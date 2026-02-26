import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { PaginatedData } from "@/types/base";
import { PaymentMethod, PaymentMethodGetListQuery } from "@/types/paymentMethod";

export const paymentMethodRequest = {
    getList: (params?: PaymentMethodGetListQuery) =>
        http.get<PaginatedData<PaymentMethod>>(ENDPOINT_CLIENT.PAYMENT_METHODS, { query: params || {} }),
    getById: (id: string) =>
        http.get<PaymentMethod>(ENDPOINT_CLIENT.PAYMENT_METHOD_DETAIL(id)),
};
