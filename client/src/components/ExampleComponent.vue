<template>
  <div class="example-component">
    <h3>Composant d'exemple</h3>
    <p>Ce composant fonctionne correctement !</p>
  </div>
</template>

<script setup>
// Logique du composant d'exemple
import { ref } from 'vue'

const message = ref('Composant opérationnel')
</script>

<style scoped>
.example-component {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
}

.example-component h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.example-component p {
  color: #6b7280;
}
</style> 