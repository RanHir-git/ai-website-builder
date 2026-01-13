# Quick Setup Guide

## 🚀 Getting Started

### Step 1: Copy the Starter Website

Copy the entire `starter-website` folder to your desired location:

```bash
# If you're in the project root
cp -r starter-website ../my-new-project
cd ../my-new-project
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React & React DOM
- React Router DOM
- Redux Toolkit
- React Redux
- Vite (build tool)

### Step 3: Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`

## 📁 Folder Structure Explained

```
starter-website/
├── src/
│   ├── cmps/              # Reusable components (Header, Footer, etc.)
│   ├── pages/             # Page components (HomePage, AboutPage, etc.)
│   ├── store/             # Redux store setup
│   │   ├── store.js       # Main store configuration
│   │   ├── reducers/      # State reducers
│   │   └── actions/       # Action creators (async operations)
│   └── assets/
│       ├── imgs/          # Images
│       └── styles/         # CSS files
```

## 🔧 Using Redux

### Accessing State

```jsx
import { useSelector } from 'react-redux'

function MyComponent() {
    // Get items from store
    const { items, loading, error } = useSelector(state => state.items)
    
    // Get user from store
    const { currentUser, isAuthenticated } = useSelector(state => state.users)
}
```

### Dispatching Actions

```jsx
import { useDispatch } from 'react-redux'
import { fetchItems, createItem } from '../store/actions/itemsActions'

function MyComponent() {
    const dispatch = useDispatch()
    
    // Fetch items
    useEffect(() => {
        dispatch(fetchItems())
    }, [dispatch])
    
    // Create item
    const handleCreate = () => {
        dispatch(createItem({ name: 'New Item', description: '...' }))
    }
}
```

## 🎨 Adding New Components

1. Create file: `src/cmps/MyComponent.jsx`
2. Create CSS: `src/assets/styles/cmps/MyComponent.css`
3. Import in your page:

```jsx
import { MyComponent } from '../cmps/MyComponent'
import '../assets/styles/cmps/MyComponent.css'
```

## 📄 Adding New Pages

1. Create file: `src/pages/MyPage.jsx`
2. Create CSS: `src/assets/styles/pages/MyPage.css`
3. Add route in `src/App.jsx`:

```jsx
import { MyPage } from './pages/MyPage'

<Route path="/mypage" element={<MyPage />} />
```

4. Add navigation link in `src/cmps/Header.jsx`:

```jsx
const navItems = [
    { path: '/', label: 'home' },
    { path: '/mypage', label: 'My Page' },  // Add here
]
```

## 🔌 Connecting to Your API

Update the API endpoints in action files:

**In `src/store/actions/itemsActions.js`:**
```jsx
// Change this:
const response = await fetch('/api/items')

// To your API:
const response = await fetch('https://your-api.com/api/items')
```

**In `src/store/actions/usersActions.js`:**
```jsx
// Change this:
const response = await fetch('/api/auth/login')

// To your API:
const response = await fetch('https://your-api.com/api/auth/login')
```

## 🎯 Next Steps

1. ✅ Update API endpoints
2. ✅ Add your logo to `src/assets/imgs/`
3. ✅ Customize colors in `src/assets/styles/basics/base.css`
4. ✅ Add your content to pages
5. ✅ Add more components as needed

## 📚 Available Redux Actions

### Items Actions
- `fetchItems()` - Get all items
- `createItem(itemData)` - Create new item
- `updateItemById(itemData)` - Update item
- `deleteItemById(itemId)` - Delete item
- `selectItem(itemId)` - Select item for viewing/editing

### Users Actions
- `fetchUsers()` - Get all users
- `loginUser(credentials)` - Login
- `registerUser(userData)` - Register
- `logoutUser()` - Logout
- `updateUserProfile(userData)` - Update profile
- `getCurrentUser()` - Get user from token

## 🐛 Troubleshooting

### Redux not working?
- Make sure `Provider` wraps your app in `main.jsx`
- Check that actions are imported correctly
- Verify store is configured in `store/store.js`

### Routes not working?
- Make sure `BrowserRouter` wraps `App` in `main.jsx`
- Check route paths match exactly
- Verify components are exported correctly

### Styles not loading?
- Check import paths in `main.css`
- Verify CSS files exist
- Check browser console for errors

Happy coding! 🚀
