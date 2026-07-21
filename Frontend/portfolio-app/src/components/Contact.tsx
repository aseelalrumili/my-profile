import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import { sendMessage } from '../api/api';
import type { AppData } from '../types';

export default function Contact({ data }: { data: AppData }) {
  const { t, i18n } = useTranslation();
  const { profile } = data;
  const isAr = i18n.language === 'ar';
  const [form, setForm] = useState({ name: '', email: '', subject: '', messageText: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendMessage(form);
      toast.success(t('contact.success'));
      setForm({ name: '', email: '', subject: '', messageText: '' });
    } catch {
      toast.error(t('contact.error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('contact.title')}
        <span className="section-title-underline" />
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('contact.subtitle')}
      </motion.p>

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
                <label htmlFor="contact-email">{t('contact.email')}</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
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
                <div className="contact-value">{isAr && profile.locationAr ? profile.locationAr : profile.location}</div>
              </div>
            </div>
          )}
          {profile.phone && (
            <a
              href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
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
