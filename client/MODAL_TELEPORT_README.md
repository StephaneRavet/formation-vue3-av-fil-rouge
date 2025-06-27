# 🚀 Modal avec Teleport et Focus Trap

## Vue d'ensemble

Cette implémentation démontre l'utilisation avancée de Vue 3 avec :
- **Teleport** : Rendu du composant Modal hors de la hiérarchie DOM normale
- **Focus Trap** : Confinement du focus clavier à l'intérieur de la modal
- **Accessibilité** : Support complet de la navigation clavier

## 🎯 Fonctionnalités implementées

### 1. Point de Téléportation
Dans `client/index.html` :
```html
<div id="teleport-root"></div>
```

### 2. Utilisation avec Teleport
Dans `App.vue` :
```vue
<Teleport to="#teleport-root">
  <Modal v-model:modelValue="showModal">
    <!-- Contenu de la modal -->
  </Modal>
</Teleport>
```

### 3. Focus Trap
Le composant Modal inclut :
- **Détection des éléments focusables** : `[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])`
- **Navigation circulaire** : Tab/Shift+Tab en boucle dans la modal
- **Filtrage des éléments** : Exclusion des éléments désactivés ou invisibles
- **Focus automatique** : Focus sur le premier élément à l'ouverture

## 🔧 Comment tester

1. **Ouvrir l'application** : `cd client && npm run dev`
2. **Ouvrir la modal** : Cliquer sur "Ouvrir la Modal"
3. **Tester la navigation** :
   - Utilisez `Tab` pour naviguer vers l'avant
   - Utilisez `Shift + Tab` pour naviguer vers l'arrière
   - Vérifiez que le focus reste confiné dans la modal
4. **Tester l'échappement** : Appuyez sur `Échap` pour fermer
5. **Vérifier Teleport** : Inspectez le DOM - la modal est rendue dans `#teleport-root`

## 📋 Éléments testables dans la modal

- Bouton de fermeture (×)
- Champ de texte
- Liste déroulante
- Zone de texte
- Boutons Annuler/Confirmer

## 🎨 Avantages de cette approche

### Teleport
- ✅ Modal rendue au bon endroit dans le DOM (évite les problèmes de z-index)
- ✅ Indépendante de la hiérarchie des composants parents
- ✅ Meilleur contrôle du positionnement et du style

### Focus Trap
- ✅ Améliore l'accessibilité pour les utilisateurs de lecteurs d'écran
- ✅ Navigation intuitive au clavier
- ✅ Respect des standards WCAG

## 🔍 Code clé

### Focus Trap Logic
```javascript
function trapFocus(event) {
  if (event.key !== 'Tab' || !modalEl.value || !isVisible.value) return
  
  const focusable = Array.from(modalEl.value.querySelectorAll(focusablesSelector))
    .filter(el => !el.disabled && el.offsetWidth > 0 && el.offsetHeight > 0)
  
  if (focusable.length === 0) return
  
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  
  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}
```

### Auto-focus à l'ouverture
```javascript
watch(
  () => props.modelValue,
  async (visible) => {
    if (visible) {
      await nextTick()
      const focusable = modalEl.value?.querySelectorAll(focusablesSelector)
      focusable?.[0]?.focus()
    }
  }
)
```

## 🎉 Résultat

Une modal moderne, accessible et performante qui respecte les meilleures pratiques de Vue 3 et d'accessibilité web. 