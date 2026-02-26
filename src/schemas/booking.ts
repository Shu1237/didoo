import { z } from "zod";

/** Match BE BookingCreateCommand - cấu trúc mới (1 loại vé/request) */
export const bookingCreateSchema = z.object({
    ticketTypeId: z.string().uuid("Ticket type ID không hợp lệ"),
    quantity: z.number().min(1, "Số lượng tối thiểu 1"),
    userId: z.string().uuid("User ID không hợp lệ"),
    eventId: z.string().uuid("Event ID không hợp lệ"),
    fullname: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().optional().or(z.literal("")),
});

export type BookingCreateBody = z.infer<typeof bookingCreateSchema>;
