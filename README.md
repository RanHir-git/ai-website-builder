# React Starter Website with Redux

A complete starter React website with Redux store setup, ready for development.

## 📁 Project Structure

```
starter-website/
├── src/
│   ├── cmps/              # Components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   └── ContactPage.jsx
│   ├── store/             # Redux store
│   │   ├── store.js       # Store configuration
│   │   ├── reducers/      # Redux reducers
│   │   │   ├── itemsReducer.js
│   │   │   └── usersReducer.js
│   │   └── actions/       # Redux actions
│   │       ├── itemsActions.js
│   │       └── usersActions.js
│   ├── assets/
│   │   ├── imgs/          # Images
│   │   └── styles/        # CSS files
│   │       ├── basics/    # Base styles
│   │       ├── cmps/      # Component styles
│   │       └── pages/     # Page styles
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── package.json
├── vite.config.js
└── index.html
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd starter-website
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

## 📦 Redux Store Structure

### Items Redux

**State:**
- `items` - Array of items
- `loading` - Loading state
- `error` - Error message
- `selectedItem` - Currently selected item

**Actions:**
- `fetchItems()` - Fetch all items
- `createItem(itemData)` - Create new item
- `updateItemById(itemData)` - Update item
- `deleteItemById(itemId)` - Delete item
- `selectItem(itemId)` - Select item
- `clearSelectedItem()` - Clear selection

**Usage:**
```jsx
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems, createItem } from '../store/actions/itemsActions'

function MyComponent() {
    const dispatch = useDispatch()
    const { items, loading } = useSelector(state => state.items)

    useEffect(() => {
        dispatch(fetchItems())
    }, [dispatch])

    const handleCreate = () => {
        dispatch(createItem({ name: 'New Item', description: '...' }))
    }
}
```

### Users Redux

**State:**
- `users` - Array of users
- `currentUser` - Currently logged in user
- `loading` - Loading state
- `error` - Error message
- `isAuthenticated` - Authentication status

**Actions:**
- `fetchUsers()` - Fetch all users
- `loginUser(credentials)` - Login user
- `registerUser(userData)` - Register new user
- `logoutUser()` - Logout user
- `updateUserProfile(userData)` - Update user profile
- `deleteUserById(userId)` - Delete user
- `getCurrentUser()` - Get current user from token

**Usage:**
```jsx
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logoutUser } from '../store/actions/usersActions'

function LoginComponent() {
    const dispatch = useDispatch()
    const { currentUser, isAuthenticated } = useSelector(state => state.users)

    const handleLogin = async () => {
        try {
            await dispatch(loginUser({ email: 'user@example.com', password: 'password' }))
        } catch (error) {
            console.error('Login failed:', error)
        }
    }
}
```

## 🎨 Adding New Components

1. Create component file in `src/cmps/`
2. Create CSS file in `src/assets/styles/cmps/`
3. Import and use in your pages

## 📄 Adding New Pages

1. Create page file in `src/pages/`
2. Create CSS file in `src/assets/styles/pages/`
3. Add route in `src/App.jsx`
4. Add navigation link in `src/cmps/Header.jsx`

## 🔧 Customizing

### Update API Endpoints

Edit the action files in `src/store/actions/` to point to your API:

```jsx
// In itemsActions.js
const response = await fetch('/api/items')  // Change to your API
```

### Update Colors

Edit CSS variables in `src/assets/styles/basics/base.css`:

```css
:root {
    --primary-color: #007bff;  /* Change to your brand color */
    /* ... */
}
```

### Update Navigation

Edit `navItems` array in `src/cmps/Header.jsx`:

```jsx
const navItems = [
    { path: '/', label: 'home' },
    { path: '/about', label: 'about' },
    // Add your routes here
]
```

## 📚 Next Steps

1. **Update API endpoints** in action files
2. **Add your logo** to `src/assets/imgs/` and update imports
3. **Customize colors** in CSS variables
4. **Add more pages** as needed
5. **Add more components** from starter-templates folder
6. **Connect to your backend API**

## 🎯 Features Included

- ✅ Redux Toolkit setup
- ✅ Items management (CRUD operations)
- ✅ Users management (authentication ready)
- ✅ React Router setup
- ✅ Header and Footer components
- ✅ Basic page structure
- ✅ Responsive CSS
- ✅ Loading and error states

## 📝 Notes

- All API calls are placeholder - update with your actual endpoints
- Authentication uses localStorage for tokens
- Redux actions are async-ready (thunk middleware included)
- All components are functional components with hooks

Happy coding! 🚀
