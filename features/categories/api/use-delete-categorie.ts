import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>

export const useDeleteCategorie = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({
                param: { id },
            })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Categorie deleted")
            queryClient.invalidateQueries({ queryKey: ["categorie", { id }] })
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            // TODO
        },
        onError: () => {
            toast.error("Failed to delete categorie")
        }
    });
    return mutation;
};