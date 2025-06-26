<template>
  <Suspense>
    <template #default>
      <!-- affichage du produit ici -->
    </template>
    <template #fallback>
      <!-- état de chargement -->
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute() // récupérer les paramètres de la route
const product = ref(null)
const loading = ref(false)
const productId = route.params.productId

const response = await fetch(`http://localhost:3001/api/products/${productId}`)
product.value = await response.json()
</script>
