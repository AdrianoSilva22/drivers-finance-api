import connection from "../config/connectionDb"

export const incomeRepository = () => {

    const getTotalIncome = async (cpf: string) => {
        const sql = ` SELECT income_amount FROM income where driver_cpf = '${cpf}' `
        const con = await connection.getConnection()

        try {
            const [result] = await con.execute(sql)

            const queryResultIncome = result as { income_amount: number }[]

            const totalIncome = queryResultIncome.reduce((accumulator, currentItem) => {
                return accumulator + Number(currentItem.income_amount)
            }, 0)

            return totalIncome
        } catch (error) {
            console.error(error)
        }
    }

    return {
        getTotalIncome,

    }
}