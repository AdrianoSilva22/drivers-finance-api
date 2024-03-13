import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import { Driver } from "../models/driverModel";
dotenv.config()

export const tokenUtils = () => {
    let decoded: JwtPayload | string

    interface CustomRequest extends Request {
        userCpf?: string;
    }

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

    const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.headers['authorization'] as string
        if (!token) { res.status(401).send("Nenhum token fornecido.") }
        try {

            decoded = jwt.verify(token, process.env.SECRET as string)

        } catch (err) {
            res.status(500).send("Falha ao autenticar o token")
        }

        if (typeof decoded !== 'string' && decoded.cpf) {
            const decodedCPF = decoded.cpf;
            next()
        }
    }

    return {

        generateToken,
        verifyToken
    }

}
