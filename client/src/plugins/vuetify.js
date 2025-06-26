import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3498db',
          secondary: '#2c3e50',
          accent: '#e74c3c',
          success: '#27ae60',
          warning: '#f39c12',
          error: '#e74c3c',
          info: '#3498db'
        }
      }
    }
  }
}) 