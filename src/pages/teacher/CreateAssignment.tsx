import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Save, Loader2, ArrowLeft, Send } from 'lucide-react';

interface CourseOption { id: string; title: string; }

export default function CreateAssignment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', course_id: '', due_date: '', total_marks: 100,
  });

  useEffect(() => {
    supabase.from('courses').select('id, title').then(({ data }) => {
      if (data) setCourses(data);
    });
  }, []);

  const handleSubmit = async (status: string) => {
    if (!form.title.trim() || !form.course_id) {
      toast({ title: 'Title and Course are required', variant: 'destructive' }); return;
    }
    setSaving(true);
    const { error } = await supabase.from('assignments').insert({
      title: form.title,
      description: form.description,
      course_id: form.course_id,
      due_date: form.due_date || null,
      total_marks: form.total_marks,
      status,
    } as any);
    setSaving(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: status === 'published' ? 'Assignment published!' : 'Draft saved!' });
    navigate(`/${user?.role}/assignments`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Create Assignment</h1>
            <p className="text-muted-foreground text-sm mt-1">Create a new assignment for your students</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div><Label>Assignment Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Build a REST API" className="mt-1.5" /></div>
          <div><Label>Description</Label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Assignment instructions..." className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Course *</Label>
              <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div><Label>Due Date</Label><Input type="datetime-local" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Total Marks</Label><Input type="number" value={form.total_marks} onChange={e => setForm({ ...form, total_marks: Number(e.target.value) })} className="mt-1.5" /></div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => handleSubmit('published')} disabled={saving} style={{ background: 'var(--gradient-primary)' }} className="font-semibold flex-1">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}Publish Assignment
          </Button>
          <Button onClick={() => handleSubmit('draft')} disabled={saving} variant="outline" className="flex-1">
            <Save className="w-4 h-4 mr-2" />Save Draft
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
