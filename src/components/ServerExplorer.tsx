'use client'

import {
  Server as ServerIcon,
  FileText,
  Loader2,
  MoreHorizontal,
  Database,
} from 'lucide-react'
import React, { useCallback, useState, useId } from 'react'
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
import { useContextMenu } from '@/hooks/useContextMenu'

export function ServerExplorer() {
  const { servers, activeServer, setActiveServer, removeServer, addTab } =
    useAppStore()
  const { toast } = useToast()

  const [expandedServerId, setExpandedServerId] = useState<string | null>(null)
  const [expandedDb, setExpandedDb] = useState<Record<string, string | null>>(
    {}
  )

  // context menus (server-level and database-level)
  const {
    state: contextMenu,
    open: openContextMenu,
    close: closeContextMenu,
  } = useContextMenu<{ serverId?: string }>()
  const {
    state: dbContextMenu,
    open: openDbContextMenu,
    close: closeDbContextMenu,
  } = useContextMenu<{ serverId?: string; databaseName?: string }>()

  const databaseNameInputId = useId()
  const collectionNameInputId = useId()

  // Create database dialog state
  const [createDbDialog, setCreateDbDialog] = useState<{
    open: boolean
    serverId: string | null
    databaseName: string
  }>({ open: false, serverId: null, databaseName: '' })

  // Create collection dialog state
  const [createCollectionDialog, setCreateCollectionDialog] = useState<{
    open: boolean
    serverId: string | null
    databaseName: string | null
    collectionName: string
  }>({ open: false, serverId: null, databaseName: null, collectionName: '' })

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

  // NOTE: resetting expanded state when servers list changes was removed
  // because it caused an unnecessary hook dependency warning. If a reset
  // is required when servers change, add explicit logic here that uses
  // `servers` so the dependency is intentional.

  // useContextMenu handles global click-to-close behavior

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

  // useContextMenu provides open/close helpers instead of manual positioning

  // db context menu is opened via the hook

  const handleAddDatabase = (serverId: string) => {
    closeContextMenu()
    setCreateDbDialog({ open: true, serverId, databaseName: '' })
  }

  const handleAddCollection = (serverId: string, databaseName: string) => {
    closeDbContextMenu()
    setCreateCollectionDialog({
      open: true,
      serverId,
      databaseName,
      collectionName: '',
    })
  }

  const handleDeleteCollection = async (
    serverId: string,
    databaseName: string
  ) => {
    closeDbContextMenu()

    const collectionName = window.prompt('Enter collection name to delete:')
    if (!collectionName?.trim()) return

    const server = servers.find((s) => s.id === serverId)
    if (!server) return

    try {
      const res = await fetch('/api/collections/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uri: server.uri,
          database: databaseName,
          collection: collectionName.trim(),
        }),
      })

      const body = await res.json()
      if (res.ok && body.success) {
        toast({ title: 'Success', description: 'Collection deleted' })
        // Refresh collections
        const server = servers.find((s) => s.id === serverId)
        if (server) {
          loadCollections(server, databaseName)
        }
      } else {
        toast({
          title: 'Error',
          description: body.error || 'Failed to delete collection',
          variant: 'destructive',
        })
      }
    } catch (_err) {
      toast({
        title: 'Error',
        description: 'Failed to delete collection',
        variant: 'destructive',
      })
    }
  }

  const handleCreateCollection = async () => {
    const { serverId, databaseName, collectionName } = createCollectionDialog
    if (!serverId || !databaseName || !collectionName.trim()) return

    const server = servers.find((s) => s.id === serverId)
    if (!server) return

    try {
      const res = await fetch('/api/collections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uri: server.uri,
          database: databaseName,
          collection: collectionName.trim(),
        }),
      })

      const body = await res.json()
      if (res.ok && body.success) {
        toast({ title: 'Success', description: 'Collection created' })
        setCreateCollectionDialog({
          open: false,
          serverId: null,
          databaseName: null,
          collectionName: '',
        })
        // Refresh collections
        loadCollections(server, databaseName)
      } else {
        toast({
          title: 'Error',
          description: body.error || 'Failed to create collection',
          variant: 'destructive',
        })
      }
    } catch (_err) {
      toast({
        title: 'Error',
        description: 'Failed to create collection',
        variant: 'destructive',
      })
    }
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
    } catch (_err) {
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
    closeContextMenu()
  }

  const handleDeleteConnection = (serverId: string) => {
    // remove from store
    removeServer(serverId)
    toast({ title: 'Deleted', description: 'Server connection removed' })
    closeContextMenu()
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
                  type="button"
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
                  onClick={(e) =>
                    openContextMenu(e as React.MouseEvent, {
                      width: 224,
                      height: 120,
                      data: { serverId: server.id },
                    })
                  }
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
                          type="button"
                          className="flex items-center gap-2 flex-1 text-sm text-left p-2 hover:bg-muted/50 rounded"
                          onClick={() => toggleDatabase(server, db.name)}
                        >
                          <Database className="h-4 w-4" />
                          <span className="truncate">{db.name}</span>
                        </button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                                    openDbContextMenu(e, {
                                      width: 224,
                                      height: 80,
                                      data: { serverId: server.id, databaseName: db.name },
                                    })
                                  }
                                >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
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
        // Use fixed positioning so the menu positions relative to the viewport
        // (prevents parent stacking/scroll offsets from pushing it away from the pointer)
        <div
          role="menu"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeContextMenu()
          }}
          className="fixed z-50 bg-popover rounded-md border border-border shadow-lg py-1 w-56"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm"
            onClick={() =>
              contextMenu.data?.serverId && handleAddDatabase(contextMenu.data.serverId)
            }
          >
            Add Database
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm"
            onClick={() =>
              contextMenu.data?.serverId &&
              handleRefreshConnection(contextMenu.data.serverId)
            }
          >
            Refresh Connection
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-destructive/10 text-sm text-destructive"
            onClick={() =>
              contextMenu.data?.serverId &&
              handleDeleteConnection(contextMenu.data.serverId)
            }
          >
            Delete Connection
          </button>
        </div>
      )}

      {dbContextMenu.visible && (
        <div
          role="menu"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeDbContextMenu()
          }}
          className="fixed z-50 bg-popover rounded-md border border-border shadow-lg py-1 w-56"
          style={{ left: dbContextMenu.x, top: dbContextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm"
            onClick={() =>
                dbContextMenu.data?.serverId &&
                dbContextMenu.data?.databaseName &&
                handleAddCollection(
                  dbContextMenu.data.serverId,
                  dbContextMenu.data.databaseName
                )
              }
          >
            Add Collection
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-destructive/10 text-sm text-destructive"
            onClick={() =>
              dbContextMenu.data?.serverId &&
              dbContextMenu.data?.databaseName &&
              handleDeleteCollection(
                dbContextMenu.data.serverId,
                dbContextMenu.data.databaseName
              )
            }
          >
            Delete Collection
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
              <label htmlFor={databaseNameInputId} className="text-right text-sm">
                Name
              </label>
              <Input
                id={databaseNameInputId}
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

      <Dialog
        open={createCollectionDialog.open}
        onOpenChange={(open) =>
          setCreateCollectionDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Enter a name for the new collection in database "
              {createCollectionDialog.databaseName}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={collectionNameInputId} className="text-right text-sm">
                Name
              </label>
              <Input
                id={collectionNameInputId}
                value={createCollectionDialog.collectionName}
                onChange={(e) =>
                  setCreateCollectionDialog((prev) => ({
                    ...prev,
                    collectionName: e.target.value,
                  }))
                }
                className="col-span-3"
                placeholder="Enter collection name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateCollection()
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
                setCreateCollectionDialog({
                  open: false,
                  serverId: null,
                  databaseName: null,
                  collectionName: '',
                })
              }
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCollection}
              disabled={!createCollectionDialog.collectionName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
