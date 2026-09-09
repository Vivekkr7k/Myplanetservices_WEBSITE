import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '../../components/admin/admin-layout';
import {
  InquiryRecord,
  InquiryStatus,
  InquiryType,
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../../lib/inquiries';
import {
  saveClientRecord,
  saveClientRecordAsync,
  ClientRecord,
} from '../../lib/client-records';
import { ClientModal } from '../../components/admin/client-modal';
import { AdminPagination } from '../../components/admin/admin-pagination';
import {
  Inbox,
  Search,
  RefreshCw,
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

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
    if (!window.confirm(`Are you sure you want to remove inquiry from ${nameOrEmail}?`)) return;
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

  return (
    <AdminLayout
      title="Inquiries & Leads Vault"
      subtitle="Real-time capture of website form submissions, discovery calls, and instant estimate leads."
    >
      <div className="space-y-6 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Inquiries & Leads Vault
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Live Form Submissions
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-0.5">
                  Real-time submissions from project briefs, discovery calls, and instant estimate calculators.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/80 text-xs font-medium transition-all cursor-pointer shadow-sm hover:text-white"
              title="Refresh submissions"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
              Refresh
            </button>

            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border ${
                dbConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{dbConfigured ? 'MongoDB: Connected' : 'Storage: Local Cache'}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Total Inquiries</p>
              <p className="text-2xl font-bold text-white mt-0.5">{stats.total}</p>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">New / Unread</p>
              <p className="text-2xl font-bold text-purple-400 mt-0.5">{stats.newCount}</p>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Discovery Calls</p>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">{stats.bookings}</p>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Converted Clients</p>
              <p className="text-2xl font-bold text-blue-400 mt-0.5">{stats.converted}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/70">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, email, company, or message..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type selector */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              {(['all', 'brief', 'booking', 'lead'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTypeFilter(t);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                    typeFilter === t
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t === 'all' ? 'All Types' : t === 'brief' ? 'Briefs' : t === 'booking' ? 'Calls' : 'Leads'}
                </button>
              ))}
            </div>

            {/* Status selector */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              {(['all', 'new', 'contacted', 'converted', 'archived'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inquiries Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/80">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-3" />
            <p className="text-zinc-400 text-sm">Syncing inquiries from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
            <Inbox className="w-12 h-12 text-zinc-600 mb-3" />
            <h3 className="text-lg font-semibold text-zinc-300">No Inquiries Found</h3>
            <p className="text-sm text-zinc-500 max-w-sm text-center mt-1">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search terms or active filters.'
                : 'New website form submissions and discovery call requests will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedInquiries.map((inq) => {
              const isNew = inq.status === 'new';
              const typeColor =
                inq.type === 'brief'
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                  : inq.type === 'booking'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';

              const statusColor =
                inq.status === 'new'
                  ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 animate-pulse'
                  : inq.status === 'contacted'
                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                  : inq.status === 'converted'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700';

              const timeDisplay = new Date(inq.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={inq.id}
                  className={`bg-zinc-900/70 hover:bg-zinc-900 border rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-xl hover:border-zinc-700 ${
                    isNew ? 'border-purple-500/40 ring-1 ring-purple-500/20' : 'border-zinc-800/80'
                  }`}
                >
                  <div>
                    {/* Top Row: Type, Status, and Timestamp */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border uppercase tracking-wider ${typeColor}`}
                        >
                          {inq.type === 'brief'
                            ? 'Project Brief'
                            : inq.type === 'booking'
                            ? 'Discovery Call'
                            : 'Quick Lead'}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium border capitalize ${statusColor}`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 whitespace-nowrap">
                        {timeDisplay}
                      </span>
                    </div>

                    {/* Sender Identity */}
                    <div className="mb-3">
                      <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                        {inq.name || inq.company || 'Website Visitor'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                        <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{inq.email}</span>
                        <button
                          onClick={() => handleCopy(inq.email, 'email address', inq.id)}
                          className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
                          title="Copy email"
                        >
                          {copiedId === inq.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {inq.company && inq.company !== inq.name && (
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                          <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="truncate">{inq.company}</span>
                        </div>
                      )}
                    </div>

                    {/* Service & Budget/Slot Highlights */}
                    <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-800/60 mb-3 space-y-1.5 text-xs">
                      {inq.service && (
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-500 font-medium shrink-0">Service:</span>
                          <span className="text-zinc-300 truncate">{inq.service}</span>
                        </div>
                      )}
                      {inq.budget && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 font-medium shrink-0">Budget:</span>
                          <span className="text-emerald-400 font-semibold">{inq.budget}</span>
                        </div>
                      )}
                      {inq.slot && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 font-medium shrink-0">Call Slot:</span>
                          <span className="text-purple-300 font-semibold">{inq.slot}</span>
                        </div>
                      )}
                      {inq.quote?.total && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 font-medium shrink-0">Est. Total:</span>
                          <span className="text-emerald-400 font-mono font-bold">
                            {inq.currency === 'INR' ? '₹' : '$'}
                            {inq.quote.total.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Short Message Snippet */}
                    {inq.message && (
                      <p className="text-xs text-zinc-400 line-clamp-2 italic mb-3">
                        "{inq.message}"
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {inq.status !== 'converted' && (
                        <button
                          onClick={() => handleConvertToClient(inq)}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                          title="Convert to Client Record"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Convert</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(inq.id, inq.name || inq.email)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
        )}

        {/* Pagination Bar */}
        {filtered.length > 0 && (
          <div className="pt-4 border-t border-zinc-800/80">
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

        {/* Inquiry Detail Modal / Drawer */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      Inquiry Details
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                        {selectedInquiry.id}
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400">
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
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Status & Quick Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-medium">Status:</span>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) =>
                        handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)
                      }
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="new">New / Unread</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: Your Project with My Planet Services`}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    {selectedInquiry.status !== 'converted' && (
                      <button
                        onClick={() => {
                          const target = selectedInquiry;
                          setSelectedInquiry(null);
                          handleConvertToClient(target);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Convert to Client</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Prospect Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-3">
                    <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-500 block">Name:</span>
                        <span className="text-white font-medium text-sm">
                          {selectedInquiry.name || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Email:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-mono font-medium">
                            {selectedInquiry.email}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(selectedInquiry.email, 'email', 'modal-email')
                            }
                            className="text-zinc-500 hover:text-zinc-300"
                          >
                            {copiedId === 'modal-email' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Company:</span>
                        <span className="text-zinc-300">
                          {selectedInquiry.company || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-3">
                    <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Submission Metadata
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-500 block">Source Channel:</span>
                        <span className="text-zinc-300">
                          {selectedInquiry.source || 'Website'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Region / Timezone:</span>
                        <span className="text-zinc-300">
                          {selectedInquiry.region || 'Global'} /{' '}
                          {selectedInquiry.timeZone || 'UTC'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Notification Status:</span>
                        <span className="text-emerald-400">
                          Team: {selectedInquiry.teamEmailStatus || 'Sent'} | Visitor:{' '}
                          {selectedInquiry.clientEmailStatus || 'Sent'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope & Requirement */}
                <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Project Request
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {selectedInquiry.service && (
                      <div>
                        <span className="text-zinc-500 block">Service Requested:</span>
                        <span className="text-white font-medium">
                          {selectedInquiry.service}
                        </span>
                      </div>
                    )}
                    {selectedInquiry.budget && (
                      <div>
                        <span className="text-zinc-500 block">Target Budget:</span>
                        <span className="text-emerald-400 font-semibold">
                          {selectedInquiry.budget}
                        </span>
                      </div>
                    )}
                    {selectedInquiry.slot && (
                      <div>
                        <span className="text-zinc-500 block">Preferred Discovery Slot:</span>
                        <span className="text-purple-300 font-semibold">
                          {selectedInquiry.slot}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedInquiry.message && (
                    <div className="pt-2 border-t border-zinc-800">
                      <span className="text-zinc-500 text-xs block mb-1">Message:</span>
                      <p className="text-sm text-zinc-200 bg-zinc-900/90 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                        {selectedInquiry.message}
                      </p>
                    </div>
                  )}

                  {selectedInquiry.quote?.bundled && (
                    <div className="pt-2 border-t border-zinc-800">
                      <span className="text-zinc-500 text-xs block mb-1">
                        Bundled Services:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedInquiry.quote.bundled.map((b: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Internal Agency Notes */}
                <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Internal Studio Notes
                  </h4>
                  <textarea
                    defaultValue={selectedInquiry.notes || ''}
                    placeholder="Add private team notes regarding this lead, discovery call outcomes, or quotation notes..."
                    onBlur={(e) => {
                      updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, e.target.value);
                      toast.success('Notes saved');
                    }}
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                <button
                  onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name || selectedInquiry.email)}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry</span>
                </button>

                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
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
      </div>
    </AdminLayout>
  );
}
