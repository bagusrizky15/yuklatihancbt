"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const handleRegister = async (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    // Mock registration - in real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

    // Mock validation
    const existingUsers = ["admin@test.com", "user@test.com"]
    if (existingUsers.includes(data.email)) {
      return { success: false, error: "Email sudah terdaftar" }
    }

    // Mock successful registration
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: "user",
    }

    localStorage.setItem("user", JSON.stringify(newUser))
    router.push("/")
    return { success: true }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">CBT Psikotest</h1>
          <p className="text-muted-foreground">Platform latihan soal psikotest online</p>
        </div>
        <RegisterForm onRegister={handleRegister} />
      </div>
    </div>
  )
}
