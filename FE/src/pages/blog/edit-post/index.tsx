import React from 'react';
import { Button, Container, Table, LoadingOverlay, Text, Flex } from '@mantine/core';
import { modals } from '@mantine/modals';
import Layout from '@/src/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { addPostToFavorites, deletePostById, deleteAllPosts } from '@/src/services/post';
import { formatDate } from '@/src/utils/date';
import { createNotification } from '@/src/utils/createNotification';
import useFetchAllPosts from '@/src/hooks/api/useFetchAllPosts';

const PostsList = () => {
  const router = useRouter();
  const { posts, loading, error, setPosts } = useFetchAllPosts();

  const handleEdit = (id: string) => router.push(`/blog/edit-post/${id}`);
  const goToPost = (id: string) => router.push(`/post/${id}`);

  const handleBookmark = async (id: string, isFavorite: boolean) => {
    try {
      const { description, status } = await addPostToFavorites({
        postId: id,
        userId: posts.find((post) => post.id === id)?.author.id,
      });

      createNotification({
        title: 'Bookmark',
        message: description,
        color: status === 200 ? 'green' : 'red',
        autoClose: 3000,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? { ...post, isFavorite: !isFavorite } : post))
      );
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    }
  };

  const confirmDelete = (postId: string) => {
    modals.openConfirmModal({
      title: 'Confirm Deletion',
      children: (
        <Text size="sm">
          Are you sure you want to delete this post? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onCancel: () => console.log('Delete canceled'),
      onConfirm: async () => {
        try {
          await deletePostById(postId);
          createNotification({
            title: 'Post Deleted',
            message: 'The post has been deleted successfully.',
            color: 'green',
            autoClose: 3000,
          });
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
          console.error('Failed to delete post:', error);
          createNotification({
            title: 'Delete Failed',
            message: 'Failed to delete the post.',
            color: 'red',
            autoClose: 3000,
          });
        }
      },
    });
  };

  const confirmDeleteAll = () => {
    modals.openConfirmModal({
      title: 'Confirm Deletion of All Posts',
      children: (
        <Text size="sm">
          Are you sure you want to delete all posts? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete All', cancel: 'Cancel' },
      onCancel: () => console.log('Delete all canceled'),
      onConfirm: async () => {
        try {
          await deleteAllPosts();
          createNotification({
            title: 'All Posts Deleted',
            message: 'All posts have been deleted successfully.',
            color: 'green',
            autoClose: 3000,
          });
          setPosts([]);
        } catch (error) {
          console.error('Failed to delete all posts:', error);
          createNotification({
            title: 'Delete Failed',
            message: 'Failed to delete all posts.',
            color: 'red',
            autoClose: 3000,
          });
        }
      },
    });
  };

  const renderTableRows = () =>
    posts.map((post) => (
      <Table.Tr key={post.id}>
        <Table.Td onClick={() => goToPost(post.slug)} style={{ cursor: 'pointer' }}>
          {post.title}
        </Table.Td>
        <Table.Td>{post.author.name}</Table.Td>
        <Table.Td>{formatDate(post.createdAt)}</Table.Td>
        <Table.Td>{formatDate(post.updatedAt)}</Table.Td>
        <Table.Td>
          <Button variant="outline" color="red" size="xs" onClick={() => confirmDelete(post.id)}>
            Delete
          </Button>
        </Table.Td>
        <Table.Td>
          <Button onClick={() => handleEdit(post.id)} size="xs">
            Edit
          </Button>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Layout hasNavbar={false} hasError={error} loading={loading} skeletonStyle="editPostList">
      <Head>
        <title>Posts List</title>
        <meta name="description" content="List of all posts." key="desc" />
      </Head>
      <Container>
        <LoadingOverlay visible={loading} />
        <Flex justify="space-between" align="center" mb={20}>
          <Text size="xl" fw={700}>
            Posts List
          </Text>
          <Button color="red" onClick={confirmDeleteAll}>
            Delete All
          </Button>
        </Flex>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Author</Table.Th>
              <Table.Th>Created Date</Table.Th>
              <Table.Th>Updated Date</Table.Th>
              <Table.Th colSpan={2}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderTableRows()}</Table.Tbody>
        </Table>
      </Container>
    </Layout>
  );
};

export default PostsList;
