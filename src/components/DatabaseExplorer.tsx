'use client'

import { Database, FileText, Folder, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useListCollections, useListDatabases } from '@/hooks/useApi'
import { type Server, useAppStore } from '@/lib/store'
import { CollectionViewer } from './CollectionViewer'

interface DatabaseExplorerProps {
  server: Server
}

export function DatabaseExplorer({ server }: DatabaseExplorerProps) {
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null)
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
                <Card
                  key={db.name}
                  className={`cursor-pointer transition-colors ${
                    selectedDatabase === db.name
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedDatabase(db.name)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      {db.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
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
    </div>
  )
}
