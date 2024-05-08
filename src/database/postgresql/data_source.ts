import * as pg from 'pg'
import path from 'path'
import { DataSource } from 'typeorm'
import { loadFilesOnDirectory } from '../../utils/util'

pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (stringValue: string) => new Date(`${stringValue}Z`))

class DataSourceBuilder {
  static readonly PATH_FILES = path.join(__dirname, 'model/*.{ts,js}')
  static readonly PATH_DIR = path.join(__dirname, 'model')

  static async resolveEntities() {
    if (process.platform === 'win32') {
      return await loadFilesOnDirectory(this.PATH_DIR)
    } else {
      return [this.PATH_FILES]
    }
  }

  static async builderDatasource() {
    return new DataSource({
      type: 'postgres',
      url: 'postgresql://atos:123456@localhost:5432/drivers_finance',
      synchronize: false,
      entities: await this.resolveEntities()
    })
  }
}

let dataSource: DataSource

async function getDataSource() {
  if (!dataSource) {
    dataSource = await DataSourceBuilder.builderDatasource()
  }

  return dataSource
}

export {
  getDataSource
}
