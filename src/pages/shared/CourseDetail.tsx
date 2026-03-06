import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, ChevronLeft, ChevronRight, Clock, BookOpen, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: string | null;
  sort_order: number | null;
}

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  category: string | null;
  level: string | null;
  duration: string | null;
  price: number | null;
  status: string | null;
  instructor_id: string | null;
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [instructorName, setInstructorName] = useState('');

  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      setLoading(true);
      const [courseRes, lessonsRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).single(),
        supabase.from('lessons').select('*').eq('course_id', courseId).order('sort_order', { ascending: true }),
      ]);
      if (courseRes.data) {
        setCourse(courseRes.data as CourseData);
        if (courseRes.data.instructor_id) {
          const { data: profile } = await supabase.from('profiles').select('name').eq('user_id', courseRes.data.instructor_id).single();
          if (profile) setInstructorName(profile.name);
        }
      }
      setLessons((lessonsRes.data || []) as Lesson[]);
      setLoading(false);
    };
    load();
  }, [courseId]);

  const currentLesson = lessons[activeLesson];

  const toggleComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId); else next.add(lessonId);
      return next;
    });
    toast({ title: completedLessons.has(lessonId) ? 'Lesson unmarked' : 'Lesson completed!' });
  };

  const getVideoEmbed = (url: string | null) => {
    if (!url) return null;
    // YouTube embed
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url;
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;
  if (!course) return <DashboardLayout><div className="text-center py-20 text-muted-foreground">Course not found.</div></DashboardLayout>;

  const rolePrefix = user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/student';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`${rolePrefix}/courses`)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground">{course.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              {instructorName && <span>by {instructorName}</span>}
              {course.category && <span className="badge-primary text-[10px]">{course.category}</span>}
              {course.level && <span className={course.level === 'beginner' ? 'badge-success' : course.level === 'intermediate' ? 'badge-warning' : 'badge-info'} style={{ fontSize: '10px' }}>{course.level}</span>}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video / Content Area */}
          <div className="lg:col-span-2 space-y-4">
            {currentLesson ? (
              <>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  {currentLesson.video_url ? (
                    <div className="aspect-video bg-black">
                      <iframe
                        src={getVideoEmbed(currentLesson.video_url) || ''}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={currentLesson.title}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Play className="w-12 h-12 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No video available for this lesson</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="font-display font-semibold text-foreground text-lg">{currentLesson.title}</h2>
                      {currentLesson.duration && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />{currentLesson.duration}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => toggleComplete(currentLesson.id)}
                      size="sm"
                      variant={completedLessons.has(currentLesson.id) ? 'default' : 'outline'}
                      className="font-medium text-xs"
                      style={completedLessons.has(currentLesson.id) ? { background: 'var(--gradient-success)' } : {}}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {completedLessons.has(currentLesson.id) ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </div>
                  {currentLesson.description && (
                    <p className="text-sm text-muted-foreground">{currentLesson.description}</p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    disabled={activeLesson === 0}
                    onClick={() => setActiveLesson(prev => prev - 1)}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />Previous Lesson
                  </Button>
                  <Button
                    disabled={activeLesson >= lessons.length - 1}
                    onClick={() => setActiveLesson(prev => prev + 1)}
                    className="flex-1 font-semibold"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    Next Lesson<ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="relative h-64">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600'} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground">{course.description}</p>
                  <p className="text-sm text-muted-foreground mt-3">No lessons have been added to this course yet.</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Sidebar */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                Lessons ({lessons.length})
              </h3>
              <div className="text-xs text-muted-foreground mt-1">
                {completedLessons.size}/{lessons.length} completed
              </div>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: lessons.length > 0 ? `${(completedLessons.size / lessons.length) * 100}%` : '0%' }} />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(i)}
                  className={`w-full text-left p-4 border-b border-border/50 hover:bg-muted/30 transition-colors flex items-start gap-3 ${activeLesson === i ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${completedLessons.has(lesson.id) ? 'text-white' : 'text-muted-foreground border border-border'}`}
                    style={completedLessons.has(lesson.id) ? { background: 'var(--gradient-success)' } : {}}>
                    {completedLessons.has(lesson.id) ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${activeLesson === i ? 'text-primary' : 'text-foreground'}`}>{lesson.title}</div>
                    {lesson.duration && <div className="text-xs text-muted-foreground mt-0.5">{lesson.duration}</div>}
                  </div>
                  {activeLesson === i && <Play className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
