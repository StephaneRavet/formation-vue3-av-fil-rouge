import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import vuetify from './plugins/vuetify'

// Create the Vue app instance
const app = createApp(App)

// Configure router error handling
router.onError(error => {
  console.error('Erreur de navigation :', error)
  // Redirect to home page on navigation error
  router.push('/').catch(() => {
    console.error('Failed to redirect to home page')
  })
})

// Global error handler for the app
app.config.errorHandler = (error, instance, info) => {
  console.error('Erreur globale de l\'application :', error)
  console.error('Informations sur l\'erreur :', info)
  console.error('Instance du composant :', instance)
}

// Use plugins and mount the app
app
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app')


