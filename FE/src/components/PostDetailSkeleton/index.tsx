import { Skeleton, Box, Title, Avatar, Group, Text, Divider, Flex } from '@mantine/core';

const SkeletonLoader = () => (
  <Box>
    <Skeleton height={20} width={200} mb="md" />

    <Skeleton height={200} />

    <Skeleton height={50} mt="md" />

    <Group align="center" mt="md">
      <Avatar size="md" radius="xl">
        <Skeleton circle height={40} width={40} />
      </Avatar>
      <Flex direction="column" gap="sm">
        <Skeleton height={15} width={150} />
        <Skeleton height={15} width={150} />
      </Flex>
    </Group>

    <Divider my="lg" />

    <Skeleton height={500} width="100%" />
  </Box>
);

export default SkeletonLoader;
