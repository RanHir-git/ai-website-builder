import { createSlice } from '@reduxjs/toolkit'
import * as itemsActions from '../actions/itemsActions'

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedItem: null,
}

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    // Set all items
    setItems: (state, action) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    // Add new item
    addItem: (state, action) => {
      state.items.push(action.payload)
    },
    // Update existing item
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    // Delete item
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    // Set selected item
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload
    },
    // Clear selected item
    clearSelectedItem: (state) => {
      state.selectedItem = null
    },
  },
})

export const {
  setLoading,
  setError,
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setSelectedItem,
  clearSelectedItem,
} = itemsSlice.actions

export default itemsSlice.reducer
