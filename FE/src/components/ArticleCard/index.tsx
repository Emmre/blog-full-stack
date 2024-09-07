import { IconBookmark, IconShare } from '@tabler/icons-react';
import {
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Center,
  Avatar,
  useMantineTheme,
  rem,
  Anchor,
} from '@mantine/core';
import classes from './index.module.css';
import { FC, useState } from 'react';
import Link from 'next/link';
import { addPostToFavorites } from '@/src/services/post';
import { createNotification } from '@/src/utils/createNotification';
import { ArticleCardProps } from '@/src/types';
import { useAuth } from '@/src/hooks/context/useAuth';

const ArticleCard: FC<ArticleCardProps> = (props) => {
  const {
    id,
    categories,
    content,
    backgroundImage,
    title,
    actions,
    slug,
    author,
    isFavorite,
    extraFields,
  } = props;
  const theme = useMantineTheme();
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(isFavorite);

  const handleBookmarkClick = async () => {
    const addToBookmarks = await addPostToFavorites({
      postId: id,
      userId: author.id,
    });

    createNotification({
      title: 'Bookmark',
      message: addToBookmarks.description,
      color: addToBookmarks.status === 200 ? 'green' : 'red',
      autoClose: 3000,
    });
    setIsBookmarked((state) => !state);
  };

  const handleShare = async () => {
    const title = 'Check this out!';
    const content = 'I found this interesting content, thought you might like it!';
    const url = `${window.location.origin}/post${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
          url,
        });
        createNotification({
          title: 'Share Successful',
          message: 'Content has been shared successfully!',
          color: 'green',
          autoClose: 3000,
        });
      } catch (error) {
        createNotification({
          title: 'Share Failed',
          message: 'There was an error while sharing the content.',
          color: 'red',
          autoClose: 3000,
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        createNotification({
          title: 'Link Copied',
          message: 'The link has been copied to your clipboard.',
          color: 'blue',
          autoClose: 3000,
        });
      } catch (error) {
        createNotification({
          title: 'Copy Failed',
          message: 'There was an error while copying the link.',
          color: 'red',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section>
        <Anchor href={`/post${slug}`} component={Link} underline="never">
          <Image src={backgroundImage} height={180} />
        </Anchor>
      </Card.Section>

      {extraFields?.isNew && (
        <Badge className={classes.rating} variant="gradient">
          {extraFields?.isNew}
        </Badge>
      )}

      <Text className={classes.title} fw={500}>
        {title}
      </Text>

      <Text fz="sm" c="dimmed" lineClamp={4}>
        {content?.slice(0, 150)}...
      </Text>
      {!!categories.length && (
        <Group mt="md">
          {categories.map((category, index) => (
            <Anchor
              key={index}
              component={Link}
              c="red"
              underline="never"
              href={`/tag/${category.name}`}
            >
              <Badge variant="light">{category.name}</Badge>
            </Anchor>
          ))}
        </Group>
      )}
      <Group justify="space-between" className={classes.footer}>
        <Center>
          <Avatar src={author.image} size={24} radius="xl" mr="xs" />
          <Text fz="sm" inline>
            {author.name}
          </Text>
        </Center>

        <Group gap={8} mr={0}>
          {isAuthenticated && (
            <ActionIcon className={classes.action} onClick={handleBookmarkClick}>
              <IconBookmark
                style={{ width: rem(16), height: rem(16) }}
                color={actions?.bookmarkColor || theme.colors.yellow[7]}
                fill={isBookmarked ? theme.colors.yellow[7] : 'transparent'}
              />
            </ActionIcon>
          )}
          <ActionIcon className={classes.action} onClick={handleShare}>
            <IconShare
              style={{ width: rem(16), height: rem(16) }}
              color={actions?.shareColor || theme.colors.blue[6]}
            />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
};

export default ArticleCard;
