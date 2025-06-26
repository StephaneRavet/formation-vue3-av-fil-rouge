<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6 text-secondary">Dashboard</h1>
        📈
        <v-card>
          <v-tabs
            v-model="activeTab"
            bg-color="primary"
            color="white"
            slider-color="white"
            @update:model-value="onTabChange"
          >
            <v-tab value="overview">
              <v-icon start>mdi-view-dashboard</v-icon>
              Vue d'ensemble
            </v-tab>
            <v-tab value="stats">
              <v-icon start>mdi-chart-line</v-icon>
              Statistiques
            </v-tab>
          </v-tabs>
          
          <v-card-text class="pa-0">
            <v-tabs-window v-model="activeTab">
              <v-tabs-window-item value="overview">
                <div class="pa-6">
                  <OverviewView />
                </div>
              </v-tabs-window-item>
              <v-tabs-window-item value="stats">
                <div class="pa-6">
                  <StatsView />
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OverviewView from './OverviewView.vue'
import StatsView from './StatsView.vue'

const route = useRoute()
const router = useRouter()

// Déterminer l'onglet actif basé sur la route
const getTabFromRoute = (routeName) => {
  if (routeName === 'Stats') return 'stats'
  return 'overview' // défaut
}

const activeTab = ref(getTabFromRoute(route.name))

// Synchroniser l'onglet avec la route
watch(() => route.name, (newRouteName) => {
  activeTab.value = getTabFromRoute(newRouteName)
})

// Changer de route quand l'onglet change
const onTabChange = (newTab) => {
  const routeName = newTab === 'stats' ? 'Stats' : 'Overview'
  if (route.name !== routeName) {
    router.push({ name: routeName })
  }
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
.v-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style> 