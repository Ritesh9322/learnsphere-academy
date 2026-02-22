import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockCourses } from '@/data/mockData';
import { BookOpen, Plus, Eye, Edit3, Trash2, Star, Users, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const teacherCourses = mockCourses.filter(c => c.instructor === 'teacher1');

export default function TeacherCourses() {
  const [search, setSearch] = useState('');
  const filtered = teacherCourses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">My Courses</h1>
            <p className="text-muted-foreground text-sm mt-1">Create, edit, and manage your courses</p>
          </div>
          <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-4 h-4 mr-2" />Create Course</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(course => (
            <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className={course.status === 'published' ? 'badge-success' : 'badge-warning'}>{course.status}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-semibold text-foreground text-sm mb-2">{course.title}</h3>
                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                  <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" />{course.rating}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <span className="font-bold text-foreground">₹{course.price.toLocaleString()}</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
