import { intersection, unique, symmetricDifference } from '@/utils/arrays'

class Cell {
  rowIdx: number

  columnIdx: number

  currentNumber: number | undefined

  possibleNumbers: number[] = []

  withPresetValue: boolean

  saveToHistory: (cell: Cell, action: string, description: string, basedOn: string) => void

  constructor(
    rowIdx: number,
    columnIdx: number,
    value: string,
    maxVal: number,
    saveToHistory: (cell: Cell, action: string, description: string, basedOn: string) => void,
  ) {
    this.rowIdx = rowIdx
    this.columnIdx = columnIdx
    this.saveToHistory = saveToHistory

    if (value !== '') {
      this.currentNumber = Number(value)
      this.withPresetValue = true
    } else {
      this.possibleNumbers = Array.from({ length: maxVal }, (_, i) => i + 1)
      this.withPresetValue = false
    }
  }

  get value() {
    return this.currentNumber
  }

  get isEmpty() {
    return this.currentNumber === undefined
  }

  get isReadyToUpdateValue() {
    return !this.currentNumber && this.possibleNumbers.length === 1
  }

  isEqual(otherCell: Cell): boolean {
    return (
      this.rowIdx === otherCell.rowIdx
      && this.columnIdx === otherCell.columnIdx
      && this.currentNumber === otherCell.currentNumber
      && this.possibleNumbers.length === otherCell.possibleNumbers.length
      && this.possibleNumbers.every((num, idx) => num === otherCell.possibleNumbers[idx])
    )
  }

  removeOccupiedValues(occupiedNumbers: number[], basedOn: string) {
    if (!this.currentNumber) {
      const valuesToRemove = unique(intersection(occupiedNumbers, this.possibleNumbers))

      if (valuesToRemove.length) {
        this.possibleNumbers = this.possibleNumbers.filter((el: number) => !valuesToRemove.includes(el))
        this.saveToHistory(this, 'remove', `removed possible values: ${valuesToRemove.sort().join(', ')}`, basedOn)
      }
    }
  }

  setPossibleValues(values: Array<number>, basedOn: string) {
    const valuesToRemove = symmetricDifference(this.possibleNumbers, values)
    if (valuesToRemove.length) {
      this.possibleNumbers = values

      this.saveToHistory(this, 'remove', `removed possible values: ${valuesToRemove.sort().join(', ')}`, basedOn)
    }
  }

  updateValue() {
    [this.currentNumber] = this.possibleNumbers
    this.possibleNumbers = []

    this.saveToHistory(this, 'update', `set value: ${this.currentNumber}`, 'obvious singles')
  }

  setValues(currentNumber: number | undefined, possibleNumbers: number[]) {
    this.currentNumber = currentNumber
    this.possibleNumbers = possibleNumbers
  }
}

export default Cell
