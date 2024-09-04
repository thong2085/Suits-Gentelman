export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Kiểm tra xem đường dẫn đã là URL đầy đủ chưa
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Nếu không, thêm base URL của CDN và các tham số cần thiết
  const cdnBaseUrl = process.env.REACT_APP_CDN_BASE_URL;
  return `${cdnBaseUrl}/v1/${imagePath}`;
};
