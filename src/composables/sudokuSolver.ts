import {
  reactive, toRefs, Ref,
} from 'vue'
import { getAllCommonElements } from '@/utils/arrays'

import Method from '@/types/Method'
import ExecutedMethodsData from '@/types/ExecutedMethodsData'
import ImplementedMethod from '@/types/ImplementedMethod'
import History from '@/models/History'
import ChangeLogLine from '@/models/ChangeLogLine'
import Cell from '@/models/Cell'
import HiddenNs from '@/models/HiddenNs'

type State = {
  field: Array<Array<Cell>>
  isSolved: boolean
}

const state = reactive<State>({
  field: [],
  isSolved: false,
})

export interface SudokuSolverComposable {
  implementedMethods: Array<ImplementedMethod>
  isSolved: Ref<boolean>
  field: Ref<Array<Array<Cell>>>
  changeLog: Ref<Array<ChangeLogLine>>
  executeMethodsSequentially(): ExecutedMethodsData,
  useMethod(methodKey: Method): void
  initSudokuSolver(fieldData: Array<Array<string>>): void
  backToLastState(): void
}

export function useSudokuSolverComposable(): SudokuSolverComposable {
  const historyLog = new History()
  const fieldLength = 9
  const squareLength = 3
  const implementedMethods = [
    {
      key: Method.UpdateNotes,
      links: ['https://sudoku.com/sudoku-rules/notes-in-sudoku/'],
    },
    {
      key: Method.ObviousSingles,
      links: ['https://sudoku.com/sudoku-rules/obvious-singles/'],
    },
    {
      key: Method.ObviousPairs,
      links: ['https://sudoku.com/sudoku-rules/obvious-pairs/'],
    },
    {
      key: Method.ObviousTriples,
      links: ['https://sudoku.com/sudoku-rules/obvious-triples/'],
    },
    {
      key: Method.HiddenSingles,
      links: ['https://sudoku.com/sudoku-rules/hidden-singles/'],
    },
    {
      key: Method.HiddenPairs,
      links: ['https://sudoku.com/sudoku-rules/hidden-pairs/'],
    },
    {
      key: Method.HiddenTriples,
      links: ['https://sudoku.com/sudoku-rules/hidden-triples/'],
    },
    {
      key: Method.PointingNumbers,
      links: ['https://sudoku.com/sudoku-rules/pointing-pairs/', 'https://sudoku.com/sudoku-rules/pointing-triples/'],
    },
    {
      key: Method.XWing,
      links: ['https://sudoku.com/sudoku-rules/h-wing/'],
    },
    {
      key: Method.YWing,
      links: ['https://sudoku.com/sudoku-rules/y-wing/'],
    },
  ]

  // utils
  function isSolved() {
    for (let i = 0; i < fieldLength; i += 1) {
      for (let j = 0; j < fieldLength; j += 1) {
        if (!state.field[i][j].value) {
          return false
        }
      }
    }
    return true
  }

  function findCellsSquareFirstRow(cell: Cell) {
    return cell.rowIdx - (cell.rowIdx % squareLength)
  }

  function findCellsSquareFirstColumn(cell: Cell) {
    return cell.columnIdx - (cell.columnIdx % squareLength)
  }

  function isAtTheSameRow(cells: Array<Cell>): boolean {
    for (let i = 1; i < cells.length; i += 1) {
      if (cells[i].rowIdx !== cells[0].rowIdx) {
        return true
      }
    }
    return true
  }

  function isAtTheSameColumn(cells: Array<Cell>): boolean {
    for (let i = 1; i < cells.length; i += 1) {
      if (cells[i].columnIdx !== cells[0].columnIdx) {
        return true
      }
    }
    return true
  }

  function getSquareEmptyCells(cell: Cell, exceptSelected: boolean): Array<Cell> {
    const squareFirstRow = findCellsSquareFirstRow(cell)
    const squareFirstColumn = findCellsSquareFirstColumn(cell)
    const squareEmptyCells: Cell[] = []

    for (let i = squareFirstRow; i < squareFirstRow + squareLength; i += 1) {
      for (let j = squareFirstColumn; j < squareFirstColumn + squareLength; j += 1) {
        if (state.field[i][j].isEmpty) {
          if ((exceptSelected && (state.field[i][j] !== cell)) || !exceptSelected) {
            squareEmptyCells.push(state.field[i][j])
          }
        }
      }
    }
    return squareEmptyCells
  }

  function isFieldChanged() {
    return JSON.stringify(historyLog.fieldState) !== JSON.stringify(state.field)
  }

  function getLastUpdatedCells(): Array<Cell> {
    const updatedCells: Array<Cell> = []

    for (let i = 0; i < fieldLength; i += 1) {
      for (let j = 0; j < fieldLength; j += 1) {
        if (!state.field[i][j].isEqual(historyLog.fieldState[i][j])) {
          updatedCells.push(state.field[i][j])
        }
      }
    }

    return updatedCells
  }

  // removing cell impossible numbers
  // base on existed numbers in row/column/square
  function checkCellSurroundings(cell: Cell) {
    const occupiedNumbers: number[] = []

    for (let i = 0; i < fieldLength; i += 1) {
      const rowValue = state.field[cell.rowIdx][i].value
      const colValue = state.field[i][cell.columnIdx].value

      if (rowValue !== undefined) {
        occupiedNumbers.push(rowValue)
      }

      if (colValue !== undefined) {
        occupiedNumbers.push(colValue)
      }
    }

    // check square
    const squareFirstRow = findCellsSquareFirstRow(cell)
    const squareFirstColumn = findCellsSquareFirstColumn(cell)

    for (let i = squareFirstRow; i < squareFirstRow + squareLength; i += 1) {
      for (let j = squareFirstColumn; j < squareFirstColumn + squareLength; j += 1) {
        const cellValue = state.field[i][j].value

        if (cellValue !== undefined) {
          occupiedNumbers.push(cellValue)
        }
      }
    }

    cell.removeOccupiedValues(occupiedNumbers, 'existed values in row, column and square')
  }

  function checkAllCellsSurroundings() {
    for (let i = 0; i < fieldLength; i += 1) {
      for (let j = 0; j < fieldLength; j += 1) {
        if (!state.field[i][j].value) {
          checkCellSurroundings(state.field[i][j])
        }
      }
    }
  }

  function checkForHiddenNs(cell: Cell, n: number) {
    const rowCellsToCheck: Cell[] = []
    const columnCellsToCheck: Cell[] = []
    const squareCellsToCheck: Cell[] = []

    // get all row and column cells to check
    for (let i = 0; i < fieldLength; i += 1) {
      if (state.field[cell.rowIdx][i].value === undefined && state.field[cell.rowIdx][i] !== cell
        && (cell.possibleNumbers.length >= n || state.field[cell.rowIdx][i].possibleNumbers.length >= n)) {
        rowCellsToCheck.push(state.field[cell.rowIdx][i])
      }

      if (state.field[i][cell.columnIdx].value === undefined && state.field[i][cell.columnIdx] !== cell
        && (cell.possibleNumbers.length >= n || state.field[i][cell.columnIdx].possibleNumbers.length >= n)) {
        columnCellsToCheck.push(state.field[i][cell.columnIdx])
      }
    }

    const rowHiddenN = HiddenNs.getCellHiddenNs(cell, rowCellsToCheck, n)

    if (rowHiddenN) {
      rowHiddenN.cells.forEach((pairedCell: Cell) => {
        pairedCell.setPossibleValues(rowHiddenN.numbers, `hidden ${n}`)
      })
      return
    }

    const columnHiddenN = HiddenNs.getCellHiddenNs(cell, columnCellsToCheck, n)

    if (columnHiddenN) {
      columnHiddenN.cells.forEach((pairedCell: Cell) => {
        pairedCell.setPossibleValues(columnHiddenN.numbers, `hidden ${n}`)
      })
      return
    }

    // get all square cells to check
    const squareFirstRow = findCellsSquareFirstRow(cell)
    const squareFirstColumn = findCellsSquareFirstColumn(cell)

    for (let i = squareFirstRow; i < squareFirstRow + squareLength; i += 1) {
      for (let j = squareFirstColumn; j < squareFirstColumn + squareLength; j += 1) {
        if (state.field[i][j].value === undefined && state.field[i][j] !== cell
          && (cell.possibleNumbers.length >= n || state.field[i][j].possibleNumbers.length >= n)) {
          squareCellsToCheck.push(state.field[i][j])
        }
      }
    }

    const squareHiddenN = HiddenNs.getCellHiddenNs(cell, squareCellsToCheck, n)

    if (squareHiddenN) {
      squareHiddenN.cells.forEach((pairedCell: Cell) => {
        pairedCell.setPossibleValues(squareHiddenN.numbers, `hidden ${n}`)
      })
    }
  }

  function checkForObviousNs(cell: Cell, n: number) {
    if (n === 1) {
      if (cell.isReadyToUpdateValue) {
        cell.updateValue()
      }
      return
    }

    const rowCellsToCheck: Cell[] = []
    const columnCellsToCheck: Cell[] = []
    const squareCellsToCheck: Cell[] = []

    // get all row and column cells to check
    for (let i = 0; i < fieldLength; i += 1) {
      if (state.field[cell.rowIdx][i].value === undefined && state.field[cell.rowIdx][i] !== cell) {
        rowCellsToCheck.push(state.field[cell.rowIdx][i])
      }

      if (state.field[i][cell.columnIdx].value === undefined && state.field[i][cell.columnIdx] !== cell) {
        columnCellsToCheck.push(state.field[i][cell.columnIdx])
      }
    }

    const rowObviousN = HiddenNs.getCellObviousNs(cell, rowCellsToCheck, n)

    if (rowObviousN) {
      rowCellsToCheck.forEach((otherCell: Cell) => {
        if (!rowObviousN.cells.includes(otherCell)) {
          otherCell.removeOccupiedValues(rowObviousN.numbers, `obvious ${n}`)
        }
      })
      return
    }

    const columnObviousN = HiddenNs.getCellObviousNs(cell, columnCellsToCheck, n)

    if (columnObviousN) {
      columnCellsToCheck.forEach((otherCell: Cell) => {
        if (!columnObviousN.cells.includes(otherCell)) {
          otherCell.removeOccupiedValues(columnObviousN.numbers, `obvious ${n}`)
        }
      })
      return
    }

    // get all square cells to check
    const squareFirstRow = findCellsSquareFirstRow(cell)
    const squareFirstColumn = findCellsSquareFirstColumn(cell)

    for (let i = squareFirstRow; i < squareFirstRow + squareLength; i += 1) {
      for (let j = squareFirstColumn; j < squareFirstColumn + squareLength; j += 1) {
        if (state.field[i][j].value === undefined && state.field[i][j] !== cell) {
          squareCellsToCheck.push(state.field[i][j])
        }
      }
    }

    const squareObviousN = HiddenNs.getCellObviousNs(cell, squareCellsToCheck, n)

    if (squareObviousN) {
      squareCellsToCheck.forEach((otherCell: Cell) => {
        if (!squareObviousN.cells.includes(otherCell)) {
          otherCell.removeOccupiedValues(squareObviousN.numbers, `obvious ${n}`)
        }
      })
    }
  }

  // if number in square exist just in one row/column
  // then remove this number from other row/column cells, that are not in square
  function checkForPointingNumbers(cell: Cell) {
    const squareCellsToCheck: Cell[] = []

    const squareFirstRow = findCellsSquareFirstRow(cell)
    const squareFirstColumn = findCellsSquareFirstColumn(cell)

    for (let i = squareFirstRow; i < squareFirstRow + squareLength; i += 1) {
      for (let j = squareFirstColumn; j < squareFirstColumn + squareLength; j += 1) {
        if (state.field[i][j].value === undefined && !(i === cell.rowIdx && j === cell.columnIdx)) {
          squareCellsToCheck.push(state.field[i][j])
        }
      }
    }

    for (let i = 0; i < cell.possibleNumbers.length; i += 1) {
      if (HiddenNs.isNumberInSquareJustAtTheSameRow(cell.possibleNumbers[i], cell, squareCellsToCheck)) {
        for (let j = 0; j < fieldLength; j += 1) {
          if (state.field[cell.rowIdx][j].value === undefined
            && (j < squareFirstColumn || j > squareFirstColumn + squareLength)
            && state.field[cell.rowIdx][j].possibleNumbers.includes(cell.possibleNumbers[i])) {
            state.field[cell.rowIdx][j].removeOccupiedValues([cell.possibleNumbers[i]], 'PointingNumbers')
          }
        }
      }
    }

    for (let i = 0; i < cell.possibleNumbers.length; i += 1) {
      if (HiddenNs.isNumberInSquareJustAtTheSameColumn(cell.possibleNumbers[i], cell, squareCellsToCheck)) {
        for (let j = 0; j < fieldLength; j += 1) {
          if (state.field[j][cell.columnIdx].value === undefined
            && (j < squareFirstRow || j > squareFirstRow + squareLength)
            && state.field[j][cell.columnIdx].possibleNumbers.includes(cell.possibleNumbers[i])) {
            state.field[j][cell.columnIdx].removeOccupiedValues([cell.possibleNumbers[i]], 'PointingNumbers')
          }
        }
      }
    }
  }

  function checkWithXWingRows(cellXX: Cell) {
    const rowXAllEmptyCells: Cell[] = []
    const rowXCellsToCheck: Cell[] = []

    // get all X row empty cells(except selected)
    for (let l = 0; l < fieldLength; l += 1) {
      if (state.field[cellXX.rowIdx][l].isEmpty && state.field[cellXX.rowIdx][l] !== cellXX) {
        rowXAllEmptyCells.push(state.field[cellXX.rowIdx][l])
        if (l > cellXX.columnIdx) {
          rowXCellsToCheck.push(state.field[cellXX.rowIdx][l])
        }
      }
    }

    if (!rowXCellsToCheck.length) {
      return
    }

    for (let i = 0; i < cellXX.possibleNumbers.length; i += 1) {
      for (let j = cellXX.rowIdx + 1; j < fieldLength; j += 1) {
        const cellYX = state.field[j][cellXX.columnIdx]

        if (cellYX.isEmpty && cellYX.possibleNumbers.includes(cellXX.possibleNumbers[i])) {
          const rowYAllEmptyCells: Cell[] = []

          // get all Y row empty cells(except selected)
          for (let l = 0; l < fieldLength; l += 1) {
            if (state.field[j][l].isEmpty && state.field[j][l] !== cellYX) {
              rowYAllEmptyCells.push(state.field[j][l])
            }
          }

          for (let k = 0; k < rowXCellsToCheck.length; k += 1) {
            const cellXY = rowXCellsToCheck[k]
            const cellYY = state.field[j][rowXCellsToCheck[k].columnIdx]

            if (cellYY.isEmpty
                && cellXY.possibleNumbers.includes(cellXX.possibleNumbers[i])
                && cellYY.possibleNumbers.includes(cellXX.possibleNumbers[i])
                && !HiddenNs.isNumberInOtherCells(
                  cellXX.possibleNumbers[i],
                  rowXAllEmptyCells.filter((el: Cell) => el !== cellXY),
                )
                && !HiddenNs.isNumberInOtherCells(
                  cellXX.possibleNumbers[i],
                  rowYAllEmptyCells.filter((el: Cell) => el !== cellYY),
                )
            ) {
              // пройтись по колонке cellXX и cellXY и убрать из них cell.possibleNumbers[i]
              for (let m = 0; m < fieldLength; m += 1) {
                if (state.field[m][cellXX.columnIdx].isEmpty
                  && state.field[m][cellXX.columnIdx] !== cellXX
                  && state.field[m][cellXX.columnIdx] !== cellYX) {
                  state.field[m][cellXX.columnIdx].removeOccupiedValues([cellXX.possibleNumbers[i]], 'X-wing row')
                }

                if (state.field[m][cellXY.columnIdx].isEmpty
                  && state.field[m][cellXY.columnIdx] !== cellXY
                  && state.field[m][cellXY.columnIdx] !== cellYY) {
                  state.field[m][cellXY.columnIdx].removeOccupiedValues([cellXX.possibleNumbers[i]], 'X-wing row')
                }
              }
            }
          }
        }
      }
    }
  }

  function checkWithXWingColumns(cellXX: Cell) {
    const columnXAllEmptyCells: Cell[] = []
    const columnXCellsToCheck: Cell[] = []

    // get all X column empty cells(except selected)
    for (let l = 0; l < fieldLength; l += 1) {
      if (state.field[l][cellXX.columnIdx].isEmpty && state.field[l][cellXX.columnIdx] !== cellXX) {
        columnXAllEmptyCells.push(state.field[l][cellXX.columnIdx])
        if (l > cellXX.columnIdx) {
          columnXCellsToCheck.push(state.field[l][cellXX.columnIdx])
        }
      }
    }

    if (!columnXCellsToCheck.length) {
      return
    }

    for (let i = 0; i < cellXX.possibleNumbers.length; i += 1) {
      for (let j = cellXX.columnIdx + 1; j < fieldLength; j += 1) {
        const cellXY = state.field[cellXX.rowIdx][j]

        if (cellXY.isEmpty && cellXY.possibleNumbers.includes(cellXX.possibleNumbers[i])) {
          const columnYAllEmptyCells: Cell[] = []

          // get all Y column empty cells(except selected)
          for (let l = 0; l < fieldLength; l += 1) {
            if (state.field[l][j].isEmpty && state.field[l][j] !== cellXY) {
              columnYAllEmptyCells.push(state.field[l][j])
            }
          }

          for (let k = 0; k < columnXCellsToCheck.length; k += 1) {
            const cellYX = columnXCellsToCheck[k]
            const cellYY = state.field[columnXCellsToCheck[k].rowIdx][j]

            if (cellYY.isEmpty
                && cellYX.possibleNumbers.includes(cellXX.possibleNumbers[i])
                && cellYY.possibleNumbers.includes(cellXX.possibleNumbers[i])
                && !HiddenNs.isNumberInOtherCells(
                  cellXX.possibleNumbers[i],
                  columnXAllEmptyCells.filter((el: Cell) => el !== cellYX),
                )
                && !HiddenNs.isNumberInOtherCells(
                  cellXX.possibleNumbers[i],
                  columnYAllEmptyCells.filter((el: Cell) => el !== cellYY),
                )
            ) {
              // пройтись по cтроке cellXX и cellYX и убрать из них cell.possibleNumbers[i]
              for (let m = 0; m < fieldLength; m += 1) {
                if (state.field[cellXX.rowIdx][m].isEmpty
                  && state.field[cellXX.rowIdx][m] !== cellXX
                  && state.field[cellXX.rowIdx][m] !== cellXY) {
                  state.field[cellXX.rowIdx][m].removeOccupiedValues([cellXX.possibleNumbers[i]], 'X-wing column')
                }

                if (state.field[cellYX.rowIdx][m].isEmpty
                  && state.field[cellYX.rowIdx][m] !== cellYX
                  && state.field[cellYX.rowIdx][m] !== cellYY) {
                  state.field[cellYX.rowIdx][m].removeOccupiedValues([cellXX.possibleNumbers[i]], 'X-wing column')
                }
              }
            }
          }
        }
      }
    }
  }

  // if number exists on two cell on row/column
  // and at the two parallel cells on another row/column
  function checkWithXWing(cellXX: Cell) {
    checkWithXWingRows(cellXX)
    checkWithXWingColumns(cellXX)
  }

  function checkWithYWing(pivotCell: Cell) {
    if (pivotCell.possibleNumbers.length !== 2) {
      return
    }
    const squareEmptyCells = getSquareEmptyCells(pivotCell, true)

    const rowPincerCells: Cell[] = []
    const columnPincerCells: Cell[] = []
    const squarePincerCells = squareEmptyCells.filter((element: Cell) => element.possibleNumbers.length === 2
      && getAllCommonElements(pivotCell.possibleNumbers, element.possibleNumbers).length === 1)

    for (let l = 0; l < fieldLength; l += 1) {
      if (l > pivotCell.columnIdx) {
        if (state.field[pivotCell.rowIdx][l].isEmpty && state.field[pivotCell.rowIdx][l].possibleNumbers.length === 2
            && getAllCommonElements(pivotCell.possibleNumbers, state.field[pivotCell.rowIdx][l].possibleNumbers).length === 1
        ) {
          rowPincerCells.push(state.field[pivotCell.rowIdx][l])
        }
      }

      if (l > pivotCell.rowIdx) {
        if (state.field[l][pivotCell.columnIdx].isEmpty && state.field[l][pivotCell.columnIdx].possibleNumbers.length === 2
          && getAllCommonElements(pivotCell.possibleNumbers, state.field[l][pivotCell.columnIdx].possibleNumbers).length === 1) {
          columnPincerCells.push(state.field[l][pivotCell.columnIdx])
        }
      }
    }

    // проверяем на пересечении строки и столбца
    if (rowPincerCells.length && columnPincerCells.length) {
      for (let i = 0; i < rowPincerCells.length; i += 1) {
        for (let j = 0; j < columnPincerCells.length; j += 1) {
          const commonElementsWithPivot = getAllCommonElements(rowPincerCells[i].possibleNumbers, pivotCell.possibleNumbers)
          const commonElements = getAllCommonElements(rowPincerCells[i].possibleNumbers, columnPincerCells[j].possibleNumbers)
          if (commonElements.length === 1 && commonElements[0] !== commonElementsWithPivot[0]) {
            state.field[rowPincerCells[i].columnIdx][columnPincerCells[j].rowIdx]
              .removeOccupiedValues(commonElements, 'Y-wing column/row intersection')
            return
          }
        }
      }
    }

    // проверяем на пересечении строки и блока
    if (rowPincerCells.length && squarePincerCells.length) {
      for (let i = 0; i < rowPincerCells.length; i += 1) {
        for (let j = 0; j < squarePincerCells.length; j += 1) {
          const commonElementsWithPivot = getAllCommonElements(rowPincerCells[i].possibleNumbers, pivotCell.possibleNumbers)
          const commonElements = getAllCommonElements(rowPincerCells[i].possibleNumbers, squarePincerCells[j].possibleNumbers)
          if (commonElements.length === 1 && commonElements[0] !== commonElementsWithPivot[0]
            && !isAtTheSameRow([rowPincerCells[i], squarePincerCells[j], pivotCell])) {
            const pivotCellSquareCellsToCheck = squareEmptyCells.filter((element: Cell) => element !== squarePincerCells[j])
            const rowCellSquareCellsToCheck = getSquareEmptyCells(rowPincerCells[i], true)

            pivotCellSquareCellsToCheck.concat(rowCellSquareCellsToCheck).forEach((element: Cell) => {
              element.removeOccupiedValues(commonElements, 'Y-wing row/square intersection')
            })
            return
          }
        }
      }
    }

    // проверяем на пересечении столбца и блока
    if (columnPincerCells.length && squarePincerCells.length) {
      for (let i = 0; i < columnPincerCells.length; i += 1) {
        for (let j = 0; j < squarePincerCells.length; j += 1) {
          const commonElementsWithPivot = getAllCommonElements(columnPincerCells[i].possibleNumbers, pivotCell.possibleNumbers)
          const commonElements = getAllCommonElements(columnPincerCells[i].possibleNumbers, squarePincerCells[j].possibleNumbers)
          if (commonElements.length === 1 && commonElements[0] !== commonElementsWithPivot[0]
            && !isAtTheSameColumn([columnPincerCells[i], squarePincerCells[j], pivotCell])) {
            const pivotCellSquareCellsToCheck = squareEmptyCells.filter((element: Cell) => element !== squarePincerCells[j])
            const columnCellSquareCellsToCheck = getSquareEmptyCells(columnPincerCells[i], true)

            pivotCellSquareCellsToCheck.concat(columnCellSquareCellsToCheck).forEach((element: Cell) => {
              element.removeOccupiedValues(commonElements, 'Y-wing column/square intersection')
            })
            return
          }
        }
      }
    }
  }

  function useMethod(methodKey: Method): Array<Cell> {
    let lastUpdatedCells: Array<Cell> = []
    if (methodKey === Method.UpdateNotes) {
      checkAllCellsSurroundings()
    } else {
      for (let i = 0; i < fieldLength; i += 1) {
        for (let j = 0; j < fieldLength; j += 1) {
          const cell = state.field[i][j]
          if (cell.isEmpty) {
            if (methodKey === Method.ObviousSingles) {
              checkForObviousNs(cell, 1)
            } else if (methodKey === Method.ObviousPairs) {
              checkForObviousNs(cell, 2)
            } else if (methodKey === Method.ObviousTriples) {
              checkForObviousNs(cell, 3)
            } else if (methodKey === Method.HiddenSingles) {
              checkForHiddenNs(cell, 1)
            } else if (methodKey === Method.HiddenPairs) {
              checkForHiddenNs(cell, 2)
            } else if (methodKey === Method.HiddenTriples) {
              checkForHiddenNs(cell, 3)
            } else if (methodKey === Method.PointingNumbers) {
              checkForPointingNumbers(cell)
            } else if (methodKey === Method.XWing) {
              checkWithXWing(cell)
            } else if (methodKey === Method.YWing) {
              checkWithYWing(cell)
            }
          }
        }
      }
    }

    if (isFieldChanged()) {
      lastUpdatedCells = getLastUpdatedCells()
      historyLog.addNewState(state.field)
      state.isSolved = isSolved()
    }
    return lastUpdatedCells
  }

  function executeMethodsSequentially(): ExecutedMethodsData {
    const methodKeys = Object.values(Method)
    const executedMethods: ExecutedMethodsData = {} as ExecutedMethodsData

    methodKeys.some((method) => {
      const updatedCells = useMethod(method)
      executedMethods[method] = updatedCells

      if (updatedCells.length) {
        return true
      }
      return false
    })
    return executedMethods
  }

  function saveToChangeLog(cell: Cell, action: string, description: string, basedOn: string) {
    historyLog.saveToChangeLog(cell, action, description, basedOn)
  }

  function backToLastState() {
    state.isSolved = false
    historyLog.backToLastState()

    for (let i = 0; i < fieldLength; i += 1) {
      for (let j = 0; j < fieldLength; j += 1) {
        state.field[i][j].setValues(historyLog.fieldState[i][j].currentNumber, historyLog.fieldState[i][j].possibleNumbers)
      }
    }
  }

  function initSudokuSolver(fieldData: Array<Array<string>>) {
    fieldData.forEach((fieldRow, rowIdx: number) => {
      const row: Array<Cell> = []

      fieldRow.forEach((cellValue: string, columnIdx: number) => {
        row.push(new Cell(rowIdx, columnIdx, cellValue, fieldLength, saveToChangeLog))
      })

      state.field.push(row)
    })

    historyLog.addNewState(state.field)
  }

  return {
    implementedMethods,
    useMethod,
    executeMethodsSequentially,
    initSudokuSolver,
    backToLastState,
    changeLog: historyLog.changeLog,
    ...toRefs(state),
  }
}
