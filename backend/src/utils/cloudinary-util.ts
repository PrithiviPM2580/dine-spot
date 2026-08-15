import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (
  file: Buffer,
  folder: string,
): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result)
          return reject(new Error("No result returned from Cloudinary"));
        resolve({ secure_url: result.secure_url });
      },
    );

    stream.end(file);
  });
};
