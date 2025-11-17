'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const createAdminAccount = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/auth/seed-admin', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          type: 'success',
          message: data.message,
        })
      } else {
        setResult({
          type: 'error',
          message: data.error || 'Failed to create admin account',
        })
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Network error. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Account Setup</CardTitle>
          <CardDescription>
            Create the system administrator account for Zawr Industries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p className="font-medium">Admin Credentials:</p>
            <div className="bg-muted p-3 rounded-lg space-y-1">
              <p>
                <span className="text-muted-foreground">Email:</span>{' '}
                <span className="font-mono">admin@zawrindustries.com</span>
              </p>
              <p>
                <span className="text-muted-foreground">Password:</span>{' '}
                <span className="font-mono">Zawr@2009$$</span>
              </p>
            </div>
          </div>

          {result && (
            <Alert variant={result.type === 'success' ? 'default' : 'destructive'}>
              {result.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={createAdminAccount}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Admin Account...
              </>
            ) : (
              'Create Admin Account'
            )}
          </Button>

          {result?.type === 'success' && (
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              Go to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
