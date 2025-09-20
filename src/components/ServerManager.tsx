'use client'

import { Server, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ServerManager() {
  const { servers, activeServer, setActiveServer, removeServer } = useAppStore()

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
    <div className="space-y-2">
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
                <Server className="h-4 w-4" />
                <span className="truncate">
                  {server.name || new URL(server.uri).hostname}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  removeServer(server.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
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
    </div>
  )
}
