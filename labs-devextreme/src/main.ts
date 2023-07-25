import { createApp } from 'vue'
import App from './App.vue'
import './assets//dx.generic.custom-scheme.css'
import './style.css'

Object.defineProperty(document, 'getElementsByClassName', {
  value: null,
  writable: false
})

console.log(document.getElementsByClassName)

createApp(App).mount('#app')
