"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Share2,
  Home,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TestResults {
  testId: string
  answers: Record<string, any>
  score: number
  totalQuestions: number
  timeSpent: number
  categoryScores: Record<string, { correct: number; total: number }>
}

interface Question {
  id: string
  category: string
  type: "multiple-choice" | "true-false" | "essay"
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  difficulty: "easy" | "medium" | "hard"
}

// Mock questions for review
const mockQuestions: Record<string, Question[]> = {
  verbal: [
    {
      id: "1",
      category: "verbal",
      type: "multiple-choice",
      question: 'Sinonim dari kata "CERDAS" adalah...',
      options: ["Bodoh", "Pintar", "Malas", "Lambat"],
      correctAnswer: 1,
      explanation: "Cerdas memiliki arti yang sama dengan pintar",
      difficulty: "easy",
    },
    {
      id: "2",
      category: "verbal",
      type: "multiple-choice",
      question: 'Antonim dari kata "GELAP" adalah...',
      options: ["Terang", "Suram", "Redup", "Kabur"],
      correctAnswer: 0,
      explanation: "Gelap berlawanan dengan terang",
      difficulty: "easy",
    },
    {
      id: "3",
      category: "verbal",
      type: "multiple-choice",
      question: "Kata yang tidak termasuk dalam kelompok adalah...",
      options: ["Mobil", "Motor", "Sepeda", "Jalan"],
      correctAnswer: 3,
      explanation: "Jalan bukan kendaraan, sedangkan yang lain adalah kendaraan",
      difficulty: "medium",
    },
  ],
}

