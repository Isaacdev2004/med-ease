import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { LoadingButton } from '@/shared/components/LoadingButton';

interface UnsavedChangesDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
  onSaveDraft?: () => void | Promise<void>;
  saving?: boolean;
}

/** Stay / Leave / Save Draft — required for unsaved form protection. */
export function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
  onSaveDraft,
  saving,
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onStay()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Would you like to save a draft before
            leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          <AlertDialogCancel onClick={onStay}>Stay</AlertDialogCancel>
          {onSaveDraft ? (
            <LoadingButton
              variant="secondary"
              loading={saving}
              onClick={() => void onSaveDraft()}
            >
              Save Draft
            </LoadingButton>
          ) : null}
          <Button variant="destructive" onClick={onLeave}>
            Leave
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
