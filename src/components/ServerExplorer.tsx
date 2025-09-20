'use client'

import {
  Folder,
  Server as ServerIcon,
  FileText,
  Loader2,
  MoreHorizontal,
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useListCollections, useListDatabases } from '@/hooks/useApi'
import { type Server, useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ServerExplorer() {
  const { servers, activeServer, setActiveServer, removeServer, addTab } =
    useAppStore()
  const { toast } = useToast()

  const [expandedServerId, setExpandedServerId] = useState<string | null>(null)
  const [expandedDb, setExpandedDb] = useState<Record<string, string | null>>(
    {}
  )

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    serverId: string | null
  }>({ visible: false, x: 0, y: 0, serverId: null })

  // Create database dialog state
  const [createDbDialog, setCreateDbDialog] = useState<{
    open: boolean
    serverId: string | null
    databaseName: string
  }>({ open: false, serverId: null, databaseName: '' })

  const {
    data: databases,
    loading: loadingDatabases,
    listDatabases,
  } = useListDatabases()

  const {
    data: collections,
    loading: loadingCollections,
    listCollections,
  } = useListCollections()

  const loadDatabases = useCallback(
    async (server: Server) => {
      try {
        await listDatabases(server.uri)
      } catch (_error) {
        toast({
          title: 'Error',
          description: 'Failed to load databases',
          variant: 'destructive',
        })
      }
    },
    [listDatabases, toast]
  )

  const loadCollections = useCallback(
    async (server: Server, dbName: string) => {
      try {
        await listCollections(server.uri, dbName)
      } catch (_error) {
        toast({
          title: 'Error',
          description: 'Failed to load collections',
          variant: 'destructive',
        })
      }
    },
    [listCollections, toast]
  )

  useEffect(() => {
    // Reset loaded collections when server changes
  }, [servers])

  useEffect(() => {
    if (!contextMenu.visible) return
    const onClick = () => setContextMenu((c) => ({ ...c, visible: false }))
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [contextMenu.visible])

  const toggleServer = (server: Server) => {
    if (expandedServerId === server.id) {
      setExpandedServerId(null)
    } else {
      setExpandedServerId(server.id)
      setActiveServer(server)
      loadDatabases(server)
    }
  }

  const toggleDatabase = (server: Server, dbName: string) => {
    const current = expandedDb[server.id] || null
    if (current === dbName) {
      setExpandedDb((s) => ({ ...s, [server.id]: null }))
    } else {
      setExpandedDb((s) => ({ ...s, [server.id]: dbName }))
      loadCollections(server, dbName)
    }
  }

  const handleCollectionClick = (
    serverId: string,
    dbName: string,
    collectionName: string
  ) => {
    addTab(serverId, dbName, collectionName)
  }

  const openContextMenu = (e: React.MouseEvent, serverId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const menuWidth = 224 // w-56 = 14rem = 224px
    const menuHeight = 120 // approximate height for 3 items

    // Prefer anchoring to the clicked element (options icon). If that's not
    // available, fall back to the mouse coordinates.
    let x = e.clientX
    let y = e.clientY

    const target = e.currentTarget as HTMLElement
    if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect()
      // Align menu right edge with the trigger element's right edge and
      // place it slightly below the element.
      x = rect.left + rect.width - menuWidth
      y = rect.top + rect.height + 8
    }

    // Adjust position to keep menu on screen
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10
    }
    if (x < 10) {
      x = 10
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10
    }
    if (y < 10) {
      y = 10
    }

    setContextMenu({ visible: true, x, y, serverId })
  }

  const handleAddDatabase = (serverId: string) => {
    setContextMenu((c) => ({ ...c, visible: false }))
    setCreateDbDialog({ open: true, serverId, databaseName: '' })
  }

  const handleCreateDatabase = async () => {
    const { serverId, databaseName } = createDbDialog
    if (!serverId || !databaseName.trim()) return

    const server = servers.find((s) => s.id === serverId)
    if (!server) return

    try {
      const res = await fetch('/api/databases/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uri: server.uri,
          database: databaseName.trim(),
        }),
      })
      const body = await res.json()
      if (res.ok && body.success) {
        toast({ title: 'Success', description: 'Database created' })
        loadDatabases(server)
        setCreateDbDialog({ open: false, serverId: null, databaseName: '' })
      } else {
        toast({
          title: 'Error',
          description: body.error || 'Failed to create database',
          variant: 'destructive',
        })
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create database',
        variant: 'destructive',
      })
    }
  }

  const handleRefreshConnection = (serverId: string) => {
    const server = servers.find((s) => s.id === serverId)
    if (!server) return
    loadDatabases(server)
    setContextMenu((c) => ({ ...c, visible: false }))
  }

  const handleDeleteConnection = (serverId: string) => {
    // remove from store
    removeServer(serverId)
    toast({ title: 'Deleted', description: 'Server connection removed' })
    setContextMenu((c) => ({ ...c, visible: false }))
  }

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
            'transition-colors',
            activeServer?.id === server.id
              ? 'border-primary bg-primary/5'
              : 'hover:bg-muted/50'
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ServerIcon className="h-4 w-4" />
                <button
                  className="text-left truncate"
                  onClick={() => toggleServer(server)}
                >
                  {server.name || new URL(server.uri).hostname}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => openContextMenu(e, server.id)}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          {expandedServerId === server.id && (
            <CardContent className="pt-0">
              {loadingDatabases ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="space-y-1">
                  {databases.map((db) => (
                    <div key={db.name}>
                      <div className="flex items-center justify-between">
                        <button
                          className="flex items-center gap-2 w-full text-sm text-left p-2 hover:bg-muted/50 rounded"
                          onClick={() => toggleDatabase(server, db.name)}
                        >
                          <Folder className="h-4 w-4" />
                          <span className="truncate">{db.name}</span>
                        </button>
                      </div>

                      {expandedDb[server.id] === db.name && (
                        <div className="pl-6 pt-1 pb-2 space-y-1">
                          {loadingCollections ? (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            collections.map((col) => (
                              <Button
                                key={col.name}
                                variant="ghost"
                                className="w-full justify-start text-sm h-8"
                                onClick={() =>
                                  handleCollectionClick(
                                    server.id,
                                    db.name,
                                    col.name
                                  )
                                }
                              >
                                <FileText className="h-3 w-3 mr-2" />
                                {col.name}
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {col.count}
                                </span>
                              </Button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}

      {contextMenu.visible && (
        <div
          className="absolute z-50 bg-popover rounded-md border border-border shadow-lg py-1 w-56"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm"
            onClick={() =>
              contextMenu.serverId && handleAddDatabase(contextMenu.serverId)
            }
          >
            Add Database
          </button>
          <button
            className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm"
            onClick={() =>
              contextMenu.serverId &&
              handleRefreshConnection(contextMenu.serverId)
            }
          >
            Refresh Connection
          </button>
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

      <Dialog
        open={createDbDialog.open}
        onOpenChange={(open) =>
          setCreateDbDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Database</DialogTitle>
            <DialogDescription>
              Enter a name for the new database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="database-name" className="text-right text-sm">
                Name
              </label>
              <Input
                id="database-name"
                value={createDbDialog.databaseName}
                onChange={(e) =>
                  setCreateDbDialog((prev) => ({
                    ...prev,
                    databaseName: e.target.value,
                  }))
                }
                className="col-span-3"
                placeholder="Enter database name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDatabase()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCreateDbDialog({
                  open: false,
                  serverId: null,
                  databaseName: '',
                })
              }
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateDatabase}
              disabled={!createDbDialog.databaseName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
