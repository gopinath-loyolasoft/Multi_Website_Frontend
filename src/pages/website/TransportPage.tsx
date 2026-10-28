import React, { useEffect, useState } from 'react';
import { Bus, MapPin, Clock, Phone, FileText, Download, Search, ShieldAlert, CheckCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';
import { TransportRoute } from '../../types';
import { PdfDocumentViewerModal } from '../../components/common/PdfDocumentViewerModal';

export const TransportPage: React.FC = () => {
  const Template = useActiveTemplate();
  const { siteConfig } = useTenant();
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeDoc, setActiveDoc] = useState<{ title: string; url: string } | null>(null);

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.transport ||
    siteConfig?.settings?.pageHeaders?.transport;

  const badgeText = headerConfig?.badge || 'Campus Fleet & Logistics';
  const titleText = headerConfig?.title || 'Bus Transport & Route Network';
  const subtitleText =
    headerConfig?.subtitle ||
    'Safe, GPS-enabled fleet connecting all prime city hubs, suburban stations, and transit corridors to the campus.';

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const res = await apiClient.get('/site/transport');
        if (res.data.success && Array.isArray(res.data.data)) {
          setRoutes(res.data.data);
        } else {
          setRoutes([]);
        }
      } catch (err) {
        console.error('Failed to load transport routes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransport();
  }, []);

  const filteredRoutes = routes.filter((r) => {
    const q = search.toLowerCase();
    const start = (r.startPoint || r.startingPoint || '').toLowerCase();
    const end = (r.endPoint || r.destination || '').toLowerCase();
    return (
      !search.trim() ||
      r.routeNumber.toLowerCase().includes(q) ||
      r.routeName.toLowerCase().includes(q) ||
      start.includes(q) ||
      end.includes(q) ||
      (r.viaStops && r.viaStops.some((s: string) => s.toLowerCase().includes(q)))
    );
  });

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<Bus className="w-4 h-4 text-amber-300" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Fleet Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">GPS & Speed-Governed Fleet</h3>
              <p className="text-xs text-slate-500 mt-1">Real-time tracking, CCTV safety, and regular mechanical audits on all college buses.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Punctual Schedules</h3>
              <p className="text-xs text-slate-500 mt-1">Guaranteed morning arrival before 8:30 AM and evening departures strictly after college hours.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">100+ Boarding Points</h3>
              <p className="text-xs text-slate-500 mt-1">Extensive coverage spanning multiple districts, railway terminals, and metro stations.</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by route number, start point, or stop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Showing {filteredRoutes.length} Active Routes
          </span>
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading transport routes...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
            <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No routes found</h3>
            <p className="text-slate-500 text-xs mt-1">Try another search term or stop name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden">
                <div className="p-6">
                  {/* Route Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
                      Route #{route.routeNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {route.morningPickupTime || '07:30 AM'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{route.routeName}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {route.startPoint} ➔ {route.endPoint}
                  </p>

                  {/* Stops */}
                  {route.viaStops && route.viaStops.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Key Boarding Stops
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {route.viaStops.map((stop, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Driver / Coordinator Contacts */}
                  {(route.driverName || route.driverPhone) && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Coordinator / Driver</span>
                        <strong className="text-slate-800">{route.driverName || 'Transport Incharge'}</strong>
                      </div>
                      {route.driverPhone && (
                        <a
                          href={`tel:${route.driverPhone}`}
                          className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{route.driverPhone}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* PDF Timetable Download */}
                {route.timingPdfUrl && (
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Full Timetable</span>
                    <button
                      onClick={() => setActiveDoc({ title: `Route ${route.routeNumber} Schedule`, url: route.timingPdfUrl! })}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {activeDoc && (
        <PdfDocumentViewerModal
          isOpen={true}
          title={activeDoc.title}
          pdfUrl={activeDoc.url}
          onClose={() => setActiveDoc(null)}
        />
      )}
    </div>
  );
};
