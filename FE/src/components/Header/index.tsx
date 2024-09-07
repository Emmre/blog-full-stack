import { Group, Text, Burger, ActionIcon, Anchor, AppShell, useMantineTheme } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import Link from 'next/link';
import UserMenu from '../ProfileMenu';
import { FC } from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  opened: boolean;
  toggle: () => void;
}

const Header: FC<HeaderProps> = ({ isAuthenticated, opened, toggle }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const headerStyles = {
    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
    transition: 'background-color 0.8s ease, border-color 0.8s ease',
    justifyContent: 'space-between',
  };

  const actionIconStyles = {
    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
    color: colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
    transition: 'background-color 0.8s ease, color 0.8s ease',
  };

  return (
    <AppShell.Header display="flex" style={headerStyles}>
      <Group h="100%" px="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Anchor component={Link} href="/blog" c="gray" underline="never">
          <Text size="xl" fw={700}>
            Mantine Blog
          </Text>
        </Anchor>
      </Group>
      <Group h="100%" px="md">
        {isAuthenticated && <UserMenu />}
        <ActionIcon onClick={toggleColorScheme} size="lg" style={actionIconStyles}>
          {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
        </ActionIcon>
      </Group>
    </AppShell.Header>
  );
};

export default Header;
