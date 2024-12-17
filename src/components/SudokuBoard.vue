<template>
  <div class="sudoku-board">
    <div class="board-row" v-for="rowIdx in fieldLength" :key="`row-${rowIdx}`">
      <div class="board-cell" v-for="colIdx in fieldLength" :key="`col-${colIdx}`">
        <input v-if="!isInSolveMode" :value="modelValue[rowIdx - 1][colIdx - 1]" class="cell-value" maxlength="1"
          type="text" @input="event => triggerUpdate(rowIdx - 1, colIdx - 1, event as InputEvent)">

        <div v-else class="cell-value solve-mode" :class="{
          'active': lastUpdated.includes(solvedField[rowIdx - 1][colIdx - 1]),
          'solved-cell': !solvedField[rowIdx - 1][colIdx - 1].withPresetValue,
          'with-options': solvedField[rowIdx - 1][colIdx - 1].isEmpty
        }">
          <span v-if="!solvedField[rowIdx - 1][colIdx - 1].isEmpty">{{ solvedField[rowIdx - 1][colIdx - 1].value ?? ''
            }}</span>

          <div v-else class="cell-possible-values">
            <div v-for="index in 10" :key="index">
              <span v-if="solvedField[rowIdx - 1][colIdx - 1].possibleNumbers.includes(index)">
                {{ index }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  withDefaults,
  defineProps,
  defineEmits,
  watch,
} from 'vue'

import Cell from '@/models/Cell'

interface IProps {
  modelValue: Array<Array<string>>
  solvedField: Array<Array<Cell>>
  lastUpdated: Array<Cell>
  isInSolveMode: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: () => [],
  solvedField: () => [],
  lastFound: undefined,
})

const emit = defineEmits<{(e: 'update:modelValue', value: Array<Array<string>>): void }>()

const model = computed({
  get() {
    return props.modelValue ?? []
  },
  set(value: Array<Array<string>>) {
    console.log('set triggered', value)
    emit('update:modelValue', value)
  },
})

const isNumeric = (string: string) => /^[+-]?\d+(\.\d+)?$/.test(string)

function triggerUpdate(rowIdx: number, colIdx: number, event: InputEvent) {
  const data = event.data || ''
  if (isNumeric(data) || data === '') {
    const newModel = model.value.map((row) => row.slice())
    newModel[rowIdx][colIdx] = data
    model.value = newModel
  } else {
    // eslint-disable-next-line no-param-reassign
    (event.target as HTMLInputElement).value = ''
  }
}

const fieldLength = computed(() => model.value.length ?? 0)

watch(props, () => {
  console.log('props', props)
})

</script>

<style lang="scss" scoped>
.sudoku-board {
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 5px #888;
  width: fit-content;
  border: 2px solid var(--primary);

  .board-row:not(:nth-child(3n)) {
    border-bottom: 1px solid var(--secondary);
  }

  .board-row:nth-child(3n):not(:last-child) {
    border-bottom: 2px solid var(--primary);
  }
}

.board-row {
  display: flex;
  width: fit-content;
  flex-direction: row;

  .board-cell:not(:nth-child(3n)) {
    border-right: 1px solid var(--secondary);
  }

  .board-cell:nth-child(3n):not(:last-child) {
    border-right: 2px solid var(--primary);
  }
}

.board-cell {
  color: var(--primary);
  font-family: Arial
}

.cell-value {
  display: block;
  box-sizing: content-box;
  width: 45px;
  height: 45px;
  outline: 0;
  font-size: 30px;
  transition: 0.2s;
  margin: 0;
  outline: 0;
  padding: 5px;
  text-align: center;
  border: 0;

  &.solve-mode {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.active {
    background-color: var(--bg-light);
  }

  &.solved-cell {
    color: var(--accent);
  }

  &.with-options {
    color: var(--secondary);
    font-size: 15px;
  }

  .cell-possible-values {
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
}
</style>
