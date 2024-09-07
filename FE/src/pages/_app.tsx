import '@mantine/core/styles.css';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { AuthProvider } from '@/src/context/AuthContext';
import { AppPropsType } from 'next/dist/shared/lib/utils';
import { Notifications } from '@mantine/notifications';
import dynamic from 'next/dynamic';
import { ModalsProvider } from '@mantine/modals';
import { CategoryProvider } from '../context/CategoryContext';

const UserInfoProvider = dynamic(
  () => import('../context/UserInfoContext').then((mod) => mod.UserInfoProvider),
  { ssr: false }
);

function App({ Component, pageProps }: AppPropsType) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Mantine Template</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <ModalsProvider>
      <CategoryProvider>
        <UserInfoProvider>
          <AuthProvider>
            <Notifications />
              <Component {...pageProps} />
          </AuthProvider>
        </UserInfoProvider>
        </CategoryProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
export default App;
