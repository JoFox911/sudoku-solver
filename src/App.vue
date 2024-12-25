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
  --accent: #0217d2;
  --primary: black;
  --secondary: gray;
  --success-light: #ccf6de;
  --success: #66e59b;
  --warning-light: #fef3ec;
  --warning: #faa473;
  --warning-deep: #ee8f00;

  --button: #2f80ed;
  --button-hover: #1366d6;
  --bg-light: rgb(231 238 249);

  --select-border: gray;
  --select-focus: #0217d2;
  --select-arrow: var(--select-border);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style lang="scss">
.button {
  appearance: none;
  backface-visibility: hidden;
  background-color: var(--button);
  border-radius: 10px;
  border-style: none;
  box-shadow: none;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: Arial;
  font-size: 20px;
  font-weight: 500;
  height: 40px;
  letter-spacing: normal;
  outline: none;
  overflow: hidden;
  padding: 10px 30px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: var(--button-hover);
    box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
    opacity: 1;
    transform: translateY(0);
    transition-duration: .35s;

    &.warning {
      background-color: var(--warning-deep);
    }
  }

  &:hover:after {
    opacity: .5;
  }

  &:active {
    box-shadow: rgba(0, 0, 0, .1) 0 3px 6px 0, rgba(0, 0, 0, .1) 0 0 10px 0, rgba(0, 0, 0, .1) 0 1px 4px -1px;
    transform: translateY(2px);
    transition-duration: .35s;
  }

  &:active:after {
    opacity: 1;
  }

  &.warning {
    background-color: var(--warning);
  }

  &:disabled,
  &[disabled] {
    background-color: var(--secondary);
    cursor: unset;
  }
}

.select {
  font-family: Arial;
  font-size: 20px;
  font-weight: 500;
  height: 40px;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  cursor: pointer;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
}
</style>
