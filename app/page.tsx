"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

interface AppUser {
  id: string
  name: string
  email: string
  role: string
}

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const testCategories = [
    {
      id: "verbal",
      title: "Tes Verbal",
      description: "Kemampuan bahasa dan pemahaman kata",
      questionCount: 25,
      duration: 30,
      difficulty: "Menengah",
      color: "bg-blue-500",
    },
    {
      id: "numerical",
      title: "Tes Numerik",
      description: "Kemampuan berhitung dan logika angka",
      questionCount: 20,
      duration: 25,
      difficulty: "Sulit",
      color: "bg-green-500",
    },
    {
      id: "logical",
      title: "Tes Logika",
      description: "Kemampuan berpikir logis dan pola",
      questionCount: 30,
      duration: 35,
      difficulty: "Menengah",
      color: "bg-purple-500",
    },
    {
      id: "spatial",
      title: "Tes Spasial",
      description: "Kemampuan visualisasi ruang",
      questionCount: 15,
      duration: 20,
      difficulty: "Mudah",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sikotest</h1>
              <p className="text-muted-foreground mt-1">Latihan Soal dibantu AI</p>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline">Masuk</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Daftar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Uji Kemampuan Sekarang!</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Buktikan kamu bisa tanpa AI. Gunakan AI untuk membantu menganalisis kemampuanmu.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>+100 Soal</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>1000+ Pengguna</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Terintegrasi dengan AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Test Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Coba Gratis Sekarang!</h3>
            <p className="text-muted-foreground">Pilih kategori tes yang ingin kamu coba</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testCategories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary">{category.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Jumlah Soal:</span>
                      <span className="font-medium">{category.questionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Durasi:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {category.duration} menit
                      </span>
                    </div>
                  </div>
                  <Link href={`/test/${category.id}`}>
                    <Button className="w-full mt-4" size="sm">
                      Mulai Tes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Fitur Unggulan Sikotest</h3>
            <p className="text-muted-foreground">Mengapa memilih kami?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Timer Otomatis</h4>
              <p className="text-muted-foreground">Simulasi kondisi tes sesungguhnya dengan timer yang akurat.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Analisis Hasil</h4>
              <p className="text-muted-foreground">Dapatkan analisis mendalam tentang kekuatan dan kelemahan Anda.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Bank Soal Lengkap</h4>
              <p className="text-muted-foreground">
                Soal akan terus diperbarui.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2025 Sikotest. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
