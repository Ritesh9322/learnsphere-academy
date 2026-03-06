import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function LogoutDialog({ open, onOpenChange, onConfirm }: LogoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: 'hsl(var(--destructive)/0.1)' }}>
            <LogOut className="w-6 h-6" style={{ color: 'hsl(var(--destructive))' }} />
          </div>
          <DialogTitle className="text-center">Log Out</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
          <Button onClick={onConfirm} variant="destructive" className="flex-1 font-semibold">
            <LogOut className="w-4 h-4 mr-1" />Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
