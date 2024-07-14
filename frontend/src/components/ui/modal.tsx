import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

export default function Modal(props: ModalProps) {
  const { children } = props;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[640px] space-y-5 bg-zinc-900 px-6 py-5 shadow-md sm:rounded-xl">
        {children}
      </div>
    </div>
  );
}

interface TitleProps {
  closeModal: () => void;
  children: ReactNode;
}
const Title = (props: TitleProps) => {
  const { closeModal, children } = props;
  return (
    <div className="flex items-center justify-between">
      {children}
      <button type="button" onClick={closeModal}>
        <X className="size-5 text-zinc-400" />
        <span className="sr-only">Close modal</span>
      </button>
    </div>
  );
};

interface DescriptionProps {
  children: ReactNode;
}
const Description = (props: DescriptionProps) => {
  const { children } = props;

  return <p className="text-left text-sm text-zinc-400">{children}</p>;
};

Modal.Title = Title;
Modal.Description = Description;
