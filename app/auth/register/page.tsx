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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-6">
      <div className="hidden bg-muted lg:col-span-3 lg:flex lg:items-center lg:justify-center">
        <div className="text-center px-20">
          <h2 className="text-4xl font-bold text-foreground">
            Mulai Perjalanan Anda Menuju Sukses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Daftar sekarang untuk mengakses ribuan soal latihan, melacak kemajuan,
            dan mendapatkan wawasan untuk meningkatkan skor psikotest Anda.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 lg:col-span-3 min-h-screen">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
            <p className="text-balance text-muted-foreground">Isi form di bawah untuk mendaftar</p>
          </div>
          <RegisterForm onRegister={handleRegister} />
        </div>
      </div>
    </div>
  )
}
