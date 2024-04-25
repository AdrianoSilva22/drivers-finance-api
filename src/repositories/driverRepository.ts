import { compare } from "bcrypt";
import connection from "../config/connectionDb";
import { Driver } from "../models/driverModel";
import { tokenUtils } from '../utils/tokenUtils';
import { expenseRepository } from "./expenseRepository";
import { incomeRepository } from "./incomeRepository";
const { generateToken } = tokenUtils()
const { getTotalExpense } = expenseRepository()
const { getTotalIncome } = incomeRepository()




export const driverRepository = () => {

    const loginDriver = async (driver: Driver, driverDataToken: Driver, values: string[],) => {
        const sql = `SELECT senha FROM driver where email = ?`
        const con = await connection.getConnection()
        let messageResult: {
            success: boolean;
            messageSuccess?: string;
            token?: string;
            messageError?: string;
        }

        try {
            const queryResult = await con.query(sql, values) as [][]
            let passwordVerified = false
            let password = ""

            if (queryResult[0].length > 0) {
                const passwordQueryResult = queryResult[0] as { senha: string }[]
                password = passwordQueryResult[0].senha
            }

            const token = generateToken(driverDataToken)

            if (password) {
                passwordVerified = await compare(driver.senha, password)
            }

            if (passwordVerified) {
                messageResult = {
                    success: true,
                    messageSuccess: "Login realizado com Sucesso!",
                    token
                }
            } else {
                messageResult = {
                    success: false,
                    messageError: "Login de usuário ou senha incorreto."
                }
            }

            return messageResult
        } catch (error) {
            throw error;
        } finally {
            con.release()
        }
    }

    const saveDriver = async (driver: Driver, values: any) => {

        const sql = `INSERT INTO driver (cpf, name, email, senha, phone_number, active, genero, registration_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        const con = await connection.getConnection()

        try {
            await con.query(sql, values)
        } catch (error: any) {
            throw error;

        } finally {
            con.release()
        }
    }

    const showDrivers = async () => {

        const sql = ` SELECT * FROM driver `
        const con = await connection.getConnection()

        try {
            const [result] = await con.execute(sql)

            if (result) {
                return {
                    success: true,
                    result
                }
            }
        } catch (error: any) {
            throw error
        } finally {
            con.release
        }
    }

    const showDriverById = async (cpf: string) => {
        const sql = `SELECT * FROM driver WHERE cpf = '${cpf}'`
        const con = await connection.getConnection()
        try {
            const [result] = await con.execute(sql)
            if (result) {
                return {
                    success: true,
                    result
                }
            }
        } catch (error: any) {
            throw error
        } finally {
            con.release()
        }
    }

    const updateDriver = async (driver: Driver, values: any, cpf: string) => {
        const sql = `UPDATE driver SET name = ? , email = ? , senha = ?, phone_number = ?, active = ?, genero = ? WHERE cpf = ${cpf}`
        const con = await connection.getConnection()

        try {

            const [result] = await con.query(sql, values)

            if (Array.isArray(result) && result.length === 0) {
                throw new Error()
            } else {
                return {
                    result
                }
            }
        } catch (error: any) {
            throw error
        } finally {
            con.release()
        }
    }

    const deleteDriver = async (cpf: string) => {

        const sql = `DELETE FROM driver WHERE cpf = '${cpf}'`
        const con = await connection.getConnection()

        try {
            return await con.execute(sql)
        } catch (error: any) {
            throw error
        } finally {
            con.release()
        }
    }

    const showTotalDriverBalance = async (cpf: string) => {
        const sql = `SELECT * FROM driver WHERE cpf = '${cpf}'`
        const con = await connection.getConnection()

        try {
            const totalIncome = await getTotalIncome(cpf)
            const totalExpense = await getTotalExpense(cpf)

            if (totalIncome != undefined && totalExpense != undefined) {
                const totalBalance = totalIncome - totalExpense
                return {
                    totalBalance
                }
            }
        } catch (error: any) {
            throw error
        } finally {
            con.release()
        }
    }

    return {
        loginDriver,
        saveDriver,
        showDrivers,
        showDriverById,
        updateDriver,
        deleteDriver,
        showTotalDriverBalance
    }

}
