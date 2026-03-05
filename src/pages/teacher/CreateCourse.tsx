import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save, Loader2, ArrowLeft, GripVertical } from 'lucide-react';

interface LessonForm {
  title: string;
  description: string;
  video_url: string;
  duration: string;
}

export default function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState({
    title: '', description: '', category: '', level: 'beginner', price: 0, duration: '', status: 'draft',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [lessons, setLessons] = useState<LessonForm[]>([]);

  const addLesson = () => setLessons(prev => [...prev, { title: '', description: '', video_url: '', duration: '' }]);
  const removeLesson = (i: number) => setLessons(prev => prev.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, field: keyof LessonForm, value: string) => {
    setLessons(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  const handleSave = async () => {
    if (!course.title.trim()) { toast({ title: 'Course title is required', variant: 'destructive' }); return; }
    if (!user) return;
    setSaving(true);

    let thumbnailUrl = '';
    if (thumbnail) {
      const ext = thumbnail.name.split('.').pop();
      const path = `thumbnails/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, thumbnail);
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);
        thumbnailUrl = publicUrl;
      }
    }

    const { data: courseData, error: courseErr } = await supabase.from('courses').insert({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration,
      status: course.status,
      thumbnail: thumbnailUrl || null,
      instructor_id: user.id,
    }).select().single();

    if (courseErr || !courseData) {
      toast({ title: 'Error creating course', description: courseErr?.message, variant: 'destructive' });
      setSaving(false); return;
    }

    if (lessons.length > 0) {
      const lessonInserts = lessons.map((l, i) => ({
        course_id: courseData.id,
        title: l.title,
        description: l.description,
        video_url: l.video_url,
        duration: l.duration,
        sort_order: i,
      }));
      await supabase.from('lessons').insert(lessonInserts);
    }

    setSaving(false);
    toast({ title: 'Course created!' });
    navigate(`/${user.role}/courses`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Create New Course</h1>
            <p className="text-muted-foreground text-sm mt-1">Fill in the details to create a new course</p>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground">Course Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Label>Course Title *</Label><Input value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} placeholder="e.g. Full Stack Web Development" className="mt-1.5" /></div>
            <div className="sm:col-span-2"><Label>Description</Label><textarea value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} rows={3} placeholder="Course description..." className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div><Label>Category</Label><Input value={course.category} onChange={e => setCourse({ ...course, category: e.target.value })} placeholder="e.g. Web Development" className="mt-1.5" /></div>
            <div>
              <Label>Level</Label>
              <select value={course.level} onChange={e => setCourse({ ...course, level: e.target.value })} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div><Label>Price (₹)</Label><Input type="number" value={course.price} onChange={e => setCourse({ ...course, price: Number(e.target.value) })} className="mt-1.5" /></div>
            <div><Label>Duration</Label><Input value={course.duration} onChange={e => setCourse({ ...course, duration: e.target.value })} placeholder="e.g. 48h" className="mt-1.5" /></div>
            <div>
              <Label>Thumbnail</Label>
              <Input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} className="mt-1.5" />
            </div>
            <div>
              <Label>Status</Label>
              <select value={course.status} onChange={e => setCourse({ ...course, status: e.target.value })} className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground">Lessons ({lessons.length})</h2>
            <Button onClick={addLesson} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />Add Lesson</Button>
          </div>

          {lessons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No lessons added yet. Click "Add Lesson" to get started.</p>
          )}

          {lessons.map((lesson, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Lesson {i + 1}</span>
                </div>
                <button onClick={() => removeLesson(i)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label className="text-xs">Lesson Title</Label><Input value={lesson.title} onChange={e => updateLesson(i, 'title', e.target.value)} placeholder="Lesson title" className="mt-1" /></div>
                <div><Label className="text-xs">Duration</Label><Input value={lesson.duration} onChange={e => updateLesson(i, 'duration', e.target.value)} placeholder="e.g. 45 min" className="mt-1" /></div>
                <div className="sm:col-span-2"><Label className="text-xs">Description</Label><Input value={lesson.description} onChange={e => updateLesson(i, 'description', e.target.value)} placeholder="Brief description" className="mt-1" /></div>
                <div className="sm:col-span-2"><Label className="text-xs">Video URL</Label><Input value={lesson.video_url} onChange={e => updateLesson(i, 'video_url', e.target.value)} placeholder="https://youtube.com/..." className="mt-1" /></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} style={{ background: 'var(--gradient-primary)' }} className="font-semibold flex-1">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Course
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
