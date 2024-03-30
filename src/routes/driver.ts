import * as dotenv from "dotenv";
import express, { Request, Response } from 'express';
import { Driver } from '../models/driverModel';
import { driverRepository } from '../repositories/driverRepository';
import { dateTimeMysqlUtils } from '../utils/dateTimeMySqlUtils';
import { expressValidationUtils } from '../utils/expressValidationUtils';
import { passwordHash } from "../utils/passwordHashUtilis";
import { tokenUtils } from "../utils/tokenUtils";
dotenv.config()

const router = express.Router()
const { verifyToken } = tokenUtils()
const { loginDriver, saveDriver, showDrivers, showDriverById, showTotalDriverBalance, updateDriver, deleteDriver } = driverRepository()
const { handleRequestValidation, checkLoginValidation, checkSaveValidation } = expressValidationUtils()

const { getCurrentDateTimeMySQLFormat } = dateTimeMysqlUtils()

router.post('/save', checkSaveValidation(),

  async (req: Request, res: Response) => {

    handleRequestValidation(req, res)

    const driver: Driver = req.body

    const values = [
      driver.cpf,
      driver.name,
      driver.email,
      await passwordHash(driver.senha),
      driver.phone_number,
      true,
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

    await handleRequestValidation(req, res)

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
      genero: '',
      senha: '',
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

router.put('/update/:cpf', verifyToken, async (req: Request, res: Response) => {
  const { cpf } = req.params
  const driver: Driver = req.body

  const values = [
    driver.name,
    driver.email,
    driver.senha,
    driver.phone_number,
    true,
    driver.genero,
  ]
  try {

    const queryResultUpdateDriver = await updateDriver(driver, values, cpf)

    if (queryResultUpdateDriver) {
      res.status(200).json({ result: queryResultUpdateDriver.result }).send('Motorista atualizado com sucesso')
    }
  } catch (error) {
    res.status(400).send('Erro ao atualizar o motorista')
  }
})

router.delete('/delete/:cpf', async (req: Request, res: Response) => {
  const { cpf } = req.params

  try {
    const queryResultUpdateDriver = await deleteDriver(cpf)

    if (queryResultUpdateDriver) {
      res.status(204).send('Motorista deletado com sucesso!')
    }
  } catch (error) {
    res.status(400).send('Erro ao deletar motorista!')
  }
})

router.get('/getTotalBalance/:cpf', verifyToken, async (req: Request, res: Response) => {
  const { cpf } = req.params
  try {
    const queryResultBalanceDriver = await showTotalDriverBalance(cpf)

    if (queryResultBalanceDriver) {
      res.status(200).send(`O saldo do Driver é: ${queryResultBalanceDriver.totalBalance}`)
    }
  } catch (error) {
    res.status(404).send('Erro ao buscar o Saldo do Motorista')
  }
})

export default router
