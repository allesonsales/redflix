import type { modalMessageProps } from "../../interfaces";
import { AnimatePresence, motion } from "framer-motion";
import "./stylemodal.css";

function ModalNotification({
  modalMessage,
  isOpen,
  onClose,
}: modalMessageProps) {
  return !isOpen ? null : (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-background">
          <motion.div
            className="modal"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <i className="bi bi-x-circle" onClick={onClose}></i>
            <p>{modalMessage}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ModalNotification;
