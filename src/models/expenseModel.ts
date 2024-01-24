
export interface Expense {
    expenseId: number;
    expenseAmount: number;
    expenseDescription: string;
    expenseType: 'fixed' | 'variable';
    driverCpf: string;
}