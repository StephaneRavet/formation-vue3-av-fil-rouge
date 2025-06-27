import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from './cart'
import { test, expect, beforeEach, vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

beforeEach(() => {
  setActivePinia(createPinia())
  fetch.mockClear()
})

test('itemCount renvoie 0 au départ', () => {
  const cart = useCartStore()
  expect(cart.itemCount).toBe(0)
})

test('totalPrice renvoie 0 au départ', () => {
  const cart = useCartStore()
  expect(cart.totalPrice).toBe(0)
})

test('addItemToCart ajoute un produit dans items', async () => {
  const cart = useCartStore()
  const mockItem = { id: 1, name: 'Produit A', price: 10.99 }
  
  // Mock successful API response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockItem
  })
  
  await cart.addItemToCart(mockItem)
  
  expect(cart.items).toHaveLength(1)
  expect(cart.items[0]).toEqual(mockItem)
  expect(cart.itemCount).toBe(1)
  expect(cart.totalPrice).toBeCloseTo(10.99)
})

test('addItemToCart appelle la bonne API', async () => {
  const cart = useCartStore()
  const mockItem = { id: 1, name: 'Produit A', price: 10.99 }
  
  // Mock successful API response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockItem
  })
  
  await cart.addItemToCart(mockItem)
  
  expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mockItem)
  })
})

test('fetchCart récupère et assigne les données', async () => {
  const cart = useCartStore()
  const mockCartData = [
    { id: 1, name: 'Produit A', price: 10.99 },
    { id: 2, name: 'Produit B', price: 15.50 }
  ]
  
  // Mock successful API response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockCartData
  })
  
  await cart.fetchCart()
  
  expect(cart.items).toEqual(mockCartData)
  expect(cart.itemCount).toBe(2)
  expect(cart.totalPrice).toBeCloseTo(26.49)
})

test('fetchCart appelle la bonne API', async () => {
  const cart = useCartStore()
  
  // Mock successful API response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  })
  
  await cart.fetchCart()
  
  expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/cart')
})

test('addItemToCart gère les erreurs API', async () => {
  const cart = useCartStore()
  const mockItem = { id: 1, name: 'Produit A' }
  
  // Mock failed API response
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 500
  })
  
  await expect(cart.addItemToCart(mockItem)).rejects.toThrow('HTTP error! status: 500')
  expect(cart.items).toHaveLength(0)
})

test('fetchCart gère les erreurs API', async () => {
  const cart = useCartStore()
  
  // Mock failed API response
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 404
  })
  
  await expect(cart.fetchCart()).rejects.toThrow('HTTP error! status: 404')
}) 