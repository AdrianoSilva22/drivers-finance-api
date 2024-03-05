import { hash } from 'bcrypt';
import * as dotenv from "dotenv";
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import connection from '../config/connectionDb';
import { Driver, trueActive } from '../models/driverModel';
import { driverRepository } from '../repositories/driverRepository';
import { expressValidationUtils } from '../utils/expressValidationUtils';
import { getTotalExpense } from './expense';
import { getTotalIncome } from './income';
import { dateTimeMysqlUtils } from '../utils/dateTimeMySqlUtils';
dotenv.config()


const router = express.Router()
const { loginDriver, saveDriver, showDrivers, showDriverById, updateDriver } = driverRepository()
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
        passwordHash,
        driver.phone_number,
        trueActive(true),
        driver.genero,
        getCurrentDateTimeMySQLFormat(),
      ]

      try {

        const saveQueryResult = await saveDriver(driver, values)
        res.send("Motorista Cadastrado com Sucesso!").status(200)

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

router.post('/login', checkLoginValidation(),

  async (req: Request, res: Response) => {

    handleRequestValidation(req, res)

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

      const queryResultLoginDriver = await loginDriver(driver, driverDataToken, values)

      if (queryResultLoginDriver.success == true) {

        res.status(200).json({
          token: queryResultLoginDriver.token,
          message: queryResultLoginDriver.messageSuccess
        })
      } else {
        res.status(400).json({
          token: queryResultLoginDriver.token,
          message: queryResultLoginDriver.messageError
        })
      }

    } catch (error) {
      res.status(400).send("Ops, algo deu errado. Tente novamente ou contate o admim.")
    }
  })

router.get('/getTotal', async (req: Request, res: Response) => {

  try {

    const queryResultShowDriver = await showDrivers()

    if (queryResultShowDriver?.success == true) {
      res.send(queryResultShowDriver.result).status(200)
    }
  } catch (error) {
    res.status(404).send('Erro ao buscar motoristas')
  }
})

router.get('/get/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params

  try {
    const queryResultShowDriverByCpf = await showDriverById(cpf)

    if (queryResultShowDriverByCpf) {
      if (Array.isArray(queryResultShowDriverByCpf.result) && queryResultShowDriverByCpf.result.length === 0) {
        throw new Error()
      } else {
        res.send(queryResultShowDriverByCpf.result).status(200)
      }
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

  const values = [
    driver.name,
    driver.email,
    driver.senha,
    driver.phone_number,
    trueActive(true),
    driver.genero,
  ]
  try {

    const queryResultUpdateDriver = await updateDriver(driver, values, cpf)

    if (queryResultUpdateDriver) {
      if (Array.isArray(queryResultUpdateDriver.result) && queryResultUpdateDriver.result.length === 0) {
        throw new Error()
      } else {
        res.status(200).send('Motorista atualizado com sucesso')
      }
    }
  } catch (error) {
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
