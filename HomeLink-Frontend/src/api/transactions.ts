import { apiRequest } from './client';

export interface Transaction {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description?: string;
    createdAt: string;
}

export interface CreateTransactionPayload {
    amount: number;
    type: 'credit' | 'debit';
    description?: string;
}

export const getTransactions = (token: string): Promise<Transaction[]> =>
    apiRequest<Transaction[]>('/transactions', {
        method: 'GET',
        token,
    });

export const getTransactionById = (id: string, token: string): Promise<Transaction> =>
    apiRequest<Transaction>(`/transactions/${id}`, {
        method: 'GET',
        token,
    });

export const createTransaction = (payload: CreateTransactionPayload, token: string): Promise<Transaction> =>
    apiRequest<Transaction>('/transactions', {
        method: 'POST',
        body: payload,
        token,
    });

