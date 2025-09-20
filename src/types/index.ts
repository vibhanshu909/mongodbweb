export interface Database {
  name: string
  empty: boolean
}

export interface Collection {
  name: string
  count: number
}

export interface MongoDocument {
  _id: string
  [key: string]: any
}

export interface FindParams {
  query?: Record<string, any>
  skip?: number
  limit?: number
  sort?: Record<string, any>
}

export interface ServerConnection {
  id: string
  uri: string
  name: string
  isConnected: boolean
  lastConnected?: Date
}

export interface Tab {
  id: string
  label: string
  server: string
  database: string
  collection: string
  isActive: boolean
  isDirty?: boolean
}

export interface AppError {
  message: string
  code?: string
  details?: any
}

// Form types
export interface AddServerFormData {
  uri: string
  name?: string
}

export interface QueryFormData {
  query: string
  limit: number
  skip: number
  sort: string
}

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

// GraphQL operation result types
export type QueryResult<T> = {
  data?: T
  loading: boolean
  error?: Error
  refetch: () => void
}

export type MutationResult<T> = [
  (variables: any) => Promise<any>,
  {
    data?: T
    loading: boolean
    error?: Error
  }
]