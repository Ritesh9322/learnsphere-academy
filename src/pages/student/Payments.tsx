import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockPayments } from '@/data/mockData';
import { CreditCard, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Payments() {
  const total = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Payment History</h1>
            <p className="text-muted-foreground text-sm mt-1">Track your course purchases and transactions</p>
          </div>
          <Button variant="outline" size="sm" className="font-medium"><Download className="w-4 h-4 mr-2" />Download Invoice</Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card text-center">
            <div className="text-2xl font-display font-bold" style={{ color: 'hsl(var(--primary))' }}>₹{total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Spent</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-display font-bold" style={{ color: 'hsl(var(--success))' }}>{mockPayments.filter(p => p.status === 'paid').length}</div>
            <div className="text-sm text-muted-foreground mt-1">Paid</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-2xl font-display font-bold" style={{ color: 'hsl(var(--warning))' }}>{mockPayments.filter(p => p.status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground mt-1">Pending</div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Transactions</h2>
          </div>
          <div className="divide-y divide-border">
            {mockPayments.map(payment => (
              <div key={payment.id} className="p-5 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: payment.status === 'paid' ? 'hsl(var(--success)/0.12)' : 'hsl(var(--warning)/0.12)' }}>
                  {payment.status === 'paid' ? <CheckCircle className="w-5 h-5" style={{ color: 'hsl(var(--success))' }} />
                    : payment.status === 'failed' ? <XCircle className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} />
                      : <Clock className="w-5 h-5" style={{ color: 'hsl(var(--warning))' }} />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{payment.courseName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">ID: {payment.paymentId}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-foreground">₹{payment.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{new Date(payment.paidAt).toLocaleDateString('en-IN')}</div>
                </div>
                <span className={payment.status === 'paid' ? 'badge-success' : payment.status === 'pending' ? 'badge-warning' : 'badge-primary'}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Course CTA */}
        <div className="bg-card rounded-xl border border-border p-6 text-center" style={{ background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--card)))' }}>
          <CreditCard className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(var(--primary))' }} />
          <h3 className="font-display font-semibold text-foreground mb-2">Ready to learn more?</h3>
          <p className="text-muted-foreground text-sm mb-4">Explore our course catalog and invest in your future.</p>
          <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold">Browse Courses</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
