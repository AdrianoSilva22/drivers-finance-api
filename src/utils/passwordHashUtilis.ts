import { hash } from "bcrypt"

export const passwordHash = async (senha: string) => {
    return await hash(senha, 10)
}