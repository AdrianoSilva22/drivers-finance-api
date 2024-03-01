import express, { Request, Response } from 'express'
// import { check, validationResult } from 'express-validator'
import { check, validationResult } from 'express-validator'
import connection from '../config/connectionDb'
import { Expense } from '../models/expenseModel'
import { dateTimeMysqlUtils } from '../utils/dateTimeMySqlUtils' 
const router = express.Router()
const { getCurrentDateTimeMySQLFormat } = dateTimeMysqlUtils()

router.post('/save',
    [
        check('expenseDescription').notEmpty().withMessage('O campo de descrição não pode estar vazio!'),
        check('expenseType').notEmpty().withMessage('Informe o tipo da Despesa'),
        check('expenseAmount').notEmpty().withMessage('Informe o valor da Despesa').isNumeric().withMessage('O valor deve ser numérico'),
    ],

    async (req: Request, res: Response) => {
        const erros = validationResult(req)

        if (!erros.isEmpty()) {
            return res.status(400).json({ errors: erros.array() })
        }
        const expense: Expense = req.body

        const sql = `INSERT INTO expense (expense_description, expense_type, expense_amount, driver_cpf, 
            expense_date) VALUES (?, ?, ?, ?, ?)`

        const values = [
            expense.expenseDescription,
            expense.expenseType,
            expense.expenseAmount,
            expense.driverCpf,
            getCurrentDateTimeMySQLFormat()
        ]

        try {
            const con = await connection.getConnection()
            await connection.query(sql, values)
            con.release()
            res.status(200).send("Despesa registrada com sucesso")

        } catch (error: any) {
            res.status(404).send("Erro ao Registrar Despesa")
        }
    })

export const getTotalExpense = async (cpf: string) => {
    const sql = `SELECT expense_amount FROM expense where driver_cpf = '${cpf}' `

    try {
        await connection.getConnection()
        const [result] = await connection.execute(sql)

        const queryResultExpense = result as { expense_amount: number }[]

        const totalExpense = queryResultExpense.reduce((accumulator, currentItem) => {
            return accumulator + Number(currentItem.expense_amount)
        }, 0)

        return totalExpense
    } catch (error) {
        console.error(error)
    }
}

router.get('/getTotalExpenseAmount/:cpf', async (req: Request, res: Response) => {
    const { cpf } = req.params
    try {
        const totalExpense = await getTotalExpense(cpf)
        res.status(200).send(`${totalExpense}`)
    } catch (error) {
        res.status(400).send('Erro ao buscar valor total de Despesas')
    }
})

router.get('/get/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const sql = `SELECT * FROM expense WHERE expense_id = ${id}`

    try {
        await connection.getConnection()
        const [result] = await connection.execute(sql)
        if (Array.isArray(result) && result.length === 0) {
            throw new Error()
        } else {
            res.send(result).status(200)
        }
    } catch (error) {
        console.log(error)
        res.status(404).send('Erro ao buscar Despesa')
        return null
    }
})

router.put('/update/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const expense: Expense = req.body

    const sql = `UPDATE expense SET expense_description = ? ,  expense_type = ? , expense_amount = ? WHERE expense_id = ${id};`

    const values = [
        expense.expenseDescription,
        expense.expenseType,
        expense.expenseAmount,
    ]
    try {
        const con = await connection.getConnection()
        const [result] = await connection.query(sql, values)
        con.release()
        res.status(200).send('Despesa autualizada com sucesso')
    } catch (error) {
        res.status(400).send('erro ao atualizar Despesa')
    }
})

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const sql = `DELETE FROM expense WHERE expense_id = ${id}`
    try {
        const [result] = await connection.execute(sql)
        res.status(204).send('Despesa deletada com sucesso!')
    } catch (error) {
        res.status(400).send('erro ao deletar Despesa!')
    }
})

export default router
