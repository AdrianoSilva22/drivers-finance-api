import { Request, Response } from 'express';
import { validationResult } from "express-validator";


export const handleRequestValidation = (req: Request, res: Response) => {
    const erros = validationResult(req)

    if (!erros.isEmpty()) {
        return res.status(400).json({ errors: erros.array(), statuscode: 400 })
    }
}