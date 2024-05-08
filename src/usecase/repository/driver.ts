import { DriverEntity } from "../../entity/driver";
import { CreateDriverUseCaseRequest, CreateDriverUseCaseResponse } from "../ucio/drive";

interface CreateDriverUseCaseRepositoryInterface {
  // getDriver(ID: number): Promise<DriverEntity | null>
  createDriver(driver: DriverEntity): Promise<void>
}

export {
  CreateDriverUseCaseRepositoryInterface
}