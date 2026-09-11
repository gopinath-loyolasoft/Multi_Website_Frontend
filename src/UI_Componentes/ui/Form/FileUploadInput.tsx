import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, CheckCircle, AlertCircle, X, FileText, Loader2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

export interface FileUploadInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  accept?: string;
  className?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label = 'Upload Image or File',
  value,
  onChange,
  placeholder = 'https://... or choose a local file',
  required = false,
  helpText,
  accept = '*/*',
  className = '',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.name);

      const response = await apiClient.post('/admin/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const uploadedPath = response.data.data?.filePath || response.data.data?.url || '';
        onChange(uploadedPath);
      } else {
        setError(response.data.message || 'Failed to upload file');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err.response?.data?.message || err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const isImage = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith('data:image/') ||
      /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(url) ||
      url.includes('/uploads/')
    );
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>

          <div className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                mode === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Upload Local File
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                mode === 'url'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Image URL
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {mode === 'upload' ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 transition text-center cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : value
              ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-950/10'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-900/30'
          }`}
        >
          {isUploading ? (
            <div className="py-3 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Uploading local file to server...
              </span>
            </div>
          ) : value ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {isImage(value) ? (
                  <img
                    src={value}
                    alt="Uploaded preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                <div className="text-left truncate">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {value.split('/').pop() || value}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Uploaded ready
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-50 transition"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-md transition"
                  title="Remove File"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2 space-y-1.5">
              <UploadCloud className="w-8 h-8 text-blue-500 mx-auto" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Click to select local file</span> or drag & drop here
              </div>
              <p className="text-[11px] text-slate-400">Supports any file format & any file size</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
            required={required}
          />
          <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Image Preview thumbnail below if value exists & mode is url */}
      {mode === 'url' && value && (
        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          {isImage(value) ? (
            <img
              src={value}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <FileText className="w-6 h-6 text-slate-400 shrink-0" />
          )}
          <span className="text-xs text-slate-600 dark:text-slate-300 truncate font-mono">{value}</span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-semibold">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {helpText && <p className="text-[11px] text-slate-400">{helpText}</p>}
    </div>
  );
};
