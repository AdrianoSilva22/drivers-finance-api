export interface Driver {
    cpf: string
    name: string
    email: string
    senha: string
    genero: string
    active: boolean
    phone_number: string
  }

  export const trueActive = () => {
    return `true`
  }