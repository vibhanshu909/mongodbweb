import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function formatDate(date: Date | string) {
  const d = new Date(date)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export function truncateString(str: string, length: number) {
  if (str.length <= length) return str
  return `${str.substring(0, length)}...`
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), waitFor)
  }
}

export function parseMongoUri(uri: string): {
  protocol: string
  host: string
  port?: number
  database?: string
} | null {
  try {
    const url = new URL(uri)
    return {
      protocol: url.protocol.slice(0, -1), // Remove trailing ':'
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : undefined,
      database: url.pathname.slice(1) || undefined, // Remove leading '/'
    }
  } catch {
    return null
  }
}

export function isValidMongoUri(uri: string): boolean {
  try {
    const parsed = parseMongoUri(uri)
    return (
      parsed !== null &&
      (parsed.protocol === 'mongodb' || parsed.protocol === 'mongodb+srv')
    )
  } catch {
    return false
  }
}

export function formatJSON(obj: unknown, indent = 2): string {
  try {
    return JSON.stringify(obj, null, indent)
  } catch {
    return String(obj)
  }
}

export function parseJSON(str: string): unknown {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

export function sanitizeObjectId(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectId)
  }

  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      if (
        key === '_id' &&
        value &&
        typeof value === 'object' &&
        '$oid' in value
      ) {
        sanitized[key] = (value as { $oid: string }).$oid
      } else if (value && typeof value === 'object') {
        sanitized[key] = sanitizeObjectId(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  return obj
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-999999px'

    document.body.prepend(textArea)
    textArea.select()

    try {
      document.execCommand('copy')
    } finally {
      textArea.remove()
    }

    return Promise.resolve()
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}
