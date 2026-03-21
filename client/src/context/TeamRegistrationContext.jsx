import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Initial state
const initialState = {
  teams: [],
  loading: false,
  error: null
}

// Action types
const actions = {
  ADD_TEAM: 'ADD_TEAM',
  DELETE_TEAM: 'DELETE_TEAM',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_TEAMS: 'LOAD_TEAMS',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer function
const teamReducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_TEAM:
      return {
        ...state,
        teams: [...state.teams, action.payload],
        loading: false,
        error: null
      }
    
    case actions.DELETE_TEAM:
      return {
        ...state,
        teams: state.teams.filter(team => (team._id || team.id) !== action.payload),
        loading: false,
        error: null
      }
    
    case actions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    
    case actions.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    
    case actions.LOAD_TEAMS:
      return {
        ...state,
        teams: action.payload,
        loading: false,
        error: null
      }
    
    case actions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Create context
const TeamRegistrationContext = createContext()

// Provider component
export const TeamRegistrationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(teamReducer, initialState)

  // Load teams from API on mount
  useEffect(() => {
    const loadTeamsFromAPI = async () => {
      try {
        dispatch({ type: actions.SET_LOADING, payload: true })
        
        const response = await axios.get(`${API_BASE_URL}/students`)
        
        if (response.data.success) {
          dispatch({ type: actions.LOAD_TEAMS, payload: response.data.data })
        } else {
          throw new Error(response.data.message || 'Failed to load teams')
        }
      } catch (error) {
        console.error('Error loading teams from API:', error)
        dispatch({ type: actions.SET_ERROR, payload: error.message })
      }
    }

    loadTeamsFromAPI()
  }, [])

  // Add a new team
  const addTeam = async (teamData) => {
    dispatch({ type: actions.SET_LOADING, payload: true })
    
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, teamData)
      
      if (response.data.success) {
        dispatch({ type: actions.ADD_TEAM, payload: response.data.data })
        toast.success('Team registered successfully! 🎉')
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to register team')
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register team. Please try again.'
      dispatch({ type: actions.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  }

  // Delete a team
  const deleteTeam = async (teamId) => {
    dispatch({ type: actions.SET_LOADING, payload: true })
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/students/${teamId}`)
      
      if (response.data.success) {
        dispatch({ type: actions.DELETE_TEAM, payload: teamId })
        toast.success('Team deleted successfully')
      } else {
        throw new Error(response.data.message || 'Failed to delete team')
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete team. Please try again.'
      dispatch({ type: actions.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  }

  // Refresh teams from API
  const refreshTeams = async () => {
    try {
      dispatch({ type: actions.SET_LOADING, payload: true })
      
      const response = await axios.get(`${API_BASE_URL}/students`)
      
      if (response.data.success) {
        dispatch({ type: actions.LOAD_TEAMS, payload: response.data.data })
      } else {
        throw new Error(response.data.message || 'Failed to refresh teams')
      }
    } catch (error) {
      console.error('Error refreshing teams:', error)
      dispatch({ type: actions.SET_ERROR, payload: error.message })
    }
  }

  // Get public team data (limited info)
  const getPublicTeams = () => {
    return state.teams.map(team => ({
      id: team._id || team.id,
      teamName: team.teamName,
      collegeName: team.collegeName,
      domain: team.domain,
      registeredAt: team.createdAt || team.registeredAt
    }))
  }

  // Get full team data (admin only)
  const getFullTeams = () => {
    return state.teams.map(team => ({
      id: team._id || team.id,
      teamName: team.teamName,
      collegeName: team.collegeName,
      domain: team.domain,
      members: team.members || [],
      registeredAt: team.createdAt || team.registeredAt
    }))
  }

  // Get team by ID
  const getTeamById = (teamId) => {
    return state.teams.find(team => (team._id || team.id) === teamId)
  }

  // Clear all teams (for testing/reset)
  const clearAllTeams = () => {
    try {
      // This would require an admin endpoint to clear all teams
      dispatch({ type: actions.LOAD_TEAMS, payload: [] })
      toast.success('All teams cleared')
    } catch (error) {
      toast.error('Failed to clear teams')
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: actions.CLEAR_ERROR })
  }

  const value = {
    ...state,
    addTeam,
    deleteTeam,
    refreshTeams,
    getPublicTeams,
    getFullTeams,
    getTeamById,
    clearAllTeams,
    clearError
  }

  return (
    <TeamRegistrationContext.Provider value={value}>
      {children}
    </TeamRegistrationContext.Provider>
  )
}

// Hook to use the context
export const useTeamRegistration = () => {
  const context = useContext(TeamRegistrationContext)
  if (!context) {
    throw new Error('useTeamRegistration must be used within a TeamRegistrationProvider')
  }
  return context
}

export default TeamRegistrationContext
