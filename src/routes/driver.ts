import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import connection from '../config/connection';
import { Driver } from '../models/driverModel';
import { getTotalExpense } from './expense';
import { getTotalIncome } from './income';

const router = express.Router()

const getCurrentDateTimeMySQLFormat = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')

  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')

  const mysqlDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  return mysqlDatetime
}

router.post('/save',
  [
    check('email').notEmpty().withMessage('O campo de e-mail não pode estar vazio!').isEmail().withMessage('Informe um e-mail válido'),
    check('name').notEmpty().withMessage('O campo nome não pode estar vazio!'),
    check('senha').isLength({ min: 8 }).withMessage('O campo senha deve ter no mínimo 8 caracteres!'),
    check('genero').notEmpty().withMessage('O campo gênero não pode estar vazio!')
  ],

  async (req: Request, res: Response) => {
    const erros = validationResult(req)

    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() })
    }

    const driver: Driver = req.body

    const sql = `INSERT INTO driver (cpf, name, email, senha, phone_number, active, genero, registration_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [
      driver.cpf,
      driver.name,
      driver.email,
      driver.senha,
      driver.phone_number,
      driver.active,
      driver.genero,
      getCurrentDateTimeMySQLFormat(),
    ]

    try {
      const con = await connection.getConnection()
      await connection.query(sql, values)

      con.release()
      res.status(200).send("Motorista cadastrado com sucesso")

    } catch (error: any) {
      if (error.errno == 1062) {
        if (error.sqlMessage.includes('driver.email')) {
          res.status(400).send("O e-mail fornecido já está em uso. Por favor, escolha outro.")
        } else if (error.sqlMessage.includes('driver.phone_number')) {
          res.status(400).send('O número de telefone fornecido já está em uso.')
        } else {
          res.status(400).send("Ocorreu um erro ao tentar salvar o motorista. Por favor, tente novamente.")
        }
      }
    }
  })

router.post('/login',
  [check('email').notEmpty().withMessage('O campo de login não pode estar vazio!'),
  check('senha').isLength({ min: 8 }).withMessage('O campo senha deve ter no mínimo 8 caracteres!')],

  async (req: Request, res: Response) => {
    const erros = validationResult(req)

    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() })
    }

    const driver: Driver = req.body
    const values = [
      driver.email,
      driver.senha,
    ]

    const sql = `SELECT senha FROM driver where email = ?`

    try {
      const con = await connection.getConnection()
      const queryResult = await connection.query(sql, values)
      const passwordArrayResult = queryResult[0] as { senha: string }[]

      if (driver.senha == passwordArrayResult[0].senha) {
        res.send('Login bem-sucedido!')
        con.release()

      } else {
        res.status(401).send("Login de usuário ou senha incorreto.")
        con.release()
      }
    } catch (error) {
      res.status(400).send("Ops, algo deu errado. Verifique suas credenciais e tente novamente.")
    }
  })

router.get('/search', async (req: Request, res: Response) => {
  const sql = ` SELECT * FROM driver `

  try {
    await connection.getConnection()
    const [result] = await connection.execute(sql)
    res.json(result).status(200)
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error)
    res.status(404).send('Erro ao buscar motoristas')
  }
})

router.get('/search/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params
  const sql = `SELECT * FROM driver WHERE cpf = ${cpf}`

  try {
    await connection.getConnection()
    const [result] = await connection.execute(sql)
    if (Array.isArray(result) && result.length === 0) {
      throw new Error()
    } else {
      res.send(result).status(200)
    }
  } catch (error) {
    res.status(404).send('Erro ao buscar motorista')
    return null
  }
})

router.put('/update/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params
  const driver: Driver = req.body

  const sql = `UPDATE driver SET name = ? , email = ? , senha = ?, phone_number = ?, active = ?, genero = ? WHERE cpf = ${cpf}`

  const valores = [
    driver.name,
    driver.email,
    driver.senha,
    driver.phone_number,
    driver.active,
    driver.genero,
  ]
  try {
    const con = await connection.getConnection()
    const [result] = await connection.query(sql, valores)
    con.release()
    res.status(200).send('Motorista atualizado com sucesso')
  } catch (error) {
    console.error('Erro ao atualizar o motorista:', error)
    res.status(400).send('Erro ao atualizar o motorista')
  }
})

router.delete('/delete/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params
  const sql = `DELETE FROM driver WHERE cpf = ${cpf}`
  try {
    const [result] = await connection.execute(sql)
    res.status(204).send('Motorista deletado com sucesso!')
  } catch (error) {
    res.status(400).send('Erro ao deletar motorista!')
  }
})

router.get('/getTotalBalance/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params
  try {
    const totalIncome = await getTotalIncome(cpf)
    const totalExpense = await getTotalExpense(cpf)

    if (totalIncome != undefined && totalExpense != undefined) {
      const totalBalance = totalIncome - totalExpense

      res.status(200).send(`${totalBalance}`)
    }
  } catch (error) {
    res.status(404).send('Erro ao buscar o Saldo do Motorista')
  }
})

export default router