export default function ResultsPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    // Get results from localStorage
    const savedResults = localStorage.getItem("lastTestResults")
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults)
      setResults(parsedResults)

      // Get questions for this test
      const testQuestions = mockQuestions[parsedResults.testId] || []
      setQuestions(testQuestions)
    }
  }, [])

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Hasil Tidak Ditemukan</CardTitle>
            <CardDescription>Tidak ada hasil tes yang tersimpan. Silakan ambil tes terlebih dahulu.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} menit ${secs} detik`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Sangat Baik"
    if (score >= 80) return "Baik"
    if (score >= 70) return "Cukup Baik"
    if (score >= 60) return "Cukup"
    return "Perlu Perbaikan"
  }

  const getPerformanceInsights = () => {
    const insights = []

    if (results.score >= 80) {
      insights.push({
        type: "positive",
        message: "Performa Anda sangat baik! Pertahankan kemampuan ini.",
      })
    } else if (results.score >= 60) {
      insights.push({
        type: "neutral",
        message: "Performa Anda cukup baik, masih ada ruang untuk perbaikan.",
      })
    } else {
      insights.push({
        type: "negative",
        message: "Performa Anda perlu ditingkatkan. Perbanyak latihan.",
      })
    }

    // Category-specific insights
    Object.entries(results.categoryScores).forEach(([category, scores]) => {
      const percentage = (scores.correct / scores.total) * 100
      if (percentage < 50) {
        insights.push({
          type: "negative",
          message: `Fokus lebih pada kategori ${category.toUpperCase()} - tingkat keberhasilan ${percentage.toFixed(0)}%`,
        })
      } else if (percentage >= 80) {
        insights.push({
          type: "positive",
          message: `Sangat baik pada kategori ${category.toUpperCase()} - tingkat keberhasilan ${percentage.toFixed(0)}%`,
        })
      }
    })

    return insights
  }

  const insights = getPerformanceInsights()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hasil Tes Psikotest</h1>
              <p className="text-muted-foreground">Analisis lengkap performa Anda</p>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Unduh PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button> */}
              <Link href="/">
                <Button size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Beranda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className={cn("text-4xl font-bold", getScoreColor(results.score))}>{results.score}</div>
                      <div className="text-sm text-muted-foreground">dari 100</div>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-transparent"
                    style={{
                      background: `conic-gradient(hsl(var(--primary)) ${results.score * 3.6}deg, transparent 0deg)`,
                    }}
                  ></div>
                </div>
              </div>
              <CardTitle className="text-2xl">{getScoreLabel(results.score)}</CardTitle>
              <CardDescription>
                Anda menjawab {Object.values(results.categoryScores).reduce((acc, cat) => acc + cat.correct, 0)} dari{" "}
                {results.totalQuestions} soal dengan benar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waktu Pengerjaan</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(results.timeSpent)}</div>
              <p className="text-xs text-muted-foreground">Efisiensi waktu baik</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Akurasi</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (Object.values(results.categoryScores).reduce((acc, cat) => acc + cat.correct, 0) /
                    results.totalQuestions) *
                    100,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Jawaban benar</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="categories">Per Kategori</TabsTrigger>
            <TabsTrigger value="review">Review Soal</TabsTrigger>
            <TabsTrigger value="insights">Wawasan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performa per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results.categoryScores).map(([category, scores]) => {
                  const percentage = (scores.correct / scores.total) * 100
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {scores.correct}/{scores.total} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {Object.values(results.categoryScores).reduce((acc, cat) => acc + cat.correct, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Jawaban Benar</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {results.totalQuestions -
                          Object.values(results.categoryScores).reduce((acc, cat) => acc + cat.correct, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Jawaban Salah</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Trophy className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {results.score >= 80 ? "A" : results.score >= 70 ? "B" : results.score >= 60 ? "C" : "D"}
                      </div>
                      <div className="text-sm text-muted-foreground">Grade</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(results.categoryScores).map(([category, scores]) => {
                const percentage = (scores.correct / scores.total) * 100
                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="capitalize">{category}</CardTitle>
                      <CardDescription>
                        {scores.correct} dari {scores.total} soal dijawab benar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Tingkat Keberhasilan</span>
                          <Badge
                            variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"}
                          >
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={percentage} className="h-3" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Benar: {scores.correct}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span>Salah: {scores.total - scores.correct}</span>
                          </div>
                        </div>

                        {percentage >= 80 && (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>Performa sangat baik!</span>
                          </div>
                        )}
                        {percentage < 50 && (
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <TrendingDown className="w-4 h-4" />
                            <span>Perlu lebih banyak latihan</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Jawaban</CardTitle>
                <CardDescription>Tinjau kembali jawaban Anda dan pelajari penjelasannya</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = results.answers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                          )}
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {question.category.toUpperCase()}
                            </Badge>
                            <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
                              {isCorrect ? "Benar" : "Salah"}
                            </Badge>
                          </div>

                          <h4 className="font-medium">{question.question}</h4>

                          {question.options && (
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={cn(
                                    "p-2 rounded border text-sm",
                                    optIndex === question.correctAnswer && "bg-green-50 border-green-200",
                                    optIndex === userAnswer &&
                                      optIndex !== question.correctAnswer &&
                                      "bg-red-50 border-red-200",
                                    optIndex !== question.correctAnswer && optIndex !== userAnswer && "bg-gray-50",
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                    <span>{option}</span>
                                    {optIndex === question.correctAnswer && (
                                      <Badge className="ml-auto bg-green-500 text-xs">Jawaban Benar</Badge>
                                    )}
                                    {optIndex === userAnswer && optIndex !== question.correctAnswer && (
                                      <Badge variant="destructive" className="ml-auto text-xs">
                                        Jawaban Anda
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.explanation && (
                            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                              <p className="text-sm text-blue-800">
                                <strong>Penjelasan:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Wawasan & Rekomendasi
                </CardTitle>
                <CardDescription>Analisis mendalam tentang performa Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border-l-4",
                      insight.type === "positive" && "bg-green-50 border-green-400",
                      insight.type === "neutral" && "bg-yellow-50 border-yellow-400",
                      insight.type === "negative" && "bg-red-50 border-red-400",
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm",
                        insight.type === "positive" && "text-green-800",
                        insight.type === "neutral" && "text-yellow-800",
                        insight.type === "negative" && "text-red-800",
                      )}
                    >
                      {insight.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      Ambil Tes Lain
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent">
                    Lihat Statistik Historis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
