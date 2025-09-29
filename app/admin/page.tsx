import { QuestionBank } from "@/components/question-bank"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Kelola soal dan pengaturan sistem</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <QuestionBank />
      </main>
    </div>
  )
}
