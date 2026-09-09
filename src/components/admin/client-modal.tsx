import React, { useState } from 'react';
import { ClientRecord, ClientDocument } from '../../lib/client-records';
import { useCurrency } from '../../lib/currency-context';
import { X, Trash2, FileText, DollarSign, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface ClientModalProps {
  client?: ClientRecord | null;
  onClose: () => void;
  onSave: (record: ClientRecord) => void;
}

const ALL_SERVICES = [
  'E-Commerce Development',
  'Company & Corporate Websites',
  'Website Redesign & Modernization',
  'Custom CRM & ERP Systems',
  'Website Development',
  'Mobile App Development',
  'AI Agents & Copilots',
  'Cloud & Multi-Tenant SaaS',
  'DevOps & Cloud Infrastructure',
  'SEO, AEO & GEO Search Dominance',
  'Performance Marketing',
  'Copy Writing',
];

export function ClientModal({ client, onClose, onSave }: ClientModalProps) {
  const { currency: studioCurrency } = useCurrency();
  const isEditing = !!client;

  const [formData, setFormData] = useState<Partial<ClientRecord>>(() => {
    if (client) return { ...client };
    const initialCurrency = studioCurrency || 'INR';
    const isINR = initialCurrency === 'INR';

    return {
      clientName: '',
      companyName: '',
      email: '',
      phone: '',
      status: 'active',
      engagementType: 'fixed',
      currency: initialCurrency,
      services: ['Custom Web Applications', 'AI Agents & Copilots'],
      totalQuoted: isINR ? 1000000 : 12000,
      advancePaid: isINR ? 500000 : 6000,
      advancePaidDate: new Date().toISOString().split('T')[0],
      projectStartDate: new Date().toISOString().split('T')[0],
      projectEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentPhase: 'Sprint 1: Architecture & UI Prototype',
      monthlyFee: isINR ? 450000 : 5500,
      durationMonths: 6,
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      advanceDepositPaid: isINR ? 450000 : 5500,
      billingCycleDay: 1,
      monthsCompleted: 0,
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: 'Quotation Q-2026-Init',
          type: 'quotation',
          dateAdded: new Date().toISOString().split('T')[0],
          fileSize: '220 KB',
        },
      ],
      notes: '',
    };
  });

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<ClientDocument['type']>('quotation');

  const curr = formData.currency || 'INR';
  const currSym = curr === 'INR' ? '₹' : '$';

  const handleCurrencyChange = (newCur: 'USD' | 'INR') => {
    if (newCur === formData.currency) return;
    const isNowINR = newCur === 'INR';
    // Friendly conversion of default fields when toggling currency
    const rate = 83;
    setFormData((prev) => ({
      ...prev,
      currency: newCur,
      totalQuoted: isNowINR ? Math.round((prev.totalQuoted || 12000) * rate) : Math.round((prev.totalQuoted || 1000000) / rate),
      advancePaid: isNowINR ? Math.round((prev.advancePaid || 6000) * rate) : Math.round((prev.advancePaid || 500000) / rate),
      monthlyFee: isNowINR ? Math.round((prev.monthlyFee || 5500) * rate) : Math.round((prev.monthlyFee || 450000) / rate),
      advanceDepositPaid: isNowINR ? Math.round((prev.advanceDepositPaid || 5500) * rate) : Math.round((prev.advanceDepositPaid || 450000) / rate),
    }));
    toast.info(`Switched input currency to ${newCur === 'INR' ? '₹ INR (Indian Rupee)' : '$ USD (US Dollar)'}`);
  };

  const handleServiceToggle = (svc: string) => {
    const current = formData.services || [];
    if (current.includes(svc)) {
      setFormData({ ...formData, services: current.filter((s) => s !== svc) });
    } else {
      setFormData({ ...formData, services: [...current, svc] });
    }
  };

  const handleAddDocument = () => {
    if (!newDocTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    const doc: ClientDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      type: newDocType,
      dateAdded: new Date().toISOString().split('T')[0],
      fileSize: '310 KB',
    };
    setFormData({
      ...formData,
      documents: [...(formData.documents || []), doc],
    });
    setNewDocTitle('');
    toast.success('Document added to record');
  };

  const handleRemoveDoc = (id: string) => {
    setFormData({
      ...formData,
      documents: (formData.documents || []).filter((d) => d.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName?.trim() || !formData.clientName?.trim()) {
      toast.error('Client and Company names are required');
      return;
    }

    const finalRecord: ClientRecord = {
      id: formData.id || `cli-${Date.now().toString().slice(-4)}`,
      clientName: formData.clientName.trim(),
      companyName: formData.companyName.trim(),
      email: formData.email?.trim() || 'contact@client.com',
      phone: formData.phone?.trim() || '+91 90000 00000',
      status: formData.status || 'active',
      services: formData.services && formData.services.length > 0 ? formData.services : ['Website Development'],
      engagementType: formData.engagementType || 'fixed',
      currency: formData.currency || 'USD',
      projectStartDate: formData.projectStartDate,
      projectEndDate: formData.projectEndDate,
      totalQuoted: Number(formData.totalQuoted) || 0,
      advancePaid: Number(formData.advancePaid) || 0,
      advancePaidDate: formData.advancePaidDate,
      currentPhase: formData.currentPhase,
      monthlyFee: Number(formData.monthlyFee) || 0,
      durationMonths: Number(formData.durationMonths) || 0,
      startDate: formData.startDate,
      renewalDate: formData.renewalDate,
      advanceDepositPaid: Number(formData.advanceDepositPaid) || 0,
      billingCycleDay: Number(formData.billingCycleDay) || 1,
      monthsCompleted: Number(formData.monthsCompleted) || 0,
      documents: formData.documents || [],
      notes: formData.notes || '',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-card text-foreground border border-border rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[94dvh] sm:max-h-[88vh]">
        {/* Header (Always Visible) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border bg-secondary/40 shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="font-display text-base sm:text-lg font-bold text-foreground truncate">
              {isEditing ? `Edit Record: ${client.companyName}` : 'Add New Client Record'}
            </h2>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
              Configure engagement model, advance payments, currency, and quotation docs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 overscroll-contain">
          {/* Basic Client Details */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-butter" /> Client Organization Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Apex BioTech"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-butter/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Key Stakeholder / Lead *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName || ''}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-butter/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-butter/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98000 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-butter/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Account Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-butter/50 cursor-pointer"
                >
                  <option value="active">Active (In Production)</option>
                  <option value="onboarding">Onboarding / Scoping</option>
                  <option value="completed">Completed & Signed-Off</option>
                  <option value="paused">Paused / Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1 flex items-center justify-between">
                  <span>Billing Currency</span>
                  <span className="text-[10px] text-muted-foreground font-mono">1-Click Switch:</span>
                </label>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange('INR')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      curr === 'INR'
                        ? 'bg-butter text-butter-foreground shadow-2xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>₹ INR</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">(India)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange('USD')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      curr === 'USD'
                        ? 'bg-butter text-butter-foreground shadow-2xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>$ USD</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">(Global)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Model Choice & Commercial Inputs */}
          <div className="p-4 sm:p-5 rounded-2xl bg-secondary/40 border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-butter" /> Engagement Type
              </span>
              <div className="flex bg-card rounded-full p-0.5 border border-border self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, engagementType: 'fixed' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    formData.engagementType === 'fixed'
                      ? 'bg-butter text-butter-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Fixed-Time Project
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, engagementType: 'retainer' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    formData.engagementType === 'retainer'
                      ? 'bg-butter text-butter-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly Retainer
                </button>
              </div>
            </div>

            {/* Condition 1: Fixed Time Project */}
            {formData.engagementType === 'fixed' ? (
              <div className="space-y-4 pt-2 border-t border-border/80">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">
                      Total Quoted Amount *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-mono font-bold text-xs text-foreground/70 pointer-events-none">
                        {currSym}
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.totalQuoted || 0}
                        onChange={(e) => setFormData({ ...formData, totalQuoted: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-butter/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">
                      Advance Paid *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 pointer-events-none">
                        {currSym}
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.advancePaid || 0}
                        onChange={(e) => setFormData({ ...formData, advancePaid: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-butter/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">Advance Cleared Date</label>
                    <input
                      type="date"
                      value={formData.advancePaidDate || ''}
                      onChange={(e) => setFormData({ ...formData, advancePaidDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">Project Start Date</label>
                    <input
                      type="date"
                      value={formData.projectStartDate || ''}
                      onChange={(e) => setFormData({ ...formData, projectStartDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">Target Completion Date</label>
                    <input
                      type="date"
                      value={formData.projectEndDate || ''}
                      onChange={(e) => setFormData({ ...formData, projectEndDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-foreground mb-1">Current Milestone / Phase</label>
                  <input
                    type="text"
                    value={formData.currentPhase || ''}
                    onChange={(e) => setFormData({ ...formData, currentPhase: e.target.value })}
                    placeholder="e.g. Phase 2: Core Engine Architecture & API Layer"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
                  />
                </div>

                {/* Remaining balance preview */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border/80 text-xs">
                  <span className="text-muted-foreground">Remaining Balance To Collect:</span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {currSym}{((formData.totalQuoted || 0) - (formData.advancePaid || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              /* Condition 2: Monthly Retainer */
              <div className="space-y-4 pt-2 border-t border-border/80">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">
                      Monthly Retainer Fee *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-mono font-bold text-xs text-foreground/70 pointer-events-none">
                        {currSym}
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.monthlyFee || 0}
                        onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">
                      Retainer Duration (Months) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.durationMonths || 6}
                      onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 0 })}
                      placeholder="e.g. 6 or 12"
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">
                      Advance Deposit Paid
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 pointer-events-none">
                        {currSym}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={formData.advanceDepositPaid || 0}
                        onChange={(e) => setFormData({ ...formData, advanceDepositPaid: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">Retainer Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">Next Renewal Date</label>
                    <input
                      type="date"
                      value={formData.renewalDate || ''}
                      onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">Months Completed</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.monthsCompleted || 0}
                      onChange={(e) => setFormData({ ...formData, monthsCompleted: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Total Value calculation */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card border border-border/80 text-xs">
                  <span className="text-muted-foreground">Total Contract Value (Rate × Duration):</span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {currSym}{((formData.monthlyFee || 0) * (formData.durationMonths || 1)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Services Scope Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Assigned Services & Capabilities ({formData.services?.length || 0} selected)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SERVICES.map((svc) => {
                const selected = formData.services?.includes(svc);
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => handleServiceToggle(svc)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selected
                        ? 'bg-butter text-butter-foreground border-butter font-semibold shadow-xs'
                        : 'bg-background text-muted-foreground border-border hover:border-foreground/40'
                    }`}
                  >
                    {svc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quotations & Documents Vault */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Quotation Documents & Contract Attachments
            </label>

            {/* List of current docs */}
            <div className="space-y-1.5">
              {formData.documents && formData.documents.length > 0 ? (
                formData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-3.5 h-3.5 text-butter shrink-0" />
                      <span className="font-medium text-foreground truncate">{doc.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card text-muted-foreground uppercase shrink-0">
                        {doc.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">{doc.dateAdded}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic py-2">No documents attached yet.</div>
              )}
            </div>

            {/* Quick add document */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Document Title (e.g. Quotation Q-2026-092)"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-butter"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="flex-1 sm:flex-none px-2.5 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                >
                  <option value="quotation">Quotation</option>
                  <option value="contract">Contract / NDA</option>
                  <option value="sow">Scope SOW</option>
                  <option value="invoice">Invoice</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="px-3.5 py-2 rounded-xl bg-secondary text-foreground hover:bg-butter hover:text-butter-foreground text-xs font-semibold border border-border transition-colors shrink-0 cursor-pointer"
                >
                  + Add Doc
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Internal Squad Notes & Specs
            </label>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Internal deliverables notes, dedicated engineers assigned, or special SLA requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-butter/50"
            />
          </div>
        </form>

        {/* Sticky Mobile & Desktop Footer Controls */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3.5 border-t border-border bg-card shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-medium border border-border hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as any)}
            className="px-5 py-2.5 rounded-xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-105 transition-all shadow-xs cursor-pointer"
          >
            {isEditing ? 'Save Changes' : 'Create Client Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
