import { hash } from "bcrypt"
import { Driver } from "../models/driverModel"

export const passwordHash = async (driver: Driver) => {
    return await hash(driver.senha, 10)
}