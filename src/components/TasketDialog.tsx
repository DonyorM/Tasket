import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@headlessui/react";
import { Button, IconButton } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function TasketDialog({
  open,
  onClose,
  title,
  description,
  children,
}: DialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-md max-w-sm mx-auto text-center">
          <div className="grid grid-cols-3 items-center bg-sky-800">
          {title ? <Dialog.Title className="text-xl col-start-2">{title}</Dialog.Title> : <span className="col-start-2"></span>}
          <IconButton className="col-start-3 flex-1 ml-auto mr-4"><FontAwesomeIcon icon={faTimes} /></IconButton>
          </div>
          {description ? (
            <Dialog.Description>
              Add a member to your group (search registered members by email, or
              send them an invite to join)
            </Dialog.Description>
          ) : (
            ""
          )}
          {children}
        </div>
      </div>
    </Dialog>
  );
}
