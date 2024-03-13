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

        return [
            check('email').notEmpty().withMessage('O campo de email não pode estar vazio!'),
            check('senha').notEmpty().withMessage('O campo de senha não pode estar vazio!')
        ]
    }

    const checkSaveValidation = () => {

        return [
            check('email').notEmpty().withMessage('O campo de e-mail não pode estar vazio!').isEmail().withMessage('Informe um e-mail válido'),
            check('name').notEmpty().withMessage('O campo nome não pode estar vazio!'),
            check('senha').isLength({ min: 8 }).withMessage('O campo senha deve ter no mínimo 8 caracteres!'),
            check('genero').notEmpty().withMessage('O campo gênero não pode estar vazio!'),
            check('cpf').notEmpty().withMessage('O campo CPF não pode estar vazio!'),
            check('phone_number').notEmpty().withMessage('O campo telefone não pode estar vazio!')
        ]
    }

    return {
        handleRequestValidation,
        checkLoginValidation,
        checkSaveValidation
    }

}