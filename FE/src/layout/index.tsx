import { AppShell } from '@mantine/core';
import { useAuth } from '../hooks/context/useAuth';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import MainContent from '../components/MainContent';
import { useDisclosure } from '@mantine/hooks';
import { ISkeletonStyle } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  hasError: boolean;
  loading?: boolean;
  hasNavbar?: boolean;
  skeletonStyle?: ISkeletonStyle;
}

const Layout = ({
  children,
  hasError = true,
  hasNavbar = true,
  loading = false,
  skeletonStyle,
}: LayoutProps) => {
  const [opened, { toggle }] = useDisclosure();
  const { isAuthenticated } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !hasNavbar },
      }}
      padding="md"
    >
      <Header isAuthenticated={isAuthenticated} opened={opened} toggle={toggle} />
      {hasNavbar && <Navbar />}
      <AppShell.Main>
        <MainContent
          loading={loading}
          skeletonStyle={skeletonStyle}
          hasError={hasError}
        >
          {children}
        </MainContent>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;

// import {
//   AppShell,
//   NavLink,
//   Text,
//   useMantineColorScheme,
//   useMantineTheme,
//   Group,
//   Burger,
//   ActionIcon,
//   Anchor,
//   Skeleton,
// } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import UserMenu from '../components/ProfileMenu';
// import Link from 'next/link';
// import { ReactNode } from 'react';
// import { IconSun, IconMoon } from '@tabler/icons-react';
// import { useAuth } from '../hooks/context/useAuth';
// import { Grid } from '@mantine/core';
// import { useCategories } from '../hooks/context/useCategories';

// interface LayoutProps {
//   children: ReactNode;
//   isContentLoading?: boolean;
//   hasNavbar?: boolean;
// }

// const Layout = ({ children, hasNavbar = true, isContentLoading = false }: LayoutProps) => {
//   const theme = useMantineTheme();
//   const { isAuthenticated } = useAuth();
//   const [opened, { toggle }] = useDisclosure();
//   const { colorScheme, toggleColorScheme } = useMantineColorScheme();
//   const { categories, loading, error } = useCategories();

//   const headerStyles = {
//     backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
//     borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
//     transition: 'background-color 0.8s ease, border-color 0.8s ease',
//     justifyContent: 'space-between',
//   };

//   const actionIconStyles = {
//     backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
//     color: colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
//     transition: 'background-color 0.8s ease, color 0.8s ease',
//   };

//   const renderNavbar = () => (
//     <AppShell.Navbar p="md" style={{ overflow: 'scroll' }}>
//       <Text c="dimmed" mb="md" size="lg">
//         Categories
//       </Text>
//       {loading ? (
//         [...Array(12)].map((_, index) => (
//           <Skeleton key={index} height={30} radius="md" animate mb="md" />
//         ))
//       ) : error ? (
//         <Text c="red">Failed to load categories</Text>
//       ) : (
//         categories.map((category) => (
//           <NavLink
//             key={category.id}
//             label={category.name}
//             href={`/tag/${category.name}`}
//             component={Link}
//           />
//         ))
//       )}
//     </AppShell.Navbar>
//   );

//   const renderMainContent = () =>
//     isContentLoading ? (
//       <Grid gutter="md">
//         {[...Array(12)].map((_, index) => (
//           <Grid.Col key={index} span={{ sm: 12, md: 4, lg: 3 }}>
//             <Skeleton height={200} radius="md" animate mb="md" />
//           </Grid.Col>
//         ))}
//       </Grid>
//     ) : (
//       children
//     );

//   return (
//     <AppShell
//       header={{ height: 60 }}
//       navbar={{
//         width: 300,
//         breakpoint: 'sm',
//         collapsed: { mobile: !opened, desktop: !hasNavbar },
//       }}
//       padding="md"
//     >
//       <AppShell.Header display="flex" style={headerStyles}>
//         <Group h="100%" px="md">
//           <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
//           <Anchor component={Link} href="/blog" c="gray" underline="never">
//             <Text size="xl" fw={700}>
//               Mantine Blog
//             </Text>
//           </Anchor>
//         </Group>
//         <Group h="100%" px="md">
//           {isAuthenticated && <UserMenu />}
//           <ActionIcon onClick={toggleColorScheme} size="lg" style={actionIconStyles}>
//             {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
//           </ActionIcon>
//         </Group>
//       </AppShell.Header>

//       {hasNavbar && renderNavbar()}

//       <AppShell.Main>{renderMainContent()}</AppShell.Main>
//     </AppShell>
//   );
// };

// export default Layout;
