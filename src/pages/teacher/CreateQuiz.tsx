import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save, Loader2, ArrowLeft } from 'lucide-react';

interface QuestionForm {
  text: string;
  options: string[];
  correct: number;
  marks: number;
}

interface CourseOption { id: string; title: string; }

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [form, setForm] = useState({ title: '', course_id: '', duration: 30 });
  const [questions, setQuestions] = useState<QuestionForm[]>([]);

  useEffect(() => {
    supabase.from('courses').select('id, title').then(({ data }) => { if (data) setCourses(data); });
  }, []);

  const addQuestion = () => setQuestions(prev => [...prev, { text: '', options: ['', '', '', ''], correct: 0, marks: 5 }]);
  const removeQuestion = (i: number) => setQuestions(prev => prev.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, field: string, value: any) => {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  };
  const updateOption = (qi: number, oi: number, value: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, j) => j === oi ? value : o) } : q));
  };

  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);

  const handleSave = async () => {
    if (!form.title.trim() || !form.course_id) { toast({ title: 'Title and Course are required', variant: 'destructive' }); return; }
    if (questions.length === 0) { toast({ title: 'Add at least one question', variant: 'destructive' }); return; }
    setSaving(true);
    const { error } = await supabase.from('quizzes').insert({
      title: form.title,
      course_id: form.course_id,
      duration: form.duration,
      total_marks: totalMarks,
      questions: questions as any,
    });
    setSaving(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Quiz created!' });
    navigate(`/${user?.role}/quizzes`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Create Quiz</h1>
            <p className="text-muted-foreground text-sm mt-1">Build a quiz with multiple choice questions</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground">Quiz Details</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3"><Label>Quiz Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. JavaScript Fundamentals" className="mt-1.5" /></div>
            <div>
              <Label>Course *</Label>
              <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div><Label>Duration (min)</Label><Input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="mt-1.5" /></div>
            <div><Label>Total Marks</Label><Input value={totalMarks} disabled className="mt-1.5 bg-muted" /></div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground">Questions ({questions.length})</h2>
            <Button onClick={addQuestion} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />Add Question</Button>
          </div>

          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No questions yet. Click "Add Question" to start.</p>
          )}

          {questions.map((q, qi) => (
            <div key={qi} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Q{qi + 1}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">Marks:</Label>
                    <Input type="number" value={q.marks} onChange={e => updateQuestion(qi, 'marks', Number(e.target.value))} className="w-16 h-7 text-xs" />
                  </div>
                  <button onClick={() => removeQuestion(qi)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div><Label className="text-xs">Question Text</Label><Input value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} placeholder="Enter question..." className="mt-1" /></div>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" name={`q${qi}-correct`} checked={q.correct === oi} onChange={() => updateQuestion(qi, 'correct', oi)} className="accent-primary" />
                    <Input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} className="flex-1" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">Select the radio button next to the correct answer</p>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving} style={{ background: 'var(--gradient-primary)' }} className="font-semibold w-full">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Quiz
        </Button>
      </div>
    </DashboardLayout>
  );
}
