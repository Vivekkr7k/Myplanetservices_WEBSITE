import { useState } from 'react';
import { InquiryRecord, InquiryType, InquiryStatus } from '../../lib/inquiries';
import { X, Inbox, Mail, Building2, User, DollarSign, Calendar, Layers, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface InquiryModalProps {
  inquiry?: InquiryRecord | null;
  onClose: () => void;
  onSave: (record: Partial<InquiryRecord>) => Promise<void>;
}

export function InquiryModal({ inquiry, onClose, onSave }: InquiryModalProps) {
  const isEditing = Boolean(inquiry);

  const [formData, setFormData] = useState({
    name: inquiry?.name || '',
    email: inquiry?.email || '',
    company: inquiry?.company || '',
    type: (inquiry?.type || 'lead') as InquiryType,
    service: inquiry?.service || 'Custom Web Applications',
    budget: inquiry?.budget || '$10,000 – $25,000',
    slot: inquiry?.slot || '',
    status: (inquiry?.status || 'new') as InquiryStatus,
    currency: inquiry?.currency || 'USD',
    message: inquiry?.message || '',
    notes: inquiry?.notes || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        id: inquiry?.id,
        createdAt: inquiry?.createdAt,
      });
      onClose();
    } catch {
      toast.error('Failed to save inquiry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {isEditing ? `Edit Inquiry (${inquiry?.id})` : 'New Lead / Inquiry Entry'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEditing
                  ? 'Update inquiry requirements, contact details, or status'
                  : 'Add an offline prospect, LinkedIn lead, or phone inquiry to MongoDB'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                Contact Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikram Singhania"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="prospect@company.com"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                Company / Organization
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. ARiqA Labs"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-medium flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                Lead Category / Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as InquiryType })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="lead">Homepage Quick Lead</option>
                <option value="brief">Full Project Brief</option>
                <option value="booking">Discovery Call Booking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Service of Interest</label>
              <input
                type="text"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                placeholder="e.g. AI Agents & Copilots, Next.js Web App"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                Budget Scope
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. $15,000 – $30,000 or ₹12,00,000"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1 font-medium">Lead Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as InquiryStatus })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="new">New / Unread</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted to Client</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Preferred Call Slot
              </label>
              <input
                type="text"
                value={formData.slot}
                onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                placeholder="e.g. Tomorrow 4:30 PM IST"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              Prospect Message / Brief Summary
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="What are they looking to build or solve? Key architecture notes..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Internal Studio Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Private team notes regarding priority, next call dates, or referral background..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-purple-500/20 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving to MongoDB...' : isEditing ? 'Update Inquiry' : 'Save to MongoDB'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
