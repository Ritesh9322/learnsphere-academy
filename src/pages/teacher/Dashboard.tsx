import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, TrendingUp, Plus, Eye, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ icon: Icon, label, value, gradient }: { icon: React.ElementType; label: string; value: string | number; gradient: string }) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        <div className="text-sm text-foreground/80 font-medium">{label}</div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [coursesRes, enrollRes, assignRes, subRes] = await Promise.all([
        supabase.from('courses').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('enrollments').select('student_id'),
        supabase.from('assignments').select('id', { count: 'exact' }),
        supabase.from('submissions').select('*, assignments(title), profiles:student_id(name)').order('submitted_at', { ascending: false }).limit(5),
      ]);
      setCourses(coursesRes.data || []);
      setStudentCount(new Set((enrollRes.data || []).map(e => e.student_id)).size);
      setAssignmentCount(assignRes.count || 0);
      setSubmissions(subRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    await supabase.from('courses').delete().eq('id', id);
    setCourses(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Course deleted' });
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Instructor Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name}. Manage your courses and students.</p>
          </div>
          <Button onClick={() => navigate('/teacher/courses/create')} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
            <Plus className="w-4 h-4 mr-2" />Create New Course
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="Total Courses" value={courses.length} gradient="var(--gradient-primary)" />
          <StatCard icon={Users} label="Total Students" value={studentCount} gradient="var(--gradient-success)" />
          <StatCard icon={FileText} label="Assignments" value={assignmentCount} gradient="var(--gradient-warning)" />
          <StatCard icon={TrendingUp} label="Submissions" value={submissions.length} gradient="var(--gradient-purple)" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-foreground">My Courses</h2>
              <Button variant="outline" size="sm" className="font-medium" onClick={() => navigate('/teacher/courses/create')}>
                <Plus className="w-3.5 h-3.5 mr-1" />New Course
              </Button>
            </div>
            {courses.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No courses yet.</p> : (
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/teacher/courses/${course.id}`)}>
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100'} alt={course.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{course.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{course.category || 'Uncategorized'} · {course.level || 'beginner'}</div>
                      <span className={course.status === 'published' ? 'badge-success' : 'badge-warning'} style={{ fontSize: '10px' }}>{course.status}</span>
                    </div>
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => navigate(`/teacher/courses/${course.id}`)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(course.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Recent Submissions</h2>
            {submissions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No submissions yet.</p> : (
              <div className="space-y-3">
                {submissions.map((sub: any, i: number) => (
                  <div key={sub.id || i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                      {((sub as any).profiles?.name || 'S').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{(sub as any).profiles?.name || 'Student'}</div>
                      <div className="text-xs text-muted-foreground truncate">{sub.assignments?.title || 'Assignment'}</div>
                    </div>
                    <div className="text-right">
                      <span className={sub.grade != null ? 'badge-success' : 'badge-info'} style={{ fontSize: '10px' }}>{sub.grade != null ? 'graded' : 'new'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
