import { readdirSync, existsSync } from 'fs'
import path from 'path'

function getObjectValues(obj: any) {
  const keys = Object.keys(obj)

  if (!keys || keys.length === 0) return []

  return keys.map((k) => obj[k])
}

async function importFile(path: string) {
  const modelObject = await import(path)

  const [model] = getObjectValues(modelObject)

  return [
    model || modelObject,
    'esm'
  ]
}

async function loadFilesOnDirectory(dir: string): Promise<any> {
  if (!existsSync(dir)) return []

  const files = readdirSync(dir, { encoding: 'utf-8' })
  const classes = []
  if (files?.length > 0) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      const [_class] = await importFile(path.join(dir, file))
      classes.push(_class)
    }

    return classes
  }
}

export {
  loadFilesOnDirectory
}
