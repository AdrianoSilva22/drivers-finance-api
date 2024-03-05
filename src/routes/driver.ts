import { hash } from 'bcrypt';
import * as dotenv from "dotenv";
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import connection from '../config/connectionDb';
import { Driver, trueActive } from '../models/driverModel';
import { driverRepository } from '../repositories/driverRepository';
import { dateTimeMysqlUtils } from '../utils/dateTimeMySqlUtils';
import { expressValidationUtils } from '../utils/expressValidationUtils';
import { getTotalExpense } from './expense';
import { getTotalIncome } from './income';
dotenv.config()


const router = express.Router()
const { login } = driverRepository()
const { handleRequestValidation, checkLoginValidation } = expressValidationUtils()

const { getCurrentDateTimeMySQLFormat } = dateTimeMysqlUtils()
const verify =

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

      const passwordHash = await hash(driver.senha, 10)
      const sql = `INSERT INTO driver (cpf, name, email, senha, phone_number, active, genero, registration_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

      const values = [
        driver.cpf,
        driver.name,
        driver.email,
        passwordHash,
        driver.phone_number,
        trueActive(true),
        driver.genero,
        getCurrentDateTimeMySQLFormat(),
      ]

      try {

        const con = await connection.getConnection()
        await connection.query(sql, values)
        res.status(200).send("Motorista cadastrado com sucesso")
        con.release()
      } catch (error: any) {
        if (error.errno == 1062) {
          if (error.sqlMessage.includes('driver.email')) {
            res.status(400).send("O e-mail fornecido já está em uso. Por favor, escolha outro.")
          } else if (error.sqlMessage.includes('driver.phone_number')) {
            res.status(400).send('O número de telefone fornecido já está em uso.')
          } else if (error.sqlMessage.includes('driver.PRIMARY')) {
            res.status(400).send('CPF já está Cadastrado')
          } else {
            res.status(400).send("Ocorreu um erro ao tentar salvar o motorista. Por favor, tente novamente.")
          }
        }
      }
    })

router.post('/login',

  async (req: Request, res: Response) => {

    // await handleRequestValidation(req, res)

    const driver: Driver = req.body

    const values = [
      driver.email,
      driver.senha,
    ]

    const driverDataToken: Driver = {
      cpf: driver.cpf,
      name: driver.name,
      email: driver.email,
      phone_number: driver.phone_number,
      senha: '',
      genero: ''
    }

    try {

      const loginQueryResult = await login(driver, driverDataToken, values)

      if (loginQueryResult.success == true) {

        res.status(200).json({
          token: loginQueryResult.token,
          message: loginQueryResult.messageSuccess
        })
      } else {
        res.status(401).json({
          message: loginQueryResult.messageError
        })
      }

    } catch (error) {
      console.log(error)
      res.status(400).send("Ops, algo deu errado. Verifique suas credenciais e tente novamente.")
    }
  })

router.get('/getTotal', async (req: Request, res: Response) => {
  const sql = ` SELECT * FROM driver `
  const con = await connection.getConnection()

  try {
    const [result] = await con.execute(sql)
    res.json(result).status(200)
    con.release()
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error)
    res.status(404).send('Erro ao buscar motoristas')
  } finally {
    con.release()
  }
})

router.get('/get/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params
  const sql = `SELECT * FROM driver WHERE cpf = ${cpf}`

  try {
    const con = await connection.getConnection()
    const [result] = await connection.execute(sql)
    if (Array.isArray(result) && result.length === 0) {
      throw new Error()
    } else {
      res.send(result).status(200)
    }
    con.release()

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
    trueActive(true),
    driver.genero,
  ]
  try {
    const con = await connection.getConnection()
    const [result] = await con.query(sql, valores)
    res.status(200).send('Motorista atualizado com sucesso')
    con.release()
  } catch (error) {
    console.error('Erro ao atualizar o motorista:', error)
    res.status(400).send('Erro ao atualizar o motorista')
  }
})

router.delete('/delete/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params
  const sql = `DELETE FROM driver WHERE cpf = ${cpf}`
  const con = await connection.getConnection()
  try {
    await con.execute(sql)
    res.status(204).send('Motorista deletado com sucesso!')
    con.release()
  } catch (error) {
    res.status(400).send('Erro ao deletar motorista!')
  } finally {
    con.release()
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
