"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface TestInterfaceProps {
  testId: string
  questions: Question[]
  duration: number // in minutes
  onTestComplete: (results: TestResults) => void
}

interface TestResults {
  testId: string
  answers: Record<string, any>
  score: number
  totalQuestions: number
  timeSpent: number
  categoryScores: Record<string, { correct: number; total: number }>
}

export function TestInterface({ testId, questions, duration, onTestComplete }: TestInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(duration * 60) // convert to seconds
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (!isTestStarted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTestStarted, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const calculateResults = (): TestResults => {
    let correctAnswers = 0
    const categoryScores: Record<string, { correct: number; total: number }> = {}

    questions.forEach((question) => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      if (isCorrect) correctAnswers++

      // Track category scores
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { correct: 0, total: 0 }
      }
      categoryScores[question.category].total++
      if (isCorrect) {
        categoryScores[question.category].correct++
      }
    })

    return {
      testId,
      answers,
      score: Math.round((correctAnswers / questions.length) * 100),
      totalQuestions: questions.length,
      timeSpent: duration * 60 - timeLeft,
      categoryScores,
    }
  }

  const handleSubmitTest = () => {
    const results = calculateResults()
    onTestComplete(results)
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const isQuestionAnswered = (questionId: string) => {
    return answers.hasOwnProperty(questionId)
  }

  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Siap Memulai Tes?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{questions.length}</div>
                <div className="text-sm text-muted-foreground">Total Soal</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{duration}</div>
                <div className="text-sm text-muted-foreground">Menit</div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Pastikan koneksi internet stabil</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Siapkan alat tulis untuk coret-coretan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Pastikan tidak ada gangguan selama tes</span>
              </div>
            </div>

            <Button onClick={() => setIsTestStarted(true)} className="w-full" size="lg">
              Mulai Tes Sekarang
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full" size="lg">
              Batal
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Tes Psikotest</h1>
              <Badge variant="outline">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span
                  className={cn(
                    "font-mono font-medium",
                    timeLeft < 300 && "text-red-500", // 5 minutes warning
                  )}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowConfirmSubmit(true)}>
                Selesai Tes
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Progress: {Math.round(progress)}%</span>
              <span>
                Terjawab: {getAnsweredCount()}/{questions.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigasi Soal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question, index) => (
                    <Button
                      key={question.id}
                      variant={currentQuestionIndex === index ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "relative",
                        isQuestionAnswered(question.id) &&
                          currentQuestionIndex !== index &&
                          "bg-green-50 border-green-200",
                        flaggedQuestions.has(question.id) && "ring-2 ring-yellow-400",
                      )}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                      {flaggedQuestions.has(question.id) && (
                        <Flag className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
                      )}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Soal aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                    <span>Sudah dijawab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-yellow-400 rounded"></div>
                    <span>Ditandai</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{currentQuestion.category.toUpperCase()}</Badge>
                      <Badge variant="secondary">
                        {currentQuestion.difficulty === "easy"
                          ? "Mudah"
                          : currentQuestion.difficulty === "medium"
                            ? "Menengah"
                            : "Sulit"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFlagQuestion(currentQuestion.id)}
                    className={cn(flaggedQuestions.has(currentQuestion.id) && "bg-yellow-50 border-yellow-300")}
                  >
                    <Flag
                      className={cn(
                        "w-4 h-4",
                        flaggedQuestions.has(currentQuestion.id) ? "text-yellow-500 fill-yellow-500" : "",
                      )}
                    />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          answers[currentQuestion.id] === index && "bg-primary/10 border-primary",
                        )}
                        onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                              answers[currentQuestion.id] === index
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-muted-foreground",
                            )}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "true-false" && (
                  <div className="space-y-3">
                    {["Benar", "Salah"].map((option, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          answers[currentQuestion.id] === index && "bg-primary/10 border-primary",
                        )}
                        onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                              answers[currentQuestion.id] === index
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-muted-foreground",
                            )}
                          >
                            {index === 0 ? "B" : "S"}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>

              <Button
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Konfirmasi Selesai Tes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Apakah Anda yakin ingin menyelesaikan tes? Anda telah menjawab {getAnsweredCount()} dari{" "}
                {questions.length} soal.
              </p>

              {getAnsweredCount() < questions.length && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    Masih ada {questions.length - getAnsweredCount()} soal yang belum dijawab.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSubmitTest} className="flex-1">
                  Ya, Selesai Tes
                </Button>
                <Button variant="outline" onClick={() => setShowConfirmSubmit(false)} className="flex-1">
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
