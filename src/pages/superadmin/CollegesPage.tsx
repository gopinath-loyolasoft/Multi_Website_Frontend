import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  Database, 
  ExternalLink,
  RefreshCw,
  Eye,
  Power,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  Button, 
  DataTable, 
  ColumnDef, 
  Badge, 
  SearchBar, 
  Alert, 
  useToast 
} from '../../UI_Componentes/ui';
import { Tenant, Theme } from '../../types';
import { apiClient } from '../../services/apiClient';
import { CreateCollegeDrawer } from './CreateCollegeDrawer';
import { EditCollegeModal } from './EditCollegeModal';
import { DeleteCollegeModal } from './DeleteCollegeModal';

export const CollegesPage: React.FC = () => {
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<Tenant | null>(null);
  const [deletingCollege, setDeletingCollege] = useState<Tenant | null>(null);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);

  const { toast } = useToast();

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const [collegesRes, themesRes] = await Promise.all([
        apiClient.get('/superadmin/colleges'),
        apiClient.get('/superadmin/themes')
      ]);

      if (collegesRes.data.success) {
        setColleges(collegesRes.data.data || []);
      } else {
        setError(collegesRes.data.message || 'Failed to load colleges');
      }
      if (themesRes.data.success) {
        setThemes(themesRes.data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to SuperAdmin API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleToggleStatus = async (college: Tenant) => {
    try {
      setActionLoading(college.id);
      const endpoint = college.status === 'ACTIVE' ? 'suspend' : 'activate';
      const res = await apiClient.post(`/superadmin/colleges/${college.id}/${endpoint}`);
      if (res.data.success) {
        toast.success(
          `College ${college.name} is now ${college.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}`
        );
        await fetchColleges();
      } else {
        toast.error(res.data.message || 'Failed to toggle college status');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating status');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tenantCode.toLowerCase().includes(q) ||
        (c.primaryDomain && c.primaryDomain.toLowerCase().includes(q))
    );
  }, [colleges, search]);

  // Define type-safe table columns using new ColumnDef
  const columns: ColumnDef<Tenant>[] = [
    {
      header: 'Code',
      accessor: 'tenantCode',
      render: (val) => (
        <span className="font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 px-2 py-0.5 rounded text-xs font-mono">
          {val}
        </span>
      ),
    },
    {
      header: 'College Name',
      accessor: 'name',
      render: (name, col) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{name}</div>
          <div className="text-[11px] text-slate-400 font-mono">slug: {col.slug}</div>
        </div>
      ),
    },
    {
      header: 'Routing Domain',
      render: (_, col) => {
        const portSuffix = window.location.port ? `:${window.location.port}` : '';
        const primaryDomain = col.primaryDomain || `${col.tenantCode.toLowerCase()}.localhost`;
        const isProdDomain = !primaryDomain.endsWith('.localhost');
        const localDevHost = `${col.tenantCode.toLowerCase()}.localhost`;
        const launchUrl =
          isProdDomain && window.location.hostname === 'localhost'
            ? `http://${localDevHost}${portSuffix}`
            : `http://${primaryDomain}${portSuffix}`;

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200 font-medium">
              <span>{primaryDomain}</span>
              {isProdDomain && (
                <Badge variant="purple" size="sm">
                  PROD
                </Badge>
              )}
            </div>
            <a
              href={launchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>{isProdDomain ? `Dev: ${localDevHost}${portSuffix}` : 'Open Portal'}</span>
              <ExternalLink className="w-3 h-3 text-blue-500" />
            </a>
          </div>
        );
      },
    },
    {
      header: 'Tenant Database',
      render: (_, col) => (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
          <Database className="w-3 h-3 text-slate-400" />
          <span>{col.databaseName || `college_${col.tenantCode.toLowerCase()}_database`}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => (
        <Badge
          variant={status === 'ACTIVE' ? 'success' : 'danger'}
          icon={
            status === 'ACTIVE' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500 dark:text-red-400" />
            )
          }
        >
          {status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (_, col) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant={col.status === 'ACTIVE' ? 'outline' : 'secondary'}
            loading={actionLoading === col.id}
            onClick={() => handleToggleStatus(col)}
            icon={<Power className="w-3 h-3" />}
          >
            {col.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingCollege(col)}
            icon={<Pencil className="w-3 h-3 text-slate-500" />}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setDeletingCollege(col)}
            icon={<Trash2 className="w-3 h-3 text-red-500" />}
          >
            Delete
          </Button>

          <Link to={`/superadmin/colleges/${col.id}`}>
            <Button size="sm" variant="secondary" icon={<Eye className="w-3 h-3 text-blue-600" />}>
              Inspect
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Colleges & Tenants Control</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centrally manage colleges, status, isolated PostgreSQL databases, routing domains, and themes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchColleges}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsDrawerOpen(true)}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Provision College (Drawer)
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant="error"
          title="Failed to load colleges"
          onClose={() => setError(null)}
        >
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="danger" onClick={fetchColleges}>
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Reusable Search Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Filter by college name, code (GP, RNC), or domain..."
      />

      {/* Central Reusable DataTable */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No colleges found"
        emptyMessage={
          search
            ? `No colleges found matching "${search}".`
            : 'No colleges have been provisioned yet. Click "Provision College" to create one.'
        }
        emptyAction={
          <Button size="sm" variant="primary" onClick={() => setIsDrawerOpen(true)}>
            Provision First College
          </Button>
        }
      />

      {/* Right-Side Slide-Over Drawer for College Creation */}
      <CreateCollegeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={() => {
          fetchColleges();
          toast.success('College list refreshed after successful provisioning!');
        }}
        themes={themes}
      />

      {/* Edit College Modal */}
      <EditCollegeModal
        isOpen={!!editingCollege}
        college={editingCollege}
        onClose={() => setEditingCollege(null)}
        onSuccess={() => {
          fetchColleges();
          toast.success('College updated successfully!');
        }}
        themes={themes}
      />

      {/* Delete College Modal */}
      <DeleteCollegeModal
        isOpen={!!deletingCollege}
        college={deletingCollege}
        onClose={() => setDeletingCollege(null)}
        onSuccess={() => {
          fetchColleges();
          toast.success('College and database mappings deleted!');
        }}
      />
    </div>
  );
};
