'use client'

import { Database, Monitor, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useCheckServer } from '@/hooks/useApi'
import { useAppStore } from '@/lib/store'
import { ServerExplorer } from './ServerExplorer'
import { CollectionViewer } from './CollectionViewer'
import { ThemeToggle } from './ThemeToggle'

export function MongoDBWeb() {
  const [connectionUri, setConnectionUri] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { activeServer, addServer, servers } = useAppStore()
  const { checkServer, loading } = useCheckServer()
  const { toast } = useToast()

  const handleAddServer = async () => {
    const trimmedUri = connectionUri.trim()

    // Basic validation
    if (!trimmedUri) {
      toast({
        title: 'Error',
        description: 'Please enter a MongoDB connection URI',
        variant: 'destructive',
      })
      return
    }

    // Basic URL format validation
    if (
      !trimmedUri.startsWith('mongodb://') &&
      !trimmedUri.startsWith('mongodb+srv://')
    ) {
      toast({
        title: 'Invalid URI Format',
        description: 'MongoDB URI must start with mongodb:// or mongodb+srv://',
        variant: 'destructive',
      })
      return
    }

    // Check for duplicate URIs
    const isDuplicate = servers.some((server) => server.uri === trimmedUri)
    if (isDuplicate) {
      toast({
        title: 'Duplicate Server',
        description: 'This MongoDB server is already added',
        variant: 'destructive',
      })
      return
    }

    try {
      // call checkServer and inspect response directly
      const res = await checkServer(trimmedUri)

      // res may be undefined or null if execute returned null
      if (!res) {
        toast({
          title: 'Connection Failed',
          description: 'No response from server',
          variant: 'destructive',
        })
        return
      }

      if (!res.success) {
        toast({
          title: 'Connection Failed',
          description: res.error || 'Unable to connect to the MongoDB server',
          variant: 'destructive',
        })
        return
      }

      // Success - add the server
      addServer(trimmedUri)
      setConnectionUri('')
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Server connection added successfully',
      })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to connect to the MongoDB server'
      toast({
        title: 'Connection Failed',
        description: message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              <h1 className="text-xl font-semibold">MongoDB Web</h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Add Server Dialog */}
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (open) {
                setConnectionUri('') // Reset URI when dialog opens
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full mb-4" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Server
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add MongoDB Server</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="mongodb://localhost:27017"
                  value={connectionUri}
                  onChange={(e) => setConnectionUri(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddServer()}
                />
                <Button
                  onClick={handleAddServer}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Merged Server + Database Explorer */}
          <ServerExplorer />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeServer ? (
          // Show only the collection viewer tabs in the main area; ServerExplorer handles the sidebar browsing
          <CollectionViewer />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="w-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Welcome to MongoDB Web
                </CardTitle>
                <CardDescription>
                  Connect to a MongoDB server to start managing your databases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click "Add Server" in the sidebar to get started.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
