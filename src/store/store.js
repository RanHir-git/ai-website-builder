import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './reducers/itemsReducer'
import usersReducer from './reducers/usersReducer'

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    users: usersReducer,
  },
})
