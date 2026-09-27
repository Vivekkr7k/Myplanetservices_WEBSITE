import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '../../components/admin/admin-layout';
import {
  ClientRecord,
  ClientDocument,
  getClientRecords,
  saveClientRecordAsync,
  syncClientsWithBackend,
} from '../../lib/client-records';
import { QuotationModal } from '../../components/admin/quotation-modal';
import { DocumentModal } from '../../components/admin/document-modal';
import { AdminPagination } from '../../components/admin/admin-pagination';
import {
  FileText,
  Search,
  ExternalLink,
  LayoutGrid,
  List,
  ArrowUpDown,
  Copy,
  Check,
  FolderOpen,
  Plus,
  Edit3,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQuotationsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedQuoteClient, setSelectedQuoteClient] = useState<ClientRecord | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'quotation' | 'contract' | 'sow' | 'invoice'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'company'>('newest');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal states for Document CRUD
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDocInfo, setEditingDocInfo] = useState<{ client: ClientRecord; doc: ClientDocument } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setClients(getClientRecords());
    syncClientsWithBackend().then((res) => {
      setClients(res.clients);
    });
  }, []);

  const handleSaveDocument = async (clientId: string, doc: ClientDocument) => {
    const targetClient = clients.find((c) => c.id === clientId);
    if (!targetClient) {
      toast.error('Client record not found');
      return;
    }

    let updatedDocs: ClientDocument[];
    if (editingDocInfo) {
      updatedDocs = targetClient.documents.map((d) => (d.id === doc.id ? doc : d));
    } else {
      updatedDocs = [doc, ...targetClient.documents];
    }

    const updatedClient: ClientRecord = {
      ...targetClient,
      documents: updatedDocs,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveClientRecordAsync(updatedClient);
    if (res.success) {
      setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));
      toast.success(res.persistedToMongo ? 'Document saved and synced to MongoDB!' : 'Document saved locally');
    } else {
      toast.error('Failed to save document');
    }
    setIsDocModalOpen(false);
    setEditingDocInfo(null);
  };

  const handleDeleteDocument = async (clientId: string, docId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    const targetClient = clients.find((c) => c.id === clientId);
    if (!targetClient) return;

    const updatedDocs = targetClient.documents.filter((d) => d.id !== docId);
    const updatedClient: ClientRecord = {
      ...targetClient,
      documents: updatedDocs,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveClientRecordAsync(updatedClient);
    if (res.success) {
      setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));
      toast.success('Document deleted from MongoDB');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Document title copied to clipboard');
    setTimeout(() => setCopiedId(null), 1800);
  };

  const allDocuments = useMemo(() => {
    return clients.flatMap((client) =>
      client.documents.map((doc) => ({
        ...doc,
        client,
      }))
    );
  }, [clients]);

  // Counts per category
  const counts = useMemo(() => {
    return {
      all: allDocuments.length,
      quotation: allDocuments.filter((d) => d.type === 'quotation').length,
      contract: allDocuments.filter((d) => d.type === 'contract').length,
      sow: allDocuments.filter((d) => d.type === 'sow').length,
      invoice: allDocuments.filter((d) => d.type === 'invoice').length,
    };
  }, [allDocuments]);

  // Filter & Sort
  const processedDocs = useMemo(() => {
    let result = allDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.client.companyName.toLowerCase().includes(search.toLowerCase()) ||
        doc.client.clientName.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (filterType !== 'all') return doc.type === filterType;
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'company') return a.client.companyName.localeCompare(b.client.companyName);
      // Newest date first
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });

    return result;
  }, [allDocuments, search, filterType, sortBy]);

  // Paginated Slice
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedDocs.slice(start, start + itemsPerPage);
  }, [processedDocs, currentPage, itemsPerPage]);

  const handleFilterChange = (type: typeof filterType) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  return (
    <AdminLayout
      title="Quotations & Document Vault"
      subtitle="Client commercial proposals, Master Services Agreements (MSAs), sprint scope docs, and receipts."
    >
      <div className="space-y-6">
        {/* Search, Filter Tabs & View Controls */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft space-y-3 sm:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documents, quotations, or client organizations..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl sm:rounded-2xl bg-background border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-butter/50"
              />
            </div>

            {/* Sort & View Mode Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
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
                  <option value="title">Document Title (A-Z)</option>
                  <option value="company">Client Company (A-Z)</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-secondary/70 p-1 rounded-xl sm:rounded-2xl border border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  title="Card Grid View"
                  className={`p-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
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
                  className={`p-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-butter text-butter-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Add Document Action */}
              <button
                type="button"
                onClick={() => {
                  setEditingDocInfo(null);
                  setIsDocModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl sm:rounded-2xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-102 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Document</span>
              </button>
            </div>
          </div>

          {/* Swipeable Filter Tabs on Mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 sm:pt-3 border-t border-border/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 no-scrollbar sm:flex-wrap w-full">
              {[
                { id: 'all', label: 'All Documents', count: counts.all },
                { id: 'quotation', label: 'Quotations', count: counts.quotation },
                { id: 'contract', label: 'Contracts / MSAs', count: counts.contract },
                { id: 'sow', label: 'Sprint SOWs', count: counts.sow },
                { id: 'invoice', label: 'Invoices', count: counts.invoice },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-butter text-butter-foreground font-semibold shadow-xs'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      filterType === tab.id ? 'bg-butter-foreground/20 text-butter-foreground' : 'bg-card text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-[11px] sm:text-xs text-muted-foreground font-mono shrink-0">
              In view: <span className="font-semibold text-foreground">{processedDocs.length}</span> documents
            </div>
          </div>
        </div>

        {/* Content Body: Cards vs Table */}
        {processedDocs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-card border border-border text-muted-foreground">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40 animate-pulse" />
            <p className="text-sm font-semibold text-foreground">No documents matched your filter.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try changing the search query or selecting "All Documents".
            </p>
            <button
              onClick={() => {
                setSearch('');
                setFilterType('all');
                setCurrentPage(1);
              }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-butter-foreground bg-butter px-3 py-1.5 rounded-xl shadow-xs hover:scale-105 transition-transform"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          /* Grid Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {paginatedDocs.map((doc) => (
              <div
                key={`${doc.client.id}-${doc.id}`}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft hover:shadow-md hover:border-butter/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-2.5 sm:mb-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-secondary group-hover:bg-butter group-hover:text-butter-foreground flex items-center justify-center text-butter border border-border shrink-0 transition-colors shadow-2xs">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display font-semibold text-xs sm:text-sm text-foreground truncate group-hover:text-butter transition-colors">
                            {doc.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleCopy(doc.title, `${doc.client.id}-${doc.id}`)}
                            title="Copy title"
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                          >
                            {copiedId === `${doc.client.id}-${doc.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-muted-foreground/60" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                          {doc.client.companyName} • Lead: {doc.client.clientName}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase shrink-0 border ${
                        doc.type === 'quotation'
                          ? 'bg-butter/20 text-butter-foreground border-butter/30'
                          : doc.type === 'contract'
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : doc.type === 'invoice'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-secondary text-muted-foreground border-border'
                      }`}
                    >
                      {doc.type}
                    </span>
                  </div>

                  {doc.notes && (
                    <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed bg-secondary/40 p-2.5 rounded-xl border border-border/60">
                      {doc.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-border/60 text-xs">
                  <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground truncate mr-2">
                    Date: <span className="font-medium text-foreground">{doc.dateAdded}</span> • {doc.fileSize || 'PDF'}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDocInfo({ client: doc.client, doc });
                        setIsDocModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      title="Edit Document Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(doc.client.id, doc.id, doc.title)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedQuoteClient(doc.client)}
                      className="px-3 py-1.5 rounded-xl bg-butter text-butter-foreground text-xs font-semibold hover:scale-102 transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Slip</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead className="bg-secondary/70 text-muted-foreground font-mono uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="p-4">Document Title</th>
                    <th className="p-4">Client / Entity</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Date Added</th>
                    <th className="p-4">Size</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedDocs.map((doc) => (
                    <tr key={`${doc.client.id}-${doc.id}`} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5 font-medium text-foreground">
                          <FileText className="w-4 h-4 text-butter shrink-0" />
                          <span className="truncate max-w-xs">{doc.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        <span className="font-semibold text-foreground">{doc.client.companyName}</span>
                        <div className="text-[11px] text-muted-foreground">{doc.client.clientName}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-secondary border border-border">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-muted-foreground">{doc.dateAdded}</td>
                      <td className="p-4 font-mono text-muted-foreground">{doc.fileSize || 'PDF'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDocInfo({ client: doc.client, doc });
                              setIsDocModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                            title="Edit Document"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(doc.client.id, doc.id, doc.title)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedQuoteClient(doc.client)}
                            className="px-3 py-1 rounded-lg bg-butter text-butter-foreground text-xs font-semibold hover:scale-105 transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hyper-Optimized Pagination */}
        {processedDocs.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalItems={processedDocs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(p) => setCurrentPage(p)}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        )}
      </div>

      {selectedQuoteClient && (
        <QuotationModal
          client={selectedQuoteClient}
          onClose={() => setSelectedQuoteClient(null)}
        />
      )}

      {isDocModalOpen && (
        <DocumentModal
          clients={clients}
          initialClient={editingDocInfo?.client}
          document={editingDocInfo?.doc}
          onClose={() => {
            setIsDocModalOpen(false);
            setEditingDocInfo(null);
          }}
          onSave={handleSaveDocument}
        />
      )}
    </AdminLayout>
  );
}
