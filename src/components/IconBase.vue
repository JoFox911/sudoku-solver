<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 18 18"
    :aria-labelledby="iconName" role="presentation">
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script setup lang="ts">
import {
  withDefaults,
  defineProps,
} from 'vue'

interface IProps {
  iconName: string,
  width: number,
  height: number,
  iconColor?: string
}

withDefaults(defineProps<IProps>(), {
  iconName: 'check',
  width: 18,
  height: 18,
  iconColor: 'currentColor',
})
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px;
}
</style>
