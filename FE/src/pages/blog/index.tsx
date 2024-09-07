import { Grid, Skeleton, Text, Alert } from '@mantine/core';
import ArticleCard from '../../components/ArticleCard';
import Layout from '../../layout';
import { fetchAllPosts } from '../../services/post';
import { useEffect, useState } from 'react';
import { ArticleCardProps } from '../../types';
import Head from 'next/head';
import useFetchAllPosts from '@/src/hooks/api/useFetchAllPosts';

const BlogPage = () => {
  const { posts, loading, error } = useFetchAllPosts();

  const renderContent = () => {
    if (posts.length === 0) {
      return (
        <Grid.Col span={12}>
          <Text>No posts to show</Text>
        </Grid.Col>
      );
    }

    return posts.map((article) => (
      <Grid.Col key={article.id} span={{ sm: 12, md: 4, lg: 3 }}>
        <ArticleCard {...article} />
      </Grid.Col>
    ));
  };

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
      <Grid gutter="md">{renderContent()}</Grid>
    </Layout>
  );
};

export default BlogPage;
