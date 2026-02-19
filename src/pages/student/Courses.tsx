import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockCourses, mockEnrollments } from '@/data/mockData';
import { Search, BookOpen, Clock, Star, Users, Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const enrolledIds = mockEnrollments.map(e => e.courseId);
  const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Cloud', 'Mobile', 'Security'];
  const filtered = mockCourses.filter(c =>
    (filter === 'All' || c.category === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Course Catalog</h1>
          <p className="text-muted-foreground text-sm mt-1">Explore and enroll in courses that match your goals</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === cat ? 'text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                style={filter === cat ? { background: 'var(--gradient-primary)' } : {}}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(course => {
            const enrolled = enrolledIds.includes(course.id);
            const enrollment = mockEnrollments.find(e => e.courseId === course.id);
            return (
              <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${course.level === 'Beginner' ? 'badge-success' : course.level === 'Intermediate' ? 'badge-warning' : 'badge-info'}`}>
                      {course.level}
                    </span>
                  </div>
                  {enrolled && (
                    <div className="absolute top-3 right-3 badge-success text-xs">Enrolled</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-primary text-[10px]">{course.category}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1 flex-1">{course.title}</h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{course.description}</p>
                  <div className="text-xs text-muted-foreground mb-1">by {course.instructorName}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students.toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-yellow-500" />{course.rating}</span>
                  </div>
                  {enrolled && enrollment && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{enrollment.progress}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${enrollment.progress}%` }} /></div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-foreground">₹{course.price.toLocaleString()}</span>
                    <Button size="sm" className="font-semibold text-xs" style={{ background: enrolled ? 'var(--gradient-success)' : 'var(--gradient-primary)' }}>
                      {enrolled ? (<><Play className="w-3 h-3 mr-1" />Continue</>) : (<><ChevronRight className="w-3 h-3 mr-1" />Enroll</>)}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No courses found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
