import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchMessages, markMessageRead, deleteMessage } from '../../../../api/api';
import type { Message } from '../../../../types';
import type { AppData } from '../../../../types';
import { getErrorMessage } from '../helpers';
import { useConfirmDelete } from '@/shared/hooks/useConfirmDelete';

interface Props {
  data: AppData;
  onDataUpdate: () => Promise<void>;
}

export default function MessagesTab({ data, onDataUpdate }: Props) {
  const { t } = useTranslation();
  const confirmDelete = useConfirmDelete();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch(() => {
        setMessages(data.messages || []);
        toast.error(t('admin.failed'));
      });
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await markMessageRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      toast.success(t('admin.markRead'));
      await onDataUpdate();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirmDelete()) return;
    try {
      await deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      toast.success(t('admin.deleted'));
      await onDataUpdate();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  return (
    <div>
      {messages.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>{t('admin.noMessages')}</p> : messages.map((msg) => (
        <div key={msg.id} className="list-item" style={{ opacity: msg.isRead ? 0.6 : 1, flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div className="list-item-info">
            <h4>{msg.name} {msg.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({msg.phone})</span>}</h4>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{msg.messageText}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.subject && `${msg.subject} - `}{new Date(msg.createdAt).toLocaleString()}</p>
          </div>
          <div className="list-item-actions">
            {!msg.isRead && <button className="btn btn-secondary btn-sm" onClick={() => handleMarkRead(msg.id)}>{t('admin.markRead')}</button>}
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(msg.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
