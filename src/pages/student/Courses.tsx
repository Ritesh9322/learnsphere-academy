import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock, Users, Play, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface CourseRow {
  id: string; title: string; description: string | null; category: string | null;
  level: string | null; duration: string | null; thumbnail: string | null; price: number | null;
  instructor_id: string | null;
}

export default function CourseCatalog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [enrollmentProgress, setEnrollmentProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [instructorNames, setInstructorNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const [coursesRes, enrollRes] = await Promise.all([
        supabase.from('courses').select('*').eq('status', 'published').order('created_at', { ascending: false }),
        supabase.from('enrollments').select('course_id, progress').eq('student_id', user.id),
      ]);
      const courseData = (coursesRes.data || []) as CourseRow[];
      setCourses(courseData);
      const enrollments = enrollRes.data || [];
      setEnrolledIds(enrollments.map(e => e.course_id));
      setEnrollmentProgress(Object.fromEntries(enrollments.map(e => [e.course_id, e.progress || 0])));

      // Fetch instructor names
      const instrIds = [...new Set(courseData.map(c => c.instructor_id).filter(Boolean))];
      if (instrIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('user_id, name').in('user_id', instrIds as string[]);
        setInstructorNames(Object.fromEntries((profiles || []).map(p => [p.user_id, p.name])));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean) as string[])];
  const filtered = courses.filter(c =>
    (filter === 'All' || c.category === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase()))
  );

  const handleCourseClick = (course: CourseRow) => {
    if (enrolledIds.includes(course.id)) {
      navigate(`/student/courses/${course.id}`);
    } else {
      setShowPurchaseDialog(true);
    }
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Course Catalog</h1>
          <p className="text-muted-foreground text-sm mt-1">Explore and enroll in courses that match your goals</p>
        </div>

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(course => {
            const enrolled = enrolledIds.includes(course.id);
            const progress = enrollmentProgress[course.id] || 0;
            return (
              <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col cursor-pointer" onClick={() => handleCourseClick(course)}>
                <div className="relative h-44 overflow-hidden">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${course.level === 'beginner' ? 'badge-success' : course.level === 'intermediate' ? 'badge-warning' : 'badge-info'}`}>
                      {course.level}
                    </span>
                  </div>
                  {enrolled && <div className="absolute top-3 right-3 badge-success text-xs">Enrolled</div>}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {course.category && <span className="badge-primary text-[10px] mb-2 self-start">{course.category}</span>}
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1 flex-1">{course.title}</h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{course.description}</p>
                  {course.instructor_id && instructorNames[course.instructor_id] && (
                    <div className="text-xs text-muted-foreground mb-1">by {instructorNames[course.instructor_id]}</div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    {course.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>}
                  </div>
                  {enrolled && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{progress}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto" onClick={e => e.stopPropagation()}>
                    <span className="font-bold text-foreground">₹{(course.price || 0).toLocaleString()}</span>
                    <Button size="sm" className="font-semibold text-xs" style={{ background: enrolled ? 'var(--gradient-success)' : 'var(--gradient-primary)' }} onClick={() => handleCourseClick(course)}>
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

        <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Course Not Purchased</DialogTitle>
              <DialogDescription>Please purchase this course to continue. Visit the payments page to complete your purchase.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>Cancel</Button>
              <Button onClick={() => { setShowPurchaseDialog(false); navigate('/student/payments'); }} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">Browse Courses</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
