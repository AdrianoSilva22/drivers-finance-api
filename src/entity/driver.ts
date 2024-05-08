class DriverEntity {
  ID: string | null
  cpf: string
  name: string
  email: string
  password: string
  gender: string
  phone: string
  createdAt: Date
  updatedAt: Date

  constructor(ID: string | null, cpf: string, name: string, email: string, password: string, gender: string, phone: string, createdAt: Date, updatedAt: Date) {
    this.ID = ID
    this.cpf = cpf
    this.name = name
    this.email = email
    this.password = password
    this.gender = gender
    this.phone = phone
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export {
  DriverEntity
}