import { mediaRequest } from "@/apiRequest/media";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


export const useMedia = () => {
    const uploadImage = useMutation({
        mutationFn: async (file: File) => {
            const result = await mediaRequest.upload(file);
            return result.data;
        },
        onSuccess: () => {
            toast.success("Upload ảnh thành công!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.error?.message || error.message || "Upload ảnh thất bại";
            toast.error(message);
        }
    });

    return {
        uploadImage
    };
};
