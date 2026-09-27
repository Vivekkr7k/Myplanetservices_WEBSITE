import { ClientRecord } from '../../lib/client-records';
import {
  X,
  Edit3,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Layers,
  Mail,
  Phone,
} from 'lucide-react';

interface ClientDetailDrawerProps {
  client: ClientRecord;
  onClose: () => void;
  onEdit: (client: ClientRecord) => void;
  onViewQuotation: (client: ClientRecord) => void;
  onDelete?: (id: string, name: string) => void;
}

export function ClientDetailDrawer({ client, onClose, onEdit, onViewQuotation, onDelete }: ClientDetailDrawerProps) {
  const isFixed = client.engagementType === 'fixed';
  const currSym = client.currency === 'USD' ? '$' : '₹';

  const formatMoney = (amount?: number) => {
    if (amount === undefined || amount === null) return `${currSym}0`;
    return `${currSym}${amount.toLocaleString()}`;
  };

  const advancePercentage = isFixed && client.totalQuoted
    ? Math.min(Math.round(((client.advancePaid || 0) / client.totalQuoted) * 100), 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full sm:max-w-2xl bg-card text-foreground border-l border-border h-[100dvh] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-border bg-secondary/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-butter text-butter-foreground font-display font-bold text-base sm:text-lg flex items-center justify-center shrink-0 shadow-xs">
              {client.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-foreground truncate">
                  {client.companyName}
                </h2>
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
              <p className="text-xs text-muted-foreground truncate">
                Lead: <span className="font-medium text-foreground">{client.clientName}</span> • Added{' '}
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => onEdit(client)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-secondary text-foreground hover:bg-butter hover:text-butter-foreground text-xs font-semibold border border-border transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(client.id, client.companyName)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold border border-red-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Delete Client Record"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Quick Action: View Quotation */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-butter/15 border border-butter/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-butter text-butter-foreground flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground font-display">Client Quotation & Terms</div>
                <div className="text-[11px] text-muted-foreground">View or print official studio commercial slip</div>
              </div>
            </div>
            <button
              onClick={() => onViewQuotation(client)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-102 transition-all shadow-xs cursor-pointer text-center"
            >
              View Quotation
            </button>
          </div>

          {/* Contact Details Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/30 border border-border space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
              Contact Channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div className="flex items-center gap-2 text-foreground truncate">
                <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <a href={`mailto:${client.email}`} className="hover:underline truncate">
                  {client.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-foreground truncate">
                <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <a href={`tel:${client.phone}`} className="hover:underline truncate">
                  {client.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Financials & Commercial Terms */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-butter" /> Commercial Structure & Payments
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary border border-border">
                {isFixed ? 'Fixed Project' : 'Monthly Retainer'}
              </span>
            </div>

            {isFixed ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                    <div className="text-[10px] uppercase font-mono text-muted-foreground">Total Quoted</div>
                    <div className="text-base font-display font-bold text-foreground mt-1">
                      {formatMoney(client.totalQuoted)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                    <div className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400">Advance Paid</div>
                    <div className="text-base font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {formatMoney(client.advancePaid)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                    <div className="text-[10px] uppercase font-mono text-muted-foreground">Remaining</div>
                    <div className="text-base font-display font-bold text-foreground mt-1">
                      {formatMoney((client.totalQuoted || 0) - (client.advancePaid || 0))}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Payment Realization</span>
                    <span className="font-mono font-semibold text-foreground">{advancePercentage}% Collected</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-butter rounded-full transition-all duration-500"
                      style={{ width: `${advancePercentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground text-right">
                    Advance cleared: {client.advancePaidDate || 'N/A'}
                  </div>
                </div>
              </div>
            ) : (
              /* Retainer breakdown */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Monthly Rate</div>
                  <div className="text-base font-display font-bold text-foreground mt-1">
                    {formatMoney(client.monthlyFee)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">/ month</div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-[10px] uppercase font-mono text-muted-foreground">Agreed Duration</div>
                  <div className="text-base font-display font-bold text-foreground mt-1">
                    {client.durationMonths ? `${client.durationMonths} Mos` : 'Ongoing'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Done: {client.monthsCompleted || 0}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400">Advance Deposit</div>
                  <div className="text-base font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatMoney(client.advanceDepositPaid)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Next: {client.renewalDate || 'N/A'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline & Sprints */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-butter" /> Project Timeline & Milestones
            </h3>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/30 border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 text-xs">
                <div>
                  <span className="text-muted-foreground">Start:</span>{' '}
                  <span className="font-mono font-medium text-foreground">
                    {isFixed ? client.projectStartDate || 'Pending' : client.startDate || 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target / Renewal:</span>{' '}
                  <span className="font-mono font-medium text-foreground">
                    {isFixed ? client.projectEndDate || 'Pending' : client.renewalDate || 'Pending'}
                  </span>
                </div>
              </div>

              {client.currentPhase && (
                <div className="px-3 py-2 rounded-xl bg-card border border-border/80 text-xs">
                  <span className="text-muted-foreground font-mono text-[11px] block mb-0.5">Current Focus:</span>
                  <span className="font-medium text-foreground">{client.currentPhase}</span>
                </div>
              )}

              {/* Milestones list */}
              {isFixed && client.milestones && client.milestones.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border">
                  {client.milestones.map((ms) => (
                    <div
                      key={ms.id}
                      className="p-2.5 rounded-xl bg-card border border-border text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            ms.status === 'completed'
                              ? 'bg-emerald-500'
                              : ms.status === 'in_progress'
                              ? 'bg-amber-500'
                              : 'bg-zinc-400'
                          }`}
                        />
                        <span className="font-medium text-foreground truncate">{ms.title}</span>
                      </div>
                      <div className="text-right shrink-0 font-mono">
                        <div className="font-semibold text-foreground">{formatMoney(ms.amount)}</div>
                        <div className="text-[10px] text-muted-foreground">{ms.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Services Disciplines */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-butter" /> Services Provided
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {client.services.map((svc) => (
                <span
                  key={svc}
                  className="px-2.5 py-1 rounded-xl bg-secondary text-foreground text-xs font-medium border border-border"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Documents Vault */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-butter" /> Documents & Contracts ({client.documents.length})
            </h3>
            <div className="space-y-1.5">
              {client.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-secondary/40 border border-border flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-butter shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate">{doc.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">
                        {doc.dateAdded} • {doc.fileSize || 'PDF Document'}
                      </div>
                    </div>
                  </div>
                  {doc.type === 'quotation' ? (
                    <button
                      onClick={() => onViewQuotation(client)}
                      className="px-2.5 py-1 rounded-lg bg-card text-foreground hover:bg-butter hover:text-butter-foreground text-[11px] font-semibold border border-border transition-colors shrink-0 cursor-pointer"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-[11px] text-muted-foreground font-mono uppercase px-2 py-0.5 rounded bg-card shrink-0">
                      {doc.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          {client.notes && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Squad Notes
              </h3>
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border text-xs text-muted-foreground leading-relaxed">
                {client.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
