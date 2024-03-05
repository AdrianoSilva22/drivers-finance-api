import { Request, Response } from 'express';
import { check, validationResult } from "express-validator";

export const expressValidationUtils = () => {

    const handleRequestValidation = (req: Request, res: Response) => {
        const erros = validationResult(req)

        if (!erros.isEmpty()) {
            return res.status(400).json({ errors: erros.array(), statuscode: 400 })
        }
    }

    const checkLoginValidation = () => {

        return [check('email').notEmpty().withMessage('O campo de email não pode estar vazio!'),
        check('senha').notEmpty().withMessage('O campo de senha não pode estar vazio!')]
    }

    return {
        handleRequestValidation,
        checkLoginValidation
    }

}