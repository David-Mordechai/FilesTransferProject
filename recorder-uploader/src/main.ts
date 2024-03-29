import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'

// Vuetify
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as labs from 'vuetify/labs/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
// make sure to also import the coresponding css
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import "@fortawesome/fontawesome-free/css/all.css"; // Ensure your project is capable of handling css files
const myCustomLightTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#2196F3',
    secondary: '#263238',
  },
}

const vuetify = createVuetify({
  components: {
    ...labs,
    ...components
    
  },
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    }
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
})

createApp(App)
  .use(vuetify)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
