<template>
  <div class="accordion">
    <div 
      v-for="(item, index) in items" 
      :key="index" 
      class="accordion-item"
    >
      <!-- Header section with scoped slot -->
      <div 
        class="accordion-header" 
        @click="toggleItem(index)"
        :class="{ 'active': activeItems.includes(index) }"
      >
        <slot 
          name="header" 
          :item="item" 
          :index="index" 
          :isOpen="activeItems.includes(index)"
        >
          <!-- Default header content if no slot provided -->
          <h3>{{ item.title }}</h3>
        </slot>
        
        <!-- Toggle icon -->
        <v-icon 
          class="accordion-toggle-icon"
          :class="{ 'rotated': activeItems.includes(index) }"
        >
          mdi-chevron-down
        </v-icon>
      </div>
      
      <!-- Content section -->
      <div 
        v-show="activeItems.includes(index)"
        class="accordion-content"
      >
        <slot 
          name="content" 
          :item="item" 
          :index="index"
        >
          <!-- Default content if no content slot provided -->
          <p>{{ item.content }}</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props definition
const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      // Validate that each item has title and content
      return items.every(item => 
        typeof item === 'object' && 
        'title' in item && 
        'content' in item
      )
    }
  },
  multiple: {
    type: Boolean,
    default: false // Allow multiple items to be open at once
  }
})

// Reactive state for tracking open accordion items
const activeItems = ref([])

// Toggle accordion item
const toggleItem = (index) => {
  if (props.multiple) {
    // Multiple items can be open
    const itemIndex = activeItems.value.indexOf(index)
    if (itemIndex > -1) {
      activeItems.value.splice(itemIndex, 1)
    } else {
      activeItems.value.push(index)
    }
  } else {
    // Only one item can be open at a time
    if (activeItems.value.includes(index)) {
      activeItems.value = []
    } else {
      activeItems.value = [index]
    }
  }
}
</script>

<style scoped>
.accordion {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.accordion-item {
  border-bottom: 1px solid #e0e0e0;
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.accordion-header:hover {
  background-color: #eeeeee;
}

.accordion-header.active {
  background-color: #e3f2fd;
}

.accordion-toggle-icon {
  transition: transform 0.3s ease;
}

.accordion-toggle-icon.rotated {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 16px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

/* Default header styling when using scoped slot */
.accordion-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Default content styling */
.accordion-content p {
  margin: 0;
  line-height: 1.6;
}
</style> 