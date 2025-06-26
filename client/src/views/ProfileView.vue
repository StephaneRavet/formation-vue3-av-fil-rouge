<template>
  <div class="profile-view">
    <h1>Profil Utilisateur</h1>
    <div v-if="auth.user.value" class="user-info">
      <h2>Informations personnelles</h2>
      <p><strong>Nom :</strong> {{ auth.user.value.name || 'Non défini' }}</p>
      <p><strong>Email :</strong> {{ auth.user.value.email || 'Non défini' }}</p>
      <p><strong>Rôle :</strong> {{ auth.role.value }}</p>
    </div>
    <div class="actions">
      <button @click="logout" class="logout-btn">Se déconnecter</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.user-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.actions {
  margin-top: 2rem;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c82333;
}
</style> 