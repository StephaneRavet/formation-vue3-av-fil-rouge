<template>
  <div class="admin-view">
    <h1>Panneau d'Administration</h1>
    <div class="admin-content">
      <div class="welcome">
        <h2>Bienvenue, {{ auth.user.value?.name }}!</h2>
        <p>Vous avez accès au panneau d'administration avec le rôle : <strong>{{ auth.role.value }}</strong></p>
      </div>
      
      <div class="admin-sections">
        <div class="section">
          <h3>Gestion des utilisateurs</h3>
          <p>Fonctionnalités de gestion des comptes utilisateurs</p>
          <button class="action-btn">Gérer les utilisateurs</button>
        </div>
        
        <div class="section">
          <h3>Gestion du contenu</h3>
          <p>Modération et gestion du contenu du site</p>
          <button class="action-btn">Gérer le contenu</button>
        </div>
        
        <div class="section">
          <h3>Statistiques</h3>
          <p>Tableau de bord avec les métriques importantes</p>
          <button class="action-btn">Voir les stats</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const auth = useAuth()
</script>

<style scoped>
.admin-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome {
  background: #e7f3ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #007bff;
}

.admin-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.section h3 {
  margin-top: 0;
  color: #495057;
}

.action-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.action-btn:hover {
  background: #218838;
}
</style> 