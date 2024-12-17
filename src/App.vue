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
export default class App extends Vue {}
</script>

<style>
:root {
  --accent: #0217d2;
  --primary: black;
  --secondary: gray;
  --success: #66e59b;
  --success-light: #ccf6de;
  --warning: #faa473;
  --warning-light: #fef3ec;

  --button: #2f80ed;
  --button-hover: #1366d6;
  --bg-light: rgb(231 238 249);

}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

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
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 9px 30px;
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
}

.button:hover:not(:disabled) {
  background-color: var(--button-hover);
  box-shadow: rgba(0, 0, 0, .05) 0 5px 30px, rgba(0, 0, 0, .05) 0 1px 4px;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
}

.button:hover:after {
  opacity: .5;
}

.button:active {
  box-shadow: rgba(0, 0, 0, .1) 0 3px 6px 0, rgba(0, 0, 0, .1) 0 0 10px 0, rgba(0, 0, 0, .1) 0 1px 4px -1px;
  transform: translateY(2px);
  transition-duration: .35s;
}

.button:active:after {
  opacity: 1;
}

.button.warning {
  background-color: var(--warning);
}

button:disabled,
button[disabled]{
  background-color: var(--secondary);
  cursor: unset;
}
</style>
