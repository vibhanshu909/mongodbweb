'use client'

import React, { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Copy, Search, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

interface JsonViewerProps {
  // Accept any here to allow document shapes from the app (MongoDocument, etc.)
  // We still use runtime checks before rendering. This keeps the component flexible
  // while avoiding build-time type errors when passing repository-specific types.
  data: any
  className?: string
  maxDepth?: number
  defaultExpanded?: boolean
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
    try {
      const jsonString = JSON.stringify(data, null, 2)
      navigator.clipboard.writeText(jsonString)
      toast({
        title: 'Copied!',
        description: 'Full JSON copied to clipboard',
      })
    } catch (_err) {
      // fallback for circular refs
      navigator.clipboard.writeText(String(data))
      toast({ title: 'Copied!', description: 'Copied (string fallback)' })
    }
  }, [data, toast])

  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    const filterObject = (obj: JsonValue): JsonValue | undefined => {
      if (obj === null || typeof obj !== 'object') {
        return String(obj).toLowerCase().includes(searchTerm.toLowerCase())
          ? obj
          : undefined
      }

      if (Array.isArray(obj)) {
        const filtered = obj
          .map((v) => filterObject(v))
          .filter((item): item is JsonValue => item !== undefined)
        return filtered.length > 0 ? filtered : undefined
      }

      const filtered: { [key: string]: JsonValue } = {}
      for (const [key, value] of Object.entries(obj)) {
        const filteredValue = filterObject(value as JsonValue)
        if (
          filteredValue !== undefined ||
          key.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          filtered[key] = value as JsonValue
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
          (typeof filteredData === 'object' && filteredData !== null) ? (
            // react-json-view expects an object/array
            <ReactJson
              // cast to unknown->object for react-json-view runtime API
              src={filteredData as unknown as object}
              name={null}
              collapsed={defaultExpanded ? false : maxDepth}
              collapseStringsAfterLength={120}
              enableClipboard={true}
              displayDataTypes={false}
              indentWidth={2}
              sortKeys={true}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            />
          ) : (
            <pre className="text-sm">{String(filteredData)}</pre>
          )
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}
