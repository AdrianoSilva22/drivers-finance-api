import * as dotenv from "dotenv";
import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { Driver } from "../database/postgresql/model/driverModel";
dotenv.config()

export const tokenUtils = () => {

    const generateToken = (driverDataToken: Driver) => {

        const SECRET = process.env.SECRET;
        if (!SECRET) {
            throw new Error('Chave secreta não definida!');
        }

        const token = jwt.sign(driverDataToken, SECRET, {
            expiresIn: 20
        })

        return token
    }

    const verifyToken = (req: Request, res: Response /* , next: NextFunction*/) => {
        const token = req.headers.authorization as string
        if (!token) { res.status(401).send("Nenhum token fornecido.") }
        try {
            const tokenWithoutBearer = token.slice(7, token.length) //slice rejeita (nesse caso '7') os 7 primeiros caracteres
            jwt.verify(tokenWithoutBearer, process.env.SECRET as string, (err, decoded) => {
                if (err) {
                    res.status(401).send({ message: "Invalid Token" });
                } else {
                    res.status(200).send("certo ")
                }
            })
        } catch (err) {
            console.log(err)
            res.status(500).send("Falha ao autenticar o token")
        }

        // if (typeof decoded !== 'string' && decoded.cpf) {
        //     const decodedCPF = decoded.cpf;
        //     next()
        // }
    }

    return {
        generateToken,
        verifyToken
    }

}
