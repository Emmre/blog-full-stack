import React, { useEffect, useState } from 'react';
import Layout from '@/src/layout';
import { updateUserById } from '@/src/services/user';
import Head from 'next/head';
import { Container, Button, Title, Group, Card, Stack, TextInput } from '@mantine/core';
import ProfileAvatar from '@/src/components/ProfileAvatar';
import useFetchUserById from '@/src/hooks/api/useFetchUserById';
import { useUserInfo } from '@/src/hooks/context/useUserInfo';
import { useForm, hasLength } from '@mantine/form';
import { handleNotification } from '@/src/utils/notification';

const ProfileSettings = () => {
  const { userInfo, setUserInfoCredentials } = useUserInfo();
  const { user, loading, error } = useFetchUserById({ userId: userInfo.id });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      fullname: '',
      username: '',
      password: '',
    },
    validate: {
      fullname: hasLength({ min: 1 }, 'Full name is required'),
      username: hasLength({ min: 1 }, 'Username is required'),
      password: hasLength({ min: 6 }, 'Password must be at least 6 characters long'),
    },
  });

  useEffect(() => {
    if (!user) return;
    form.setValues({
      fullname: user.fullname || '',
      username: user.username || '',
      password: '',
    });
    setImagePreview(user.image);
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const buildFormData = (values: typeof form.values): FormData => {
    const formData = new FormData();

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        formData.append(key, values[key as keyof typeof values] as string);
      }
    }

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return formData;
  };

  const handleProfileSave = async (values: typeof form.values) => {
    setIsSubmitting(true);

    try {
      const formData = buildFormData(values);
      await updateUserProfile(formData);
      handleNotification(
        'success',
        'Profile Updated',
        'Your profile has been updated successfully.'
      );
    } catch (error) {
      handleNotification(
        'error',
        'Profile Update Failed',
        'An error occurred while updating your profile.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserProfile = async (formData: FormData) => {
    const updatedUser = await updateUserById(userInfo.id, formData);
    setUserInfoCredentials(updatedUser.data);
  };

  return (
    <Layout hasError={error} loading={loading} skeletonStyle="editProfile">
      <Head>
        <title>Profile Settings</title>
        <meta
          name="description"
          content="Update your profile settings and preferences."
          key="desc"
        />
      </Head>
      <Container size="md">
        <form onSubmit={form.onSubmit(handleProfileSave)}>
          <Card shadow="sm" padding="lg" withBorder>
            <Group align="center" mb="lg">
              <ProfileAvatar image={imagePreview} onImageChange={handleFileChange} />
              <Title order={2}>Profile Settings</Title>
            </Group>
            <Stack>
              <TextInput label="Full Name" {...form.getInputProps('fullname')} />
              <TextInput label="Username" {...form.getInputProps('username')} />
              <TextInput label="Password" type="password" {...form.getInputProps('password')} />
              <Button
                type="submit"
                mt="sm"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Save
              </Button>
            </Stack>
          </Card>
        </form>
      </Container>
    </Layout>
  );
};

export default ProfileSettings;
