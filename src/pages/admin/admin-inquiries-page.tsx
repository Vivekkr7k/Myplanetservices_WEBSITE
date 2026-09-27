import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '../../components/admin/admin-layout';
import {
  InquiryRecord,
  InquiryStatus,
  InquiryType,
  fetchInquiries,
  updateInquiryStatus,
  updateInquiryRecord,
  saveInquiryAsync,
  deleteInquiry,
} from '../../lib/inquiries';
import {
  saveClientRecord,
  saveClientRecordAsync,
  ClientRecord,
} from '../../lib/client-records';
import { ClientModal } from '../../components/admin/client-modal';
import { InquiryModal } from '../../components/admin/inquiry-modal';
import { AdminPagination } from '../../components/admin/admin-pagination';
import {
  Inbox,
  Search,
  RefreshCw,
  Plus,
  Edit3,
  Save,
  UserPlus,
  Mail,
  Calendar,
  Building2,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Database,
  Copy,
  Check,
  X,
  Sparkles,
  LayoutGrid,
  List,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | InquiryType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [convertingLead, setConvertingLead] = useState<Partial<ClientRecord> | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<InquiryRecord | null>(null);
  const [inquiryNoteText, setInquiryNoteText] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const handleSaveInquiry = async (formData: Partial<InquiryRecord>) => {
    if (editingInquiry) {
      const success = await updateInquiryRecord(editingInquiry.id, formData);
      if (success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === editingInquiry.id ? { ...i, ...formData } : i))
        );
        if (selectedInquiry?.id === editingInquiry.id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, ...formData } : null));
        }
        toast.success('Inquiry updated in MongoDB');
      } else {
        toast.error('Failed to update inquiry');
      }
    } else {
      const res = await saveInquiryAsync(formData);
      if (res.success) {
        setInquiries((prev) => [res.data, ...prev]);
        toast.success(res.persistedToMongo ? 'Lead created and saved to MongoDB!' : 'Lead saved locally');
      } else {
        toast.error('Failed to save inquiry');
      }
    }
  };

  const handleEditInquiry = (inq: InquiryRecord) => {
    setEditingInquiry(inq);
    setIsInquiryModalOpen(true);
  };

  const handleSaveNote = async (id: string, noteText: string) => {
    const success = await updateInquiryRecord(id, { notes: noteText });
    if (success) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, notes: noteText } : i))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, notes: noteText } : null));
      }
      toast.success('Notes saved to MongoDB');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchInquiries();
      setInquiries(res.data);
      setDbConfigured(res.configured);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    const success = await updateInquiryStatus(id, newStatus);
    if (success) {
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      toast.success(`Inquiry marked as ${newStatus}`);
    }
  };

  const handleDelete = async (id: string, nameOrEmail: string) => {
    if (!window.confirm(`Are you sure you want to remove inquiry from "${nameOrEmail}"?`)) return;
    await deleteInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
    toast.success('Inquiry removed');
  };

  const handleConvertToClient = (inq: InquiryRecord) => {
    const isINR = (inq.currency || 'USD') === 'INR';
    const draft: Partial<ClientRecord> = {
      id: `lead-convert-${Date.now().toString(36)}`,
      clientName: inq.name || (inq.email ? inq.email.split('@')[0] : 'New Client'),
      companyName: inq.company || 'Private Client',
      email: inq.email,
      phone: '',
      status: 'onboarding',
      engagementType: inq.quote?.bundled ? 'fixed' : 'retainer',
      currency: (inq.currency === 'INR' ? 'INR' : 'USD'),
      services: inq.service
        ? inq.service.split(',').map((s) => s.trim())
        : ['Custom Web Applications'],
      totalQuoted: inq.quote?.total || (isINR ? 850000 : 12000),
      advancePaid: inq.quote?.total ? Math.round(inq.quote.total * 0.5) : (isINR ? 425000 : 6000),
      notes: `Converted from Website Inquiry (${inq.type.toUpperCase()}).\nMessage: ${inq.message || 'N/A'}\nSource: ${inq.source || 'Website'}`,
      documents: [
        {
          id: `doc-quote-${Date.now()}`,
          title: `Initial Proposal - ${inq.name || inq.company || 'Client'}`,
          type: 'quotation',
          dateAdded: new Date().toISOString().split('T')[0],
          fileSize: '180 KB',
          notes: `Created from project brief estimate (${inq.budget || 'Custom'})`,
        },
      ],
    };

    setConvertingLead(draft);
  };

  const handleSaveConvertedClient = async (record: ClientRecord) => {
    const finalRecord = {
      ...record,
      id: `cli-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    };
    saveClientRecord(finalRecord);
    saveClientRecordAsync(finalRecord).catch(() => {});

    // Mark inquiry as converted
    if (selectedInquiry) {
      await updateInquiryStatus(selectedInquiry.id, 'converted', undefined, finalRecord.id);
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id
            ? { ...item, status: 'converted', convertedClientId: finalRecord.id }
            : item
        )
      );
    }

    setConvertingLead(null);
    toast.success(`Successfully converted to Client Record: ${finalRecord.clientName}`);
  };

  const handleCopy = (text: string, label: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`Copied ${label}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered list
  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      if (typeFilter !== 'all' && inq.type !== typeFilter) return false;
      if (statusFilter !== 'all' && inq.status !== statusFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        inq.email.toLowerCase().includes(q) ||
        (inq.name && inq.name.toLowerCase().includes(q)) ||
        (inq.company && inq.company.toLowerCase().includes(q)) ||
        (inq.service && inq.service.toLowerCase().includes(q)) ||
        (inq.message && inq.message.toLowerCase().includes(q))
      );
    });
  }, [inquiries, typeFilter, statusFilter, searchQuery]);

  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  // Metrics
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter((i) => i.status === 'new').length;
    const bookings = inquiries.filter((i) => i.type === 'booking').length;
    const converted = inquiries.filter((i) => i.status === 'converted').length;
    return { total, newCount, bookings, converted };
  }, [inquiries]);

  // Helper for type badges
  const renderTypeBadge = (type: InquiryType) => {
    if (type === 'brief') {
      return (
        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-butter/30 text-butter-foreground border border-butter/50 uppercase tracking-wider">
          Project Brief
        </span>
      );
    }
    if (type === 'booking') {
      return (
        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 uppercase tracking-wider">
          Discovery Call
        </span>
      );
    }
    return (
      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-secondary text-foreground border border-border uppercase tracking-wider">
        Quick Lead
      </span>
    );
  };

  // Helper for status badges
  const renderStatusBadge = (status: InquiryStatus) => {
    if (status === 'new') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold bg-butter text-butter-foreground shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-butter-foreground animate-ping" />
          <span>New</span>
        </span>
      );
    }
    if (status === 'contacted') {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25 capitalize">
          Contacted
        </span>
      );
    }
    if (status === 'converted') {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 capitalize">
          Converted
        </span>
      );
    }
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-secondary text-muted-foreground border border-border capitalize">
        Archived
      </span>
    );
  };

  return (
    <AdminLayout
      title="Inquiries & Leads Vault"
      subtitle="Real-time capture of website form submissions, discovery calls, and instant estimate leads."
    >
      <div className="space-y-5 sm:space-y-6 pb-12">
        {/* Header Banner - Clean Luxury Light Aesthetic */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-border/80 shadow-soft relative overflow-hidden">
          {/* Subtle Warm Aurora Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-butter/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center font-display shadow-xs shrink-0 mt-0.5 sm:mt-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-semibold text-foreground tracking-tight">
                  Inquiries & Leads Vault
                </h1>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-butter/30 text-butter-foreground border border-butter/50">
                  Live Form Submissions
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-xl">
                Real-time submissions from project briefs, discovery calls, and instant estimate calculators.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 relative z-10">
            <button
              onClick={() => {
                setEditingInquiry(null);
                setIsInquiryModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-102 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Lead / Inquiry</span>
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-medium transition-colors cursor-pointer"
              title="Refresh submissions"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? 'animate-spin text-foreground' : ''}`} />
              <span>Refresh</span>
            </button>

            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border ${
                dbConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <Database className="w-3.5 h-3.5" />
              <span>{dbConfigured ? 'MongoDB: Connected' : 'Cloud Database'}</span>
            </div>
          </div>
        </div>

        {/* Stats Row - 4 Crisp Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden transition-all hover:border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Total Inquiries
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <Inbox className="w-4 h-4 text-butter" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              {stats.total}
            </div>
            <div className="mt-1 text-xs text-muted-foreground truncate">
              Across all live forms & calculators
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden transition-all hover:border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                New / Unread
              </span>
              <div className="w-8 h-8 rounded-xl bg-butter/30 text-butter-foreground flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight flex items-baseline gap-2">
              <span>{stats.newCount}</span>
              {stats.newCount > 0 && (
                <span className="text-xs font-semibold font-mono text-butter-foreground bg-butter/40 px-2 py-0.5 rounded-full">
                  Action Needed
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-butter animate-pulse shrink-0" />
              <span>Awaiting response</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden transition-all hover:border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Discovery Calls
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              {stats.bookings}
            </div>
            <div className="mt-1 text-xs text-muted-foreground truncate">
              Scheduled calendar slots
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden transition-all hover:border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Converted Clients
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              {stats.converted}
            </div>
            <div className="mt-1 text-xs text-muted-foreground truncate">
              Signed & moved to client records
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar - Light Card */}
        <div className="bg-card border border-border/80 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-soft space-y-3">
          {/* Top Row: Search Input + View Mode Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, company, or message..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-foreground focus:ring-2 focus:ring-butter/40 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              <span className="text-xs text-muted-foreground font-mono">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> submissions
              </span>

              {/* View Switcher: Cards vs Table */}
              <div className="flex items-center bg-secondary/80 p-1 rounded-xl border border-border/80">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  title="Card Grid View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-butter text-butter-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  title="Compact Table View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-butter text-butter-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-border/60">
            {/* Type selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar sm:flex-wrap">
              {[
                { id: 'all', label: 'All Submissions', count: inquiries.length },
                { id: 'brief', label: 'Project Briefs', count: inquiries.filter((i) => i.type === 'brief').length },
                { id: 'booking', label: 'Discovery Calls', count: inquiries.filter((i) => i.type === 'booking').length },
                { id: 'lead', label: 'Quick Leads', count: inquiries.filter((i) => i.type === 'lead').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setTypeFilter(tab.id as any);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    typeFilter === tab.id
                      ? 'bg-butter text-butter-foreground font-semibold shadow-xs'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      typeFilter === tab.id ? 'bg-butter-foreground/20 text-butter-foreground' : 'bg-card text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Status selector */}
            <div className="flex items-center bg-secondary/80 p-1 rounded-xl border border-border/80 text-xs shrink-0 self-start sm:self-auto">
              {(['all', 'new', 'contacted', 'converted', 'archived'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-card text-foreground font-semibold shadow-2xs border border-border/60'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body: Cards View OR Table View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border/80 shadow-soft">
            <Loader2 className="w-8 h-8 text-butter animate-spin mb-3" />
            <p className="text-sm font-semibold text-foreground">Syncing inquiries from MongoDB...</p>
            <p className="text-xs text-muted-foreground mt-1">Checking live form submissions and calendar bookings.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-soft text-center p-6">
            <Inbox className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground">No Inquiries Found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search terms or active filters.'
                : 'New website form submissions and discovery call requests will appear here in real-time.'}
            </p>
            {(searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-butter-foreground bg-butter px-3.5 py-2 rounded-xl shadow-xs hover:scale-102 transition-transform cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedInquiries.map((inq) => {
              const isNew = inq.status === 'new';
              const timeDisplay = new Date(inq.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={inq.id}
                  className={`bg-card border rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all group shadow-soft hover:shadow-md relative overflow-hidden ${
                    isNew
                      ? 'border-butter/70 ring-1 ring-butter/30 bg-card'
                      : 'border-border/80 hover:border-foreground/20'
                  }`}
                >
                  {/* Subtle Butter Left Accent Bar for New Inquiries */}
                  {isNew && (
                    <div className="absolute left-0 inset-y-0 w-1.5 bg-butter rounded-l-full" />
                  )}

                  <div>
                    {/* Top Row: Type, Status, and Timestamp */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {renderTypeBadge(inq.type)}
                        {renderStatusBadge(inq.status)}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono whitespace-nowrap">
                        {timeDisplay}
                      </span>
                    </div>

                    {/* Sender Identity */}
                    <div className="mb-3.5">
                      <h3 className="text-base sm:text-lg font-display font-semibold text-foreground group-hover:text-butter-foreground transition-colors flex items-center gap-2">
                        <span>{inq.name || inq.company || 'Website Visitor'}</span>
                      </h3>

                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate font-mono">{inq.email}</span>
                        <button
                          onClick={() => handleCopy(inq.email, 'email address', inq.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-0.5"
                          title="Copy email address"
                        >
                          {copiedId === inq.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {inq.company && inq.company !== inq.name && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate font-medium">{inq.company}</span>
                        </div>
                      )}
                    </div>

                    {/* Service & Budget/Slot Highlights */}
                    <div className="bg-secondary/50 rounded-2xl p-3 sm:p-3.5 border border-border/60 mb-3 space-y-1.5 text-xs">
                      {inq.service && (
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground font-medium shrink-0">Service:</span>
                          <span className="text-foreground font-semibold truncate">{inq.service}</span>
                        </div>
                      )}
                      {inq.budget && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium shrink-0">Budget:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                            {inq.budget}
                          </span>
                        </div>
                      )}
                      {inq.slot && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium shrink-0">Slot:</span>
                          <span className="text-butter-foreground font-semibold font-mono bg-butter/30 px-2 py-0.5 rounded-md">
                            {inq.slot}
                          </span>
                        </div>
                      )}
                      {inq.quote?.total && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium shrink-0">Est. Total:</span>
                          <span className="text-foreground font-mono font-bold">
                            {inq.currency === 'INR' ? '₹' : '$'}
                            {inq.quote.total.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Short Message Snippet */}
                    {inq.message && (
                      <p className="text-xs text-muted-foreground bg-secondary/30 rounded-xl p-2.5 border border-border/40 line-clamp-2 italic mb-3">
                        "{inq.message}"
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditInquiry(inq)}
                        className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                        title="Edit inquiry details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {inq.status !== 'converted' && (
                        <button
                          onClick={() => handleConvertToClient(inq)}
                          className="px-3 py-1.5 rounded-xl bg-butter text-butter-foreground text-xs font-semibold shadow-2xs hover:scale-102 transition-all flex items-center gap-1 cursor-pointer"
                          title="Convert to Client Record"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Convert</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(inq.id, inq.name || inq.email)}
                        className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/40 text-[11px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Prospect</th>
                    <th className="py-3.5 px-4 font-semibold">Type & Service</th>
                    <th className="py-3.5 px-4 font-semibold">Budget / Slot</th>
                    <th className="py-3.5 px-4 font-semibold">Received</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedInquiries.map((inq) => {
                    const isNew = inq.status === 'new';
                    return (
                      <tr
                        key={inq.id}
                        className={`hover:bg-secondary/30 transition-colors ${isNew ? 'bg-butter/5' : ''}`}
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {renderStatusBadge(inq.status)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground text-sm">
                            {inq.name || 'Website Visitor'}
                          </div>
                          <div className="text-muted-foreground font-mono text-[11px] flex items-center gap-1.5 mt-0.5">
                            <span>{inq.email}</span>
                            <button
                              onClick={() => handleCopy(inq.email, 'email', inq.id)}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Copy email"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          {inq.company && (
                            <div className="text-muted-foreground text-[11px] flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              <span>{inq.company}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="mb-1">{renderTypeBadge(inq.type)}</div>
                          <div className="font-medium text-foreground text-xs truncate max-w-[200px]">
                            {inq.service || 'General Inquiry'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                          {inq.budget && (
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {inq.budget}
                            </span>
                          )}
                          {inq.slot && (
                            <span className="font-semibold text-butter-foreground bg-butter/30 px-2 py-0.5 rounded-md text-[11px]">
                              {inq.slot}
                            </span>
                          )}
                          {!inq.budget && !inq.slot && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                          {new Date(inq.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedInquiry(inq)}
                              className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border transition-colors cursor-pointer"
                            >
                              View
                            </button>

                            {inq.status !== 'converted' && (
                              <button
                                onClick={() => handleConvertToClient(inq)}
                                className="px-2.5 py-1 rounded-lg bg-butter text-butter-foreground text-xs font-semibold shadow-2xs hover:scale-102 transition-transform cursor-pointer"
                                title="Convert to Client"
                              >
                                Convert
                              </button>
                            )}

                            <button
                              onClick={() => handleEditInquiry(inq)}
                              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(inq.id, inq.name || inq.email)}
                              className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        {filtered.length > 0 && (
          <div className="pt-4 border-t border-border/80">
            <AdminPagination
              currentPage={currentPage}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(val) => {
                setItemsPerPage(val);
                setCurrentPage(1);
              }}
              pageSizeOptions={[6, 12, 24]}
            />
          </div>
        )}

        {/* Inquiry Detail Modal / Drawer - Clean Light Theme */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-card text-foreground border border-border rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-butter text-butter-foreground flex items-center justify-center shadow-xs">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-display font-semibold text-foreground flex items-center gap-2">
                      <span>Inquiry Details</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-mono border border-border">
                        {selectedInquiry.id}
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Received on{' '}
                      {new Date(selectedInquiry.createdAt).toLocaleString('en-US', {
                        dateStyle: 'full',
                        timeStyle: 'medium',
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                {/* Status & Quick Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">Status:</span>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) =>
                        handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)
                      }
                      className="px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-foreground cursor-pointer"
                    >
                      <option value="new">New / Unread</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditInquiry(selectedInquiry)}
                      className="px-3 py-1.5 rounded-xl bg-card hover:bg-secondary text-foreground text-xs font-medium border border-border transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Edit Inquiry</span>
                    </button>

                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: Your Project with My Planet Services`}
                      className="px-3 py-1.5 rounded-xl bg-card hover:bg-secondary text-foreground text-xs font-medium border border-border transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Reply via Email</span>
                    </a>

                    {selectedInquiry.status !== 'converted' && (
                      <button
                        onClick={() => {
                          const target = selectedInquiry;
                          setSelectedInquiry(null);
                          handleConvertToClient(target);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-butter text-butter-foreground text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-102"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Convert to Client</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Prospect Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-2.5">
                    <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Name:</span>
                        <span className="text-foreground font-semibold text-sm">
                          {selectedInquiry.name || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Email:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-mono font-medium">
                            {selectedInquiry.email}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(selectedInquiry.email, 'email', 'modal-email')
                            }
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {copiedId === 'modal-email' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Company:</span>
                        <span className="text-foreground font-medium">
                          {selectedInquiry.company || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-2.5">
                    <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Submission Metadata
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Source Channel:</span>
                        <span className="text-foreground font-medium">
                          {selectedInquiry.source || 'Website'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Region / Timezone:</span>
                        <span className="text-foreground font-medium">
                          {selectedInquiry.region || 'Global'} /{' '}
                          {selectedInquiry.timeZone || 'UTC'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Notification Status:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Team: {selectedInquiry.teamEmailStatus || 'Sent'} | Visitor:{' '}
                          {selectedInquiry.clientEmailStatus || 'Sent'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope & Requirement */}
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-3">
                  <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Project Request
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {selectedInquiry.service && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Service Requested:</span>
                        <span className="text-foreground font-semibold">
                          {selectedInquiry.service}
                        </span>
                      </div>
                    )}
                    {selectedInquiry.budget && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Target Budget:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                          {selectedInquiry.budget}
                        </span>
                      </div>
                    )}
                    {selectedInquiry.slot && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Preferred Discovery Slot:</span>
                        <span className="text-butter-foreground font-semibold font-mono bg-butter/30 px-2 py-0.5 rounded-md">
                          {selectedInquiry.slot}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedInquiry.message && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-muted-foreground text-[11px] block mb-1">Message:</span>
                      <p className="text-xs sm:text-sm text-foreground bg-card p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap border border-border">
                        {selectedInquiry.message}
                      </p>
                    </div>
                  )}

                  {selectedInquiry.quote?.bundled && (
                    <div className="pt-2 border-t border-border">
                      <span className="text-muted-foreground text-[11px] block mb-1">
                        Bundled Services:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedInquiry.quote.bundled.map((b: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-butter/30 border border-butter/50 text-butter-foreground text-xs font-medium"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Internal Agency Notes */}
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Internal Studio Notes
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono">Saved to MongoDB</span>
                  </div>
                  <textarea
                    key={selectedInquiry.id}
                    defaultValue={selectedInquiry.notes || ''}
                    placeholder="Add private team notes regarding this lead, discovery call outcomes, or quotation notes..."
                    onChange={(e) => setInquiryNoteText(e.target.value)}
                    onBlur={(e) => {
                      handleSaveNote(selectedInquiry.id, e.target.value);
                    }}
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-card border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveNote(selectedInquiry.id, inquiryNoteText || selectedInquiry.notes || '')}
                      className="px-3 py-1.5 rounded-xl bg-butter text-butter-foreground text-xs font-semibold shadow-2xs hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Notes</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-secondary/30 flex justify-between items-center">
                <button
                  onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name || selectedInquiry.email)}
                  className="px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry</span>
                </button>

                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1-Click Convert to Client Modal */}
        {convertingLead && (
          <ClientModal
            client={convertingLead as ClientRecord}
            onClose={() => setConvertingLead(null)}
            onSave={handleSaveConvertedClient}
          />
        )}

        {/* Create / Edit Inquiry Modal */}
        {isInquiryModalOpen && (
          <InquiryModal
            inquiry={editingInquiry}
            onClose={() => {
              setIsInquiryModalOpen(false);
              setEditingInquiry(null);
            }}
            onSave={handleSaveInquiry}
          />
        )}
      </div>
    </AdminLayout>
  );
}
