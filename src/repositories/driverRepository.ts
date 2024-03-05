import { compare, hash } from "bcrypt";
import connection from "../config/connectionDb";
import { Driver } from "../models/driverModel";
import { tokenUtils } from '../utils/tokenUtils';
const { generateToken } = tokenUtils()



export const driverRepository = () => {

    const loginDriver = async (driver: Driver, driverDataToken: Driver, values: string[],) => {
        const sql = `SELECT senha FROM driver where email = ?`
        try {

            const con = await connection.getConnection()
            const queryResult = await connection.query(sql, values)
            const passwordQueryResult = queryResult[0] as { senha: string }[]
            const token = generateToken(driver)
            const passwordVerified = await compare(driver.senha, passwordQueryResult[0].senha)


            if (passwordVerified) {
                return {
                    success: true,
                    messageSuccess: "Login realizado com Sucesso!",
                    token
                }
                con.release()
            } else {
                return {
                    success: false,
                    messageError: "Login de usuário ou senha incorreto."
                }
                con.release()
            }
        } catch (error) {
            throw error;
        }

    }

    const saveDriver = async (driver: Driver, values) => {


        const passwordHash = await hash(driver.senha, 10)
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
        showDriverById
    }

}
