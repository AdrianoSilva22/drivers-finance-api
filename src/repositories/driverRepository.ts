import { compare } from "bcrypt";
import connection from "../config/connectionDb";
import { Driver } from "../models/driverModel";
import { tokenUtils } from '../utils/tokenUtils';
const { generateToken } = tokenUtils()



export const driverRepository = () => {

    const login = async (driver: Driver, driverDataToken: Driver, values: string[], ) => {
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

    return {
        login
    }
}


