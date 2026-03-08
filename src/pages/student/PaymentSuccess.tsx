import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function PaymentSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [courseName, setCourseName] = useState('');

  const sessionId = searchParams.get('session_id');
  const courseId = searchParams.get('course_id');
  const isSubscription = searchParams.get('type') === 'subscription';

  useEffect(() => {
    if (isSubscription) {
      setVerified(true);
      setVerifying(false);
      return;
    }

    if (!sessionId || !courseId || !user) {
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        // Get course name
        const { data: course } = await supabase.from('courses').select('title').eq('id', courseId).single();
        if (course) setCourseName(course.title);

        const { data, error } = await supabase.functions.invoke('verify-course-payment', {
          body: { sessionId, courseId },
        });

        if (error) throw error;
        if (data?.success) {
          setVerified(true);
          toast({ title: 'Payment verified!', description: `You are now enrolled in "${course?.title}"` });
        } else {
          toast({ title: 'Verification issue', description: data?.error || 'Please contact support', variant: 'destructive' });
        }
      } catch (err: any) {
        toast({ title: 'Verification failed', description: err.message, variant: 'destructive' });
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [sessionId, courseId, user, isSubscription]);

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto py-20 text-center space-y-6 animate-fade-in">
        {verifying ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-display font-bold text-foreground">Verifying Payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </>
        ) : verified ? (
          <>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}>
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {isSubscription ? 'Subscription Activated!' : 'Payment Successful!'}
            </h1>
            <p className="text-muted-foreground">
              {isSubscription
                ? 'You now have unlimited access to all courses. Start learning!'
                : `You are now enrolled in "${courseName}". Start learning right away!`
              }
            </p>
            <div className="flex gap-3 justify-center pt-4">
              {courseId && !isSubscription && (
                <Button
                  onClick={() => navigate(`/student/courses/${courseId}`)}
                  className="font-semibold"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />Start Learning
                </Button>
              )}
              <Button
                variant={courseId ? 'outline' : 'default'}
                onClick={() => navigate('/student/courses')}
                className={!courseId ? 'font-semibold' : ''}
                style={!courseId ? { background: 'var(--gradient-primary)' } : {}}
              >
                <ArrowRight className="w-4 h-4 mr-2" />Browse Courses
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-destructive/10">
              <Sparkles className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Something Went Wrong</h1>
            <p className="text-muted-foreground">We couldn't verify your payment. If you were charged, please contact support.</p>
            <Button variant="outline" onClick={() => navigate('/student/courses')}>
              Back to Courses
            </Button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
