import { showNotification } from '@mantine/notifications';
import { MantineTheme, useMantineColorScheme } from '@mantine/core';

type CustomNotificationColor = keyof MantineTheme['colors'];

interface CreateNotificationProps {
  title: string;
  message: string;
  color?: CustomNotificationColor;
  autoClose?: number;
  colorScheme?: 'light' | 'dark';
}

// TODO: DÜZELT

export const createNotification = ({
  title,
  message,
  color,
  autoClose = 2000,
}: CreateNotificationProps) => {
  showNotification({
    title,
    message,
    color,
    autoClose,
    styles: (theme) => {
      const { colorScheme } = useMantineColorScheme();

      return {
        root: {
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
          width: '300px',
          maxWidth: '100%',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: theme.radius.md,
          boxShadow: theme.shadows.md,
          color: colorScheme === 'dark' ? theme.white : theme.black,
        },
        title: {
          fontWeight: 600,
        },
        description: {
          color: colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        },
        closeButton: {
          '&:hover': {
            backgroundColor: colorScheme === 'dark' ? theme.colors.blue[7] : theme.colors.blue[5],
          },
        },
      };
    },
  });
};
