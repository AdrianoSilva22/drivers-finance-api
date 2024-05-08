function checkNumberEmpty(e: number): boolean {
  return e === undefined || e === null || Number.isNaN(e)
}

function checkStringEmpty(e: string): boolean {
  return e === undefined || e === null || e.trim() === ''
}

function checkListEmpty(arr: Array<any>): boolean {
  return arr === undefined || arr === null || arr.length <= 0
}

function checkBooleanEmpty(e: boolean): boolean {
  return e === undefined || e === null
}

function checkDateEmpty(e: Date): boolean {
  return e === undefined || e === null
}

function checkRowEmptyFile(row: any): boolean {
  return row.length === 9 || row.undefined || row.null
}

export {
  checkNumberEmpty,
  checkStringEmpty,
  checkListEmpty,
  checkBooleanEmpty,
  checkDateEmpty,
  checkRowEmptyFile
}
