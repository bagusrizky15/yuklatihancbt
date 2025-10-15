"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const handleRegister = async (data: {
    name: string
    email: string
    password: string
  }) => {
    try {
      if (!API_URL) {
        console.error("API_URL is not defined. Please check your .env.local file.");
        return {
          success: false,
          error: "Konfigurasi server tidak ditemukan. Hubungi administrator.",
        };
      }

      // Kirim request ke backend Golang
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Parse response dari backend
      const result = await res.json();

      // Jika backend mengembalikan error
      if (!res.ok) {
        return { success: false, error: result.message || "Gagal membuat user" };
      }

      // Simpan data user (jika kamu mau simpan ke localStorage)
      const newUser = {
        name: data.name,
        email: data.email,
        role: "user",
      };

      localStorage.setItem("user", JSON.stringify(newUser));

      // Arahkan ke halaman utama
      router.push("/");

      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        error:
          "Tidak dapat terhubung ke server. Pastikan backend berjalan dan URL sudah benar.",
      };
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-6">
      <div className="hidden bg-muted lg:col-span-3 lg:flex lg:items-center lg:justify-center">
        <div className="text-center px-20">
          <h2 className="text-4xl font-bold text-foreground">
            Mulai Perjalanan Kamu Disini
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Daftar sekarang untuk mengakses ribuan soal latihan, menganalisis kemajuan,
            dan mendapatkan wawasan untuk meningkatkan skor Kamu.
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
