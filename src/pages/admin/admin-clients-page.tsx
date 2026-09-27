import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '../../components/admin/admin-layout';
import {
  ClientRecord,
  getClientRecords,
  saveClientRecord,
  deleteClientRecord,
  syncClientsWithBackend,
  saveClientRecordAsync,
  deleteClientRecordAsync,
} from '../../lib/client-records';
import { ClientModal } from '../../components/admin/client-modal';
import { QuotationModal } from '../../components/admin/quotation-modal';
import { ClientDetailDrawer } from '../../components/admin/client-detail-drawer';
import { AdminPagination } from '../../components/admin/admin-pagination';
import {
  Search,
  Plus,
  Download,
  FileText,
  Edit3,
  Trash2,
  Eye,
  Briefcase,
  LayoutGrid,
  List,
  ArrowUpDown,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'fixed' | 'retainer' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'value_desc' | 'balance_desc'>('newest');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [selectedClientForDrawer, setSelectedClientForDrawer] = useState<ClientRecord | null>(null);
  const [selectedClientForQuote, setSelectedClientForQuote] = useState<ClientRecord | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);

  useEffect(() => {
    setClients(getClientRecords());
    syncClientsWithBackend().then((res) => {
      setClients(res.clients);
    });
  }, []);

  const handleSaveClient = async (record: ClientRecord) => {
    const updated = saveClientRecord(record);
    setClients(updated);
    setIsClientModalOpen(false);
    setEditingClient(null);
    toast.success('Client record updated');
    saveClientRecordAsync(record).catch(() => {});
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete client record for "${name}"?`)) {
      const updated = deleteClientRecord(id);
      setClients(updated);
      toast.success('Client record deleted');
      deleteClientRecordAsync(id).catch(() => {});
    }
  };

  const handleCopyText = (text: string, label: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mps-clients-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Client database exported as JSON');
  };

  // Reset page to 1 when filters or search change
  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filtered & Sorted Data
  const processedClients = useMemo(() => {
    let result = clients.filter((c) => {
      const matchesSearch =
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeFilter === 'fixed') return c.engagementType === 'fixed';
      if (activeFilter === 'retainer') return c.engagementType === 'retainer';
      if (activeFilter === 'active') return c.status === 'active';
      if (activeFilter === 'completed') return c.status === 'completed';
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.companyName.localeCompare(b.companyName);
      }
      if (sortBy === 'value_desc') {
        const valA = a.engagementType === 'fixed' ? a.totalQuoted || 0 : (a.monthlyFee || 0) * (a.durationMonths || 1);
        const valB = b.engagementType === 'fixed' ? b.totalQuoted || 0 : (b.monthlyFee || 0) * (b.durationMonths || 1);
        return valB - valA;
      }
      if (sortBy === 'balance_desc') {
        const balA = a.engagementType === 'fixed' ? (a.totalQuoted || 0) - (a.advancePaid || 0) : a.monthlyFee || 0;
        const balB = b.engagementType === 'fixed' ? (b.totalQuoted || 0) - (b.advancePaid || 0) : b.monthlyFee || 0;
        return balB - balA;
      }
      // Newest first default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [clients, searchQuery, activeFilter, sortBy]);

  // Paginated Slice
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedClients.slice(start, start + itemsPerPage);
  }, [processedClients, currentPage, itemsPerPage]);

  return (
    <AdminLayout
      title="Client Directory & Engagements"
      subtitle="Manage fixed-price contracts, ongoing squad retainers, milestones, and quotations."
      actions={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl bg-secondary text-foreground text-xs font-medium border border-border hover:bg-secondary/80 transition-colors w-full sm:w-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export Database</span>
          </button>
          <button
            onClick={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-102 transition-all shadow-xs w-full sm:w-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Client</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Search, Filters, Sort & View Controls Bar */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company, stakeholder, email, or discipline..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl sm:rounded-2xl bg-background border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-butter/50"
              />
            </div>

            {/* Sort Dropdown & View Mode Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-secondary/70 px-3 py-1.5 rounded-xl sm:rounded-2xl border border-border text-xs flex-1 sm:flex-none justify-between sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground hidden sm:inline text-[11px] font-mono">Sort:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Company Name (A-Z)</option>
                  <option value="value_desc">Highest Contract Value</option>
                  <option value="balance_desc">Highest Balance Due</option>
                </select>
              </div>

              {/* View Toggle (Cards vs Table) */}
              <div className="flex items-center bg-secondary/70 p-1 rounded-xl sm:rounded-2xl border border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  title="Card View"
                  className={`p-1.5 rounded-lg sm:rounded-xl transition-all ${
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
                  title="Table View"
                  className={`p-1.5 rounded-lg sm:rounded-xl transition-all ${
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

          {/* Horizontally Swipeable Filter Pills Row on Mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 sm:pt-3 border-t border-border/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 no-scrollbar sm:flex-wrap w-full">
              {[
                { id: 'all', label: 'All Accounts', count: clients.length },
                { id: 'fixed', label: 'Fixed Sprints', count: clients.filter((c) => c.engagementType === 'fixed').length },
                { id: 'retainer', label: 'Monthly Retainers', count: clients.filter((c) => c.engagementType === 'retainer').length },
                { id: 'active', label: 'Active', count: clients.filter((c) => c.status === 'active').length },
                { id: 'completed', label: 'Completed', count: clients.filter((c) => c.status === 'completed').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-butter text-butter-foreground font-semibold shadow-xs'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      activeFilter === tab.id ? 'bg-butter-foreground/20 text-butter-foreground' : 'bg-card text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-[11px] sm:text-xs text-muted-foreground font-mono shrink-0">
              Filtered: <span className="font-semibold text-foreground">{processedClients.length}</span> records
            </div>
          </div>
        </div>

        {/* Content Body: Either Cards or Table View */}
        {processedClients.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-card border border-border text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40 animate-pulse" />
            <p className="text-sm font-semibold text-foreground">No client records matched your criteria.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search keywords or switching filter tabs.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setCurrentPage(1);
              }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-butter-foreground bg-butter px-3 py-1.5 rounded-xl shadow-xs hover:scale-105 transition-transform"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards Grid View */
          <div className="space-y-4">
            {paginatedClients.map((client) => {
              const isFixed = client.engagementType === 'fixed';
              const currSym = client.currency === 'USD' ? '$' : '₹';

              return (
                <div
                  key={client.id}
                  className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft hover:shadow-md hover:border-butter/40 transition-all relative overflow-hidden group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
                    {/* Left: Client Identity */}
                    <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-butter text-butter-foreground font-display font-bold text-base sm:text-lg flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        {client.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => setSelectedClientForDrawer(client)}
                            className="font-display font-bold text-sm sm:text-base text-foreground hover:text-butter transition-colors cursor-pointer truncate"
                          >
                            {client.companyName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase shrink-0 ${
                              client.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : client.status === 'completed'
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20'
                            }`}
                          >
                            {client.status}
                          </span>
                        </div>

                        {/* Stakeholder & Quick Copy Action */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground mt-1">
                          <span className="truncate">
                            Lead: <span className="font-medium text-foreground">{client.clientName}</span>
                          </span>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(client.email, 'email', `${client.id}-email`)}
                            className="font-mono hover:text-foreground hover:underline inline-flex items-center gap-1 text-[11px] truncate max-w-[200px] sm:max-w-none"
                            title="Click to copy email"
                          >
                            <span className="truncate">{client.email}</span>
                            {copiedId === `${client.id}-email` ? (
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                            ) : (
                              <Copy className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                            )}
                          </button>
                        </div>

                        {/* Services Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-2.5">
                          {client.services.map((svc) => (
                            <span
                              key={svc}
                              className="px-2 py-0.5 rounded-lg bg-secondary text-foreground text-[10px] sm:text-[11px] font-medium border border-border/60"
                            >
                              {svc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Financial Terms & Timeline */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-secondary/40 border border-border/80 text-xs w-full lg:w-auto lg:min-w-[380px]">
                      {isFixed ? (
                        <>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                              Total Quoted
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                              {currSym}{client.totalQuoted?.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 block">
                              Advance Paid
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                              {currSym}{client.advancePaid?.toLocaleString()}
                            </span>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                              Balance Due
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                              {currSym}{((client.totalQuoted || 0) - (client.advancePaid || 0)).toLocaleString()}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                              Monthly Fee
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                              {currSym}{client.monthlyFee?.toLocaleString()}
                              <span className="text-[10px] text-muted-foreground font-normal"> /mo</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                              Duration
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                              {client.durationMonths ? `${client.durationMonths} Mos` : 'Ongoing'}
                            </span>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 block">
                              Advance Dep
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                              {currSym}{client.advanceDepositPaid?.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                      <button
                        onClick={() => setSelectedClientForQuote(client)}
                        title="View Official Quotation"
                        className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-xl bg-secondary text-foreground hover:bg-butter hover:text-butter-foreground text-xs font-semibold border border-border transition-all inline-flex items-center gap-1.5 shadow-2xs hover:scale-102 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Quotation</span>
                      </button>

                      <button
                        onClick={() => setSelectedClientForDrawer(client)}
                        title="View Full Profile"
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer shrink-0"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setIsClientModalOpen(true);
                        }}
                        title="Edit Record"
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer shrink-0"
                      >
                        <Edit3 className="w-4 h-4 text-muted-foreground" />
                      </button>

                      <button
                        onClick={() => handleDeleteClient(client.id, client.companyName)}
                        title="Delete Record"
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border transition-colors cursor-pointer shrink-0"
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
          <div className="rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[680px]">
                <thead className="bg-secondary/70 text-muted-foreground font-mono uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="p-4">Client / Company</th>
                    <th className="p-4">Engagement</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Financials</th>
                    <th className="p-4">Timeline / Renewal</th>
                    <th className="p-4">Docs</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedClients.map((client) => {
                    const isFixed = client.engagementType === 'fixed';
                    const currSym = client.currency === 'USD' ? '$' : '₹';

                    return (
                      <tr key={client.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-butter text-butter-foreground font-bold flex items-center justify-center font-display text-xs">
                              {client.companyName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div
                                onClick={() => setSelectedClientForDrawer(client)}
                                className="font-semibold text-foreground hover:text-butter cursor-pointer text-xs"
                              >
                                {client.companyName}
                              </div>
                              <div className="text-[11px] text-muted-foreground">{client.clientName}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary border border-border">
                            {isFixed ? 'Fixed Sprint' : 'Retainer Squad'}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                              client.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>

                        <td className="p-4 font-mono">
                          {isFixed ? (
                            <div>
                              <div className="font-semibold text-foreground">
                                {currSym}{client.totalQuoted?.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                Adv: {currSym}{client.advancePaid?.toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold text-foreground">
                                {currSym}{client.monthlyFee?.toLocaleString()}
                                <span className="text-[10px] text-muted-foreground"> /mo</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground">{client.durationMonths} Mos</div>
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-muted-foreground font-mono text-[11px]">
                          {isFixed ? client.projectEndDate || 'TBD' : `Renews: ${client.renewalDate || 'N/A'}`}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => setSelectedClientForQuote(client)}
                            className="px-2 py-1 rounded-lg bg-secondary hover:bg-butter hover:text-butter-foreground text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Slip</span>
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedClientForDrawer(client)}
                              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingClient(client);
                                setIsClientModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id, client.companyName)}
                              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
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

        {/* Hyper-Optimized Pagination Component */}
        {processedClients.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalItems={processedClients.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(p) => setCurrentPage(p)}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={[4, 8, 16, 32]}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      {selectedClientForDrawer && (
        <ClientDetailDrawer
          client={selectedClientForDrawer}
          onClose={() => setSelectedClientForDrawer(null)}
          onEdit={(c) => {
            setSelectedClientForDrawer(null);
            setEditingClient(c);
            setIsClientModalOpen(true);
          }}
          onViewQuotation={(c) => {
            setSelectedClientForQuote(c);
          }}
          onDelete={handleDeleteClient}
        />
      )}

      {selectedClientForQuote && (
        <QuotationModal
          client={selectedClientForQuote}
          onClose={() => setSelectedClientForQuote(null)}
        />
      )}

      {isClientModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => {
            setIsClientModalOpen(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
        />
      )}
    </AdminLayout>
  );
}
