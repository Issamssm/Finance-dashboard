import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { TransactionForm } from "./transaction-form"
import { insertTransactionsSchema } from "@/db/schema"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { useConfirm } from "@/hooks/use-confirm"
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction"
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction"
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction"
import { useCreateCategorie } from "@/features/categories/api/use-create-categorie"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"


const formSchema = insertTransactionsSchema.omit({
    id: true,
})

type FormValues = z.input<typeof formSchema>;


export const EditTransactionSheet = () => {
    const { isOpen, onClose, id } = useOpenTransaction()

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Transaction",
        "Are you sure you want to delete this Transaction?"
    )

    const transactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutaion = useDeleteTransaction(id)

    const CategoryQuery = useGetCategories()
    const CategoryMutation = useCreateCategorie()
    const onCreateCategory = (name: string) => CategoryMutation.mutate({
        name
    });
    const CategoryOptions = (CategoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }))


    const AccountQuery = useGetAccounts()
    const AccountMutation = useCreateAccount()
    const onCreateAccount = (name: string) => AccountMutation.mutate({
        name
    });
    const AccountOptions = (AccountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }));

    const isPending =
        editMutation.isPending ||
        deleteMutaion.isPending ||
        transactionQuery.isLoading ||
        CategoryMutation.isPending ||
        AccountMutation.isPending;
    

    const isLoading =
        transactionQuery.isLoading ||
        CategoryQuery.isLoading ||
        AccountQuery.isLoading;

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


    const defaulValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
            ? new Date(transactionQuery.data.date)
            : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
    }

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing Transaction
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                            <TransactionForm
                                id={id}
                                defaulValues={defaulValues}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                                disabled={isPending}
                                categoryOptions={CategoryOptions}
                                onCreateCategory={onCreateCategory}
                                accountOptions={AccountOptions}
                                onCreateAccount={onCreateAccount}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
