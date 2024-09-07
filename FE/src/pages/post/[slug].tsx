import { useRouter } from 'next/router';
import {
  Breadcrumbs,
  Text,
  Box,
  Avatar,
  Group,
  Container,
  Divider,
  Anchor,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { formatDate } from '@/src/utils/date';
import Layout from '@/src/layout';
import Head from 'next/head';
import useFetchPostBySlug from '@/src/hooks/api/useFetchPostBySlug';

const PostDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { post, loading, error } = useFetchPostBySlug({ slug: slug as string });

  if (!post) return router.push('/blog');

  const formattedCreatedAt = formatDate(post.createdAt);
  const formattedUpdatedAt = formatDate(post.updatedAt);

  return (
    <Layout loading={loading} hasError={error} skeletonStyle='postDetail'>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.content} key="desc" />
      </Head>
      <Container>
        <Breadcrumbs>
          <Anchor href="/blog" component={Link} underline="never" c="gray">
            Home
          </Anchor>
          <Text>{slug}</Text>
        </Breadcrumbs>

        <Box
          style={{
            backgroundImage: `url(${post.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            borderRadius: 8,
            marginTop: '1rem',
            marginBottom: '2rem',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        />
        <Title>{post.title}</Title>

        {post.author && (
          <Group align="center" mt="md">
            <Avatar src={post.author.image} size="md" radius="xl" />
            <Box>
              <Text>{post.author.name}</Text>
              <Group>
                <Text size="sm">{formattedCreatedAt}</Text>
                <Text size="sm">Updated: {formattedUpdatedAt}</Text>
              </Group>
            </Box>
          </Group>
        )}

        <Divider my="lg" />

        <Box mt="md">
          <Text>{post.content}</Text>
        </Box>
      </Container>
    </Layout>
  );
};

export default PostDetail;
