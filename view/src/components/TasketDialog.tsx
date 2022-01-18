import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@headlessui/react";
import { IconButton } from "./Button";

export interface DialogProps {
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
        <div className="relative bg-gray-800 rounded-md max-w-sm mx-auto text-center text-white w-11/12">
          <div className="grid grid-cols-3 items-center bg-sky-800 rounded-t-md p-1">
            {title ? (
              <Dialog.Title className="text-xl col-start-2">
                {title}
              </Dialog.Title>
            ) : (
              <span className="col-start-2"></span>
            )}
            <IconButton
              className="col-start-3 flex-1 ml-auto mr-2"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>
          {description ? (
            <Dialog.Description>{description}</Dialog.Description>
          ) : (
            ""
          )}
          <div className="p-2">{children}</div>
        </div>
      </div>
    </Dialog>
  );
}
