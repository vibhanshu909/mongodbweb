import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Server {
  id: string
  uri: string
  name?: string
  isActive?: boolean
}

export interface CollectionTab {
  id: string
  server: string
  database: string
  collection: string
  isActive: boolean
}

interface AppState {
  // Server management
  servers: Server[]
  activeServer: Server | null
  
  // Collection tabs
  tabs: CollectionTab[]
  activeTabId: string | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  addServer: (uri: string, name?: string) => void
  removeServer: (id: string) => void
  setActiveServer: (server: Server | null) => void
  
  addTab: (server: string, database: string, collection: string) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        servers: [],
        activeServer: null,
        tabs: [],
        activeTabId: null,
        isLoading: false,
        error: null,

        // Server actions
        addServer: (uri: string, name?: string) => {
          const server: Server = {
            id: Math.random().toString(36).substr(2, 9),
            uri,
            name: name || new URL(uri).hostname,
            isActive: false,
          }
          
          set((state) => ({
            servers: [...state.servers, server],
          }))
        },

        removeServer: (id: string) =>
          set((state) => ({
            servers: state.servers.filter((s) => s.id !== id),
            activeServer: state.activeServer?.id === id ? null : state.activeServer,
            tabs: state.tabs.filter((t) => t.server !== id),
          })),

        setActiveServer: (server: Server | null) =>
          set(() => ({
            activeServer: server,
          })),

        // Tab actions
        addTab: (server: string, database: string, collection: string) => {
          const existingTab = get().tabs.find(
            (t) => t.server === server && t.database === database && t.collection === collection
          )
          
          if (existingTab) {
            set(() => ({
              activeTabId: existingTab.id,
            }))
            return
          }

          const newTab: CollectionTab = {
            id: Math.random().toString(36).substr(2, 9),
            server,
            database,
            collection,
            isActive: true,
          }

          set((state) => ({
            tabs: [...state.tabs.map((t) => ({ ...t, isActive: false })), newTab],
            activeTabId: newTab.id,
          }))
        },

        removeTab: (id: string) => {
          const state = get()
          const tabIndex = state.tabs.findIndex((t) => t.id === id)
          const newTabs = state.tabs.filter((t) => t.id !== id)
          
          let newActiveTabId = state.activeTabId
          if (state.activeTabId === id && newTabs.length > 0) {
            // Set new active tab to the one before the removed tab, or the first one
            const newIndex = tabIndex > 0 ? tabIndex - 1 : 0
            newActiveTabId = newTabs[newIndex]?.id || null
          } else if (newTabs.length === 0) {
            newActiveTabId = null
          }

          set(() => ({
            tabs: newTabs,
            activeTabId: newActiveTabId,
          }))
        },

        setActiveTab: (id: string) =>
          set((state) => ({
            activeTabId: id,
            tabs: state.tabs.map((tab) => ({
              ...tab,
              isActive: tab.id === id,
            })),
          })),

        // UI actions
        setLoading: (loading: boolean) =>
          set(() => ({
            isLoading: loading,
          })),

        setError: (error: string | null) =>
          set(() => ({
            error,
          })),

        clearError: () =>
          set(() => ({
            error: null,
          })),
      }),
      {
        name: 'mongodb-web-store',
        partialize: (state) => ({
          servers: state.servers,
          tabs: state.tabs,
          activeTabId: state.activeTabId,
        }),
      }
    ),
    {
      name: 'mongodb-web-store',
    }
  )
)