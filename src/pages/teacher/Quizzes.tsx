import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Eye, Edit3, Trash2, Clock, Target, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function TeacherQuizzes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data } = await supabase.from('quizzes').select('*, courses(title)').order('created_at', { ascending: false });
    setQuizzes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quiz?')) return;
    await supabase.from('quizzes').delete().eq('id', id);
    setQuizzes(prev => prev.filter(q => q.id !== id));
    toast({ title: 'Quiz deleted' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Quizzes</h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage quizzes for your courses</p>
          </div>
          <Button onClick={() => navigate(`/${user?.role}/quizzes/create`)} style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-4 h-4 mr-2" />Create Quiz</Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No quizzes found. Create your first quiz!</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map((q: any) => {
              const questions = Array.isArray(q.questions) ? q.questions : [];
              return (
                <div key={q.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{q.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{q.courses?.title || 'Unknown Course'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1"><Target className="w-3 h-3" />Questions</div>
                      <div className="font-bold text-foreground">{questions.length}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1"><Clock className="w-3 h-3" />Duration</div>
                      <div className="font-bold text-foreground">{q.duration}m</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">Marks</div>
                      <div className="font-bold text-foreground">{q.total_marks}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs"><Eye className="w-3 h-3 mr-1" />View</Button>
                    <Button size="sm" variant="outline" className="text-xs"><Edit3 className="w-3 h-3" /></Button>
                    <Button onClick={() => handleDelete(q.id)} size="sm" variant="outline" className="text-xs text-destructive hover:text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
