<template>
  <div class="login-view">
    <h1>Connexion</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email :</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          placeholder="votre.email@exemple.com"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          placeholder="Votre mot de passe"
        />
      </div>
      
      <div class="form-group">
        <label for="role">Rôle :</label>
        <select id="role" v-model="form.role">
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      
      <button type="submit" :disabled="loading" class="login-btn">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>
    
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuth()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
  role: 'user'
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - accept any email/password
    const userData = {
      name: form.email.split('@')[0],
      email: form.email,
      role: form.role,
      token: `fake-token-${Date.now()}`
    }
    
    auth.login(userData)
    
    // Rediriger vers la page demandée ou le profil par défaut
    const redirectTo = route.query.redirect || '/profile'
    router.push(redirectTo)
    
  } catch (err) {
    error.value = 'Erreur lors de la connexion'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.login-btn:hover:not(:disabled) {
  background: #0056b3;
}

.login-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f8d7da;
  border-radius: 4px;
}
</style> 