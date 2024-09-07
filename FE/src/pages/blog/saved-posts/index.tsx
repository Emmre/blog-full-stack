import ArticleCard from '@/src/components/ArticleCard';
import useFetchFavoritePosts from '@/src/hooks/api/useFetchFavoritePosts';
import Layout from '@/src/layout';
import { Grid } from '@mantine/core';
import Head from 'next/head';

const BlogPage = () => {
  const { posts, loading, error } = useFetchFavoritePosts();

  return (
    <Layout hasNavbar loading={loading} hasError={error}>
      <Head>
        <title>Blog</title>
        <meta
          name="description"
          content="This is a blog page where you can find all the latest articles and news."
          key="desc"
        />
      </Head>
      <Grid gutter="md">
        {posts.map((post) => (
          <Grid.Col key={post.id} span={{ sm: 12, md: 4, lg: 3 }}>
            <ArticleCard {...post} />
          </Grid.Col>
        ))}
      </Grid>
    </Layout>
  );
};

export default BlogPage;
