import { setLoading, setError, setItems, addItem, updateItem, deleteItem, setSelectedItem, clearSelectedItem as clearSelectedItemReducer } from '../reducers/itemsReducer'

/**
 * Fetch all items (async action)
 * Usage: dispatch(fetchItems())
 * 
 * Note: Update the API endpoint to match your backend
 */
export const fetchItems = () => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch('/api/items')
    if (!response.ok) throw new Error('Failed to fetch items')
    
    const data = await response.json()
    dispatch(setItems(data))
  } catch (error) {
    dispatch(setError(error.message))
  }
}

/**
 * Create a new item
 * Usage: dispatch(createItem({ name: 'Item 1', description: '...' }))
 */
export const createItem = (itemData) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    })
    
    if (!response.ok) throw new Error('Failed to create item')
    
    const newItem = await response.json()
    dispatch(addItem(newItem))
    return newItem
  } catch (error) {
    dispatch(setError(error.message))
    throw error
  }
}

/**
 * Update an existing item
 * Usage: dispatch(updateItemById({ id: 1, name: 'Updated Name' }))
 */
export const updateItemById = (itemData) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch(`/api/items/${itemData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    })
    
    if (!response.ok) throw new Error('Failed to update item')
    
    const updatedItem = await response.json()
    dispatch(updateItem(updatedItem))
    return updatedItem
  } catch (error) {
    dispatch(setError(error.message))
    throw error
  }
}

/**
 * Delete an item
 * Usage: dispatch(deleteItemById(1))
 */
export const deleteItemById = (itemId) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    // Replace with your API call
    const response = await fetch(`/api/items/${itemId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) throw new Error('Failed to delete item')
    
    dispatch(deleteItem(itemId))
  } catch (error) {
    dispatch(setError(error.message))
    throw error
  }
}

/**
 * Select an item (for viewing/editing)
 * Usage: dispatch(selectItem(itemId))
 */
export const selectItem = (itemId) => (dispatch, getState) => {
    const state = getState()
    const item = state.items.items.find(item => item.id === itemId)
    if (item) {
        dispatch(setSelectedItem(item))
    }
}

/**
 * Clear selected item
 * Usage: dispatch(clearSelectedItem())
 */
export const clearSelectedItem = () => (dispatch) => {
    dispatch(clearSelectedItemReducer())
}
