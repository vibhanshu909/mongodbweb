"use client"

import React from 'react'
import { Database, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useContextMenu } from '@/hooks/useContextMenu'

export function ServerManager() {
  const { servers, activeServer, setActiveServer, removeServer } = useAppStore()
  const { toast } = useToast()

  // Context menu state
  const { state: contextMenu, open: openContextMenu, close: closeContextMenu } =
    useContextMenu<{ serverId?: string }>()

  const handleDeleteConnection = (serverId: string) => {
    removeServer(serverId)
    toast({ title: 'Deleted', description: 'Server connection removed' })
    closeContextMenu()
  }

  // useContextMenu already manages the global click listener

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
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  openContextMenu(e, {
                    width: 224,
                    height: 40,
                    data: { serverId: server.id },
                  })
                }
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
        <div
          role="menu"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation()
              closeContextMenu()
            }
          }}
          className="fixed z-50 bg-popover rounded-md border border-border shadow-lg py-1 w-56"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-destructive/10 text-sm text-destructive"
            onClick={() => {
              const serverId = contextMenu.data?.serverId as string | undefined
              if (serverId) {
                handleDeleteConnection(serverId)
              }
              closeContextMenu()
            }}
          >
            Delete Connection
          </button>
        </div>
      )}
    </div>
  )
}
