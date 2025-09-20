'use client'

import { Database, FileText, Loader2, MoreHorizontal } from 'lucide-react'
import { useCallback, useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
// Context menu primitives were replaced by a small hook; keep the UI primitives
// import commented out in case we need to revert. (Removed because unused)
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
import {
  useListCollections,
  useListDatabases,
  useDeleteDatabase,
  useRenameDatabase,
  useCreateCollection,
} from '@/hooks/useApi'
import { type Server, useAppStore } from '@/lib/store'
import { CollectionViewer } from './CollectionViewer'
import { useContextMenu } from '@/hooks/useContextMenu'

interface DatabaseExplorerProps {
  server: Server
}

export function DatabaseExplorer({ server }: DatabaseExplorerProps) {
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null)
  const [createCollectionDialog, setCreateCollectionDialog] = useState<{
    open: boolean
    database: string
  }>({ open: false, database: '' })
  const [renameDatabaseDialog, setRenameDatabaseDialog] = useState<{
    open: boolean
    database: string
  }>({ open: false, database: '' })
  const [deleteDatabaseDialog, setDeleteDatabaseDialog] = useState<{
    open: boolean
    database: string
  }>({ open: false, database: '' })
  const [collectionName, setCollectionName] = useState('')
  const [newDatabaseName, setNewDatabaseName] = useState('')
  const collectionId = useId()
  const databaseId = useId()

  const { addTab } = useAppStore()
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
  const { createCollection } = useCreateCollection()
  const { deleteDatabase } = useDeleteDatabase()
  const { renameDatabase } = useRenameDatabase()
  const { toast } = useToast()

  const loadDatabases = useCallback(async () => {
    try {
      await listDatabases(server.uri)
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to load databases',
        variant: 'destructive',
      })
    }
  }, [listDatabases, server.uri, toast])

  const loadCollections = useCallback(async () => {
    if (!selectedDatabase) return

    try {
      await listCollections(server.uri, selectedDatabase)
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to load collections',
        variant: 'destructive',
      })
    }
  }, [listCollections, selectedDatabase, server.uri, toast])

  useEffect(() => {
    loadDatabases()
  }, [loadDatabases])

  useEffect(() => {
    if (selectedDatabase) {
      loadCollections()
    }
  }, [selectedDatabase, loadCollections])

  const handleCollectionClick = (collection: string) => {
    if (selectedDatabase) {
      addTab(server.id, selectedDatabase, collection)
    }
  }

  const {
    state: contextMenu,
    open: openContextMenu,
    close: closeContextMenu,
  } = useContextMenu<{ database?: string }>()

  const handleCreateCollection = useCallback(
    async (database: string, collectionName: string) => {
      try {
        await createCollection(server.uri, database, collectionName)
        toast({
          title: 'Success',
          description: `Collection "${collectionName}" created successfully`,
        })
        // Refresh collections if the current database is selected
        if (selectedDatabase === database) {
          await listCollections(server.uri, database)
        }
        setCreateCollectionDialog({ open: false, database: '' })
      } catch (_error) {
        toast({
          title: 'Error',
          description: 'Failed to create collection',
          variant: 'destructive',
        })
      }
    },
    [createCollection, server.uri, selectedDatabase, listCollections, toast]
  )

  const handleRenameDatabase = useCallback(
    async (oldName: string, newName: string) => {
      try {
        await renameDatabase(server.uri, oldName, newName)
        toast({
          title: 'Success',
          description: `Database renamed from "${oldName}" to "${newName}"`,
        })
        // Refresh databases list
        await listDatabases(server.uri)
        // Update selected database if it was renamed
        if (selectedDatabase === oldName) {
          setSelectedDatabase(newName)
        }
        setRenameDatabaseDialog({ open: false, database: '' })
      } catch (_error) {
        toast({
          title: 'Error',
          description: 'Failed to rename database',
          variant: 'destructive',
        })
      }
    },
    [renameDatabase, server.uri, listDatabases, selectedDatabase, toast]
  )

  const handleDeleteDatabase = useCallback(
    async (database: string) => {
      try {
        await deleteDatabase(server.uri, database)
        toast({
          title: 'Success',
          description: `Database "${database}" deleted successfully`,
        })
        // Refresh databases list
        await listDatabases(server.uri)
        // Clear selection if deleted database was selected
        if (selectedDatabase === database) {
          setSelectedDatabase(null)
        }
        setDeleteDatabaseDialog({ open: false, database: '' })
      } catch (_error) {
        toast({
          title: 'Error',
          description: 'Failed to delete database',
          variant: 'destructive',
        })
      }
    },
    [deleteDatabase, server.uri, listDatabases, selectedDatabase, toast]
  )

  return (
    <div className="flex h-full">
      {/* Database/Collection Browser */}
      <div className="w-80 border-r border-border bg-card p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <h2 className="font-semibold">Databases</h2>
          </div>

          {loadingDatabases ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {databases.map((db) => (
                <div key={db.name} className="relative">
                  <Card
                    className={`cursor-pointer transition-colors ${
                      selectedDatabase === db.name
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedDatabase(db.name)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          {db.name}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e: React.MouseEvent<HTMLElement>) =>
                            openContextMenu(e, {
                              width: 224,
                              height: 120,
                              data: { database: db.name },
                            })
                          }
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {contextMenu.visible && (
            <div
              role="menu"
              tabIndex={-1}
              onKeyDown={(e) => {
                // close on Escape
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
                className="w-full text-left px-3 py-2 hover:bg-accent/10 text-sm"
                onClick={() => {
                  setCreateCollectionDialog({
                    open: true,
                    database: contextMenu.data?.database || '',
                  })
                  closeContextMenu()
                }}
              >
                Create Collection
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-muted/10 text-sm"
                onClick={() => {
                  setRenameDatabaseDialog({
                    open: true,
                    database: contextMenu.data?.database || '',
                  })
                  closeContextMenu()
                }}
              >
                Rename Database
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-destructive/10 text-sm text-destructive"
                onClick={() => {
                  setDeleteDatabaseDialog({
                    open: true,
                    database: contextMenu.data?.database || '',
                  })
                  closeContextMenu()
                }}
              >
                Delete Database
              </button>
            </div>
          )}

          {selectedDatabase && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                <h3 className="font-medium text-sm">Collections</h3>
              </div>

              {loadingCollections ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="space-y-1">
                  {collections.map((collection) => (
                    <Button
                      key={collection.name}
                      variant="ghost"
                      className="w-full justify-start text-sm h-8"
                      onClick={() => handleCollectionClick(collection.name)}
                    >
                      <FileText className="h-3 w-3 mr-2" />
                      {collection.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {collection.count}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collection Viewer Tabs */}
      <div className="flex-1">
        <CollectionViewer />
      </div>

      {/* Create Collection Dialog */}
      <Dialog
        open={createCollectionDialog.open}
        onOpenChange={(open) =>
          setCreateCollectionDialog({
            open,
            database: createCollectionDialog.database,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Enter the name for the new collection in database "
              {createCollectionDialog.database}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={collectionId} className="text-right">
                Name
              </label>
              <Input
                id={collectionId}
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="col-span-3"
                placeholder="Enter collection name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (collectionName.trim()) {
                  handleCreateCollection(
                    createCollectionDialog.database,
                    collectionName.trim()
                  )
                  setCollectionName('')
                }
              }}
              disabled={!collectionName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Database Dialog */}
      <Dialog
        open={renameDatabaseDialog.open}
        onOpenChange={(open) =>
          setRenameDatabaseDialog({
            open,
            database: renameDatabaseDialog.database,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Database</DialogTitle>
            <DialogDescription>
              Enter the new name for database "{renameDatabaseDialog.database}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={databaseId} className="text-right">
                Name
              </label>
              <Input
                id={databaseId}
                value={newDatabaseName}
                onChange={(e) => setNewDatabaseName(e.target.value)}
                className="col-span-3"
                placeholder="Enter new database name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (newDatabaseName.trim()) {
                  handleRenameDatabase(
                    renameDatabaseDialog.database,
                    newDatabaseName.trim()
                  )
                  setNewDatabaseName('')
                }
              }}
              disabled={!newDatabaseName.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Database Dialog */}
      <Dialog
        open={deleteDatabaseDialog.open}
        onOpenChange={(open) =>
          setDeleteDatabaseDialog({
            open,
            database: deleteDatabaseDialog.database,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Database</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete database "
              {deleteDatabaseDialog.database}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDatabaseDialog({ open: false, database: '' })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                handleDeleteDatabase(deleteDatabaseDialog.database)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
