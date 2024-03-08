import { compare } from "bcrypt";
import connection from "../config/connectionDb";
import { Driver } from "../models/driverModel";
import { tokenUtils } from '../utils/tokenUtils';
const { generateToken } = tokenUtils()



export const driverRepository = () => {

    const login = async (driver: Driver, driverDataToken: Driver, values: string[]) => {
        const sql = `SELECT senha FROM driver where email = ?`
        const con = await connection.getConnection()

        try {
            const queryResult = await con.query(sql, values)
            const passwordQueryResult = queryResult[0] as { senha: string }[]
            const token = generateToken(driver)
            const passwordVerified = await compare(driver.senha, passwordQueryResult[0].senha)

            if (passwordVerified) {
                return {
                    success: true,
                    messageSuccess: "Login realizado com Sucesso!",
                    token
                }
            } else {
                return {
                    success: false,
                    messageError: "Login de usuário ou senha incorreto."
                }
            }
        } catch (error) {
            throw error;
        } finally {
            con.release()
        }
    }

    const save = async (driver: Driver, values: any[]) => {

        const sql = `INSERT INTO driver (cpf, name, email, senha, phone_number, active, genero, registration_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        const con = await connection.getConnection()

        try {
            const result = await con.query(sql, values)

            if (result) {
                return {
                    success: true,
                    message: "Motorista Cadastrado com Sucesso!"
                }
            }
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
            const [result] = await connection.execute(sql)

            if (result) {
                return {
                    success: true,
                    message: "Motorista Cadastrado com Sucesso!"
                }
            }

        } catch {

        }


    }



    return {
        login,
        save,
        showDrivers
    }

}
