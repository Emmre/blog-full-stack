import ArticleCard from '@/src/components/ArticleCard';
import useFetchPostsByCategory from '@/src/hooks/api/useFetchPostsByCategory';
import Layout from '@/src/layout';
import { Grid } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TagDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { posts, loading, error } = useFetchPostsByCategory({ slug: slug as string });

  return (
    <Layout loading={loading} hasError={error} skeletonStyle='postLists'>
      <Head>
        <title>{`Articles tagged with: ${slug}`}</title>
        <meta name="description" content={`Articles tagged with ${slug}`} key="desc" />
      </Head>
      <Grid gutter="md">
        {posts.map((article, index) => (
          <Grid.Col key={index} span={{ sm: 12, md: 4, lg: 3 }}>
            <ArticleCard {...article} />
          </Grid.Col>
        ))}
      </Grid>
    </Layout>
  );
};

export default TagDetailPage;
