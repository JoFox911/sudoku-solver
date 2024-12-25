<template>
  <div class="page">
    <p class="title">Human-Like Sudoku Solver</p>
    <div class="content main">
      <div class="board-container">
        <SudokuBoard v-model:modelValue="initialField" :isInSolveMode="isInSolveMode" :solvedField="resultField"
          :lastUpdated="lastUpdatedCells" />

        <div v-if="!isInSolveMode || isInSolveMode && isSolved" class="board-controls">
          <template v-if="!isInSolveMode">
            <button class="button" @click="turnToSolvingMode">Start</button>

            <div class="options">
              <select class="select" v-model="selectedOption">
                <option v-for="option in boardOptions" :value="option" :key="option">
                  {{ option }}
                </option>
              </select>

              <button class="button warning" @click="cleanTheBoard">
                <IconBase :width="24" :height="24" icon-name="eraser">
                  <IconEraser />
                </IconBase>
              </button>
            </div>
          </template>

          <button v-if="isInSolveMode && isSolved" class="button" @click="restart()">Restart</button>
        </div>
      </div>

      <div class="methods-container" v-if="isInSolveMode">
        <div class="controls">
          <button class="button" :disabled="isNoMoreOptions || isSolved"
            @click="tryToExecuteMethodsSequentially()">Next</button>
          <button class="button warning" @click="tryToBackToLastState">
            <IconBase :width="24" :height="24" icon-name="back">
              <IconBack />
            </IconBase>
          </button>
        </div>

        <div class="method-data" v-for="method, idx in implementedMethods" :key="`${idx}-${method}`">
          <div class="method-status">
            <IconBase v-if="executedMethodsData[method.key]" :width="20" :height="20" icon-name="check" class="done"
              :class="{ 'updated': executedMethodsData[method.key].length }">
              <IconCheck />
            </IconBase>
          </div>
          <a :href="method.links[0]" target="_blank">{{ method.key }}</a>
          <!-- <button v-if="isInSolveMode" class="button temp"  @click="tryMethod(method.key)">Try</button> -->
        </div>

        <div v-if="isNoMoreOptions">
          Implemented Strategies can not solve this. Please add more data to solve Sudoku
        </div>
      </div>
    </div>

    <div v-if="isInSolveMode && changeLog.length" class="content history">
      <HistoryLog :changeLog="changeLog" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref, Ref, computed, watchEffect,
} from 'vue'
import IconBase from '@/components/IconBase.vue'
import IconBack from '@/components/icons/IconBack.vue'
import IconEraser from '@/components/icons/IconEraser.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import SudokuBoard from '@/components/SudokuBoard.vue'
import HistoryLog from '@/components/HistoryLog.vue'
import { useSudokuSolverComposable } from '@/composables/sudokuSolver'

// import Method from '@/types/Method'
import ExecutedMethodsData from '@/types/ExecutedMethodsData'
import { BoardOption, sudokuOptions } from '@/types/BoardOption'

const {
  isSolved,
  field: resultField,
  initSudokuSolver,
  executeMethodsSequentially,
  backToLastState,
  // useMethod,
  changeLog,
  implementedMethods,
} = useSudokuSolverComposable()

const isInSolveMode = ref(false)
const isNoMoreOptions = ref(false)
const executedMethodsData: Ref<ExecutedMethodsData> = ref({} as ExecutedMethodsData)

const selectedOption = ref<BoardOption>(BoardOption.Easy)
const initialField = ref<string[][]>(sudokuOptions[BoardOption.Easy])
const boardOptions = computed(() => Object.values(BoardOption))

const lastUpdatedCells = computed(() => Object.values(executedMethodsData.value).reduce(
  (accumulator, updatedCells) => accumulator.concat(updatedCells),
  [],
))

function turnToSolvingMode() {
  console.log('initialField', initialField)
  initSudokuSolver(initialField.value)
  isInSolveMode.value = true
}

function resetExecutedMethodsData() {
  executedMethodsData.value = {} as ExecutedMethodsData
}

// function tryMethod(method: Method) {
//   resetExecutedMethodsData()
//   console.log(useMethod(method))
// }

function tryToExecuteMethodsSequentially() {
  resetExecutedMethodsData()
  executedMethodsData.value = executeMethodsSequentially()
  console.log('isNoMoreOptions', !lastUpdatedCells.value.length, lastUpdatedCells.value)
  if (!lastUpdatedCells.value.length) {
    isNoMoreOptions.value = true
  }
}

function tryToBackToLastState() {
  isNoMoreOptions.value = false
  resetExecutedMethodsData()
  backToLastState()
}

function cleanTheBoard() {
  selectedOption.value = BoardOption.Empty
}

function restart() {
  cleanTheBoard()
  executedMethodsData.value = {} as ExecutedMethodsData
  isNoMoreOptions.value = false
  isInSolveMode.value = false
}

// Update the initialField whenever the selectedOption changes
watchEffect(() => {
  console.log('watchEffect')
  const selected = selectedOption.value
  initialField.value = JSON.parse(JSON.stringify(sudokuOptions[selected]))
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    text-decoration: none;
  }

  .title {
    font-size: 30px;
  }

  .content {
    display: flex;
    flex-direction: row;
    gap: 40px;
    justify-content: center;
    max-width: 900px;

    &.history {
      margin-top: 20px;
      width: 100%;
    }

    &>* {
      max-height: 569px;
    }

    @media (max-width: 700px) {
      flex-direction: column;
      gap: 20px;
    }
  }

  .board-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .board-controls {
      display: flex;
      justify-content: space-between;

      .options {
        display: flex;
        gap: 8px;
      }
    }
  }

  .methods-container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;

    .controls {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .method-data {
      display: flex;

      .method-status {
        width: 20px;
        height: 20px;

        .done {
          color: var(--color-warning-10);
        }

        .updated {
          color: var(--color-accent-30);
        }
      }
    }
  }

  .button {
    max-width: 150px;

    &.warning {
      padding: 8px;
    }

    &.temp {
      background-color: lightgray;
      height: 20px;
      padding: 0 10px;
      margin-left: 10px;
    }
  }
}
</style>
