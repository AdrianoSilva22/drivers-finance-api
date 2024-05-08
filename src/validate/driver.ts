import { CreateDriverUseCaseRequest } from "../usecase/ucio/drive";
import { CreateDriverUseCaseValidateInterface } from "../usecase/validate/driver";
import { checkStringEmpty } from "./validate";

class CreateDriverUseCaseValidate implements CreateDriverUseCaseValidateInterface {
  validateDriver(req: CreateDriverUseCaseRequest): string | null {
    const { cpf, email, gender, name, password, phone } = req
    if (checkStringEmpty(cpf)) return 'O cpf não pode ficar vazio!'
    if (checkStringEmpty(name)) return 'O nome não pode ficar vazio!'
    if (checkStringEmpty(email)) return 'O nome email pode ficar vazio!'
    if (checkStringEmpty(password)) return 'O senha pode ficar vazia!'

    return null
  }
}

export {
  CreateDriverUseCaseValidate
}