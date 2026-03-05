
-- Create lessons table
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  duration text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons viewable by authenticated" ON public.lessons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can manage lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Add total_marks column to assignments
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS total_marks integer DEFAULT 100;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS file_url text;

-- Add title column to notifications  
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS title text DEFAULT 'Notification';

-- Allow users to delete own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies for uploads bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anyone can view uploads" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'uploads');

CREATE POLICY "Users can update own uploads" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'uploads');

CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'uploads');
