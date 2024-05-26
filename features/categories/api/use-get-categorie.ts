import { useQuery } from "@tanstack/react-query";


import { client } from "@/lib/hono";

export const useGetCategorie = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["categorie", { id }],
        queryFn: async () => {
            const response = await client.api.categories[":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch categorie")
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
}