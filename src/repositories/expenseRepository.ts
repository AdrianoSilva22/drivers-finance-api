import connection from "../config/connectionDb"

export const expenseRepository = () => {

    const getTotalExpense = async (cpf: string) => {
        const sql = `SELECT expense_amount FROM expense where driver_cpf = '${cpf}' `
        const con = await connection.getConnection()
        
        try {
            const [result] = await con.execute(sql)
            
            const queryResultExpense = result as { expense_amount: number }[]
    
            const totalExpense = queryResultExpense.reduce((accumulator, currentItem) => {
                return accumulator + Number(currentItem.expense_amount)
            }, 0)
    
            return totalExpense
        } catch (error) {
            console.error(error)
        }
    }

    return {
        getTotalExpense,
        
    }
}