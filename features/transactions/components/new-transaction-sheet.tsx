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
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useCreateCategorie } from "@/features/categories/api/use-create-categorie"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"
import { Loader2 } from "lucide-react"

const formSchema = insertTransactionsSchema.omit({
    id: true,
})

type FormValues = z.input<typeof formSchema>;


export const NewTransactionSheet = () => {

    const { isOpen, onClose } = useNewTransaction()

    const CreateMutation = useCreateTransaction()

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
        CreateMutation.isPending ||
        CategoryMutation.isPending ||
        AccountMutation.isPending;

    const isLoading = CategoryQuery.isLoading || AccountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        CreateMutation.mutate(values, {
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
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction.
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                        </div>
                    ) : (
                        <TransactionForm
                            onSubmit={onSubmit}
                            disabled={isPending}
                            categoryOptions={CategoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={AccountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
    )
}
