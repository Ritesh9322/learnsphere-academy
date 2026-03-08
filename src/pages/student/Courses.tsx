import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock, Play, ChevronRight, Loader2, CreditCard, CheckCircle2, IndianRupee, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

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
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
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
      setSelectedCourse(course);
      setPurchaseSuccess(false);
    }
  };

  const handlePurchase = async () => {
    if (!user || !selectedCourse) return;
    setPurchasing(true);

    try {
      // Create payment record
      const { error: payErr } = await supabase.from('payments').insert({
        student_id: user.id,
        course_id: selectedCourse.id,
        amount: selectedCourse.price || 0,
        status: 'completed',
        payment_id: `PAY-${Date.now()}`,
      });
      if (payErr) throw payErr;

      // Create enrollment
      const { error: enrollErr } = await supabase.from('enrollments').insert({
        student_id: user.id,
        course_id: selectedCourse.id,
        progress: 0,
      });
      if (enrollErr) throw enrollErr;

      // Update local state
      setEnrolledIds(prev => [...prev, selectedCourse.id]);
      setEnrollmentProgress(prev => ({ ...prev, [selectedCourse.id]: 0 }));
      setPurchaseSuccess(true);
      toast({ title: 'Course purchased successfully!', description: `You are now enrolled in "${selectedCourse.title}"` });
    } catch (err: any) {
      toast({ title: 'Purchase failed', description: err.message, variant: 'destructive' });
    } finally {
      setPurchasing(false);
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
                    <span className="font-bold text-foreground">
                      {(course.price || 0) === 0 ? 'Free' : `₹${(course.price || 0).toLocaleString()}`}
                    </span>
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

        {/* Purchase / Enrollment Dialog */}
        <Dialog open={!!selectedCourse} onOpenChange={(open) => { if (!open) { setSelectedCourse(null); setPurchaseSuccess(false); } }}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            {purchaseSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}>
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">Enrollment Successful!</h3>
                  <p className="text-sm text-muted-foreground mt-1">You now have full access to "{selectedCourse?.title}"</p>
                </div>
                <Button
                  onClick={() => { setSelectedCourse(null); setPurchaseSuccess(false); navigate(`/student/courses/${selectedCourse?.id}`); }}
                  className="w-full font-semibold"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Play className="w-4 h-4 mr-2" />Start Learning
                </Button>
              </div>
            ) : selectedCourse && (
              <>
                {/* Course preview header */}
                <div className="relative h-40 overflow-hidden">
                  <img src={selectedCourse.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600'} alt={selectedCourse.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-display font-bold text-lg">{selectedCourse.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedCourse.category && <span className="text-white/80 text-xs bg-white/20 px-2 py-0.5 rounded">{selectedCourse.category}</span>}
                      {selectedCourse.level && <span className="text-white/80 text-xs bg-white/20 px-2 py-0.5 rounded">{selectedCourse.level}</span>}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {selectedCourse.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{selectedCourse.description}</p>
                  )}

                  {/* Order summary */}
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Order Summary</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Course Price</span>
                      <span className="text-foreground font-medium">
                        {(selectedCourse.price || 0) === 0 ? 'Free' : `₹${(selectedCourse.price || 0).toLocaleString()}`}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between text-sm">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-lg" style={{ color: 'hsl(var(--primary))' }}>
                        {(selectedCourse.price || 0) === 0 ? 'Free' : `₹${(selectedCourse.price || 0).toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Secure payment</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />Lifetime access</span>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setSelectedCourse(null)} className="flex-1" disabled={purchasing}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="flex-1 font-semibold"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      {purchasing ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                      ) : (selectedCourse.price || 0) === 0 ? (
                        <><CheckCircle2 className="w-4 h-4 mr-2" />Enroll Free</>
                      ) : (
                        <><CreditCard className="w-4 h-4 mr-2" />Pay ₹{(selectedCourse.price || 0).toLocaleString()}</>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
