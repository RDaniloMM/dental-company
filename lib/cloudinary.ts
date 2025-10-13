import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface UploadResult {
  public_id: string;
  secure_url: string;
}

export function uploadImage(
  file: Buffer,
  folder: string,
  publicId: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          public_id: publicId,
          resource_type: "image",
          format: "webp",
          quality: "auto",
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          } else {
            reject(new Error("Cloudinary did not return a result."));
          }
        }
      )
      .end(file);
  });
}

export async function deleteImage(publicId: string) {
  return await cloudinary.uploader.destroy(publicId);
}
