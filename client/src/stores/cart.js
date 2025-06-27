import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({ 
    items: [] 
  }),
  getters: {
    itemCount: (state) => state.items.length,
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price || 0), 0)
  },
  actions: {
    async addItemToCart(item) {
      try {
        const response = await fetch('http://localhost:3001/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const addedItem = await response.json()
        this.items.push(addedItem)
        return addedItem
      } catch (error) {
        console.error('Error adding item to cart:', error)
        throw error
      }
    },
    
    async fetchCart() {
      try {
        const response = await fetch('http://localhost:3001/api/cart')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const cartData = await response.json()
        this.items = cartData
        return cartData
      } catch (error) {
        console.error('Error fetching cart:', error)
        throw error
      }
    }
  }
}) 