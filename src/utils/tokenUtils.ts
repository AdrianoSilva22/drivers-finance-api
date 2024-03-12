import * as dotenv from "dotenv";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { Driver } from "../models/driverModel";
dotenv.config()

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

    const verifyToken = (req: Request, res: Response) => {
        const token = req.headers['authorization'] as string
        if (!token) { res.status(401).send("Nenhum token fornecido.") }

        jwt.verify(token, process.env.SECRET as string, (err, decoded) => {
            if (err) { res.status(500).send() }
        })
    }

    return {

        generateToken

    }

}
