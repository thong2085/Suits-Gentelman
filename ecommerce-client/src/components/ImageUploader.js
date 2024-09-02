import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ImageUploader = ({ onImageUpload }) => {
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        onImageUpload(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Thả ảnh vào đây ...</p>
      ) : (
        <p>Kéo và thả ảnh vào đây, hoặc click để chọn ảnh</p>
      )}
    </div>
  );
};

export default ImageUploader;
