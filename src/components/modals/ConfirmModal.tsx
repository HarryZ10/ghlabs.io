// src/components/modals/ConfirmModal.tsx
"use client";

import React from "react";
import { Modal } from "antd";
import Button from "../Button";
import useConfirmModal from "../../hooks/useConfirmModal";

interface ConfirmModalProps {
  title: string;
  desc: string;
  note?: string;
  confirmText: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  desc,
  note,
  confirmText,
}) => {
  const confirmModal = useConfirmModal();

  return (
    <Modal
      style={{ width: "100%", padding: "2%" }}
      footer={null}
      title={<h1>{title}</h1>}
      open={confirmModal.isOpen}
      onCancel={confirmModal.onClose}
    >
      <div className="flex flex-col gap-3">
        <p className="text-headings">{desc}</p>
        {note && <p className="text-body text-xs">{note}</p>}
        <div className="flex gap-4 justify-end mt-2">
          <Button label="Cancel" onClick={confirmModal.onClose} outline />
          <Button
            label={confirmText}
            onClick={() => {
              confirmModal.onConfirm();
              confirmModal.onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
