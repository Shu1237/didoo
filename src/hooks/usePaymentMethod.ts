import { useQuery } from "@tanstack/react-query";
import { paymentMethodRequest } from "@/apiRequest/paymentMethod";
import { QUERY_KEY } from "@/utils/constant";
import { PaymentMethodGetListQuery } from "@/types/paymentMethod";

export const useGetPaymentMethods = (params?: PaymentMethodGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.paymentMethods.list(params),
        queryFn: () => paymentMethodRequest.getList(params || {}),
    });
};

export const useGetPaymentMethod = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.paymentMethods.detail(id),
        queryFn: () => paymentMethodRequest.getById(id),
        enabled: !!id,
    });
};
