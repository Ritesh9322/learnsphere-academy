import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Loader2, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Question {
  text: string;
  options: string[];
  correct: number;
  marks: number;
  image_url?: string;
}

export default function QuizTake() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; correct: number; wrong: number } | null>(null);
  const [existingAttempt, setExistingAttempt] = useState<any>(null);

  useEffect(() => {
    if (!quizId || !user) return;
    const load = async () => {
      setLoading(true);
      const [qRes, aRes] = await Promise.all([
        supabase.from('quizzes').select('*, courses(title)').eq('id', quizId).single(),
        supabase.from('quiz_attempts').select('*').eq('quiz_id', quizId).eq('student_id', user.id).maybeSingle(),
      ]);
      if (qRes.data) {
        setQuiz(qRes.data);
        const qs = Array.isArray(qRes.data.questions) ? qRes.data.questions as Question[] : [];
        setQuestions(qs);
        setTimeLeft((qRes.data.duration || 30) * 60);
      }
      if (aRes.data) {
        setExistingAttempt(aRes.data);
        setSubmitted(true);
        // Calculate result from existing attempt
        const qs = Array.isArray(qRes.data?.questions) ? qRes.data.questions as Question[] : [];
        const savedAnswers = (aRes.data.answers as Record<string, number>) || {};
        let correct = 0, total = 0;
        qs.forEach((q, i) => {
          total += q.marks;
          if (savedAnswers[String(i)] === q.correct) correct += q.marks;
        });
        setResult({ score: aRes.data.score || correct, total, correct: qs.filter((q, i) => savedAnswers[String(i)] === q.correct).length, wrong: qs.filter((q, i) => savedAnswers[String(i)] !== undefined && savedAnswers[String(i)] !== q.correct).length });
        setAnswers(Object.fromEntries(Object.entries(savedAnswers).map(([k, v]) => [Number(k), v as number])));
      }
      setLoading(false);
    };
    load();
  }, [quizId, user]);

  // Timer
  useEffect(() => {
    if (!started || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted]);

  const handleSubmit = useCallback(async () => {
    if (submitted || !user || !quizId) return;
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) { score += q.marks; correctCount++; }
      else if (answers[i] !== undefined) wrongCount++;
    });
    const total = questions.reduce((s, q) => s + q.marks, 0);

    await supabase.from('quiz_attempts').insert({
      quiz_id: quizId,
      student_id: user.id,
      score,
      answers: answers as any,
    });

    setResult({ score, total, correct: correctCount, wrong: wrongCount });
    setSubmitted(true);
    toast({ title: 'Quiz submitted!' });
  }, [answers, questions, submitted, user, quizId]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;
  if (!quiz) return <DashboardLayout><div className="text-center py-20 text-muted-foreground">Quiz not found.</div></DashboardLayout>;

  // Result screen
  if (submitted && result) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/student/quizzes')} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-display font-bold text-foreground">Quiz Results</h1>
          </div>

          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: result.score >= result.total * 0.5 ? 'var(--gradient-success)' : 'hsl(var(--destructive)/0.15)' }}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-1">{result.score}/{result.total}</h2>
            <p className="text-muted-foreground mb-6">{Math.round((result.score / result.total) * 100)}% Score</p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold" style={{ color: 'hsl(var(--success))' }}>{result.correct}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold" style={{ color: 'hsl(var(--destructive))' }}>{result.wrong}</div>
                <div className="text-xs text-muted-foreground">Wrong</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-muted-foreground">{questions.length - result.correct - result.wrong}</div>
                <div className="text-xs text-muted-foreground">Skipped</div>
              </div>
            </div>
          </div>

          {/* Review answers */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Answer Review</h3>
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {userAnswer !== undefined ? (isCorrect ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} /> : <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(var(--destructive))' }} />) : <div className="w-4 h-4" />}
                    <span className="text-sm font-medium text-foreground">Q{i + 1}. {q.text}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{q.marks} marks</span>
                  </div>
                  {q.image_url && <img src={q.image_url} alt="Question" className="max-h-32 rounded-lg mb-2 ml-6" />}
                  <div className="grid sm:grid-cols-2 gap-1 ml-6">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={`text-xs px-3 py-1.5 rounded-md ${oi === q.correct ? 'bg-success/10 text-success font-medium' : userAnswer === oi && !isCorrect ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Start screen
  if (!started) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
          <button onClick={() => navigate('/student/quizzes')} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm mb-6">{quiz.courses?.title}</p>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="font-bold text-foreground">{questions.length}</div>
                <div className="text-[10px] text-muted-foreground">Questions</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="font-bold text-foreground">{quiz.duration}m</div>
                <div className="text-[10px] text-muted-foreground">Duration</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="font-bold text-foreground">{quiz.total_marks}</div>
                <div className="text-[10px] text-muted-foreground">Marks</div>
              </div>
            </div>
            <Button onClick={() => setStarted(true)} size="lg" className="font-semibold" style={{ background: 'var(--gradient-primary)' }}>
              Start Quiz
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Quiz in progress
  const progress = Object.keys(answers).length;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
        {/* Top bar */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between sticky top-16 z-10">
          <div>
            <h2 className="font-display font-semibold text-foreground text-sm">{quiz.title}</h2>
            <div className="text-xs text-muted-foreground">{progress}/{questions.length} answered</div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'}`}>
              <Clock className="w-3.5 h-3.5" />{formatTime(timeLeft)}
            </div>
            <Button onClick={handleSubmit} size="sm" className="font-semibold" style={{ background: 'var(--gradient-primary)' }}>
              Submit Quiz
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(progress / questions.length) * 100}%` }} />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={qi} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Q{qi + 1}. {q.text}</span>
                <span className="badge-primary text-[10px] ml-2 flex-shrink-0">{q.marks} marks</span>
              </div>
              {q.image_url && <img src={q.image_url} alt="Question" className="max-h-40 rounded-lg mb-3" />}
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm border transition-all ${answers[qi] === oi ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border text-foreground hover:bg-muted/50'}`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} className="w-full font-semibold" style={{ background: 'var(--gradient-primary)' }}>
          Submit Quiz
        </Button>
      </div>
    </DashboardLayout>
  );
}
