import { DriverEntity } from "../../../entity/driver";
import { DriverModel } from "../model/driver";

function toDriverEntity(m: DriverModel): DriverEntity {
  return new DriverEntity(m.ID, m.cpf, m.name, m.email, m.password, m.gender, m.phone, m.createdAt, m.updatedAt)
}

function toDriverModel(e: DriverEntity): DriverModel {
  return new DriverModel(e.ID, e.cpf, e.name, e.email, e.password, e.gender, e.phone, e.createdAt, e.updatedAt)
}

export {
  toDriverEntity,
  toDriverModel
}