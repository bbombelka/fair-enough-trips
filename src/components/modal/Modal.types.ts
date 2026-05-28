import { AllHTMLAttributes } from "react";

export interface ModalProps extends AllHTMLAttributes<HTMLDivElement> {
  closeModalCallback: () => void;
  title?: string;
}
