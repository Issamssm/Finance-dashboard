"use client"

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
    id: string;
}

export const Actions = ({ id }: Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Transaction",
        "Are you sure you want to delete this transaction?"
    )

    const deleteMutaion = useDeleteTransaction(id);
    const { onOpen } = useOpenTransaction()

    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutaion.mutate()
        }
    };

    return (
        <>
        <ConfirmDialog/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        disabled={deleteMutaion.isPending}
                        onClick={()=>onOpen(id)}
                    >
                        <Edit className="size-4 mr-2"/>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={deleteMutaion.isPending}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

