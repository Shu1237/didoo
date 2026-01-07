import { z } from 'zod';
const configSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_URL: z.string(),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string()
})

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

})
if (!configProject.success) {
    console.error('Invalid configuration:', configProject.error);
    throw new Error('Invalid configuration');
}
export const envconfig = configProject.data;
export default envconfig;