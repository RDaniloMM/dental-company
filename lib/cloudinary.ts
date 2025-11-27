import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
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
  publicId: string,
  tipo: "perfil" | "carrusel" | "general" = "general"
): Promise<UploadResult> {
  // Configuraciones de transformación según el tipo
  const transformations: Record<string, object> = {
    perfil: {
      // Fotos de perfil: 400x400, calidad optimizada, formato webp
      width: 400,
      height: 400,
      crop: "fill",
      gravity: "face", // Detecta rostros y centra en ellos
      quality: "auto:good",
      fetch_format: "webp",
    },
    carrusel: {
      // Imágenes de carrusel: 1920px ancho máximo, optimizado para web
      width: 1920,
      crop: "limit",
      quality: "auto:eco", // Más compresión para imágenes grandes
      fetch_format: "webp",
    },
    general: {
      // Imágenes generales: optimización estándar
      width: 1200,
      crop: "limit",
      quality: "auto:good",
      fetch_format: "webp",
    },
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          public_id: publicId,
          resource_type: "image",
          format: "webp",
          // Aplicar transformaciones eager (se procesan al subir)
          eager: [transformations[tipo]],
          eager_async: false,
          // Optimizaciones adicionales
          quality: "auto",
          // Eliminar metadatos EXIF para reducir tamaño
          strip: true,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            // Usar la URL transformada si existe, sino la original
            const optimizedUrl =
              result.eager?.[0]?.secure_url || result.secure_url;
            resolve({
              public_id: result.public_id,
              secure_url: optimizedUrl,
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
