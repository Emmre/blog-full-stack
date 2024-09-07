import { Title, Text, Button, Container, Group } from '@mantine/core';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <Container
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <Title
        order={1}
        style={{
          fontSize: '120px',
          fontWeight: 900,
          color: '#1c7ed6',
          marginBottom: '20px',
        }}
      >
        404
      </Title>
      <Title
        order={2}
        style={{
          fontSize: '36px',
          fontWeight: 700,
          marginBottom: '10px',
        }}
      >
        Page Not Found
      </Title>
      <Text
        color="dimmed"
        size="lg"
        style={{
          maxWidth: '500px',
          marginBottom: '30px',
        }}
      >
        Sorry, the page you are looking for does not exist. It might have been removed or you may have mistyped the URL.
      </Text>
      <Group p="center">
        <Button size="md" variant="filled" color="blue" onClick={() => router.push('/blog')}>
          Go Back to Home
        </Button>
      </Group>
    </Container>
  );
}
