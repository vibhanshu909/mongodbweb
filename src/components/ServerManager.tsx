'use client'

import React, { useState, useEffect } from 'react'
import { Database, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function ServerManager() {
  const { servers, activeServer, setActiveServer, removeServer } = useAppStore()
  const { toast } = useToast()

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    serverId: string | null
  }>({ visible: false, x: 0, y: 0, serverId: null })

  const openContextMenu = (e: React.MouseEvent, serverId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const menuWidth = 224 // w-56 = 14rem = 224px
    const menuHeight = 40 // approximate height for 1 item

    let x = e.clientX
    let y = e.clientY

    const target = e.currentTarget as HTMLElement
    if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect()
      // Place menu so its right edge aligns with trigger's right edge,
      // and offset slightly downwards.
      x = rect.left + rect.width - menuWidth
      y = rect.top + rect.height + 8
    }

    // Adjust position to keep menu on screen
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10
    }
    if (x < 10) x = 10
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10
    }
    if (y < 10) y = 10

    setContextMenu({ visible: true, x, y, serverId })
  }

  const handleDeleteConnection = (serverId: string) => {
    removeServer(serverId)
    toast({ title: 'Deleted', description: 'Server connection removed' })
    setContextMenu((c) => ({ ...c, visible: false }))
  }

  useEffect(() => {
    if (!contextMenu.visible) return
    const onClick = () => setContextMenu((c) => ({ ...c, visible: false }))
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [contextMenu.visible])

  if (servers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            No servers connected
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2 relative">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Servers
      </h3>
      {servers.map((server) => (
        <Card
          key={server.id}
          className={cn(
            'cursor-pointer transition-colors',
            activeServer?.id === server.id
              ? 'border-primary bg-primary/5'
              : 'hover:bg-muted/50'
          )}
          onClick={() => setActiveServer(server)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="truncate">
                  {server.name || new URL(server.uri).hostname}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => openContextMenu(e, server.id)}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground truncate">
              {server.uri}
            </p>
          </CardContent>
        </Card>
      ))}

      {contextMenu.visible && (
        // Use fixed positioning so the menu positions relative to the viewport
        // (prevents parent stacking/scroll offsets from pushing it away from the pointer)
        <div
          className="fixed z-50 bg-popover rounded-md border border-border shadow-lg py-1 w-56"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-3 py-2 hover:bg-destructive/10 text-sm text-destructive"
            onClick={() =>
              contextMenu.serverId &&
              handleDeleteConnection(contextMenu.serverId)
            }
          >
            Delete Connection
          </button>
        </div>
      )}
    </div>
  )
}
