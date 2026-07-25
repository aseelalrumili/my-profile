import { useState, useCallback, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import { sendMessage } from '../../../api/api';
import type { AppData } from '../../../types';
import SectionHeader from '../../../shared/components/UI/SectionHeader';
import { useLocale } from '../../../shared/hooks/useLocale';

export default function Contact({ data }: { data: AppData }) {
  const { t } = useTranslation();
  const { profile } = data;
  const { isAr, local } = useLocale();
  const [form, setForm] = useState({ name: '', phone: '', subject: '', messageText: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendMessage(form);
      toast.success(t('contact.success'));
      setForm({ name: '', phone: '', subject: '', messageText: '' });
    } catch {
      toast.error(t('contact.error'));
    } finally {
      setSending(false);
    }
  }, [form, t]);

  return (
    <section className="section" id="contact">
      <SectionHeader title={t('contact.title')} subtitle={t('contact.subtitle')} underline />

      <div className="contact-section">
        <motion.div
          initial={{ opacity: 0, x: isAr ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">{t('contact.name')}</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-phone">{t('contact.phone')} <span style={{ fontSize: '0.75em', color: 'var(--text-muted)' }}>({t('contact.optional')})</span></label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">{t('contact.subject')}</label>
              <input
                id="contact-subject"
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">{t('contact.message')}</label>
              <textarea
                id="contact-message"
                value={form.messageText}
                onChange={(e) => setForm({ ...form, messageText: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="contact-btn primary" disabled={sending}>
              {sending ? t('contact.sending') : t('contact.send')}
            </button>
          </motion.form>
        </motion.div>

        <motion.div
          className="contact-grid"
          initial={{ opacity: 0, x: isAr ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {profile.email && (
            <div className="contact-item">
              <div className="contact-icon"><FiMail /></div>
              <div>
                <div className="contact-label">{t('contact.emailLabel')}</div>
                <div className="contact-value">{profile.email}</div>
              </div>
            </div>
          )}
          {profile.phone && (
            <div className="contact-item">
              <div className="contact-icon"><FiPhone /></div>
              <div>
                <div className="contact-label">{t('contact.phoneLabel')}</div>
                <div className="contact-value">{profile.phone}</div>
              </div>
            </div>
          )}
          {profile.location && (
            <div className="contact-item">
              <div className="contact-icon"><FiMapPin /></div>
              <div>
                <div className="contact-label">{t('contact.locationLabel')}</div>
                <div className="contact-value">{local(profile, 'location')}</div>
              </div>
            </div>
          )}
          {profile.phone && (
            <a
              href={`https://wa.me/${profile.phone!.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="contact-icon"><FiMessageCircle /></div>
              <div>
                <div className="contact-label">WhatsApp</div>
                <div className="contact-value">{profile.phone}</div>
              </div>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
