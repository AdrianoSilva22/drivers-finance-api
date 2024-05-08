import 'reflect-metadata'
import { EntityManager, Repository } from 'typeorm'
import { getDataSource } from './data_source'

class Connection {
  static async transaction(f: any) {
    const dataSource = await getDataSource()
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }

    return dataSource.transaction(f)
  }

  static async getRepository(T: any): Promise<Repository<any>> {
    const dataSource = await getDataSource()
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }

    return dataSource.getRepository(T)
  }

  static async getManager(): Promise<EntityManager> {
    const dataSource = await getDataSource()
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }

    return dataSource.manager
  }
}

export {
  Connection
}
