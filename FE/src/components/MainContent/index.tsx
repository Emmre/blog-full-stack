import { ISkeletonStyle } from '@/src/types';
import { Avatar, Card, Container, Flex, Grid, Group, Skeleton, Stack, Table } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  loading?: boolean;
  skeletonStyle?: ISkeletonStyle;
  hasError: boolean;
}

const skeletonVariants = {
  postLists: [...Array(12)].map((_, index) => (
    <Grid.Col key={index} span={{ sm: 12, md: 4, lg: 3 }}>
      <Skeleton height={200} radius="md" animate mb="md" />
    </Grid.Col>
  )),
  postDetail: [
    <>
      <Skeleton key="breadcrumb" height={20} width={200} mb="md" />
      <Skeleton key="image" height={200} />
      <Skeleton key="title" height={50} mt="md" />
      <Group key="author" align="center" mt="md">
        <Avatar size="md" radius="xl">
          <Skeleton circle height={40} width={40} />
        </Avatar>
        <Flex direction="column" gap="sm">
          <Skeleton key="authorName" height={15} width={150} />
          <Skeleton key="time" height={15} width={150} />
        </Flex>
      </Group>
      <Skeleton key="content" height={500} mt="lg" />
    </>,
  ],
  editPost: [
    <Container key="content" w="100%">
      <Skeleton key="title" height={50} radius="md" animate mb="md" />
      <Skeleton key="content" height={50} radius="md" animate mb="md" />
      <Skeleton key="authorId" height={50} radius="md" animate mb="md" />
      <Skeleton key="categories" height={50} radius="md" animate mb="md" />
      <Skeleton key="avatar" height={200} animate mb="md" />
      <Skeleton key="slug" height={50} radius="md" animate mb="md" />
      <Skeleton key="button" height={50} radius="md" animate mb="md" width="100%" />
    </Container>,
  ],
  editPostList: (
    <>
      <Flex key="title" mb="md" direction="row" justify="space-between" flex="1">
        <Skeleton key="title" height={40} width={150} />
        <Skeleton key="button" height={40} width={150} />
      </Flex>
      <Skeleton key="tableHeader" height={50} animate mb="xs" />
      <Skeleton key="table" height={300} animate />
    </>
  ),
  editProfile: (
    <Container key="content" w="100%" mt="md">
      <Card shadow="sm" padding="lg" withBorder>
        <Group align="center" mb="lg">
          <Skeleton circle height={60} width={60} />
          <Skeleton height={20} width={150} />
        </Group>
        <Stack>
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" width="100%" mt="lg" />
        </Stack>
      </Card>
    </Container>
  ),
  default: null,
};

const MainContent: FC<MainContentProps> = ({ children, loading, skeletonStyle, hasError }) => {
  const skeletons = skeletonStyle ? skeletonVariants[skeletonStyle] : null;

  if (loading && skeletons) {
    return <Grid gutter="md">{skeletons}</Grid>;
  }
  if (hasError) {
    return <p>Failed to load content. Please try again later.</p>;
  }

  return <>{children}</>;
};

export default MainContent;
