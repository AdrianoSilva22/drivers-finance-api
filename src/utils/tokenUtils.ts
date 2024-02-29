import jwt from "jsonwebtoken";
import { Driver } from "../models/driverModel";

export const tokenUtils = () => {


    const generateToken = (driverDataToken: Driver) => {

        const SECRET = process.env.SECRET;
        if (!SECRET) {
            throw new Error('Chave secreta não definida!');
        }

        const token = jwt.sign(driverDataToken, SECRET, {
            expiresIn: 2 * 60
        })

        return token
    }

    return {

        generateToken

    }

}
