import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

interface UploadResult {
  public_id: string;
  secure_url: string;
}

const uploadTransforms: Record<
  "perfil" | "carrusel" | "general" | "paciente",
  string
> = {
  perfil: "tr=w-400,h-400,c-at_max,q-auto,f-webp",
  carrusel: "tr=w-1920,c-at_max,q-auto:eco,f-webp",
  general: "tr=w-1200,c-at_max,q-auto,f-webp",
  paciente: "tr=w-2000,c-at_max,q-auto:best,f-webp",
};

function requireImageKitConfig() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not configured.");
  }
}

function withTransformation(url: string, transformation: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${transformation}`;
}

export async function uploadImage(
  file: Buffer,
  folder: string,
  publicId: string,
  tipo: "perfil" | "carrusel" | "general" | "paciente" = "general"
): Promise<UploadResult> {
  requireImageKitConfig();

  const arrayBuffer = new ArrayBuffer(file.byteLength);
  new Uint8Array(arrayBuffer).set(file);
  const uploadable = await toFile(arrayBuffer, publicId);

  const result = await imagekit.files.upload({
    file: uploadable,
    fileName: publicId,
    folder: `/${folder.replace(/^\/+/, "")}`,
    useUniqueFileName: false,
  });

  if (!result.fileId || !result.url) {
    throw new Error("ImageKit did not return a fileId or url.");
  }

  return {
    public_id: result.fileId,
    secure_url: withTransformation(result.url, uploadTransforms[tipo]),
  };
}

export async function deleteImage(fileId: string) {
  requireImageKitConfig();

  try {
    await imagekit.files.delete(fileId);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
