import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock, Download, BookOpen, Loader2, Crown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function Payments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('payments').select('*, courses(title)').eq('student_id', user.id).order('paid_at', { ascending: false }).then(({ data }) => {
      setPayments(data || []);
      setLoading(false);
    });
    // Check subscription status
    supabase.functions.invoke('check-subscription').then(({ data }) => {
      if (data?.subscribed) {
        setIsSubscribed(true);
        setSubscriptionEnd(data.subscription_end);
      }
    });
  }, [user]);

  const total = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not open subscription portal', variant: 'destructive' });
    } finally {
      setPortalLoading(false);
    }
  };

  const downloadInvoice = (payment: any) => {
    const invoiceContent = `
INVOICE
=======
Course: ${payment.courses?.title || 'N/A'}
Amount: ₹${Number(payment.amount).toLocaleString()}
Payment ID: ${payment.payment_id || payment.id}
Date: ${new Date(payment.paid_at || '').toLocaleDateString('en-IN')}
Status: ${payment.status}
    `.trim();
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${payment.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Payment History</h1>
            <p className="text-muted-foreground text-sm mt-1">Track your course purchases and transactions</p>
          </div>
        </div>

        {/* Subscription Status */}
        {isSubscribed && (
          <div className="bg-card rounded-xl border border-primary/30 p-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--card)))' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display font-semibold text-foreground">All Access Subscription</div>
                <div className="text-xs text-muted-foreground">
                  {subscriptionEnd ? `Renews on ${new Date(subscriptionEnd).toLocaleDateString('en-IN')}` : 'Active'}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={portalLoading}>
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Settings className="w-4 h-4 mr-1" />}
              Manage
            </Button>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-display font-bold" style={{ color: 'hsl(var(--primary))' }}>₹{total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Spent</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-display font-bold" style={{ color: 'hsl(var(--success))' }}>{payments.filter(p => p.status === 'paid').length}</div>
            <div className="text-sm text-muted-foreground mt-1">Paid</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-display font-bold" style={{ color: 'hsl(var(--warning))' }}>{payments.filter(p => p.status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground mt-1">Pending</div>
          </div>
        </div>

        {/* Transactions */}
        {payments.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-display font-semibold text-foreground">Transactions</h2>
            </div>
            <div className="divide-y divide-border">
              {payments.map(payment => (
                <div key={payment.id} className="p-5 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: payment.status === 'paid' ? 'hsl(var(--success)/0.12)' : 'hsl(var(--warning)/0.12)' }}>
                    {payment.status === 'paid' ? <CheckCircle className="w-5 h-5" style={{ color: 'hsl(var(--success))' }} /> : <Clock className="w-5 h-5" style={{ color: 'hsl(var(--warning))' }} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{payment.courses?.title || 'Unknown Course'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">ID: {payment.payment_id || payment.id.slice(0, 8)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">₹{Number(payment.amount).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{new Date(payment.paid_at || '').toLocaleDateString('en-IN')}</div>
                  </div>
                  <span className={payment.status === 'paid' ? 'badge-success' : 'badge-warning'}>{payment.status}</span>
                  {payment.status === 'paid' && (
                    <button onClick={() => downloadInvoice(payment)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Download Invoice">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">No payments found.</div>
        )}

        {/* Browse Courses CTA */}
        <div className="bg-card rounded-xl border border-border p-6 text-center" style={{ background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--card)))' }}>
          <CreditCard className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(var(--primary))' }} />
          <h3 className="font-display font-semibold text-foreground mb-2">Ready to learn more?</h3>
          <p className="text-muted-foreground text-sm mb-4">Explore our course catalog and invest in your future.</p>
          <Button onClick={() => navigate('/student/courses')} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
            <BookOpen className="w-4 h-4 mr-2" />Browse Courses
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
