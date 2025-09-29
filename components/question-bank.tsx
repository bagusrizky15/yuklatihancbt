"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"

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

export function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([
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
      category: "numerical",
      type: "multiple-choice",
      question: "Hasil dari 15 + 25 × 2 adalah...",
      options: ["80", "65", "55", "50"],
      correctAnswer: 1,
      explanation: "Menggunakan aturan operasi matematika: 15 + (25 × 2) = 15 + 50 = 65",
      difficulty: "medium",
    },
  ])

  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    category: "verbal",
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    difficulty: "medium",
  })

  const categories = [
    { value: "verbal", label: "Tes Verbal" },
    { value: "numerical", label: "Tes Numerik" },
    { value: "logical", label: "Tes Logika" },
    { value: "spatial", label: "Tes Spasial" },
  ]

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || q.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.options?.every((opt) => opt.trim())) {
      const question: Question = {
        id: Date.now().toString(),
        category: newQuestion.category!,
        type: newQuestion.type!,
        question: newQuestion.question,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer!,
        explanation: newQuestion.explanation,
        difficulty: newQuestion.difficulty!,
      }
      setQuestions([...questions, question])
      setNewQuestion({
        category: "verbal",
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        difficulty: "medium",
      })
      setIsAddingQuestion(false)
    }
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Mudah"
      case "medium":
        return "Menengah"
      case "hard":
        return "Sulit"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bank Soal</h2>
          <p className="text-muted-foreground">Kelola soal-soal psikotest</p>
        </div>
        <Button onClick={() => setIsAddingQuestion(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Soal
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari soal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add Question Form */}
      {isAddingQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Soal Baru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={newQuestion.category}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                <Select
                  value={newQuestion.difficulty}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Mudah</SelectItem>
                    <SelectItem value="medium">Menengah</SelectItem>
                    <SelectItem value="hard">Sulit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="question">Pertanyaan</Label>
              <Textarea
                id="question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Masukkan pertanyaan..."
              />
            </div>

            <div>
              <Label>Pilihan Jawaban</Label>
              <div className="space-y-2">
                {newQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(newQuestion.options || [])]
                        newOptions[index] = e.target.value
                        setNewQuestion({ ...newQuestion, options: newOptions })
                      }}
                      placeholder={`Pilihan ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                    >
                      {newQuestion.correctAnswer === index ? "Benar" : "Pilih"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="explanation">Penjelasan (Opsional)</Label>
              <Textarea
                id="explanation"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Penjelasan jawaban..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddQuestion}>Simpan Soal</Button>
              <Button variant="outline" onClick={() => setIsAddingQuestion(false)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{categories.find((c) => c.value === question.category)?.label}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {getDifficultyLabel(question.difficulty)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border ${
                      question.correctAnswer === index ? "bg-green-50 border-green-200 text-green-800" : "bg-gray-50"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                    {question.correctAnswer === index && <Badge className="ml-2 bg-green-500">Jawaban Benar</Badge>}
                  </div>
                ))}
              </div>
              {question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <strong>Penjelasan:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada soal yang ditemukan</p>
        </div>
      )}
    </div>
  )
}
