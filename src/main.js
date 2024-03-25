import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
        light: {
            primary: '#1A8C54',
            secondary: '#3F4857',
            accent: '#1B1E10',
            error: '#b71c1c',
        },
        dark: {
            primary: '#1A8C54',
            secondary: '#3F4857',
            accent: '#1B1E10',
            error: '#b71c1c',
        }
    },
},
})

createApp(App).use(vuetify).mount('#app')
// createApp(App).mount('#app')
