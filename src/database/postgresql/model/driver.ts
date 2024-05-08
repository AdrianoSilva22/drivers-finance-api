import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'public', name: 'drivers' })
class DriverModel {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  ID: string | null

  @Column({ type: 'varchar', length: '255' })
  cpf: string

  @Column({ type: 'varchar', length: '255' })
  name: string

  @Column({ type: 'varchar', length: '255' })
  email: string

  @Column({ type: 'varchar', length: '255' })
  password: string

  @Column({ type: 'varchar', length: '255' })
  gender: string

  @Column({ type: 'varchar', length: '255' })
  phone: string

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @Column({ type: 'timestamp', name: 'updated_at' })
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
  DriverModel
}