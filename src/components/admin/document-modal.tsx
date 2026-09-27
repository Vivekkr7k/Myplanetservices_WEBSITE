import { useState } from 'react';
import { ClientRecord, ClientDocument } from '../../lib/client-records';
import { X, FileText, Calendar, Building2, HardDrive, Link as LinkIcon, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentModalProps {
  clients: ClientRecord[];
  initialClient?: ClientRecord | null;
  document?: ClientDocument | null;
  onClose: () => void;
  onSave: (clientId: string, doc: ClientDocument) => Promise<void>;
}

export function DocumentModal({
  clients,
  initialClient,
  document,
  onClose,
  onSave,
}: DocumentModalProps) {
  const isEditing = Boolean(document);

  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialClient?.id || clients[0]?.id || ''
  );

  const [formData, setFormData] = useState<Omit<ClientDocument, 'id'>>({
    title: document?.title || '',
    type: document?.type || 'quotation',
    dateAdded: document?.dateAdded || new Date().toISOString().split('T')[0],
    fileSize: document?.fileSize || '240 KB',
    fileUrl: document?.fileUrl || '',
    notes: document?.notes || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Document title is required');
      return;
    }
    if (!selectedClientId) {
      toast.error('Please select a client organization');
      return;
    }

    setSaving(true);
    try {
      const docToSave: ClientDocument = {
        id: document?.id || `doc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        title: formData.title.trim(),
        type: formData.type,
        dateAdded: formData.dateAdded,
        fileSize: formData.fileSize?.trim() || 'PDF Document',
        fileUrl: formData.fileUrl?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
      };

      await onSave(selectedClientId, docToSave);
      onClose();
    } catch {
      toast.error('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card text-foreground border border-border rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center font-bold shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                {isEditing ? `Edit Document: ${document?.title}` : 'Add Client Document / Quotation'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Persisted to client record in MongoDB Atlas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Target Client Organization */}
          <div>
            <label className="text-muted-foreground block mb-1 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              Client Organization *
            </label>
            <select
              value={selectedClientId}
              disabled={isEditing}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-butter/50 disabled:opacity-60"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} ({c.clientName})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-muted-foreground block mb-1 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Services Agreement (MSA) 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-butter/50"
            />
          </div>

          {/* Type & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground block mb-1 font-medium">Document Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ClientDocument['type'] })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-butter/50"
              >
                <option value="quotation">Quotation / Proposal</option>
                <option value="contract">Contract / Agreement</option>
                <option value="sow">Statement of Work (SOW)</option>
                <option value="invoice">Tax Invoice</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Date Added *
              </label>
              <input
                type="date"
                required
                value={formData.dateAdded}
                onChange={(e) => setFormData({ ...formData, dateAdded: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-butter/50"
              />
            </div>
          </div>

          {/* File Size & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground block mb-1 font-medium flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
                Estimated File Size
              </label>
              <input
                type="text"
                placeholder="e.g. 320 KB or 1.2 MB"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-butter/50 font-mono"
              />
            </div>

            <div>
              <label className="text-muted-foreground block mb-1 font-medium flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                Document / Vault URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-butter/50 font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-muted-foreground block mb-1 font-medium flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
              Notes / Terms Summary
            </label>
            <textarea
              rows={3}
              placeholder="Commercial milestone breakdown, 50% advance terms, or signature status..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-butter/50 leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 text-xs font-semibold border border-border transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-102 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving to MongoDB...' : isEditing ? 'Update Document' : 'Save to MongoDB'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
