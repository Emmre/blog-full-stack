import { useCategories } from '@/src/hooks/context/useCategories';
import { NavLink, Text, Skeleton, AppShell } from '@mantine/core';
import Link from 'next/link';

const Navbar = () => {
  const { categories, loading, error } = useCategories();

  return (
    <AppShell.Navbar p="md" style={{ overflow: 'scroll' }}>
      <Text c="dimmed" mb="md" size="lg">
        Categories
      </Text>
      {loading ? (
        [...Array(12)].map((_, index) => (
          <Skeleton key={index} height={30} radius="md" animate mb="md" />
        ))
      ) : error ? (
        <Text c="red">Failed to load categories</Text>
      ) : (
        categories.map((category) => (
          <NavLink
            key={category.id}
            label={category.name}
            href={`/tag/${category.name}`}
            component={Link}
          />
        ))
      )}
    </AppShell.Navbar>
  );
};

export default Navbar;
