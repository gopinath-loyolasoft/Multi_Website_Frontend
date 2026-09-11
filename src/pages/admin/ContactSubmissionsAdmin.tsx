import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  Calendar,
  User,
  RefreshCw,
  X,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export const ContactSubmissionsAdminPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Modal States for Create & Delete
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admin/contact/submissions', {
        params: { pageSize: 100 }
      });
      if (res.data.success && res.data.data) {
        const list = res.data.data.items || res.data.data;
        if (Array.isArray(list)) {
          setSubmissions(list);
        } else {
          setSubmissions([]);
        }
      }
    } catch (err) {
      console.error('Failed to load contact submissions', err);
      setError('Unable to load contact inquiries from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const res = await apiClient.put(`/admin/contact/submissions/${id}/status`, {
        status: newStatus
      });
      if (res.data.success) {
        setActionMessage(`Inquiry status updated to ${newStatus}`);
        setSubmissions((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update submission status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCreateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.subject || !createForm.message) {
      alert('Please fill in all required fields (Name, Email, Subject, Message).');
      return;
    }

    try {
      setCreateLoading(true);
      const res = await apiClient.post('/admin/contact/submissions', createForm);
      if (res.data.success) {
        setActionMessage('New contact inquiry logged successfully!');
        setShowCreateModal(false);
        setCreateForm({ name: '', email: '', phone: '', subject: '', message: '' });
        fetchSubmissions();
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to create inquiry', err);
      alert('Failed to log inquiry. Please verify form data.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await apiClient.delete(`/admin/contact/submissions/${id}`);
      if (res.data.success) {
        setActionMessage('Contact inquiry deleted successfully.');
        setSubmissions((prev) => prev.filter((item) => item.id !== id));
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission(null);
        }
        setShowDeleteConfirm(null);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete inquiry', err);
      alert('Failed to delete contact inquiry.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      (item.phone && item.phone.includes(search));

    const matchesStatus =
      statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const totalCount = submissions.length;
  const newCount = submissions.filter((s) => s.status.toUpperCase() === 'NEW').length;
  const inProgressCount = submissions.filter((s) => s.status.toUpperCase() === 'IN_PROGRESS').length;
  const resolvedCount = submissions.filter(
    (s) => s.status.toUpperCase() === 'RESOLVED' || s.status.toUpperCase() === 'COMPLETED'
  ).length;

  const getStatusBadge = (status: string) => {
    const st = status.toUpperCase();
    if (st === 'NEW') {
      return (
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>New</span>
        </span>
      );
    }
    if (st === 'IN_PROGRESS') {
      return (
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3 text-amber-700" />
          <span>In Progress</span>
        </span>
      );
    }
    if (st === 'RESOLVED' || st === 'COMPLETED') {
      return (
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>Resolved</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 shrink-0">
        <Archive className="w-3 h-3 text-slate-500" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span>Contact Inquiries & Submissions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Read, filter, log new inquiries, track status, and respond to submissions from visitors and students.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Inquiry</span>
          </button>

          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Inquiries</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">New Unread</span>
            <h3 className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">{newCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">In Progress</span>
            <h3 className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">{inProgressCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Resolved</span>
            <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{resolvedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Messages' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Inquiries List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            Loading contact submissions...
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-red-700">{error}</h3>
            <button
              onClick={fetchSubmissions}
              className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No inquiries found</h3>
            <p className="text-xs text-slate-500">
              {search ? 'Try clearing your search keyword.' : 'Visitors submit inquiries through the contact page or you can log new ones.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">Visitor / Contact</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSubmissions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => setSelectedSubmission(item)}
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</div>
                      <div className="flex items-center gap-3 text-slate-500 mt-1 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-primary" />
                          <span>{item.email}</span>
                        </span>
                        {item.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{item.phone}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.subject}</div>
                      <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{item.message}</div>
                    </td>

                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSubmission(item)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span>Read</span>
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-500 rounded-lg transition cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(selectedSubmission.status)}
                  <span className="text-xs text-slate-400">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {selectedSubmission.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Sender Name</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  {selectedSubmission.name}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Email Address</span>
                <a href={`mailto:${selectedSubmission.email}`} className="font-bold text-primary hover:underline flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedSubmission.email}</span>
                </a>
              </div>

              {selectedSubmission.phone && (
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Contact Phone Number</span>
                  <a href={`tel:${selectedSubmission.phone}`} className="font-bold text-emerald-600 hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedSubmission.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inquiry Message</span>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                {selectedSubmission.message}
              </div>
            </div>

            {/* Action Buttons to update status and delete */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Update Status:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedSubmission.id, 'IN_PROGRESS')}
                  disabled={updatingStatus || selectedSubmission.status === 'IN_PROGRESS'}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition disabled:opacity-50 cursor-pointer"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedSubmission.id, 'RESOLVED')}
                  disabled={updatingStatus || selectedSubmission.status === 'RESOLVED'}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition disabled:opacity-50 cursor-pointer"
                >
                  Mark Resolved
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(selectedSubmission.id)}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${encodeURIComponent(selectedSubmission.subject)}`}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-90 transition flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log New Inquiry Modal (POST) */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <span>Log New Contact Inquiry</span>
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Visitor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admission Inquiry 2026-27"
                  value={createForm.subject}
                  onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed message or phone query summary..."
                  value={createForm.message}
                  onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (DELETE) */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Inquiry?</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this contact submission? This action cannot be undone.
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSubmission(showDeleteConfirm)}
                disabled={deletingId === showDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deletingId === showDeleteConfirm && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
