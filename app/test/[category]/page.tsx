"use client"

import { useState } from "react"
import { TestInterface } from "@/components/test-interface"
import { useRouter } from "next/navigation"

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

// Mock questions data
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
  numerical: [
    {
      id: "4",
      category: "numerical",
      type: "multiple-choice",
      question: "Hasil dari 15 + 25 × 2 adalah...",
      options: ["80", "65", "55", "50"],
      correctAnswer: 1,
      explanation: "Menggunakan aturan operasi matematika: 15 + (25 × 2) = 15 + 50 = 65",
      difficulty: "medium",
    },
    {
      id: "5",
      category: "numerical",
      type: "multiple-choice",
      question: "Jika x = 3, maka nilai dari 2x² + 5x - 1 adalah...",
      options: ["32", "28", "24", "20"],
      correctAnswer: 0,
      explanation: "2(3)² + 5(3) - 1 = 2(9) + 15 - 1 = 18 + 15 - 1 = 32",
      difficulty: "hard",
    },
  ],
  logical: [
    {
      id: "6",
      category: "logical",
      type: "multiple-choice",
      question: "Deret angka: 2, 4, 8, 16, ... Angka selanjutnya adalah...",
      options: ["24", "32", "28", "20"],
      correctAnswer: 1,
      explanation: "Pola: setiap angka dikali 2. Jadi 16 × 2 = 32",
      difficulty: "medium",
    },
  ],
  spatial: [
    {
      id: "7",
      category: "spatial",
      type: "multiple-choice",
      question: "Jika kubus diputar 90° searah jarum jam, sisi mana yang akan berada di depan?",
      options: ["Sisi A", "Sisi B", "Sisi C", "Sisi D"],
      correctAnswer: 2,
      explanation: "Setelah rotasi 90°, sisi C akan berada di posisi depan",
      difficulty: "hard",
    },
  ],
}

export default function TestPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const [testResults, setTestResults] = useState(null)

  const questions = mockQuestions[params.category] || []
  const duration = 30 // 30 minutes

  const handleTestComplete = (results: any) => {
    setTestResults(results)
    // Store results in localStorage for now
    localStorage.setItem("lastTestResults", JSON.stringify(results))
    // Redirect to results page
    router.push("/results")
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kategori Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-4">Kategori tes "{params.category}" tidak tersedia.</p>
          <button onClick={() => router.push("/")} className="text-primary hover:underline">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <TestInterface
      testId={params.category}
      questions={questions}
      duration={duration}
      onTestComplete={handleTestComplete}
    />
  )
}
