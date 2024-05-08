class CreateDriverUseCaseRequest {
  cpf: string
  name: string
  email: string
  password: string
  gender: string
  phone: string

  constructor(cpf: string, name: string, email: string, password: string, gender: string, phone: string) {
    this.cpf = cpf
    this.name = name
    this.email = email
    this.password = password
    this.gender = gender
    this.phone = phone
  }
}

class CreateDriverUseCaseResponse {
  error: string | null
  constructor(error: string | null) {
    this.error = error
  }
}

export {
  CreateDriverUseCaseRequest,
  CreateDriverUseCaseResponse
}