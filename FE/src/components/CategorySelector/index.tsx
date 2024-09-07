import { useState, useEffect, FC } from 'react';
import { CheckIcon, Combobox, Group, Pill, PillsInput, Title, useCombobox } from '@mantine/core';
import { fetchAllCategories } from '@/src/services/post';

interface ICategory {
  id: number;
  name: string;
}

interface CategorySelectorProps {
  onChange: (value: ICategory[]) => void;
  selected?: ICategory[];
}

const CategorySelector: FC<CategorySelectorProps> = ({ onChange, selected = [] }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const [data, setData] = useState<ICategory[]>([]);
  const [value, setValue] = useState<ICategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchAllCategories();
        setData(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (data.length > 0 && selected.length > 0) {
      const validSelectedItems = selected.filter((item) => data.some((d) => d.id === item.id));
      setValue(validSelectedItems);
    }
  }, [data, selected]);

  const exactOptionMatch = data.some(
    (item) => item.name.toLowerCase() === search.trim().toLowerCase()
  );

  const handleValueSelect = async (val: string) => {
    setSearch('');

    if (val === '$create') {
      // Create a new category with a numeric ID
      const newCategory: ICategory = { id: Date.now(), name: search }; // Ensure ID is a number
      setData((current) => [...current, newCategory]); // Update the category list
      setValue((current) => [...current, newCategory]); // Update selected values
      onChange([...value, newCategory]); // Pass updated value to parent
    } else {
      const selectedCategory = data.find((item) => item.name === val);
      if (selectedCategory) {
        const updatedValue = value.some((v) => v.id === selectedCategory.id)
          ? value.filter((v) => v.id !== selectedCategory.id)
          : [...value, selectedCategory];

        setValue(updatedValue);
        onChange(updatedValue); // Pass updated value to parent
      }
    }
  };

  const handleValueRemove = (categoryId: number) => {
    const updatedValue = value.filter((v) => v.id !== categoryId);
    setValue(updatedValue);
    onChange(updatedValue); // Pass updated value to parent
  };

  const values = value.map((item) => (
    <Pill key={item.id} withRemoveButton onRemove={() => handleValueRemove(item.id)}>
      {item.name}
    </Pill>
  ));

  const options = data
    .filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option value={item.name} key={item.id} active={value.some((v) => v.id === item.id)}>
        <Group gap="sm">
          {value.some((v) => v.id === item.id) ? <CheckIcon size={12} /> : null}
          <span>{item.name}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Title order={5} mt={5}>
        Categories
      </Title>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Search categories"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    if (value.length > 0) {
                      handleValueRemove(value[value.length - 1].id);
                    }
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}

          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create "{search}"</Combobox.Option>
          )}

          {exactOptionMatch && search.trim().length > 0 && options.length === 0 && (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default CategorySelector;
