<template>
  <div class="history-log">
    <p class="title">History</p>
    <div class="elements-container">
      <p class="line" :class="{ [`${line.action}`]: true }" v-for="(line, idx) in revertedArray" :key="idx">
        <span class="line-title">{{ `Step ${revertedArray.length - idx}` }}</span>
        <span class="line-text">{{ `for cell [${line.cell.rowIdx + 1}, ${line.cell.columnIdx + 1}] ${line.description}`
          }}</span>
        <span class="line-extra">{{ `based on: ${line.basedOn}` }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  withDefaults,
  defineProps,
  computed,
} from 'vue'

import HistoryLine from '@/models/HistoryLine'

interface IProps {
  changeLog: Array<HistoryLine>
}

const props = withDefaults(defineProps<IProps>(), {
  changeLog: () => [],
})

const revertedArray = computed(() => props.changeLog.slice().reverse())

</script>

<style lang="scss" scoped>
.history-log {
  flex-grow: 1;
}

.title {
  position: sticky;
  font-size: 20px;
  margin: 0;
  padding: 8px;
  top: 0;
  background-color: var(--bg-light);
}

.elements-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0 0;
  justify-content: start;
  align-items: start;
  text-align: start;
}

.line {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 10px;
  width: 100%;

  &.remove {
    background-color: var(--warning-light);
  }

  &.update {
    background-color: var(--success-light);
  }
}

.line-title {
  text-align: center;
}

.line-extra {
  font-size: 12px;
  color: var(--secondary);
}
</style>
