import { createNotification } from './createNotification';

export const handleSuccess = (
  title: string = 'Profile Updated',
  message: string = 'Your profile has been updated successfully.'
) => {
  handleNotification('success', title, message);
};

export const handleError = (
  error: any,
  title: string = 'Profile Update Failed',
  message: string = 'An error occurred while updating your profile.'
) => {
  console.error(title, error);
  handleNotification('error', title, message);
};

export const handleNotification = (type: 'success' | 'error', title: string, message: string) => {
  createNotification({
    title,
    message,
    color: type === 'success' ? 'teal' : 'red',
    autoClose: 3000,
  });
};
