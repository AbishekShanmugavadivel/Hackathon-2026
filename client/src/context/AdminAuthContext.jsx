import { createContext, useContext, useReducer } from 'react'
import toast from 'react-hot-toast'

// ✅ Named export (IMPORTANT)
export const AdminAuthContext = createContext()

// Initial state
const initialState = {
  isAdmin: false,
  isLoading: false,
  messages: []
}

// Reducer
const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true }

    case 'LOGIN_SUCCESS':
      return { isAdmin: true, isLoading: false }

    case 'LOGIN_FAILURE':
      return { isAdmin: false, isLoading: false }

    case 'LOGOUT':
      return { isAdmin: false, isLoading: false }

    case 'ADD_MESSAGE':
      return { ...state, messages: [action.payload, ...state.messages] }

    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] }

    default:
      return state
  }
}

// Provider
export const AdminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, initialState)

  const login = async ({ adminId, password }) => {
    dispatch({ type: 'LOGIN_START' })

    // 🔐 Static Credentials
    if (adminId === 'Abishek@2007' && password === 'abishek') {
      dispatch({ type: 'LOGIN_SUCCESS' })
      toast.success('Admin login successful 🎉')
      return true
    } else {
      dispatch({ type: 'LOGIN_FAILURE' })
      toast.error('Invalid Admin Credentials ❌')
      return false
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const addMessage = (message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message })
    toast.success('New message received! 📧')
  }

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }

  return (
    <AdminAuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

// Custom Hook
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)

  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }

  return context
}