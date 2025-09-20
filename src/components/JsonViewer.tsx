'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { ChevronRight, ChevronDown, Copy, Search, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface JsonViewerProps {
  data: any
  className?: string
  maxDepth?: number
  defaultExpanded?: boolean
}

interface JsonNodeProps {
  data: any
  name?: string
  depth: number
  maxDepth: number
  defaultExpanded: boolean
  searchTerm?: string
  onCopy?: (value: string) => void
}

const JsonValue: React.FC<{
  value: any
  onCopy?: (value: string) => void
  searchTerm?: string
}> = ({ value, onCopy, searchTerm }) => {
  const { toast } = useToast()

  const handleCopy = useCallback(() => {
    const text = typeof value === 'string' ? `"${value}"` : String(value)
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'Value copied to clipboard',
    })
    onCopy?.(text)
  }, [value, onCopy, toast])

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  if (value === null) {
    return (
      <span className="text-gray-500 italic">
        {highlightText('null', searchTerm || '')}
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </span>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <span className="text-blue-600 dark:text-blue-400">
        {highlightText(String(value), searchTerm || '')}
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </span>
    )
  }

  if (typeof value === 'number') {
    return (
      <span className="text-green-600 dark:text-green-400">
        {highlightText(String(value), searchTerm || '')}
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </span>
    )
  }

  if (typeof value === 'string') {
    return (
      <span className="text-red-600 dark:text-red-400 group">
        "{highlightText(value, searchTerm || '')}"
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </span>
    )
  }

  return <span>{String(value)}</span>
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  name,
  depth,
  maxDepth,
  defaultExpanded,
  searchTerm,
  onCopy,
}) => {
  const [isExpanded, setIsExpanded] = useState(
    depth < 2 && defaultExpanded && depth < maxDepth
  )

  const isObject = data !== null && typeof data === 'object'
  const isArray = Array.isArray(data)
  const shouldCollapse = depth >= maxDepth

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  if (!isObject || shouldCollapse) {
    return (
      <div className="flex items-start gap-2 py-0.5">
        {name && (
          <span className="text-purple-600 dark:text-purple-400 font-medium">
            "{name}":
          </span>
        )}
        <JsonValue value={data} onCopy={onCopy} searchTerm={searchTerm} />
      </div>
    )
  }

  const entries = Object.entries(data)
  const itemCount = isArray ? data.length : entries.length

  return (
    <div className="py-0.5">
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1 group"
        onClick={toggleExpanded}
      >
        {isExpanded ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
        {name && (
          <span className="text-purple-600 dark:text-purple-400 font-medium">
            "{name}":
          </span>
        )}
        <span className="text-orange-600 dark:text-orange-400">
          {isArray ? '[' : '{'}
        </span>
        <span className="text-muted-foreground text-xs">
          {itemCount} {isArray ? 'items' : 'properties'}
        </span>
        <span className="text-orange-600 dark:text-orange-400">
          {isExpanded ? (isArray ? '[' : '{') : isArray ? '...' : '...'}
        </span>
        {!isExpanded && (
          <span className="text-orange-600 dark:text-orange-400">
            {isArray ? ']' : '}'}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="ml-4 border-l border-muted pl-2">
          {entries.map(([key, value]) => (
            <JsonNode
              key={key}
              data={value}
              name={isArray ? undefined : key}
              depth={depth + 1}
              maxDepth={maxDepth}
              defaultExpanded={defaultExpanded}
              searchTerm={searchTerm}
              onCopy={onCopy}
            />
          ))}
          <div className="text-orange-600 dark:text-orange-400">
            {isArray ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  )
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  className,
  maxDepth = 5,
  defaultExpanded = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const { toast } = useToast()

  const handleCopyAll = useCallback(() => {
    const jsonString = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(jsonString)
    toast({
      title: 'Copied!',
      description: 'Full JSON copied to clipboard',
    })
  }, [data, toast])

  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    const filterObject = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') {
        return String(obj).toLowerCase().includes(searchTerm.toLowerCase())
          ? obj
          : undefined
      }

      if (Array.isArray(obj)) {
        const filtered = obj
          .map(filterObject)
          .filter((item) => item !== undefined)
        return filtered.length > 0 ? filtered : undefined
      }

      const filtered: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const filteredValue = filterObject(value)
        if (
          filteredValue !== undefined ||
          key.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          filtered[key] = value
        }
      }
      return Object.keys(filtered).length > 0 ? filtered : undefined
    }

    return filterObject(data)
  }, [data, searchTerm])

  return (
    <div className={cn('bg-card border rounded-lg', className)}>
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">JSON Viewer</h3>
          <span className="text-xs text-muted-foreground">
            {Array.isArray(data) ? `${data.length} items` : 'Object'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className={cn('h-8 w-8 p-0', showSearch && 'bg-muted')}
          >
            {showSearch ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAll}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showSearch && (
        <div className="p-3 border-b">
          <Input
            placeholder="Search JSON..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
      )}

      <div className="p-3 max-h-96 overflow-auto font-mono text-sm">
        {filteredData !== undefined ? (
          <JsonNode
            data={filteredData}
            depth={0}
            maxDepth={maxDepth}
            defaultExpanded={defaultExpanded}
            searchTerm={searchTerm}
            onCopy={handleCopyAll}
          />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}
