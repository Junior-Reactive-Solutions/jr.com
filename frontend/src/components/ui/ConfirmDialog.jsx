import React from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * Confirmation dialog built on the v2 Modal — replaces window.confirm()
 * everywhere in the admin panel. Native confirm() dialogs are jarring,
 * unbrandable, and read as unfinished; this keeps the destructive-action
 * pattern consistent across the app.
 */
const ConfirmDialog = ({ open, title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) => (
    <Modal
        open={open}
        onClose={onCancel}
        title={title}
        actions={
            <>
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
            </>
        }
    >
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-body)' }}>{message}</p>
    </Modal>
);

export default ConfirmDialog;
