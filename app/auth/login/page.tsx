"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    // Mock validation
    if (email === "admin@test.com" && password === "admin123") {
      // Store user session in localStorage (in real app, use proper session management)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: "Admin User",
          email: email,
          role: "admin",
        }),
      )
      router.push("/dashboard")
      return { success: true }
    } else if (email.includes("@") && password.length >= 6) {
      // Mock successful login for any valid email/password
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "2",
          name: "Test User",
          email: email,
          role: "user",
        }),
      )
      router.push("/")
      return { success: true }
    } else {
      return { success: false, error: "Email atau password salah" }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">CBT Psikotest</h1>
          <p className="text-muted-foreground">Platform latihan soal psikotest online</p>
        </div>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  )
}
