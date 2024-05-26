import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"]


export const useEditCategorie = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({
                param: { id },
                json,
            })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Categorie updated")
            queryClient.invalidateQueries({ queryKey: ["categorie", { id }] })
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            // TODO
        },
        onError: () => {
            toast.error("Failed to update categorie")
        }
    });
    return mutation;
};