<template>
  <div class="page">
    <p class="title">Human-Like Sudoku Solver</p>
    <div class="content main">
      <div class="board-container">
        <SudokuBoard v-model:modelValue="initialField" :isInSolveMode="isInSolveMode" :solvedField="resultField"
          :lastUpdated="lastUpdatedCells" />
      </div>

      <div class="methods-container">
        <button v-if="!isInSolveMode" class="button" @click="turnToSolvingMode">Start</button>

        <div class="controls" v-if="isInSolveMode">
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

    <div v-if="changeLog.length" class="content history">
      <HistoryLog :changeLog="changeLog" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import IconBase from '@/components/IconBase.vue'
import IconBack from '@/components/icons/IconBack.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import SudokuBoard from '@/components/SudokuBoard.vue'
import HistoryLog from '@/components/HistoryLog.vue'
import { useSudokuSolverComposable } from '@/composables/sudokuSolver'

// import Method from '@/types/Method'
import ExecutedMethodsData from '@/types/ExecutedMethodsData'

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

// const initialField = ref([
//   ['5', '3', '', '', '7', '', '', '', ''],
//   ['6', '', '', '1', '9', '5', '', '', ''],
//   ['', '9', '8', '', '', '', '', '6', ''],
//   ['8', '', '', '', '6', '', '', '', '3'],
//   ['4', '', '', '8', '', '3', '', '', ''],
//   ['7', '', '', '', '2', '', '', '', '6'],
//   ['', '6', '', '', '', '', '2', '8', ''],
//   ['', '', '', '4', '1', '9', '', '', '5'],
//   ['', '', '', '', '8', '', '', '7', '9'],
// ])

// const initialField = ref([
//   ['1', '', '', '', '9', '', '', '', '6'],
//   ['', '', '3', '7', '', '2', '', '9', '1'],
//   ['', '9', '', '4', '', '', '', '7', ''],
//   ['3', '', '9', '', '7', '', '6', '2', ''],
//   ['', '6', '', '', '5', '', '8', '', '9'],
//   ['', '8', '2', '6', '3', '9', '', '', ''],
//   ['9', '', '', '3', '', '7', '', '6', ''],
//   ['2', '', '6', '', '', '', '9', '8', ''],
//   ['5', '3', '', '9', '', '', '7', '', ''],
// ])

// // done
// const initialField = ref([
//   ['5', '', '', '2', '', '', '', '4', ''],
//   ['', '', '', '6', '', '3', '', '', ''],
//   ['', '3', '', '', '', '9', '', '', '7'],
//   ['', '', '3', '', '', '7', '', '', ''],
//   ['', '', '7', '', '', '8', '', '', ''],
//   ['6', '', '', '', '', '', '', '2', ''],
//   ['', '8', '', '', '', '', '', '', '3'],
//   ['', '', '', '4', '', '', '6', '', ''],
//   ['', '', '', '1', '', '', '5', '', ''],
// ])

// done
const initialField = ref([
  ['6', '', '7', '9', '', '', '2', '', '3'],
  ['9', '', '3', '4', '2', '', '8', '6', ''],
  ['', '', '', '', '8', '3', '', '', '1'],
  ['5', '3', '', '', '6', '', '9', '', '2'],
  ['', '', '', '', '', '', '', '3', '7'],
  ['4', '', '', '1', '3', '2', '5', '', ''],
  ['', '4', '', '', '7', '', '6', '', '9'],
  ['7', '2', '', '', '', '', '', '', ''],
  ['8', '9', '1', '2', '5', '', '', '7', ''],
])

// done
// x-wing row
// const initialField = ref([
//   ['', '', '3', '8', '', '', '5', '1', ''],
//   ['', '', '8', '7', '', '', '9', '3', ''],
//   ['1', '', '', '3', '', '5', '7', '2', '8'],
//   ['', '', '', '2', '', '', '8', '4', '9'],
//   ['8', '', '1', '9', '', '6', '2', '5', '7'],
//   ['', '', '', '5', '', '', '1', '6', '3'],
//   ['9', '6', '4', '1', '2', '7', '3', '8', '5'],
//   ['3', '8', '2', '6', '5', '9', '4', '7', '1'],
//   ['', '1', '', '4', '', '', '6', '9', '2'],
// ])

// x-wing column
// const initialField = ref([
//   ['', '2', '', '', '', '', '', '9', '4'],
//   ['7', '6', '', '9', '1', '', '', '5', ''],
//   ['', '9', '', '', '', '2', '', '8', '1'],
//   ['', '7', '', '', '5', '', '', '1', ''],
//   ['', '', '', '7', '', '9', '', '', ''],
//   ['', '8', '', '', '3', '1', '', '6', '7'],
//   ['2', '4', '', '1', '', '', '', '7', ''],
//   ['', '1', '', '', '9', '', '', '4', '5'],
//   ['9', '', '', '', '', '', '1', '', ''],
// ])

// y-wing column
// const initialField = ref([
//   ['9', '', '', '2', '4', '', '', '', ''],
//   ['', '5', '', '6', '9', '', '2', '3', '1'],
//   ['', '2', '', '', '5', '', '', '9', ''],
//   ['', '9', '', '7', '', '', '3', '2', ''],
//   ['', '', '2', '9', '3', '5', '6', '', '7'],
//   ['', '7', '', '', '', '2', '9', '', ''],
//   ['', '6', '9', '', '2', '', '', '7', '3'],
//   ['5', '1', '', '', '7', '9', '', '6', '2'],
//   ['2', '', '7', '', '8', '6', '', '', '9'],
// ])

// const initialField = ref([
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
//   ['', '', '', '', '', '', '', '', ''],
// ])

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
    }
  }

  .board-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
          color: var(--warning);
        }

        .updated {
          color: var(--success);
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
