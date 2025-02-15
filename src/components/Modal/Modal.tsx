import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import cn from "classnames";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  className = "",
  children,
}) => {
  const modalRoot = document.getElementById("root");

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !modalRoot) return null;

  // Prevent clicks on the modal content from closing the modal.
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={cn(styles.modalContent, className)}
        onClick={handleContentClick}
      >
        {title && (
          <div className={styles.modalHeader}>
            <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              {title}
            </span>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>
        )}
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
