import { z } from 'zod';
const configSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_URL: z.string(),
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
    NEXT_PUBLIC_GOOGLE_API_KEY: z.string(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string(),
})

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
})
if (!configProject.success) {
    console.error('Invalid configuration:', configProject.error);
    throw new Error('Invalid configuration');
}
export const envconfig = configProject.data;
export default envconfig;