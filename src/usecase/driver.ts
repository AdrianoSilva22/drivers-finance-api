import { DriverEntity } from "../entity/driver";
import { generateUUID } from "../utils/uuid";
import { CreateDriverUseCaseRepositoryInterface } from "./repository/driver";
import { CreateDriverUseCaseRequest, CreateDriverUseCaseResponse } from "./ucio/drive";
import { CreateDriverUseCaseValidateInterface } from "./validate/driver";

class CreateDriverUseCase {
  validate: CreateDriverUseCaseValidateInterface
  repository: CreateDriverUseCaseRepositoryInterface

  constructor(
    validate: CreateDriverUseCaseValidateInterface,
    repository: CreateDriverUseCaseRepositoryInterface
  ) {
    this.validate = validate
    this.repository = repository
  }

  async createDriver(req: CreateDriverUseCaseRequest): Promise<CreateDriverUseCaseResponse> {
    try {
      const errorMessage = this.validate.validateDriver(req)

      if (errorMessage) {
        console.log('PRE_CONDITIONAL_ERROR', errorMessage)
        return new CreateDriverUseCaseResponse(errorMessage)
      }
      const { cpf, email, gender, name, password, phone } = req

      const UUID = generateUUID()

      const now = new Date()
      await this.repository.createDriver(new DriverEntity(UUID, cpf, name, email, password, gender, phone, now, now))
      return new CreateDriverUseCaseResponse(null)
    } catch (error: any) {
      console.log('INTERNAL_SERVER_ERROR', error)

      return new CreateDriverUseCaseResponse(error)
    }
  }
}

export {
  CreateDriverUseCase
}