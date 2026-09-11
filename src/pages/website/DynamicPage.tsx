import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { PageData } from '../../types';
import { apiClient } from '../../services/apiClient';
import { PageRenderer } from '../../components/dynamic/SectionRenderer';
import { useTenant } from '../../tenant/TenantContext';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get('preview_token');
  const isPreview = searchParams.get('preview') === 'true' || Boolean(previewToken);
  const activeSlug = slug || 'home';
  const { tenantDomain } = useTenant();

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        let queryParams = '';
        if (previewToken) {
          queryParams = `?preview_token=${encodeURIComponent(previewToken)}`;
        } else if (isPreview) {
          queryParams = '?preview=true';
        }
        const res = await apiClient.get(`/site/pages/${activeSlug}${queryParams}`);
        if (res.data.success) {
          setPageData(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || `Page '${activeSlug}' not found.`);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [activeSlug, tenantDomain, isPreview, previewToken]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading dynamic page sections...</p>
      </div>
    );
  }

  if (error || !pageData) {
    if (activeSlug === 'home') {
      return (
        <div className="w-full">
          <div className="py-24 bg-gradient-to-b from-primary/10 via-white to-slate-50 text-center px-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary">
                Excellence in Higher Education
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Empowering Minds, Shaping Tomorrow's Leaders
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Welcome to our institution. Our campus is dedicated to academic innovation, world-class degree pathways, and distinguished student achievements.
              </p>
<div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Link
                  to="/admissions"
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-primary hover:opacity-95 transition shadow-lg shadow-primary/25"
                >
                  Explore Admissions
                </Link>
                <Link
                  to="/courses"
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-800 bg-white hover:bg-slate-100 transition shadow-lg shadow-slate-900/10"
                >
                  Browse Programs
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-24 max-w-xl mx-auto px-6 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 font-black text-xl">
          404
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-slate-600 text-sm">
          The requested page <strong>/{activeSlug}</strong> does not exist in this college database.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-primary hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

if (pageData && pageData.sections.length === 0) {
    return (
      <div className="py-24 max-w-xl mx-auto px-6 text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary font-black text-xl">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-900">This page is being prepared</h2>
        <p className="text-slate-600 text-sm">
          No sections have been published for <strong>/{activeSlug}</strong> yet.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-primary hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageRenderer sections={pageData.sections} />
    </div>
  );
};
