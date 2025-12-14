"use client";

import { Cloudinary } from "@cloudinary/url-gen";
import { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";
import { CloudinaryVideo } from "@cloudinary/url-gen/assets/CloudinaryVideo";

// Cliente Cloudinary inicializado de forma síncrona con tipado completo
const cldInstance = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

export const cld = {
  image(publicId: string): CloudinaryImage {
    return cldInstance.image(publicId);
  },
  video(publicId: string): CloudinaryVideo {
    return cldInstance.video(publicId);
  },
};
