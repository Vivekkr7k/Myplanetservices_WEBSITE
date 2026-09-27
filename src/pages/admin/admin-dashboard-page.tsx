import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/admin-layout';
import {
  ClientRecord,
  getClientRecords,
  saveClientRecord,
  saveClientRecordAsync,
  deleteClientRecord,
  deleteClientRecordAsync,
  resetToDemoClients,
  syncClientsWithBackend,
} from '../../lib/client-records';
import {
  InquiryRecord,
  fetchInquiries,
} from '../../lib/inquiries';
import { useCurrency } from '../../lib/currency-context';
import { ClientModal } from '../../components/admin/client-modal';
import { QuotationModal } from '../../components/admin/quotation-modal';
import { ClientDetailDrawer } from '../../components/admin/client-detail-drawer';
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  FileText,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  Inbox,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { currency } = useCurrency();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  // Modal states
  const [selectedClientForDrawer, setSelectedClientForDrawer] = useState<ClientRecord | null>(null);
  const [selectedClientForQuote, setSelectedClientForQuote] = useState<ClientRecord | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);

  useEffect(() => {
    setClients(getClientRecords());
    syncClientsWithBackend().then((res) => {
      setClients(res.clients);
    });
    fetchInquiries().then((res) => {
      setInquiries(res.data);
    });
  }, []);

  const handleSaveClient = (record: ClientRecord) => {
    const updated = saveClientRecord(record);
    setClients(updated);
    setIsClientModalOpen(false);
    setEditingClient(null);
    toast.success('Client record saved successfully');
    saveClientRecordAsync(record).catch(() => {});
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete client record for "${name}"?`)) {
      const updated = deleteClientRecord(id);
      setClients(updated);
      setSelectedClientForDrawer(null);
      toast.success('Client record deleted');
      deleteClientRecordAsync(id).catch(() => {});
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all clients back to default studio demo data?')) {
      const reset = resetToDemoClients();
      setClients(reset);
      toast.success('Demo records restored');
    }
  };

  // Convert or format amounts based on active currency
  // Using baseline 1 USD = 83 INR
  const FX_RATE = 83;
  const toDisplay = (amount: number, clientCur: 'USD' | 'INR') => {
    if (clientCur === currency) return amount;
    if (currency === 'USD' && clientCur === 'INR') return Math.round(amount / FX_RATE);
    if (currency === 'INR' && clientCur === 'USD') return Math.round(amount * FX_RATE);
    return amount;
  };

  const currSym = currency === 'USD' ? '$' : '₹';
  const formatMoney = (val: number) => `${currSym}${val.toLocaleString()}`;

  // KPI Calculations
  const activeClients = clients.filter((c) => c.status === 'active');
  const retainerClients = activeClients.filter((c) => c.engagementType === 'retainer');
  const fixedClients = activeClients.filter((c) => c.engagementType === 'fixed');

  // Retainer MRR
  const mrr = retainerClients.reduce((acc, c) => acc + toDisplay(c.monthlyFee || 0, c.currency), 0);

  // Total Contract Value (TCV)
  const totalContractValue = clients.reduce((acc, c) => {
    if (c.engagementType === 'fixed') {
      return acc + toDisplay(c.totalQuoted || 0, c.currency);
    } else {
      const duration = c.durationMonths || 6;
      return acc + toDisplay((c.monthlyFee || 0) * duration, c.currency);
    }
  }, 0);

  // Pending Receivables on Fixed Projects (Total Quoted - Advance Paid)
  const pendingReceivables = fixedClients.reduce((acc, c) => {
    const remaining = (c.totalQuoted || 0) - (c.advancePaid || 0);
    return acc + toDisplay(Math.max(remaining, 0), c.currency);
  }, 0);

  // Advance Collected
  const advanceCollected = clients.reduce((acc, c) => {
    if (c.engagementType === 'fixed') {
      return acc + toDisplay(c.advancePaid || 0, c.currency);
    } else {
      return acc + toDisplay(c.advanceDepositPaid || 0, c.currency);
    }
  }, 0);

  return (
    <AdminLayout
      title="Studio Executive Dashboard"
      subtitle="Financial health, active client retainers, project timelines, and quotation vault."
      actions={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleResetDemo}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl bg-secondary text-foreground text-xs font-medium border border-border hover:bg-secondary/80 transition-colors w-full sm:w-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Reset Demo Records</span>
          </button>
          <button
            onClick={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-102 transition-all shadow-xs w-full sm:w-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Client Record</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5 sm:space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Active Clients */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Active Client Accounts
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <Users className="w-4 h-4 text-butter" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight truncate">
              {activeClients.length} <span className="text-sm font-normal text-muted-foreground">/ {clients.length}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{retainerClients.length} Retainers • {fixedClients.length} Fixed</span>
            </div>
          </div>

          {/* Card 2: Retainer MRR */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Retainer MRR
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <TrendingUp className="w-4 h-4 text-butter" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight truncate">
              {formatMoney(mrr)}
              <span className="text-xs font-normal text-muted-foreground"> /mo</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground truncate">
              Across {retainerClients.length} ongoing active retainer squads
            </div>
          </div>

          {/* Card 3: Total Contract Value */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Total Contract Pipeline
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <DollarSign className="w-4 h-4 text-butter" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight truncate">
              {formatMoney(totalContractValue)}
            </div>
            <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{formatMoney(advanceCollected)} advances received</span>
            </div>
          </div>

          {/* Card 4: Pending Receivables */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Pending Receivables
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight truncate">
              {formatMoney(pendingReceivables)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground truncate">
              Fixed project balance due upon milestone handoffs
            </div>
          </div>
        </div>

        {/* Section: Inbound Leads & Website Form Submissions */}
        <div className="rounded-2xl sm:rounded-[32px] bg-card border border-border/80 p-4 sm:p-7 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
            <div>
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-500" />
                <span>Recent Website Inquiries & Leads</span>
                {inquiries.filter((i) => i.status === 'new').length > 0 && (
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono font-semibold animate-pulse">
                    {inquiries.filter((i) => i.status === 'new').length} New
                  </span>
                )}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Incoming project briefs, discovery call bookings, and instant estimate leads.
              </p>
            </div>
            <Link
              to="/admin/inquiries"
              className="text-xs font-semibold text-foreground bg-secondary hover:bg-butter hover:text-butter-foreground px-3 py-1.5 rounded-xl border border-border transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>View All Inquiries</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {inquiries.slice(0, 3).map((inq) => {
              const isNew = inq.status === 'new';
              const typeLabel =
                inq.type === 'brief'
                  ? 'Project Brief'
                  : inq.type === 'booking'
                  ? 'Discovery Call'
                  : 'Quick Lead';
              const badgeClass =
                inq.type === 'brief'
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  : inq.type === 'booking'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

              return (
                <Link
                  key={inq.id}
                  to="/admin/inquiries"
                  className={`p-3.5 rounded-xl sm:rounded-2xl bg-secondary/30 hover:bg-secondary/70 border transition-all flex flex-col justify-between group ${
                    isNew ? 'border-purple-500/40 ring-1 ring-purple-500/20' : 'border-border'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border uppercase tracking-wider ${badgeClass}`}
                      >
                        {typeLabel}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(inq.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="font-display font-semibold text-sm text-foreground group-hover:text-purple-400 transition-colors truncate">
                      {inq.name || inq.company || inq.email}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {inq.email}
                    </div>

                    {(inq.budget || inq.slot || inq.service) && (
                      <div className="mt-2.5 pt-2 border-t border-border/60 text-xs flex items-center justify-between gap-2">
                        <span className="text-muted-foreground truncate">
                          {inq.service || 'Service Request'}
                        </span>
                        {(inq.budget || inq.slot) && (
                          <span className="font-semibold text-foreground shrink-0 font-mono text-[11px]">
                            {inq.budget || inq.slot}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section: Project Timelines & Active Sprints */}
        <div className="rounded-2xl sm:rounded-[32px] bg-card border border-border/80 p-4 sm:p-7 shadow-soft">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="font-display text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <span>Active Project Timelines & Sprints</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-butter text-butter-foreground font-mono font-semibold">
                  Live
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time delivery progress, milestone deadlines, and active focus phases.
              </p>
            </div>
            <Link
              to="/admin/clients"
              className="text-xs font-semibold text-butter-foreground bg-secondary hover:bg-butter px-3 py-1.5 rounded-xl border border-border transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Directory</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {clients
              .filter((c) => c.status === 'active')
              .map((client) => {
                const isFixed = client.engagementType === 'fixed';
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientForDrawer(client)}
                    className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary/30 hover:bg-secondary/60 border border-border transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-butter text-butter-foreground font-bold flex items-center justify-center text-xs font-display shrink-0 shadow-2xs">
                          {client.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-display font-semibold text-sm text-foreground group-hover:text-butter transition-colors truncate">
                            {client.companyName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            Lead: {client.clientName} • {isFixed ? 'Fixed Project' : 'Monthly Retainer'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        {isFixed ? (
                          <div className="text-left sm:text-right">
                            <span className="text-muted-foreground text-[11px]">Timeline: </span>
                            <span className="font-medium text-foreground">
                              {client.projectStartDate || 'TBD'} → {client.projectEndDate || 'TBD'}
                            </span>
                          </div>
                        ) : (
                          <div className="text-left sm:text-right">
                            <span className="text-muted-foreground text-[11px]">Next Renewal: </span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              {client.renewalDate || 'Pending'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phase Focus */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-border/60">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase text-muted-foreground shrink-0">Focus:</span>
                        <span className="font-medium text-foreground text-xs truncate">
                          {client.currentPhase || `${client.services.slice(0, 2).join(', ')} ongoing delivery`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClientForQuote(client);
                          }}
                          className="text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline py-0.5 px-1.5 rounded-md hover:bg-card"
                        >
                          <FileText className="w-3 h-3 text-butter" />
                          <span>Quotation Slip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 2-Column Grid: Retainer Billing Radar & Quotations Vault */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Col 1: Retainer Billing Radar */}
          <div className="rounded-2xl sm:rounded-[32px] bg-card border border-border/80 p-4 sm:p-6 shadow-soft space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span>Retainer Commitments</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-butter text-butter-foreground font-semibold">
                  {retainerClients.length} Active
                </span>
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly ongoing squads with advance security deposits and scheduled cycle dates.
            </p>

            <div className="space-y-2.5">
              {retainerClients.map((ret) => (
                <div
                  key={ret.id}
                  onClick={() => setSelectedClientForDrawer(ret)}
                  className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-secondary/40 border border-border flex items-center justify-between gap-2.5 text-xs hover:border-butter/50 transition-all cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-semibold text-foreground truncate">{ret.companyName}</div>
                    <div className="text-muted-foreground text-[11px] mt-0.5 truncate">
                      Cycle Day: {ret.billingCycleDay || 1}st • {ret.durationMonths} Mos
                    </div>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <div className="font-bold text-xs sm:text-sm text-foreground">
                      {ret.currency === 'USD' ? '$' : '₹'}
                      {ret.monthlyFee?.toLocaleString()}
                      <span className="text-[10px] text-muted-foreground font-normal"> /mo</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Adv: {ret.currency === 'USD' ? '$' : '₹'}{ret.advanceDepositPaid?.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Quotations & Documents Vault */}
          <div className="rounded-2xl sm:rounded-[32px] bg-card border border-border/80 p-4 sm:p-6 shadow-soft space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span>Recent Client Quotations & SOWs</span>
              </h3>
              <Link
                to="/admin/quotations"
                className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Commercial proposals, scope documents, and delivery sign-offs.
            </p>

            <div className="space-y-2.5">
              {clients
                .flatMap((c) =>
                  c.documents.map((d) => ({
                    ...d,
                    client: c,
                  }))
                )
                .slice(0, 4)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-secondary/40 border border-border flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center text-butter border border-border shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground truncate">{doc.title}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {doc.client.companyName} • {doc.dateAdded}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedClientForQuote(doc.client)}
                      className="px-2.5 py-1.5 rounded-lg bg-card text-foreground hover:bg-butter hover:text-butter-foreground text-xs font-semibold border border-border transition-colors shrink-0 cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
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
