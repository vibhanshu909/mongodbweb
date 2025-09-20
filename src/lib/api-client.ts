import { type MongoDocument } from '@/types'

// API Response types
export interface ApiResponse<T = MongoDocument> {
  success: boolean
  data?: T
  error?: string
}

export interface Database {
  name: string
  empty: boolean
}

export interface Collection {
  name: string
  count: number
}

export interface QueryParams {
  query?: Record<string, unknown>
  skip?: number
  limit?: number
  sort?: Record<string, unknown>
}

// Base API client class
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()
    return data as ApiResponse<T>
  }

  async checkServer(uri: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>('/check-server', {
      method: 'POST',
      body: JSON.stringify({ uri }),
    })
  }

  async listDatabases(uri: string): Promise<ApiResponse<Database[]>> {
    return this.request<Database[]>('/databases', {
      method: 'POST',
      body: JSON.stringify({ uri }),
    })
  }

  async listCollections(
    uri: string,
    database: string
  ): Promise<ApiResponse<Collection[]>> {
    return this.request<Collection[]>('/collections', {
      method: 'POST',
      body: JSON.stringify({ uri, database }),
    })
  }

  async queryDocuments(
    uri: string,
    database: string,
    collection: string,
    params?: QueryParams
  ): Promise<ApiResponse<MongoDocument[]>> {
    return this.request<MongoDocument[]>('/documents/query', {
      method: 'POST',
      body: JSON.stringify({ uri, database, collection, params }),
    })
  }

  async createDocument(
    uri: string,
    database: string,
    document: MongoDocument
  ): Promise<ApiResponse<boolean>> {
    return this.request<boolean>('/documents/create', {
      method: 'POST',
      body: JSON.stringify({ uri, database, collection, document }),
    })
  }

  async updateDocument(
    uri: string,
    database: string,
    collection: string,
    id: string,
    document: MongoDocument
  ): Promise<ApiResponse<boolean>> {
    return this.request<boolean>('/documents/update', {
      method: 'PUT',
      body: JSON.stringify({ uri, database, collection, id, document }),
    })
  }

  async deleteDocuments(
    uri: string,
    database: string,
    collection: string,
    ids: string[]
  ): Promise<ApiResponse<boolean>> {
    return this.request<boolean>('/documents/delete', {
      method: 'DELETE',
      body: JSON.stringify({ uri, database, collection, ids }),
    })
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient()
export default apiClient
