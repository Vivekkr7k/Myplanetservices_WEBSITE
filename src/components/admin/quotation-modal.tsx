import { ClientRecord } from '../../lib/client-records';
import { X, Printer, CheckCircle2, Shield, Mail, Phone } from 'lucide-react';

interface QuotationModalProps {
  client: ClientRecord;
  onClose: () => void;
}

export function QuotationModal({ client, onClose }: QuotationModalProps) {
  const isFixed = client.engagementType === 'fixed';
  const currSym = client.currency === 'USD' ? '$' : '₹';

  const formatMoney = (amount?: number) => {
    if (amount === undefined || amount === null) return `${currSym}0`;
    return `${currSym}${amount.toLocaleString()}`;
  };

  const quotationDoc = client.documents.find((d) => d.type === 'quotation');
  const quoteNumber = quotationDoc ? quotationDoc.title.split(' ')[1] || `Q-2026-${client.id.slice(-3)}` : `Q-2026-${client.id.slice(-3)}`;
  const quoteDate = quotationDoc ? quotationDoc.dateAdded : new Date(client.createdAt).toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      <div className="bg-card text-foreground border border-border rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[95dvh] sm:max-h-[90vh]">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-secondary/40 shrink-0 print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-butter shrink-0" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground truncate">
              Studio Quotation & Scope
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-foreground text-xs font-medium border border-border hover:bg-butter hover:text-butter-foreground transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 bg-background print:p-0 print:bg-white print:text-black">
          {/* Header & Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-butter text-butter-foreground flex items-center justify-center font-display font-bold text-base shadow-xs print:border print:border-black">
                  MP
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-foreground print:text-black">
                    My Planet Services
                  </h2>
                  <p className="text-xs font-mono text-muted-foreground">SaaS, Web & AI Engineering Studio</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bengaluru, Karnataka, India • vivek@myplanetservices.com • +91-78081-58221<br />
                <span className="font-mono text-[11px]">https://myplanetservices.com</span>
              </p>
            </div>

            <div className="sm:text-right bg-secondary/50 print:bg-gray-100 p-4 rounded-2xl border border-border/80">
              <span className="text-[11px] uppercase font-mono tracking-wider font-semibold text-butter-foreground bg-butter px-2.5 py-0.5 rounded-full inline-block mb-1">
                Commercial Quotation
              </span>
              <div className="font-mono text-sm font-bold text-foreground print:text-black">{quoteNumber}</div>
              <div className="text-xs text-muted-foreground mt-1">Issue Date: <span className="font-medium text-foreground print:text-black">{quoteDate}</span></div>
              <div className="text-xs text-muted-foreground">Valid for: <span className="font-medium text-foreground print:text-black">30 Days</span></div>
            </div>
          </div>

          {/* Client Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-semibold block mb-2">
                Client Organization
              </span>
              <div className="font-display font-semibold text-base text-foreground print:text-black mb-1">
                {client.companyName}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground print:text-black">Stakeholder:</span> {client.clientName}
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> {client.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> {client.phone}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-semibold block mb-2">
                Engagement Model
              </span>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-butter text-butter-foreground">
                  {isFixed ? 'Fixed-Time Sprint Project' : 'Dedicated Squad Retainer'}
                </span>
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  Status: {client.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {isFixed ? (
                  <div>
                    <span className="font-medium text-foreground print:text-black">Project Timeline:</span>{' '}
                    {client.projectStartDate || 'TBD'} to {client.projectEndDate || 'TBD'}
                  </div>
                ) : (
                  <div>
                    <span className="font-medium text-foreground print:text-black">Contract Duration:</span>{' '}
                    {client.durationMonths ? `${client.durationMonths} Months` : 'Month-to-month (Ongoing)'}
                  </div>
                )}
                <div className="mt-1">
                  <span className="font-medium text-foreground print:text-black">Billing Currency:</span>{' '}
                  {client.currency}
                </div>
              </div>
            </div>
          </div>

          {/* Scope of Services Table */}
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>Scope of Deliverables & Services</span>
              <span className="text-xs text-muted-foreground font-normal">({client.services.length} Core Disciplines)</span>
            </h3>

            <div className="rounded-2xl border border-border overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-secondary/60 text-muted-foreground font-mono uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Engineering Discipline</th>
                    <th className="p-3">Delivery Model</th>
                    <th className="p-3 text-right">Cadence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {client.services.map((svc, idx) => (
                    <tr key={svc} className="hover:bg-secondary/20">
                      <td className="p-3 font-mono text-muted-foreground">{idx + 1}</td>
                      <td className="p-3 font-medium text-foreground print:text-black">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-butter" />
                          <span>{svc}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">Production-Grade Handoff & IP Transfer</td>
                      <td className="p-3 text-right font-mono text-foreground print:text-black">
                        {isFixed ? 'Milestone Based' : 'Weekly Live Sprints'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commercial Terms & Advance Details */}
          <div className="p-5 rounded-2xl bg-secondary/40 border border-border">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">
              Financial Breakdown & Terms
            </h3>

            {isFixed ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-card border border-border/80">
                  <div className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">Total Quoted Value</div>
                  <div className="text-xl font-display font-bold text-foreground print:text-black mt-1">
                    {formatMoney(client.totalQuoted)}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Fixed contract fee</div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/80">
                  <div className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Advance Received
                  </div>
                  <div className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatMoney(client.advancePaid)}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Cleared on {client.advancePaidDate || 'Initiation'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/80">
                  <div className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">Remaining Balance</div>
                  <div className="text-xl font-display font-bold text-foreground print:text-black mt-1">
                    {formatMoney((client.totalQuoted || 0) - (client.advancePaid || 0))}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Payable on milestone sign-offs</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-card border border-border/80">
                  <div className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">Monthly Retainer Fee</div>
                  <div className="text-xl font-display font-bold text-foreground print:text-black mt-1">
                    {formatMoney(client.monthlyFee)} <span className="text-xs font-normal text-muted-foreground">/ month</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Billed every {client.billingCycleDay || 1}st of month</div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/80">
                  <div className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">Retainer Commitment</div>
                  <div className="text-xl font-display font-bold text-foreground print:text-black mt-1">
                    {client.durationMonths ? `${client.durationMonths} Months` : 'Ongoing'}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Completed: {client.monthsCompleted || 0} cycles
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/80">
                  <div className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Advance Deposit Paid
                  </div>
                  <div className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatMoney(client.advanceDepositPaid)}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Initial security / cycle 1 advance</div>
                </div>
              </div>
            )}

            {/* Milestones if Fixed */}
            {isFixed && client.milestones && client.milestones.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Milestone Disbursement Schedule
                </h4>
                <div className="space-y-1.5">
                  {client.milestones.map((ms) => (
                    <div
                      key={ms.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-card/80 border border-border/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ms.status === 'completed'
                              ? 'bg-emerald-500'
                              : ms.status === 'in_progress'
                              ? 'bg-amber-500'
                              : 'bg-zinc-400'
                          }`}
                        />
                        <span className="font-medium text-foreground print:text-black">{ms.title}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-muted-foreground text-[11px]">Due {ms.dueDate}</span>
                        <span className="font-semibold text-foreground print:text-black">{formatMoney(ms.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legal / Studio Guarantee Terms */}
          <div className="p-4 rounded-2xl bg-card border border-border text-xs text-muted-foreground space-y-2">
            <div className="font-semibold text-foreground print:text-black flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-butter" /> Studio Standard Terms & IP Ownership
            </div>
            <p className="leading-relaxed">
              1. <strong>100% Intellectual Property Transfer:</strong> Upon final milestone settlement, the client retains 100% ownership of all source code, assets, Figma files, and infrastructure scripts with zero vendor lock-in.
            </p>
            <p className="leading-relaxed">
              2. <strong>Warranty & Code Guarantees:</strong> All production deliveries include a 30-day post-launch bug warranty covering SLA uptime, cross-browser stability, and Core Web Vitals guarantees.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-xs">
            <div>
              <div className="h-10 sm:h-12 border-b border-muted-foreground/30 flex items-end pb-1 font-serif italic text-muted-foreground">
                Vivek Kumar
              </div>
              <div className="mt-1.5 font-semibold text-foreground print:text-black">Vivek Kumar</div>
              <div className="text-muted-foreground text-[11px]">Founder & Studio Lead, My Planet Services</div>
            </div>

            <div>
              <div className="h-10 sm:h-12 border-b border-muted-foreground/30 flex items-end pb-1 font-serif italic text-muted-foreground">
                {client.clientName}
              </div>
              <div className="mt-1.5 font-semibold text-foreground print:text-black">{client.clientName}</div>
              <div className="text-muted-foreground text-[11px]">Authorized Signatory, {client.companyName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
