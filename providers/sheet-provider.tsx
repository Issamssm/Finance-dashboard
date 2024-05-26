"use client"
import { useMountedState } from 'react-use'

import { EditAccountSheet } from '@/features/accounts/components/edit-account-sheet';
import { NewAccountSheet } from '@/features/accounts/components/new-account-sheet';

import { EditCategorieSheet } from '@/features/categories/components/edit-categorie-sheet';
import { NewCategorieSheet } from '@/features/categories/components/new-categorie-sheet';


export const SheetProvider = () => {

    const isMounted = useMountedState();

    if (!isMounted) return null;

    
    return (
        <>
            <NewAccountSheet />
            <EditAccountSheet />
            
            <NewCategorieSheet />
            <EditCategorieSheet />
        </>
    )
}
