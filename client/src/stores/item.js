// src/stores/order.js
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({ orders: [] }),
  getters: {
    orderCount: (state) => state.orders.length
  },
  actions: {
    addOrder(order) {
      this.orders.push(order)
    },
    async fetchOrders() {
      // simuler un appel API
      const data = await new Promise(resolve =>
        setTimeout(() => resolve([{ id: 1, item: 'Produit A' }]), 300)
      )
      this.orders = data
    }
  }
})