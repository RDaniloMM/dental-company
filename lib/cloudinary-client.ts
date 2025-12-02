"use client";

// Tipo para el cliente de Cloudinary
type CloudinaryType = {
  image: (publicId: string) => any;
  video: (publicId: string) => any;
};

// Cliente Cloudinary cargado dinámicamente
let cldInstance: CloudinaryType | null = null;

// Función para obtener el cliente (carga perezosa)
export async function getCloudinary(): Promise<CloudinaryType> {
  if (cldInstance) return cldInstance;

  const { Cloudinary } = await import("@cloudinary/url-gen");
  cldInstance = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  return cldInstance;
}

// Exportación síncrona para compatibilidad (puede ser null inicialmente)
export const cld = {
  image: (publicId: string) => {
    if (!cldInstance) {
      console.warn("Cloudinary not loaded yet, call getCloudinary() first");
      return null;
    }
    return cldInstance.image(publicId);
  },
  video: (publicId: string) => {
    if (!cldInstance) {
      console.warn("Cloudinary not loaded yet, call getCloudinary() first");
      return null;
    }
    return cldInstance.video(publicId);
  },
};
