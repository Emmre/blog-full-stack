import { ReactNode } from 'react';
import {
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconLogout,
  IconTrash,
} from '@tabler/icons-react';
import { rem } from '@mantine/core';

type MenuItemType = {
  label: string;
  icon: ReactNode;
  color?: string;
};

const createIconStyle = (color?: string) => ({
  width: rem(16),
  height: rem(16),
  strokeWidth: 1.5,
  color,
});

export const menuItems: MenuItemType[] = [
  {
    label: 'Saved posts',
    icon: <IconStar style={createIconStyle('red')} />,
  },
  {
    label: 'Edit Posts',
    icon: <IconMessage style={createIconStyle('green')} />,
  },
];

export const settingsItems: MenuItemType[] = [
  {
    label: 'Account settings',
    icon: <IconSettings style={createIconStyle()} />,
  },
  {
    label: 'Logout',
    icon: <IconLogout style={createIconStyle()} />,
  },
];
