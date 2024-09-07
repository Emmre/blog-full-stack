import { DropzoneProps, Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Group, Text, rem, Image } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface BaseDemoProps extends Partial<DropzoneProps> {
  image: string | null;
  setState: (value: string | null) => void; // setState işlevinin uygun türünü belirleyin
}

const ImageDropzone: React.FC<BaseDemoProps> = (props) => {
  const { image: initialImage, setState, ...dropzoneProps } = props;
  const [image, setImage] = useState<string | null>(initialImage || null);

  useEffect(() => {
    setImage(initialImage || null);
  }, [initialImage]);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setState(imageUrl); // imageUrl ile setState çağrısını yapın
    }
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      onReject={(files) => console.log('Rejected files:', files)}
      maxSize={5 * 1024 ** 2} // Maksimum dosya boyutu 5 MB
      accept={IMAGE_MIME_TYPE} // Sadece görüntü dosyalarına izin ver
      {...dropzoneProps}
    >
      {!image ? (
        <Group position="center" spacing="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5MB
            </Text>
          </div>
        </Group>
      ) : (
        <Image
          src={image}
          alt="Uploaded image preview"
          style={{
            maxHeight: rem(200),
            objectFit: 'cover',
            borderRadius: rem(8),
            marginTop: rem(16),
          }}
        />
      )}
    </Dropzone>
  );
};

export default ImageDropzone;
