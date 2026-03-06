import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Clock, Download, Loader2, CheckCircle2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!assignmentId || !user) return;
    const load = async () => {
      setLoading(true);
      const [aRes, sRes] = await Promise.all([
        supabase.from('assignments').select('*, courses(title)').eq('id', assignmentId).single(),
        supabase.from('submissions').select('*').eq('assignment_id', assignmentId).eq('student_id', user.id).maybeSingle(),
      ]);
      setAssignment(aRes.data);
      setSubmission(sRes.data);
      setLoading(false);
    };
    load();
  }, [assignmentId, user]);

  const handleSubmit = async () => {
    if (!file || !user || !assignmentId) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `submissions/${user.id}/${assignmentId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('uploads').upload(path, file);
    if (upErr) { toast({ title: 'Upload failed', description: upErr.message, variant: 'destructive' }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);

    if (submission) {
      await supabase.from('submissions').update({ file_url: publicUrl, submitted_at: new Date().toISOString() }).eq('id', submission.id);
    } else {
      await supabase.from('submissions').insert({ assignment_id: assignmentId, student_id: user.id, file_url: publicUrl });
    }
    setUploading(false);
    toast({ title: submission ? 'Submission updated!' : 'Assignment submitted!' });
    // Refresh
    const { data } = await supabase.from('submissions').select('*').eq('assignment_id', assignmentId).eq('student_id', user.id).maybeSingle();
    setSubmission(data);
    setFile(null);
  };

  const rolePrefix = user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/student';

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;
  if (!assignment) return <DashboardLayout><div className="text-center py-20 text-muted-foreground">Assignment not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`${rolePrefix}/assignments`)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{assignment.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{assignment.courses?.title || 'Course'}</p>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground">Assignment Details</h2>
          {assignment.description && <p className="text-sm text-muted-foreground">{assignment.description}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Due Date</div>
              <div className="text-sm font-medium text-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline'}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Total Marks</div>
              <div className="text-sm font-bold text-foreground">{assignment.total_marks || 100}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <span className={assignment.status === 'published' ? 'badge-success' : 'badge-warning'}>{assignment.status}</span>
            </div>
          </div>
          {assignment.file_url && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Attached File</div>
              <a href={assignment.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <Download className="w-3.5 h-3.5" />Download Attachment
              </a>
            </div>
          )}
        </div>

        {/* Student Submission Section */}
        {user?.role === 'student' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Your Submission</h2>

            {submission ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--success))' }} />
                  <span className="text-sm font-medium text-foreground">Submitted</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(submission.submitted_at || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {submission.file_url && (
                  <a href={submission.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <Download className="w-3.5 h-3.5" />View Submission File
                  </a>
                )}
                {submission.grade != null && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Grade</div>
                    <div className="text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>{submission.grade}/{assignment.total_marks || 100}</div>
                    {submission.feedback && <p className="text-sm text-muted-foreground mt-1">{submission.feedback}</p>}
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Re-upload to edit your submission:</p>
                  <input type="file" accept=".pdf,.doc,.docx,.jpeg,.jpg,.png,.zip" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
                  {file && (
                    <Button onClick={handleSubmit} disabled={uploading} size="sm" className="mt-2 font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                      {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Edit3 className="w-3 h-3 mr-1" />}Update Submission
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Upload your assignment file (PDF, DOC, DOCX, JPEG, PNG, ZIP)</p>
                <input type="file" accept=".pdf,.doc,.docx,.jpeg,.jpg,.png,.zip" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
                <Button onClick={handleSubmit} disabled={!file || uploading} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Submit Assignment
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
