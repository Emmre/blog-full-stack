import React from 'react';
import { Avatar, Group } from '@mantine/core';
import classes from './index.module.css';

interface ProfileAvatarProps {
  image: string | null; // Add image prop to display the image preview
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullsize?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  image,
  onImageChange,
  fullsize = false,
}) => {
  // TODO: BAŞLANGIÇTA RESİM YÜKLENMESİ YOKSA BİNARY GİTMİYOR
  return (
    <Group>
      <div style={{ position: 'relative', width: '100%' }}>
        {fullsize ? (
          <Avatar
            src={image}
            className={classes.avatar}
            imageProps={{
              style: { objectFit: 'contain' },
            }}
          />
        ) : (
          <Avatar src={image || '/default-avatar.png'} size="xl" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>
    </Group>
  );
};

export default ProfileAvatar;

// import React from 'react';
// import { Avatar, Group } from '@mantine/core';

// interface ProfileAvatarProps {
//   image: string | null;
//   onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   fullsize?: boolean;
// }

// const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
//   image,
//   onImageChange,
//   fullsize = false,
// }) => {
//   return (
//     <Group>
//       <div style={{ position: 'relative', width: '100%' }}>
//         {fullsize ? (
//           <Avatar
//             src={image}
//             style={{ width: '100%', height: 200, borderRadius: 0 }}
//             imageProps={{
//               style: { objectFit: 'contain' },
//             }}
//           />
//         ) : (
//           <Avatar src={image || '/default-avatar.png'} size="xl" radius="xl" />
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           onChange={onImageChange}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             opacity: 0,
//             cursor: 'pointer',
//           }}
//         />
//       </div>
//     </Group>
//   );
// };

// export default ProfileAvatar;
