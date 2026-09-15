import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Mail, 
  Award, 
  CheckCircle2, 
  Search, 
  Check, 
  X, 
  ExternalLink,
  GraduationCap,
  Copy,
  Lock,
  Unlock,
  RotateCcw
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { slugify, copyToClipboard } from '../../utils/helpers';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog } from '../../UI_Componentes/ui';

interface Faculty {
  id: string;
  departmentId: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  isActive: boolean;
}

interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  isPublished: boolean;
}

export const FacultyManagementPage: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [departmentId, setDepartmentId] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('Professor');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [email, setEmail] = useState('');

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, deptRes] = await Promise.all([
        apiClient.get('/admin/faculty'),
        apiClient.get('/admin/departments')
      ]);
      if (facRes.data.success) setFacultyList(facRes.data.data.items || facRes.data.data || []);
      if (deptRes.data.success) {
        const depts = deptRes.data.data.items || deptRes.data.data || [];
        setDepartments(depts);
        if (depts.length > 0 && !departmentId) setDepartmentId(depts[0].id);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load faculty directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingFaculty(null);
    setName('');
    setDesignation('Professor');
    setQualification('');
    setSpecialization('');
    setEmail('');
    if (departments.length > 0) setDepartmentId(departments[0].id);
    setShowModal(true);
  };

  const handleOpenEdit = (f: Faculty) => {
    setEditingFaculty(f);
    setDepartmentId(f.departmentId);
    setName(f.name);
    setDesignation(f.designation);
    setQualification(f.qualification || '');
    setSpecialization(f.specialization || '');
    setEmail(f.email || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (editingFaculty) {
        await apiClient.put(`/admin/faculty/${editingFaculty.id}`, {
          departmentId,
          name,
          designation,
          qualification,
          specialization,
          email,
          isActive: editingFaculty.isActive !== false,
        });
        showNotification('Faculty profile updated successfully');
      } else {
        await apiClient.post('/admin/faculty', {
          departmentId,
          name,
          designation,
          qualification,
          specialization,
          email,
          isActive: true,
        });
        showNotification('Faculty member added successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showNotification('Failed to save faculty profile', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (f: Faculty) => {
    const nextStatus = f.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/faculty/${f.id}`, {
        departmentId: f.departmentId,
        name: f.name,
        designation: f.designation,
        qualification: f.qualification,
        specialization: f.specialization,
        email: f.email,
        isActive: nextStatus,
      });
      showNotification(`"${f.name}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchData();
    } catch (err) {
      showNotification('Failed to update faculty status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this faculty profile?')) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/faculty/${id}`);
      showNotification('Faculty profile removed');
      fetchData();
    } catch (err) {
      showNotification('Failed to delete faculty', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.specialization && f.specialization.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = !selectedDeptFilter || String(f.departmentId) === String(selectedDeptFilter);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Professors & Mentors</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Faculty Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage professors, lecturers, researchers, qualifications, and specializations.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Faculty Profile</span>
        </button>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Department Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name, designation, or specialization..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        <select
          value={selectedDeptFilter}
          onChange={(e) => setSelectedDeptFilter(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm min-w-[200px]"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.code})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          Loading faculty directory...
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Faculty Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Add teaching staff, research scholars, and heads of departments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((fac) => {
            const isActive = fac.isActive !== false;
            const dept = departments.find((d) => String(d.id) === String(fac.departmentId));

            return (
              <div
                key={fac.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 shadow-sm flex flex-col justify-between space-y-4 transition ${
                  isActive
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-dashed border-red-200 dark:border-red-900/60 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary">
                      {fac.designation}
                    </span>
                    <button
                      onClick={() => toggleStatus(fac)}
                      disabled={actionLoading}
                      title={isActive ? 'Click to make Inactive' : 'Click to make Active'}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-lg leading-snug ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 line-through'}`}>
                    {fac.name}
                  </h3>

                  {dept && (
                    <span className="inline-block text-[11px] font-bold text-slate-400">
                      Dept: {dept.name}
                    </span>
                  )}

                  {fac.qualification && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.qualification}</span>
                    </div>
                  )}

                  {fac.specialization && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.specialization}</span>
                    </div>
                  )}

                  {fac.email && (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono truncate pt-1">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{fac.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(fac)}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    title="Edit Faculty"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(fac.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                    title="Delete Faculty"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Faculty Profile */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingFaculty ? 'Edit Faculty Profile' : 'Add Faculty Member'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Department *
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                  required
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. A. P. Raman, Ph.D."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Designation *
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                >
                  <option value="Professor & Head of Department">Professor & HOD</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="Research Director">Research Director</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. Ph.D. in Machine Learning (IISc Bangalore)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Research Specialization
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Computer Vision, Distributed Cloud, IoT"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. raman.ap@college.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90"
                >
                  {actionLoading ? 'Saving...' : editingFaculty ? 'Save Changes' : 'Add Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const GalleryManagementPage: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCopyLink = (targetSlug: string) => {
    const url = `/gallery/${targetSlug}`;
    copyToClipboard(url);
    setCopiedSlug(targetSlug);
    showNotification(`Copied URL "${url}" to clipboard!`);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/gallery');
      if (res.data.success) {
        setGalleries(res.data.data.items || res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load gallery albums', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (autoSlug) {
      setSlug(slugify(newTitle));
    }
  };

  const handleOpenCreate = () => {
    setEditingGallery(null);
    setTitle('');
    setSlug('');
    setAutoSlug(true);
    setDescription('');
    setCoverImageUrl('');
    setIsPublished(true);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (g: Gallery) => {
    setEditingGallery(g);
    setTitle(g.title);
    setSlug(g.slug || slugify(g.title));
    setAutoSlug(false);
    setDescription(g.description || '');
    setCoverImageUrl(g.coverImageUrl || '');
    setIsPublished(g.isPublished !== false);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slugify(slug || title);
    try {
      setActionLoading(true);
      if (editingGallery) {
        await apiClient.put(`/admin/gallery/${editingGallery.id}`, {
          title,
          slug: finalSlug,
          description,
          coverImageUrl,
          isPublished,
        });
        showNotification('Gallery album updated');
      } else {
        await apiClient.post('/admin/gallery', {
          title,
          slug: finalSlug,
          description,
          coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
          isPublished,
        });
        showNotification('Gallery album created');
      }
      setIsDrawerOpen(false);
      fetchGalleries();
    } catch (err) {
      showNotification('Failed to save gallery', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (g: Gallery) => {
    const nextStatus = g.isPublished === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/gallery/${g.id}`, {
        title: g.title,
        slug: g.slug,
        description: g.description,
        coverImageUrl: g.coverImageUrl,
        isPublished: nextStatus,
      });
      showNotification(`"${g.title}" is now ${nextStatus ? 'PUBLISHED' : 'UNPUBLISHED (Draft)'}`);
      fetchGalleries();
    } catch (err) {
      showNotification('Failed to update album status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery album?')) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/gallery/${id}`);
      showNotification('Gallery album deleted');
      fetchGalleries();
    } catch (err) {
      showNotification('Failed to delete album', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Campus Media Hub</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Photo & Event Gallery</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish event photo albums, convocations, campus infrastructure, and laboratory tours.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Album</span>
        </button>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          Loading gallery albums...
        </div>
      ) : galleries.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Photo Albums Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Create photo albums to showcase campus festivals, sports days, and ceremonies.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gal) => {
            const isPub = gal.isPublished !== false;
            const albumSlug = gal.slug || slugify(gal.title);
            const isCopied = copiedSlug === albumSlug;

            return (
              <div
                key={gal.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border overflow-hidden shadow-sm flex flex-col justify-between transition ${
                  isPub
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-dashed border-red-200 opacity-75'
                }`}
              >
                {/* Cover Image */}
                <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={gal.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'}
                    alt={gal.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleStatus(gal)}
                      disabled={actionLoading}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition shadow-sm ${
                        isPub ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {isPub ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {gal.title}
                    </h3>
                    
                    {/* Slug & Copy Link Pill */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyLink(albumSlug)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border transition ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700'
                        }`}
                        title="Click to copy public URL"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        <span>/gallery/{albumSlug}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {gal.description || 'Campus photo collection'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <a
                      href={`/gallery/${albumSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Public Album</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(gal)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        title="Edit Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(gal.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                        title="Delete Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FormDrawer for Creating / Editing Gallery Album */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Create Gallery Album'
            : drawerMode === 'edit'
            ? 'Edit Gallery Album'
            : editingGallery?.title || 'Album Details'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Upload photos and create a new campus event album'
            : drawerMode === 'edit'
            ? 'Update album title, slug, cover image, or details'
            : 'Gallery album preview and settings'
        }
        icon={<ImageIcon className="w-5 h-5 text-primary" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Album Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Annual Convocation 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          {/* URL Slug Field with Auto-Sync & Custom toggles */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                URL Slug *
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoSlug;
                    setAutoSlug(next);
                    if (next && title) {
                      setSlug(slugify(title));
                    }
                  }}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                    autoSlug
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                  title={autoSlug ? 'Auto-generating from title (click to unlock custom edit)' : 'Custom slug mode (click to re-enable auto-sync)'}
                >
                  {autoSlug ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                  <span>{autoSlug ? 'Auto-Sync' : 'Custom'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSlug(slugify(title))}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 text-slate-700 transition cursor-pointer"
                  title="Sync slug with current title"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Sync</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. annual-convocation-2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
            <p className="text-[11px] text-slate-400">
              Public Route: <span className="font-mono text-primary">/gallery/{slug || 'album-slug'}</span>
            </p>
          </div>

          {/* Local File Upload for Cover Image */}
          <FileUploadInput
            label="COVER IMAGE"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            placeholder="/assets/templates/... or upload local image"
            helpText="Upload an album cover photo from your computer or paste an image URL."
            accept="image/*"
          />

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Album Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Moments captured from campus ceremonies, student festivals, and sports..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Published Status Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 block">Album Visibility</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isPublished ? 'Visible to public visitors on live site' : 'Hidden as draft'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                isPublished
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {isPublished ? 'Published' : 'Draft'}
            </button>
          </div>
        </div>
      </FormDrawer>
    </div>
  );
};
