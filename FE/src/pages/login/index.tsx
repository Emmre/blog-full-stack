import { useState } from 'react';
import { Button, Paper, TextInput, Container, Title, Text, Anchor, Group } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { login } from '../../services/auth';
import { createNotification } from '../../utils/createNotification';
import { useRouter } from 'next/router';
import { useAuth } from '@/src/hooks/context/useAuth';
import { useUserInfo } from '@/src/hooks/context/useUserInfo';

const Login = () => {
  const { setUserCredentials } = useAuth();
  const { setUserInfoCredentials } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    mode: 'controlled',
    initialValues: { username: 'emosrc1', password: 'newpassword' },
    validate: {
      username: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      password: hasLength({ min: 5 }, 'Must be at least 5 characters'),
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const { user } = await login(values);
      setUserCredentials({
        isAuthenticated: true,
      });
      setUserInfoCredentials(user);
      createNotification({
        title: 'Login Successful',
        message: 'You have successfully logged in.',
        color: 'green',
        autoClose: 3000,
      });
      router.push('/blog');
    } catch (error: any) {
      createNotification({
        title: 'Login Error',
        message: error.response?.data?.description || 'Login failed. Please try again.',
        color: 'red',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={1}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper p="md" shadow="md" withBorder mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            {...form.getInputProps('username')}
            label="Username"
            placeholder="Username"
            required
          />
          <TextInput
            {...form.getInputProps('password')}
            mt="md"
            label="Password"
            placeholder="Password"
            type="password"
            required
          />
          <Group mt="lg">
            <Button type="submit" loading={loading}>
              Sign in
            </Button>
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
