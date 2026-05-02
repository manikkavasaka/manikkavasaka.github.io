import { Lead } from '../types';

export interface Notification {
  id: string;
  type: 'whatsapp' | 'email' | 'sms';
  recipient: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  timestamp: string;
}

export interface AutomationSettings {
  whatsappEnabled: boolean;
  whatsappNumber: string;
  emailEnabled: boolean;
  emailRecipient: string;
  smsEnabled: boolean;
  smsNumber: string;
  notifyOnNewLead: boolean;
  notifyOnStatusChange: boolean;
  welcomeMessageTemplate: string;
  internalAlertTemplate: string;
}

const DEFAULT_SETTINGS: AutomationSettings = {
  whatsappEnabled: true,
  whatsappNumber: '+91 7200059453',
  emailEnabled: true,
  emailRecipient: 'mkshopzone2@gmail.com',
  smsEnabled: true,
  smsNumber: '+91 7200059453',
  notifyOnNewLead: true,
  notifyOnStatusChange: true,
  welcomeMessageTemplate: 'Hi {name}! Thank you for contacting MK ShopZone. We received your inquiry about {service}. Our team will review your requirement and reach out within 24 hours with the next steps.',
  internalAlertTemplate: '🔔 NEW LEAD for MK ShopZone: {name} from {company} is interested in {service}. Budget: ₹{budget}. Contact: {email} | {phone}'
};

const STORAGE_KEYS = {
  NOTIFICATIONS: 'dm_notifications',
  AUTOMATION_SETTINGS: 'dm_automation_settings'
};

export const automationDB = {
  getSettings: (): AutomationSettings => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTOMATION_SETTINGS);
    if (!stored) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(stored);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      whatsappNumber: parsed.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
      smsNumber: parsed.smsNumber || DEFAULT_SETTINGS.smsNumber,
      emailRecipient: parsed.emailRecipient || DEFAULT_SETTINGS.emailRecipient,
    };
  },

  saveSettings: (settings: AutomationSettings): void => {
    localStorage.setItem(STORAGE_KEYS.AUTOMATION_SETTINGS, JSON.stringify(settings));
  },

  getNotifications: (): Notification[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  sendLeadNotifications: (lead: Lead): Notification[] => {
    const settings = automationDB.getSettings();
    const notifications: Notification[] = [];
    const timestamp = new Date().toISOString();

    if (!settings.notifyOnNewLead) return notifications;

    if (settings.whatsappEnabled && lead.phone) {
      const welcomeMsg = settings.welcomeMessageTemplate
        .replace('{name}', lead.name)
        .replace('{service}', lead.serviceInterested || 'Digital Marketing')
        .replace('{company}', lead.company || 'your company');

      notifications.push({
        id: 'n_' + Math.random().toString(36).substr(2, 9),
        type: 'whatsapp',
        recipient: lead.phone,
        message: welcomeMsg,
        status: 'sent',
        timestamp
      });
    }

    if (settings.whatsappEnabled) {
      const internalMsg = settings.internalAlertTemplate
        .replace('{name}', lead.name)
        .replace('{company}', lead.company || 'N/A')
        .replace('{service}', lead.serviceInterested || 'General')
        .replace('{budget}', lead.budget?.toLocaleString() || '0')
        .replace('{email}', lead.email)
        .replace('{phone}', lead.phone || 'N/A');

      notifications.push({
        id: 'n_' + Math.random().toString(36).substr(2, 9),
        type: 'whatsapp',
        recipient: settings.whatsappNumber,
        message: internalMsg,
        status: 'sent',
        timestamp
      });
    }

    if (settings.emailEnabled) {
      const emailBody = `
NEW LEAD ALERT - MK ShopZone
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${lead.name}
🏢 Company: ${lead.company || 'Not specified'}
📧 Email: ${lead.email}
📱 Phone: ${lead.phone || 'Not specified'}
🎯 Service: ${lead.serviceInterested || 'General Inquiry'}
💰 Budget: ₹${lead.budget?.toLocaleString() || '0'}
📝 Message: "${lead.message || 'No message provided'}"
📅 Date: ${lead.date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action Required: Contact within 24 hours for best conversion rates.
      `.trim();

      notifications.push({
        id: 'n_' + Math.random().toString(36).substr(2, 9),
        type: 'email',
        recipient: settings.emailRecipient,
        message: emailBody,
        status: 'sent',
        timestamp
      });

      notifications.push({
        id: 'n_' + Math.random().toString(36).substr(2, 9),
        type: 'email',
        recipient: lead.email,
        message: `Hi ${lead.name},\n\nThank you for reaching out to MK ShopZone! We've received your inquiry about ${lead.serviceInterested || 'our services'}.\n\nOur digital marketing strategist will review your requirements and get back to you within 24 hours.\n\nBest regards,\nMK ShopZone Team`,
        status: 'sent',
        timestamp
      });
    }

    if (settings.smsEnabled) {
      const smsMsg = `MK ShopZone Alert: New lead from ${lead.name} (${lead.company || 'N/A'}). Service: ${lead.serviceInterested || 'General'}. Budget: ₹${lead.budget?.toLocaleString() || '0'}. Check dashboard for details.`;

      notifications.push({
        id: 'n_' + Math.random().toString(36).substr(2, 9),
        type: 'sms',
        recipient: settings.smsNumber,
        message: smsMsg,
        status: 'sent',
        timestamp
      });
    }

    const existing = automationDB.getNotifications();
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([...notifications, ...existing]));
    return notifications;
  },

  sendStatusChangeNotification: (lead: Lead, oldStatus: string, newStatus: string): Notification[] => {
    const settings = automationDB.getSettings();
    const notifications: Notification[] = [];
    const timestamp = new Date().toISOString();

    if (!settings.notifyOnStatusChange) return notifications;

    const statusMsg = `📊 MK ShopZone Lead Update: ${lead.name} (${lead.company || 'N/A'}) status changed from "${oldStatus}" → "${newStatus}".`;

    if (settings.whatsappEnabled) notifications.push({ id: 'n_' + Math.random().toString(36).substr(2, 9), type: 'whatsapp', recipient: settings.whatsappNumber, message: statusMsg, status: 'sent', timestamp });
    if (settings.emailEnabled) notifications.push({ id: 'n_' + Math.random().toString(36).substr(2, 9), type: 'email', recipient: settings.emailRecipient, message: statusMsg, status: 'sent', timestamp });
    if (settings.smsEnabled) notifications.push({ id: 'n_' + Math.random().toString(36).substr(2, 9), type: 'sms', recipient: settings.smsNumber, message: statusMsg, status: 'sent', timestamp });

    const existing = automationDB.getNotifications();
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([...notifications, ...existing]));
    return notifications;
  },

  clearNotifications: (): void => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};
