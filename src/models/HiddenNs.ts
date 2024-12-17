import Cell from './Cell'

type Result = {
    numbers: Array<number>;

    cells: Cell[];
}

function getAllUniqueNumbers(array: Array<Cell>) {
  const allNumbers: Array<number> = []
  array.forEach((cell: Cell) => {
    allNumbers.push(...cell.possibleNumbers)
  })
  return [...new Set(allNumbers)]
}

function getAllPairs(cell: Cell) {
  const allPairs: Array<[number, number]> = []
  for (let i = 0; i < cell.possibleNumbers.length; i += 1) {
    for (let j = i + 1; j < cell.possibleNumbers.length; j += 1) {
      allPairs.push([cell.possibleNumbers[i], cell.possibleNumbers[j]])
    }
  }
  return allPairs
}

function getAllTriples(cell: Cell) {
  const allTriples: Array<[number, number, number]> = []
  for (let i = 0; i < cell.possibleNumbers.length; i += 1) {
    for (let j = i + 1; j < cell.possibleNumbers.length; j += 1) {
      for (let k = j + 1; k < cell.possibleNumbers.length; k += 1) {
        allTriples.push([cell.possibleNumbers[i], cell.possibleNumbers[j], cell.possibleNumbers[k]])
      }
    }
  }
  return allTriples
}

function isArrayExistsInSet(pair: Array<number>, set: Array<Array<number>>): boolean {
  for (let i = 0; i < set.length; i += 1) {
    if (JSON.stringify(pair) === JSON.stringify(set[i])) {
      return true
    }
  }
  return false
}

function getAllCommonPairs(cellX: Cell, cellY: Cell) {
  const commonPairs: Array<[number, number]> = []

  const allCellXPairs = getAllPairs(cellX)
  const allCellYPairs = getAllPairs(cellY)

  allCellXPairs.forEach((pair: [number, number]) => {
    if (isArrayExistsInSet(pair, allCellYPairs)) {
      commonPairs.push(pair)
    }
  })

  return commonPairs
}

function getAllCommonTriples(cellX: Cell, cellY: Cell, cellZ: Cell) {
  const commonTriples: Array<[number, number, number]> = []

  const allCellXTriples = getAllTriples(cellX)
  const allCellYTriples = getAllTriples(cellY)
  const allCellZTriples = getAllTriples(cellZ)

  allCellXTriples.forEach((triples: [number, number, number]) => {
    if (isArrayExistsInSet(triples, allCellYTriples) && isArrayExistsInSet(triples, allCellZTriples)) {
      commonTriples.push(triples)
    }
  })

  return commonTriples
}

function isNumbersInOtherCells(array: Array<number>, cells: Array<Cell>) {
  for (let i = 0; i < cells.length; i += 1) {
    for (let j = 0; j < array.length; j += 1) {
      if (cells[i].possibleNumbers.includes(array[j])) {
        return true
      }
    }
  }
  return false
}

function isNumbersInCellsEqual(cellX: Cell, cellY: Cell) {
  return JSON.stringify(cellX.possibleNumbers) === JSON.stringify(cellY.possibleNumbers)
}

function getCellHiddenSingle(cell: Cell, cellsToCheck: Cell[]): Result | undefined {
  for (let i = 0; i < cell.possibleNumbers.length; i += 1) {
    if (!isNumbersInOtherCells([cell.possibleNumbers[i]], cellsToCheck)) {
      return {
        numbers: [cell.possibleNumbers[i]],
        cells: [cell],
      }
    }
  }
  return undefined
}

function getCellHiddenPair(cell: Cell, cellsToCheck: Cell[]): Result | undefined {
  for (let i = 0; i < cellsToCheck.length; i += 1) {
    const pairs = getAllCommonPairs(cell, cellsToCheck[i])

    for (let j = 0; j < pairs.length; j += 1) {
      if (!isNumbersInOtherCells(pairs[j], cellsToCheck.filter((el) => el !== cellsToCheck[i]))) {
        return {
          numbers: pairs[j],
          cells: [cell, cellsToCheck[i]],
        }
      }
    }
  }
  return undefined
}

