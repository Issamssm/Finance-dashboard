import { useOpenAccount } from "../hooks/use-open-transaction"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { AccountForm } from "./transaction-form"
import { insertAccountSchema } from "@/db/schema"
import { z } from "zod"
import { useGetAccount } from "../api/use-get-account"
import { Loader2, UndoIcon } from "lucide-react"
import { useEditAccount } from "../api/use-edit-account"
import { useDeleteAccount } from "../api/use-delete-account"
import { useConfirm } from "@/hooks/use-confirm"


const formSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>;


export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount()

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Account",
        "Are you sure you want to delete this account?"
    )

    const accountQuery = useGetAccount(id)
    const editMutation = useEditAccount(id)
    const deleteMutaion = useDeleteAccount(id)

    const isPending = editMutation.isPending || deleteMutaion.isPending

    const isLoading = accountQuery.isLoading

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


    const defaulValues = accountQuery.data ? {
        name: accountQuery.data.name,
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
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <AccountForm
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
