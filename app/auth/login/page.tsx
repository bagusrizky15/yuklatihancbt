"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await res.json()

      if (!res.ok) {
        return {
          success: false,
          error: result.message || "Email atau password salah",
        }
      }

      if (result.message && result.token) {
        localStorage.setItem("message", result.message)
        localStorage.setItem("token", result.token)
        router.push("/")
        return { success: true }
      }

      return { success: false, error: "Respons dari server tidak valid" }
    } catch (error) {
      console.error("error:", error)
      return {
        success: false,
        error: "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
      }
    }
  }

  const handleGoogleLogin = async () => {
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
            <h1 className="text-3xl font-bold">Sikotest</h1>
            <p className="text-balance text-muted-foreground">Masuk untuk melanjutkan</p>
          </div>
          <LoginForm onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
        </div>
      </div>
    </div>
  )
}
