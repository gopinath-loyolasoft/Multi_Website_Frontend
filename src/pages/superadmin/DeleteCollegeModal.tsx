import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, Database, Globe, Loader2 } from 'lucide-react';
import { Drawer } from '../../UI_Componentes/ui';
import { Tenant } from '../../types';
import { apiClient } from '../../services/apiClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  college: Tenant | null;
}

export const DeleteCollegeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  college
}) => {
  const [confirmCode, setConfirmCode] = useState('');
  const [dropDatabase, setDropDatabase] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (college) {
      setConfirmCode('');
      setDropDatabase(true);
      setError(null);
    }
  }, [college]);

  if (!isOpen || !college) return null;

  const expectedCode = college.tenantCode.trim().toUpperCase();
  const isCodeMatch = confirmCode.trim().toUpperCase() === expectedCode;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeMatch) {
      setError(`Please type "${expectedCode}" to confirm deletion.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await apiClient.delete(
        `/superadmin/colleges/${college.id}?dropDatabase=${dropDatabase}`
      );

      if (res.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.data.message || 'Failed to delete college');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error occurred while deleting college');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Delete College & Associated Data"
      subtitle="Permanent de-provisioning and routing revocation"
      icon={<Trash2 className="w-5 h-5 text-red-600" />}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || !isCodeMatch}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              isCodeMatch && !loading
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting College...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="text-slate-900 space-y-5 text-xs">
        {/* Warning Alert */}
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-800 space-y-0.5">
            <p className="font-semibold text-red-900">
              Revoking domain routing and tenant access!
            </p>
            <p className="text-[11px] text-red-700 leading-relaxed">
              All domain routes, tenant credentials, and database linkages for{' '}
              <strong className="text-slate-900">{college.name}</strong> will be removed.
            </p>
          </div>
        </div>

        {/* College Details Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
            <span className="text-slate-500">College Name:</span>
            <span className="font-semibold text-slate-900">{college.name}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
            <span className="text-slate-500">Tenant Code:</span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[11px]">{college.tenantCode}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
            <span className="text-slate-500 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> Primary Domain:
            </span>
            <span className="font-mono text-slate-800 font-medium">{college.primaryDomain || 'None'}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-blue-600" /> Database Name:
            </span>
            <span className="font-mono text-blue-700 font-medium">{college.databaseName || 'None'}</span>
          </div>
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          {/* Drop DB Option */}
          {college.databaseName && (
            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition">
              <input
                type="checkbox"
                checked={dropDatabase}
                onChange={(e) => setDropDatabase(e.target.checked)}
                disabled={loading}
                className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">
                  Drop dedicated PostgreSQL database permanently
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Unchecking will retain the PostgreSQL database schema for manual archive/export.
                </span>
              </div>
            </label>
          )}

          {/* Type to confirm */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              To verify, type <span className="font-mono font-bold text-red-600">{expectedCode}</span> below:
            </label>
            <input
              type="text"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              placeholder={`Type ${expectedCode}`}
              disabled={loading}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-xs placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}
        </form>
      </div>
    </Drawer>
  );
};
