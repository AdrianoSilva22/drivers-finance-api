import { CreateDriverUseCaseRequest } from "../ucio/drive";

interface CreateDriverUseCaseValidateInterface {
  validateDriver(req: CreateDriverUseCaseRequest): string | null
}

export {
  CreateDriverUseCaseValidateInterface
}