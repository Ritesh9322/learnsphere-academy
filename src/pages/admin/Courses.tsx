import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Search, Eye, Edit3, Trash2, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminCourses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from('courses').select('*, profiles:instructor_id(name)').order('created_at', { ascending: false });
      setCourses(data || []);
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

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Course Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage all courses on the platform</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Instructor</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Category</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Price</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <img src={c.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100'} alt={c.title} className="w-10 h-7 rounded object-cover" />
                      <span className="font-medium text-foreground text-xs max-w-[180px] truncate">{c.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{c.profiles?.name || 'Unknown'}</td>
                  <td className="py-3 px-5"><span className="badge-info text-[10px]">{c.category || 'N/A'}</span></td>
                  <td className="py-3 px-5 font-medium text-foreground text-xs">₹{Number(c.price || 0).toLocaleString()}</td>
                  <td className="py-3 px-5"><span className={c.status === 'published' ? 'badge-success' : 'badge-warning'} style={{ fontSize: '10px' }}>{c.status}</span></td>
                  <td className="py-3 px-5">
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/admin/courses/${c.id}`)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No courses found.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
