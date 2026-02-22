import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockCourses } from '@/data/mockData';
import { BookOpen, Plus, Search, Eye, Edit3, Trash2, Star, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminCourses() {
  const [search, setSearch] = useState('');
  const filtered = mockCourses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Course Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage all courses on the platform</p>
          </div>
          <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-4 h-4 mr-2" />Add Course</Button>
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
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Students</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Price</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Rating</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <img src={c.thumbnail} alt={c.title} className="w-10 h-7 rounded object-cover" />
                      <span className="font-medium text-foreground text-xs max-w-[180px] truncate">{c.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{c.instructorName}</td>
                  <td className="py-3 px-5"><span className="badge-info text-[10px]">{c.category}</span></td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{c.students}</td>
                  <td className="py-3 px-5 font-medium text-foreground text-xs">₹{c.price.toLocaleString()}</td>
                  <td className="py-3 px-5 text-yellow-500 text-xs">★ {c.rating}</td>
                  <td className="py-3 px-5"><span className={c.status === 'published' ? 'badge-success' : 'badge-warning'} style={{ fontSize: '10px' }}>{c.status}</span></td>
                  <td className="py-3 px-5">
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
