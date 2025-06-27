<template>
  <Suspense>
    <template #default>
      <div class="home-view">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card class="pa-6" elevation="2">
                <v-card-title class="text-h4 text-center mb-4">
                  🏠 Page d'accueil
                </v-card-title>
                <v-card-text>
                  <p class="text-body-1 text-center">
                    Bienvenue dans votre application Vue 3 !
                  </p>
                  <p class="text-body-2 text-center mt-4">
                    Cette page d'accueil est maintenant fonctionnelle avec Vuetify.
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
    <template #fallback>
        <!-- skeleton        -->
    </template>
  </Suspense>
</template>

<script setup>
// Logique de la page d'accueil
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

onMounted(() => {
  // Simulation d'initialisation
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<style scoped>
.home-view {
  min-height: 60vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
}
</style> 