function getCellHiddenTriple(cell: Cell, cellsToCheck: Cell[]): Result | undefined {
  for (let i = 0; i < cellsToCheck.length; i += 1) {
    for (let j = i + 1; j < cellsToCheck.length; j += 1) {
      const triples = getAllCommonTriples(cell, cellsToCheck[i], cellsToCheck[j])

      for (let k = 0; k < triples.length; k += 1) {
        if (!isNumbersInOtherCells(triples[k], cellsToCheck.filter((el) => el !== cellsToCheck[i] && el !== cellsToCheck[j]))) {
          return {
            numbers: triples[k],
            cells: [cell, cellsToCheck[i], cellsToCheck[j]],
          }
        }
      }
    }
  }
  return undefined
}

function getCellObviousPair(cell: Cell, cellsToCheck: Cell[]): Result | undefined {
  if (cell.possibleNumbers.length === 2) {
    for (let i = 0; i < cellsToCheck.length; i += 1) {
      if (isNumbersInCellsEqual(cell, cellsToCheck[i])) {
        return {
          numbers: cell.possibleNumbers,
          cells: [cell, cellsToCheck[i]],
        }
      }
    }
  }
  return undefined
}

function getCellObviousTriple(cell: Cell, cellsToCheck: Cell[]): Result | undefined {
  for (let i = 0; i < cellsToCheck.length; i += 1) {
    for (let j = i + 1; j < cellsToCheck.length; j += 1) {
      const allUniqueNumbers = getAllUniqueNumbers([cell, cellsToCheck[i], cellsToCheck[j]])

      if (allUniqueNumbers.length === 3) {
        return {
          numbers: allUniqueNumbers,
          cells: [cell, cellsToCheck[i], cellsToCheck[j]],
        }
      }
    }
  }
  return undefined
}

class HiddenNs {
  static getCellHiddenNs(cell: Cell, cellsToCheck: Array<Cell>, n: number): Result | undefined {
    switch (n) {
      case 1: {
        return getCellHiddenSingle(cell, cellsToCheck)
      }
      case 2: {
        return getCellHiddenPair(cell, cellsToCheck)
      }
      case 3: {
        return getCellHiddenTriple(cell, cellsToCheck)
      }
      default: {
        console.log('getCellHiddenNs no possible options')
      }
    }
    return undefined
  }

  static getCellObviousNs(cell: Cell, cellsToCheck: Array<Cell>, n: number): Result | undefined {
    switch (n) {
      case 2: {
        return getCellObviousPair(cell, cellsToCheck)
      }
      case 3: {
        return getCellObviousTriple(cell, cellsToCheck)
      }
      default: {
        console.log('getCellObviousNs no possible options')
      }
    }
    return undefined
  }

  static isNumberInSquareJustAtTheSameRow(number: number, cell: Cell, cellsToCheck: Array<Cell>): boolean {
    for (let i = 0; i < cellsToCheck.length; i += 1) {
      if (cellsToCheck[i].rowIdx !== cell.rowIdx) {
        if (cellsToCheck[i].possibleNumbers.includes(number)) {
          return false
        }
      }
    }
    return true
  }

  static isNumberInSquareJustAtTheSameColumn(number: number, cell: Cell, cellsToCheck: Array<Cell>): boolean {
    for (let i = 0; i < cellsToCheck.length; i += 1) {
      if (cellsToCheck[i].columnIdx !== cell.columnIdx) {
        if (cellsToCheck[i].possibleNumbers.includes(number)) {
          return false
        }
      }
    }
    return true
  }

  static isNumberInOtherCells(number: number, cellsToCheck: Array<Cell>) {
    for (let i = 0; i < cellsToCheck.length; i += 1) {
      if (cellsToCheck[i].possibleNumbers.includes(number)) {
        return true
      }
    }
    return false
  }
}

export default HiddenNs
