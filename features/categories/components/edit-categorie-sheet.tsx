import { useOpenCategorie } from "@/features/categories/hooks/use-open-categorie"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { CategorieForm } from "./categorie-form"
import { insertCategorieSchema } from "@/db/schema"
import { z } from "zod"
import { useGetCategorie } from "@/features/categories/api/use-get-categorie"
import { Loader2 } from "lucide-react"
import { useEditCategorie } from "@/features/categories/api/use-edit-categorie"
import { useDeleteCategorie } from "@/features/categories/api/use-delete-categorie"
import { useConfirm } from "@/hooks/use-confirm"


const formSchema = insertCategorieSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>;


export const EditCategorieSheet = () => {
    const { isOpen, onClose, id } = useOpenCategorie()

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Categorie",
        "Are you sure you want to delete this categorie?"
    )

    const categorieQuery = useGetCategorie(id)
    const editMutation = useEditCategorie(id)
    const deleteMutaion = useDeleteCategorie(id)

    const isPending = editMutation.isPending || deleteMutaion.isPending

    const isLoading = categorieQuery.isLoading

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        })
    }

    const onDelete = async () => {
        const ok = await confirm()

        if (ok) {
            deleteMutaion.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }
    }


    const defaulValues = categorieQuery.data ? {
        name: categorieQuery.data.name,
    } : {
        name: "",
    }

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Categorie
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing categorie
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <CategorieForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaulValues={defaulValues}
                            onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
