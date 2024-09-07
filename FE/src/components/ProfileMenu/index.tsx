import classes from './index.module.css';
import cx from 'clsx';
import { IconChevronDown } from '@tabler/icons-react';
import { Anchor, Avatar, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { useAuth } from '@/src/hooks/context/useAuth';
import { useState } from 'react';
import { menuItems, settingsItems } from './data';
import { useRouter } from 'next/router';
import { useUserInfo } from '@/src/hooks/context/useUserInfo';
import Link from 'next/link';

const UserMenu = () => {
  const router = useRouter();
  const { setUserCredentials } = useAuth();
  const { userInfo, setUserInfoCredentials } = useUserInfo();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const handleClick = (item: string) => {
    if (item === 'Logout') {
      setUserCredentials({
        isAuthenticated: false,
      });
      setUserInfoCredentials(null);
      router.push('/login');
    } else if (item === 'Account settings') {
      router.push('/profile-settings');
    } else if (item === 'Saved posts') {
      router.push('/blog/saved-posts');
    } else if (item === 'Edit Posts') {
      router.push('/blog/edit-post');
    } else if (item === 'Drafts') {
      router.push('/blog/drafts');
    }
  };

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          <Group gap={7}>
            <Avatar src={userInfo.image} alt={userInfo.fullname} radius="xl" size={30} />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {userInfo.fullname}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Write a post</Menu.Label>
        <Anchor component={Link} href="/blog/create-post" underline="never" c="gray">
          <Menu.Item leftSection={<IconChevronDown size={18} />}>Create post</Menu.Item>
        </Anchor>

        <Menu.Label>Posts</Menu.Label>
        {menuItems.map((item, index) => (
          <Menu.Item key={index} leftSection={item.icon} onClick={() => handleClick(item.label)}>
            {item.label}
          </Menu.Item>
        ))}

        <Menu.Label>Settings</Menu.Label>
        {settingsItems.map((item, index) => (
          <Menu.Item key={index} leftSection={item.icon} onClick={() => handleClick(item.label)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
