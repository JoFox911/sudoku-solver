<template>
  <MainComponent />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import MainComponent from './components/MainComponent.vue'

@Options({
  components: {
    MainComponent,
  },
})
export default class App extends Vue { }
</script>

<style>
:root {
  --color-black: black;
  --color-dark-gray: #2c3e50;
  --color-gray: gray;
  --color-white: white;
  --color-bg-light: #e7eef9;

  --color-success-30: #ccf6de;

  --color-warning-10: #fef3ec;
  --color-warning-60: #faa473;
  --color-warning-100: #ee8f00;

  --color-accent-30: #2f80ed;
  --color-accent-60: #1366d6;
  --color-accent-100: #0217d2;

  --base-font-size: 16px;
  --base-line-height: 1.5;
}

html {
  font-size: var(--base-font-size);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-dark-gray);
}
</style>

<style lang="scss">
.button {
  appearance: none;
  backface-visibility: hidden;
  background-color: var(--color-accent-30);
  border: none;
  border-radius: 0.625rem;
  box-sizing: border-box;
  color: var(--color-white);
  cursor: pointer;
  display: inline-block;
  font-family: Arial, sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  height: 2.5rem;
  padding: 0.625rem 1.875rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  user-select: none;
  vertical-align: top;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-accent-60);
    box-shadow: 0 0.313rem 1.875rem rgba(0, 0, 0, 0.05), 0 0.063rem 0.25rem rgba(0, 0, 0, 0.05);
    transform: translateY(0);
    transition-duration: 0.35s;

    &.warning {
      background-color: var(--color-warning-100);
    }
  }

  &:active {
    box-shadow: 0 0.188rem 0.375rem rgba(0, 0, 0, 0.1), 0 0 0.625rem rgba(0, 0, 0, 0.1), 0 0.063rem 0.25rem -0.063rem rgba(0, 0, 0, 0.1);
    transform: translateY(0.125rem);
    transition-duration: 0.35s;
  }

  &.warning {
    background-color: var(--color-warning-60);
  }

  &:disabled,
  &[disabled] {
    background-color: var(--color-gray);
    cursor: not-allowed;
  }
}

.select {
  font-family: Arial, sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  height: 2.5rem;
  padding: 0.25em 0.5em;
  border: 0.063rem solid var(--color-gray);
  border-radius: 0.25em;
  background-color: var(--color-white);
  cursor: pointer;

  &:focus {
    outline: none;
  }
}
</style>
