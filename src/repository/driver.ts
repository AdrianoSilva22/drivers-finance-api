import { createDriver } from "../database/postgresql/driver";
import { DriverEntity } from "../entity/driver";
import { CreateDriverUseCaseRepositoryInterface } from "../usecase/repository/driver";

class CreateDriverUseCaseRepository implements CreateDriverUseCaseRepositoryInterface {
 async createDriver(filter: DriverEntity): Promise<void> {
    await createDriver(filter)
 }
}

export {
  CreateDriverUseCaseRepository
}