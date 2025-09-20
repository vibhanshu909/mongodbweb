'use client'

import { FileText, Loader2, Plus, Search, X } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useQueryDocuments } from '@/hooks/useApi'
import { useAppStore } from '@/lib/store'

export function CollectionViewer() {
  const { tabs, activeTabId, setActiveTab, removeTab, servers } = useAppStore()
  const { data: documents, loading, queryDocuments } = useQueryDocuments()
  const { toast } = useToast()

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  useEffect(() => {
    if (!activeTab) return

    const server = servers.find((s) => s.id === activeTab.server)
    if (!server) return

    queryDocuments(server.uri, activeTab.database, activeTab.collection, {
      query: {},
      limit: 50,
      skip: 0,
    }).catch(() =>
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      })
    )
  }, [activeTab, servers, queryDocuments, toast])

  if (tabs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              No Collections Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select a collection from the database explorer to view documents.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Tabs value={activeTabId || ''} onValueChange={setActiveTab}>
        <div className="border-b border-border bg-background">
          <TabsList className="h-auto p-1">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center">
                <TabsTrigger
                  value={tab.id}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <FileText className="h-3 w-3" />
                  {tab.collection}
                  <span className="text-xs text-muted-foreground">
                    ({tab.database})
                  </span>
                </TabsTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTab(tab.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="h-full mt-0">
            <div className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{tab.collection}</h2>
                  <p className="text-sm text-muted-foreground">
                    {tab.database} • {documents.length} documents
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Query
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Textarea
                      className="min-h-96 font-mono text-sm border-0 resize-none"
                      value={JSON.stringify(documents, null, 2)}
                      readOnly
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
