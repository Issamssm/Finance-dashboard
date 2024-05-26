import { useNewCategorie } from "@/features/categories/hooks/use-new-categorie"
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
import { useCreateCategorie } from "@/features/categories/api/use-create-categorie"


const formSchema = insertCategorieSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>;


export const NewCategorieSheet = () => {

    const { isOpen, onClose } = useNewCategorie()

    const mutation = useCreateCategorie()

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        })
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Categorie
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to organize your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategorieForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaulValues={{
                        name: "",
                    }}
                />
            </SheetContent>
        </Sheet>
    )
}
