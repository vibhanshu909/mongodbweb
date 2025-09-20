import { useState, useCallback } from 'react'
import { apiClient, type ApiResponse, type Database, type Collection, type QueryParams } from '@/lib/api-client'

// Generic hook for API calls
export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      if (response.success && response.data !== undefined) {
        setData(response.data)
      } else {
        setError(response.error || 'Unknown error occurred')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

// Specific hooks for each API endpoint
export function useCheckServer() {
  const { data, loading, error, execute, reset } = useApi<boolean>()
  
  const checkServer = useCallback((uri: string) => {
    return execute(() => apiClient.checkServer(uri))
  }, [execute])

  return { data, loading, error, checkServer, reset }
}

export function useListDatabases() {
  const { data, loading, error, execute, reset } = useApi<Database[]>()
  
  const listDatabases = useCallback((uri: string) => {
    return execute(() => apiClient.listDatabases(uri))
  }, [execute])

  return { data: data || [], loading, error, listDatabases, reset }
}

export function useListCollections() {
  const { data, loading, error, execute, reset } = useApi<Collection[]>()
  
  const listCollections = useCallback((uri: string, database: string) => {
    return execute(() => apiClient.listCollections(uri, database))
  }, [execute])

  return { data: data || [], loading, error, listCollections, reset }
}

export function useQueryDocuments() {
  const { data, loading, error, execute, reset } = useApi<any[]>()
  
  const queryDocuments = useCallback((
    uri: string,
    database: string,
    collection: string,
    params?: QueryParams
  ) => {
    return execute(() => apiClient.queryDocuments(uri, database, collection, params))
  }, [execute])

  return { data: data || [], loading, error, queryDocuments, reset }
}

export function useCreateDocument() {
  const { data, loading, error, execute, reset } = useApi<boolean>()
  
  const createDocument = useCallback((
    uri: string,
    database: string,
    collection: string,
    document: Record<string, any>
  ) => {
    return execute(() => apiClient.createDocument(uri, database, collection, document))
  }, [execute])

  return { success: data, loading, error, createDocument, reset }
}

export function useUpdateDocument() {
  const { data, loading, error, execute, reset } = useApi<boolean>()
  
  const updateDocument = useCallback((
    uri: string,
    database: string,
    collection: string,
    id: string,
    document: Record<string, any>
  ) => {
    return execute(() => apiClient.updateDocument(uri, database, collection, id, document))
  }, [execute])

  return { success: data, loading, error, updateDocument, reset }
}

export function useDeleteDocuments() {
  const { data, loading, error, execute, reset } = useApi<boolean>()
  
  const deleteDocuments = useCallback((
    uri: string,
    database: string,
    collection: string,
    ids: string[]
  ) => {
    return execute(() => apiClient.deleteDocuments(uri, database, collection, ids))
  }, [execute])

  return { success: data, loading, error, deleteDocuments, reset }
}