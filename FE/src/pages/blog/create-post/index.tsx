import Layout from '@/src/layout';
import { useState } from 'react';
import { TextInput, Textarea, Button, Stack, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createNewPost } from '@/src/services/post';
import Head from 'next/head';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import CategorySelector from '@/src/components/CategorySelector';
import { ICategory } from '@/src/types';
import { useRouter } from 'next/router';
import { useUserInfo } from '@/src/hooks/context/useUserInfo';
import { handleNotification } from '@/src/utils/notification';

interface FormValues {
  title: string;
  content: string;
  authorId: string;
  slug: string;
}

const CreatePost = () => {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      content: '',
      authorId: userInfo.id,
      slug: '',
    },
    validate: {
      title: (value) => (value.trim() ? null : 'Title is required'),
      content: (value) => (value.trim() ? null : 'Content is required'),
      slug: (value) => (value.trim() ? null : 'Slug is required'),
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategoriesChange = (value: ICategory[]) => setCategories(value);

  const buildFormData = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append('backgroundImage', imageFile);
    }

    const categoryName = categories.map((category) => category.name);

    const data = {
      ...Object.fromEntries(formData.entries()),
      categories: categoryName,
    };

    return data;
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = buildFormData(values);
      await createNewPost(formData);
      handleNotification('success', 'Post Created', 'Your post has been created successfully.');
      router.push('/blog');
    } catch (error: any) {
      const errorMessage = error.response?.data?.description || 'An unexpected error occurred.';
      handleNotification('error', 'Post Creation Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hasNavbar={false} hasError={false}>
      <Head>
        <title>Create Post</title>
        <meta
          name="description"
          content="Create a new post and share it with the world."
          key="desc"
        />
      </Head>
      <Container>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack mb="md">
            <TextInput
              label="Title"
              placeholder="Enter the title of your post"
              {...form.getInputProps('title')}
            />
            <Textarea
              resize="vertical"
              label="Content"
              placeholder="Enter the content of your post"
              {...form.getInputProps('content')}
              minRows={6}
            />
            <TextInput label="Author ID" value={userInfo.id} required readOnly />
            <CategorySelector onChange={handleCategoriesChange} />
            <ProfileAvatar image={imagePreview} onImageChange={handleFileChange} fullsize />
            <TextInput
              label="Slug with /"
              placeholder="Enter a slug for your post"
              {...form.getInputProps('slug')}
            />
          </Stack>
          <Button type="submit" mt="sm" fullWidth loading={loading} disabled={loading}>
            Create Post
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default CreatePost;
