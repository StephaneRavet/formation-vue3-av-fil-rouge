<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6">
          <v-card-title class="text-h4 mb-4">
            📦 Produit {{ productId }}
          </v-card-title>
          
          <v-card-text v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <span class="ml-4">Chargement du produit...</span>
          </v-card-text>
          
          <v-card-text v-else-if="error">
            <v-alert type="error" class="mb-4">
              {{ error }}
            </v-alert>
            <v-btn @click="loadProduct" color="primary">
              Réessayer
            </v-btn>
          </v-card-text>
          
          <v-card-text v-else-if="product">
            <h3>{{ product.name || 'Produit de démonstration' }}</h3>
            <p class="text-body-1 mt-4">
              ID du produit : <strong>{{ productId }}</strong>
            </p>
            <p class="text-body-2">
              Cette page affiche les détails d'un produit spécifique.
            </p>
            
            <v-divider class="my-4"></v-divider>
            
            <div v-if="product.details">
              <h4>Détails :</h4>
              <pre>{{ JSON.stringify(product, null, 2) }}</pre>
            </div>
            <div v-else>
              <p><strong>Description :</strong> Produit d'exemple avec ID {{ productId }}</p>
              <p><strong>Prix :</strong> 99.99€</p>
              <p><strong>Disponibilité :</strong> En stock</p>
            </div>
          </v-card-text>
          
          <v-card-actions>
            <v-btn color="primary" prepend-icon="mdi-cart">
              Ajouter au panier
            </v-btn>
            <v-btn color="secondary" variant="outlined" prepend-icon="mdi-heart">
              Favoris
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProfiles } from '../composables/useProfiles'

const route = useRoute()
const product = ref(null)
const productId = route.params.productId

// Utiliser le composable useProfiles
const { profiles, loading, error, fetchProfiles } = useProfiles()

// Créer le produit basé sur les profils chargés
const createProductFromProfiles = () => {
  if (profiles.value && profiles.value.length > 0) {
    product.value = {
      id: productId,
      name: `Produit ${productId}`,
      description: 'Description du produit basée sur les données API',
      price: 99.99,
      inStock: true,
      details: profiles.value,
      profilesCount: profiles.value.length
    }
  }
}

// Watch pour les changements dans les profils
watch(profiles, () => {
  createProductFromProfiles()
}, { immediate: true })

// Charger les profils au montage
onMounted(() => {
  fetchProfiles()
})
</script>
