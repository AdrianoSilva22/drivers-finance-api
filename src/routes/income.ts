import express, { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'
import connection from '../config/connection'
import { Income } from '../models/incomeModel'

const router = express.Router()

const getCurrentDateTimeMySQLFormat = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const mysqlDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return mysqlDatetime;
}

router.post('/save',
    [
        check('incomeDescription').notEmpty().withMessage('O campo de descrição não pode estar vazio!'),
        check('incomeType').notEmpty().withMessage('Informe o tipo do Ganho'),
        check('incomeAmount').notEmpty().withMessage('Informe o valor de Ganho').isNumeric().withMessage('O valor deve ser numérico'),
    ],

    async (req: Request, res: Response) => {
        const erros = validationResult(req)

        if (!erros.isEmpty()) {
            return res.status(400).json({ errors: erros.array() })
        }
        const income: Income = req.body

        const sql = `INSERT INTO income (income_description, income_type, income_amount, driver_cpf, 
            income_date) VALUES (?, ?, ?, ?, ?)`

        const values = [
            income.incomeDescription,
            income.incomeType,
            income.incomeAmount,
            income.driverCpf,
            getCurrentDateTimeMySQLFormat()
        ]

        try {
            const con = await connection.getConnection()
            await connection.query(sql, values)
            con.release()
            res.status(200).send("Receita registrada com sucesso")

        } catch (error: any) {
            res.status(404).send("Erro ao Registrar Receita")
        }
    })

export const getTotalIncome = async (cpf: string) => {
    const sql = ` SELECT income_amount FROM income where driver_cpf = ${cpf} `
    try {
        await connection.getConnection()
        const [result] = await connection.execute(sql)
        const queryResultIncome = result as { income_amount: number }[]

        const totalIncome = queryResultIncome.reduce((accumulator, currentItem) => {
            return accumulator + Number(currentItem.income_amount)
        }, 0)

        return totalIncome
    } catch (error) {
        console.error(error)
    }
}

router.get('/getTotalIncome/:cpf', async (req: Request, res: Response) => {
    const { cpf } = req.params
    try {
        const totalIncome = await getTotalIncome(cpf)
        res.status(200).send(`${totalIncome}`)
    } catch (error) {
        res.status(400).send('Erro ao buscar valor total de Receitas')
    }
})

router.get('/get/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const sql = `SELECT * FROM income WHERE income_id = ${id}`

    try {
        await connection.getConnection()
        const [result] = await connection.execute(sql)
        if (Array.isArray(result) && result.length === 0) {
            throw new Error()
        } else {
            res.send(result).status(200)
        }
    } catch (error) {
        res.status(404).send('Erro ao buscar usuário')
        return null
    }
})

router.put('/update/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const income: Income = req.body

    const sql = `UPDATE income SET income_description = ? ,  income_type = ? , income_amount = ? WHERE income_id = ${id};`

    const values = [
        income.incomeDescription,
        income.incomeType,
        income.incomeAmount,
    ]
    try {
        const con = await connection.getConnection()
        const [result] = await connection.query(sql, values)
        con.release()
        res.status(200).send('usuario autualizado com sucesso')
    } catch (error) {
        console.error('Erro ao atualizar o usuário:', error)
        res.status(400).send('erro ao atualizar')
    }
})

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const sql = `DELETE FROM income WHERE income_id = ${id}`
    try {
        const [result] = await connection.execute(sql)
        res.status(204).send('Receita deletada com sucesso!')
    } catch (error) {
        res.status(400).send('erro ao deletar Receita!')
    }
})

export default router