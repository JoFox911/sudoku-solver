import Cell from '@/models/Cell'
import ChangeLogLine from '@/models/ChangeLogLine'

import { ref, Ref } from 'vue'

interface HistoryState {
  fieldState: Array<Array<Cell>>
  changeLog: Array<ChangeLogLine>
}

class History {
  stack: Array<HistoryState>

  currentChangeLog: Ref<Array<ChangeLogLine>>

  constructor() {
    this.stack = []
    this.currentChangeLog = ref([])
  }

  get changeLog() {
    return this.currentChangeLog
  }

  get fieldState() {
    return this.stack[this.stack.length - 1].fieldState
  }

  get changeLogState() {
    return this.stack[this.stack.length - 1].changeLog
  }

  saveToChangeLog(cell: Cell, action: string, description: string, basedOn: string) {
    this.currentChangeLog.value.push(new ChangeLogLine(cell, action, description, basedOn))
    console.log(this.currentChangeLog)
  }

  addNewState(field: Array<Array<Cell>>) {
    this.stack.push({
      fieldState: JSON.parse(JSON.stringify(field)),
      changeLog: JSON.parse(JSON.stringify(this.currentChangeLog.value)),
    })
  }

  backToLastState() {
    if (this.stack.length > 1) {
      this.stack.pop()
    }
    this.currentChangeLog.value = this.changeLogState
  }
}

export default History
