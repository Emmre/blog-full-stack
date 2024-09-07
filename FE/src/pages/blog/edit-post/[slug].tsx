import Layout from '@/src/layout';
import { FormEvent, useEffect, useState } from 'react';
import { TextInput, Textarea, Button, Stack, Container, LoadingOverlay } from '@mantine/core';
import { editPost } from '@/src/services/post';
import { createNotification } from '@/src/utils/createNotification';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import { ICategory } from '@/src/types';
import CategorySelector from '@/src/components/CategorySelector';
import { useUserInfo } from '@/src/hooks/context/useUserInfo';
import useFetchPostById from '@/src/hooks/api/useFetchPostById';

const EditPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { userInfo } = useUserInfo();

  const { post, loading, error } = useFetchPostById({ slug: slug as string });

  useEffect(() => {
    if (error) {
      createNotification({
        title: 'Failed to fetch post',
        message: 'An unexpected error occurred.',
        color: 'red',
      });
    }

    if (post) {
      setCategories(post.categories);
      setImagePreview(post.backgroundImage);
    }
  }, [post]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    if (imageFile) {
      formData.append('backgroundImage', imageFile);
    }

    const categoryName = categories.map((category) => category.name);

    console.log('categoryName', categoryName);

    const data = {
      ...Object.fromEntries(formData.entries()),
      categories: categoryName,
    };

    try {
      setIsSubmitting(true);
      await editPost(slug, data);
      createNotification({
        title: 'Post updated',
        message: 'Your post has been successfully updated',
      });
      router.push('/blog/edit-post/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.description || 'An unexpected error occurred.';
      createNotification({
        title: 'Failed to update post',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategoryChange = (value: ICategory[]) => {
    setCategories(value);
  };

  return (
    <Layout hasNavbar={false} hasError={error} loading={loading} skeletonStyle="editPost">
      <Head>
        <title>Edit Post</title>
        <meta name="description" content="Edit your post." key="desc" />
      </Head>
      <Container>
        <form onSubmit={handleSubmit}>
          <Stack mb="md">
            <TextInput
              label="Title"
              placeholder="Enter the title of your post"
              name="title"
              defaultValue={post.title}
              required
            />

            <Textarea
              label="Content"
              placeholder="Enter the content of your post"
              name="content"
              required
              minRows={6}
              defaultValue={post.content}
            />

            <TextInput label="Author ID" name="authorId" value={userInfo.id} required readOnly />

            <CategorySelector onChange={handleCategoryChange} selected={categories} />

            <ProfileAvatar
              image={imagePreview || post.backgroundImage}
              onImageChange={handleFileChange}
              fullsize
            />

            <TextInput
              label="Slug with /"
              placeholder="Enter a slug for your post"
              name="slug"
              defaultValue={post.slug}
              required
            />
          </Stack>

          <Button type="submit" mt="sm" fullWidth loading={isSubmitting} disabled={isSubmitting}>
            Update Post
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default EditPost;
