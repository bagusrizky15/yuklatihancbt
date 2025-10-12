"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onGoogleLogin: () => Promise<{ success: boolean; error?: string }>
}

const GoogleIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
    <title>Google</title>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.25 0 3.67.87 4.5 1.62l2.4-2.3c-1.48-1.34-3.56-2.18-5.9-2.18-5.01 0-9.09 4.08-9.09 9.09s4.08 9.09 9.09 9.09c2.83 0 5.1-1 6.7-2.6.97-1.02 1.6-2.3 1.88-3.96.13-.6.08-1.2.08-1.8H12.48z"
    />
  </svg>
)

export function LoginForm({ onLogin, onGoogleLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await onLogin(email, password)
      if (!result.success) {
        setError(result.error || "Login gagal")
      }
    } catch (err) {
      console.log("Login err", err)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Masuk</CardTitle>
        <CardDescription>Masuk ke akun Anda untuk melanjutkan latihan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Dialog>
              <DialogTrigger asChild>
                <Link href="#" className="text-primary hover:underline">
                  Lupa password?
                </Link>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Lupa Password</DialogTitle>
                  <DialogDescription>
                    Masukkan email Anda, dan kami akan mengirimkan tautan untuk mereset password Anda.
                  </DialogDescription>
                </DialogHeader>
                <Input type="email" placeholder="nama@email.com" className="my-4" />
                <DialogFooter>
                  <Button type="submit">Send Reset Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Daftar sekarang
            </Link>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">atau lanjutkan dengan</span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full" onClick={onGoogleLogin} disabled={isLoading}>
            <GoogleIcon />
            Masuk dengan Google
          </Button>
        </form>
      </CardContent>
    </Card>

  )
}
