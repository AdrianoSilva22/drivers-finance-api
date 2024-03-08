import * as dotenv from "dotenv";
import express, { Request, Response } from 'express';
import connection from '../config/connectionDb';
import { Driver, trueActive } from '../models/driverModel';
import { driverRepository } from '../repositories/driverRepository';
import { dateTimeMysqlUtils } from '../utils/dateTimeMySqlUtils';
import { expressValidationUtils } from '../utils/expressValidationUtils';
import { getTotalExpense } from './expense';
import { getTotalIncome } from './income';
dotenv.config()


const router = express.Router()
const { login, save } = driverRepository()
const { handleRequestValidation, checkLoginValidation, checkSaveValidation } = expressValidationUtils()

const { getCurrentDateTimeMySQLFormat } = dateTimeMysqlUtils()
const verify =

  router.post('/save', checkSaveValidation(),

    async (req: Request, res: Response) => {

      handleRequestValidation(req, res)

      const driver: Driver = req.body

      const values = [
        driver.cpf,
        driver.name,
        driver.email,
        driver.senha,
        driver.phone_number,
        trueActive(true),
        driver.genero,
        getCurrentDateTimeMySQLFormat(),
      ]

      try {
        save(driver, values)
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
      res.status(400).send("Ops, algo deu errado. Tente novamente ou contate o admim.")
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
  const sql = `SELECT * FROM driver WHERE cpf = '${cpf}' `

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

  const sql = `UPDATE driver SET name = ? , email = ? , senha = ?, phone_number = ?, active = ?, genero = ? WHERE cpf = '${cpf}'`

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
  const sql = `DELETE FROM driver WHERE cpf = '${cpf}'`
  const con = await connection.getConnection()
  try {
    await con.execute(sql)
    res.status(204).send('Motorista deletado com sucesso!')
  } catch (error) {
    console.error(error)
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
