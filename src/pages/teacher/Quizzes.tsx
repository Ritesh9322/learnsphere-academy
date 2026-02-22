import DashboardLayout from '@/components/layout/DashboardLayout';
import { ClipboardList, Plus, Eye, Edit3, Trash2, Clock, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quizzes = [
  { id: '1', title: 'JavaScript Fundamentals', course: 'Full Stack Web Dev', questions: 20, duration: 30, totalMarks: 100, attempts: 28, avgScore: 76, status: 'active' },
  { id: '2', title: 'React Hooks Assessment', course: 'Full Stack Web Dev', questions: 16, duration: 25, totalMarks: 80, attempts: 15, avgScore: 82, status: 'active' },
  { id: '3', title: 'Python & Pandas Basics', course: 'Data Science & ML', questions: 10, duration: 20, totalMarks: 50, attempts: 22, avgScore: 71, status: 'active' },
  { id: '4', title: 'Node.js Advanced', course: 'Full Stack Web Dev', questions: 25, duration: 40, totalMarks: 100, attempts: 0, avgScore: 0, status: 'draft' },
];

export default function TeacherQuizzes() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Quizzes</h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage quizzes for your courses</p>
          </div>
          <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-4 h-4 mr-2" />Create Quiz</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map(q => (
            <div key={q.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{q.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.course}</p>
                </div>
                <span className={q.status === 'active' ? 'badge-success' : 'badge-warning'}>{q.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1"><Target className="w-3 h-3" />Questions</div>
                  <div className="font-bold text-foreground">{q.questions}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1"><Clock className="w-3 h-3" />Duration</div>
                  <div className="font-bold text-foreground">{q.duration}m</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1"><Users className="w-3 h-3" />Attempts</div>
                  <div className="font-bold text-foreground">{q.attempts}</div>
                </div>
              </div>
              {q.avgScore > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Avg Score</span>
                    <span className="font-medium text-foreground">{q.avgScore}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${q.avgScore}%` }} /></div>
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs"><Eye className="w-3 h-3 mr-1" />View</Button>
                <Button size="sm" variant="outline" className="text-xs"><Edit3 className="w-3 h-3" /></Button>
                <Button size="sm" variant="outline" className="text-xs text-destructive hover:text-destructive"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
