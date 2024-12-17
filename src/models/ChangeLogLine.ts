import Cell from './Cell'

class ChangeLogLine {
  cell: Cell

  action: string

  description: string

  basedOn: string

  constructor(cell: Cell, action: string, description: string, basedOn: string) {
    this.cell = cell
    this.action = action
    this.description = description
    this.basedOn = basedOn
  }
}

export default ChangeLogLine
