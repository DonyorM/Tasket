import { Button } from "./Button";
import TasketDialog, { DialogProps } from "./TasketDialog";

type ConfirmDialogProps = Omit<DialogProps, "children"> & {
  onConfirm: () => void;
};

function ConfirmDialog({ onConfirm, onClose, ...props }: ConfirmDialogProps) {
  return (
    <TasketDialog onClose={onClose} {...props}>
      <div className="flex justify-end gap-3 p-1">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          OK
        </Button>
      </div>
    </TasketDialog>
  );
}

export default ConfirmDialog;
