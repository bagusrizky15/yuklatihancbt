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

  const handleGoogleLogin = async () => {
    // Mock Google authentication
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "3",
        name: "Google User",
        email: "google.user@example.com",
        role: "user",
      }),
    )
    router.push("/")
    return { success: true }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-6">
      <div className="hidden bg-muted lg:col-span-3 lg:flex lg:items-center lg:justify-center">
        <div className="text-center px-20">
          <h2 className="text-4xl font-bold text-foreground">
            Tingkatkan Peluang Karir Anda
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Latih kemampuan psikotest Anda dengan ribuan soal terstandarisasi dan
            dapatkan analisis mendalam untuk persiapan tes kerja atau seleksi
            masuk.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 lg:col-span-3 min-h-screen">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">CBT Psikotest</h1>
            <p className="text-balance text-muted-foreground">Masuk untuk melanjutkan</p>
          </div>
          <LoginForm onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
        </div>
      </div>
    </div>
  )
}
