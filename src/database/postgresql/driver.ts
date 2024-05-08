import { DriverEntity } from "../../entity/driver";
import { Connection } from "./connection";
import { DriverModel } from "./model/driver";
import { toDriverModel } from "./transformer/driver";

async function createDriver(filter: DriverEntity): Promise<void> {
  const repository = await Connection.getRepository(DriverModel)

  const driverModel = toDriverModel(filter)

  await repository.save(driverModel)
}

export {
  createDriver
}