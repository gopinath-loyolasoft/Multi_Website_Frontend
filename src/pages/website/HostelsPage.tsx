import React, { useEffect, useState } from 'react';
import { Home, Utensils, Wifi, Shield, Phone, Download, CheckCircle2, UserCheck, Coffee } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';
import { HostelFacility } from '../../types';
import { PdfDocumentViewerModal } from '../../components/common/PdfDocumentViewerModal';

export const HostelsPage: React.FC = () => {
  const Template = useActiveTemplate();
  const { siteConfig } = useTenant();
  const [hostels, setHostels] = useState<HostelFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<{ title: string; url: string } | null>(null);

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.hostels ||
    siteConfig?.settings?.pageHeaders?.hostels;

  const badgeText = headerConfig?.badge || 'Residential Life & Accommodation';
  const titleText = headerConfig?.title || 'Hostels & Campus Living';
  const subtitleText =
    headerConfig?.subtitle ||
    'A secure, comfortable home away from home with hygienic multi-cuisine dining, high-speed Wi-Fi, and 24/7 surveillance.';

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await apiClient.get('/site/hostels');
        if (res.data.success && Array.isArray(res.data.data)) {
          setHostels(res.data.data);
        } else {
          setHostels([]);
        }
      } catch (err) {
        console.error('Failed to load hostels', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<Home className="w-4 h-4 text-amber-300" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Living Standards Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Spacious Rooms</h3>
            <p className="text-xs text-slate-500 mt-1">AC and Non-AC 2, 3, 4-sharing options with study desks.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Hygienic Mess</h3>
            <p className="text-xs text-slate-500 mt-1">Nutritious Veg & Non-Veg menu planned by certified dieticians.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Hi-Speed Wi-Fi</h3>
            <p className="text-xs text-slate-500 mt-1">Campus-wide 1 Gbps fiber connectivity for round-the-clock study.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">24/7 Security</h3>
            <p className="text-xs text-slate-500 mt-1">Biometric access, full CCTV coverage, and resident wardens.</p>
          </div>
        </div>

        {/* Hostel Blocks Listing */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading hostel blocks...</p>
          </div>
        ) : hostels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No hostel listings</h3>
            <p className="text-slate-500 text-xs mt-1">Hostel details will be updated shortly by the administration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hostels.map((hostel) => (
              <div key={hostel.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
                {hostel.photoUrl && (
                  <div className="h-56 w-full overflow-hidden bg-slate-100">
                    <img src={hostel.photoUrl} alt={hostel.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                      hostel.type?.toUpperCase() === 'GIRLS'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {hostel.type} Hostel
                    </span>
                    {hostel.totalRooms && (
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {hostel.totalRooms} Rooms ({hostel.capacity} Beds)
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{hostel.name}</h3>
                  {hostel.description && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{hostel.description}</p>
                  )}

                  {/* Amenities */}
                  {hostel.amenities && hostel.amenities.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                        Included Facilities
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {hostel.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warden Contact */}
                  {(hostel.wardenName || hostel.wardenPhone) && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Resident Warden</span>
                        <strong className="text-slate-800">{hostel.wardenName || 'Hostel Incharge'}</strong>
                      </div>
                      {hostel.wardenPhone && (
                        <a href={`tel:${hostel.wardenPhone}`} className="inline-flex items-center gap-1 text-primary font-bold hover:underline">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{hostel.wardenPhone}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Mess Menu PDF Download */}
                {hostel.messMenuPdfUrl && (
                  <div className="px-6 sm:px-8 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span>Weekly Dining & Mess Menu</span>
                    </span>
                    <button
                      onClick={() => setActiveDoc({ title: `${hostel.name} - Mess Menu`, url: hostel.messMenuPdfUrl! })}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Menu PDF</span>
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
