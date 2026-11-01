import React, { useState } from 'react';
import { PageView, HealthcareFacility } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAIContext } from '../../context/AIContextManager';
import { MOCK_FACILITIES } from '../../data/mockData';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  CheckCircle2, 
  Filter, 
  Globe, 
  Sparkles,
  Search,
  ExternalLink,
  Compass,
  CornerDownRight,
  ArrowLeft,
  Clock,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface FacilityFinderProps {
  setCurrentPage: (page: PageView) => void;
  onInitiateCall: (contactName: string, role: string, phone: string) => void;
}

export const FacilityFinder: React.FC<FacilityFinderProps> = ({ setCurrentPage, onInitiateCall }) => {
  const { t, language } = useLanguage();
  const { setAIContext } = useAIContext();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);
  const [detailsFacility, setDetailsFacility] = useState<HealthcareFacility | null>(null);

  const isTe = language === 'te';

  const districts = ['All Districts', 'Ananthapur', 'Chittoor', 'Kurnool', 'Visakhapatnam', 'Guntur'];

  const filters = [
    { id: 'All', label: t('filterAll') },
    { id: 'General', label: t('filterGeneral') },
    { id: 'Pediatrics', label: t('filterPeds') },
    { id: 'Women', label: t('filterWomen') },
    { id: 'Emergency', label: t('filterEmergency') },
    { id: 'Pharmacy', label: 'Pharmacy' },
    { id: 'Teleconsultation', label: t('filterTele') }
  ];

  const filteredFacilities = MOCK_FACILITIES.filter(fac => {
    const matchesDistrict = selectedDistrict === 'All Districts' || fac.district === selectedDistrict;
    
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fac.addressEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesDistrict || !matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Emergency') return fac.isEmergencyAvailable;
    return fac.servicesEn.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fade-in select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-black"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-200" /> Multi-District Hospital Network
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('facTitle')}
          </h1>
          <p className="text-sky-100 text-sm font-medium">
            Find Primary Health Centres (PHC), CHCs, and District Hospitals by district and specialty.
          </p>
        </div>

        {/* Demo Data Tag */}
        <div className="bg-amber-500/20 text-amber-200 border border-amber-400/40 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-300" />
          <span>Demo Data</span>
        </div>

      </div>

      {/* District & Search Control Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* District Selector */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">Select District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl font-bold text-slate-900 text-xs focus:outline-none focus:border-sky-500"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="sm:col-span-8">
            <label className="block text-xs font-bold text-slate-700 mb-1">Search Hospital / City</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTe ? "సమీప ఆసుపత్రి లేదా నగరం పేరును వెతకండి..." : "Search by hospital name, city, or village..."}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Facility Cards List */}
      <div className="space-y-4">
        {filteredFacilities.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold">No healthcare facilities found matching your filter criteria.</p>
          </div>
        ) : (
          filteredFacilities.map((fac) => (
            <div 
              key={fac.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col sm:flex-row justify-between gap-6"
            >
              {/* Facility Information Card */}
              <div className="space-y-3 flex-1">
                
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black border border-sky-300">
                    {fac.type}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold border border-slate-300">
                    District: {fac.district} ({fac.city})
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" /> {fac.distanceKm} km away
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">{fac.name}</h3>

                <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{isTe ? fac.addressTe : fac.addressEn}</span>
                </p>

                {/* Services & Operating hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-extrabold text-slate-700 block">Available Services:</span>
                    <span className="text-slate-600 font-medium">
                      {(isTe ? fac.servicesTe : fac.servicesEn).join(', ')}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-extrabold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-600" /> Working Hours:
                    </span>
                    <span className="text-slate-600 font-medium">{fac.operatingHours || '24 Hours Emergency'}</span>
                  </div>
                </div>

                {/* Languages & Emergency */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Globe className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-slate-700">Languages:</span>
                    {fac.languageSupport.map((lang, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {fac.isEmergencyAvailable && (
                    <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-black rounded-full border border-rose-200">
                      🚨 24x7 Emergency Ready
                    </span>
                  )}
                </div>

              </div>

              {/* Action Buttons: Call, Directions, View Details */}
              <div className="flex sm:flex-col justify-end gap-2.5 shrink-0">
                
                <button
                  onClick={() => onInitiateCall(fac.name, fac.type, fac.contactNumber)}
                  className="flex-1 sm:flex-initial px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call</span>
                </button>

                <button
                  onClick={() => setSelectedFacility(fac)}
                  className="flex-1 sm:flex-initial px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </button>

                <button
                  onClick={() => setDetailsFacility(fac)}
                  className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl border border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>View Details</span>
                </button>

              </div>

            </div>
          ))
        )}
      </div>

      {/* Facility Details Modal */}
      {detailsFacility && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-fade-in border border-slate-200">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  {detailsFacility.type} • {detailsFacility.district} District
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  {detailsFacility.name}
                </h3>
              </div>
              <button 
                onClick={() => setDetailsFacility(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-700">Full Address:</span>
                <p className="text-slate-900 font-semibold">{detailsFacility.addressEn}</p>
                <p className="text-emerald-800 font-bold mt-1">తెలుగు చిరునామా: {detailsFacility.addressTe}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-700 block">Contact Phone:</span>
                  <span className="font-black text-emerald-700 text-sm">{detailsFacility.contactNumber}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-extrabold text-slate-700 block">Working Hours:</span>
                  <span className="font-bold text-slate-900">{detailsFacility.operatingHours || '24x7'}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-700">Supported Services:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {detailsFacility.servicesEn.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-bold text-slate-800">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Demo Badge */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold text-center text-[11px]">
                Demo Data — Static Facility Information
              </div>

            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onInitiateCall(detailsFacility.name, detailsFacility.type, detailsFacility.contactNumber);
                  setDetailsFacility(null);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow"
              >
                Call Facility Now
              </button>

              <button
                onClick={() => setDetailsFacility(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Directions Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-fade-in">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 text-sky-600" />
                <span>Directions to {selectedFacility.name}</span>
              </h3>
              <button 
                onClick={() => setSelectedFacility(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            {/* Simulated Map Visual */}
            <div className="bg-slate-900 rounded-2xl h-48 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-800 space-y-2">
              <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <MapPin className="w-10 h-10 text-emerald-400 animate-bounce relative z-10" />
              <div className="text-xs font-bold relative z-10">{selectedFacility.distanceKm} km via {selectedFacility.district} District Highway</div>
              <div className="text-[11px] text-slate-400 relative z-10">Estimated travel time: ~15 mins by vehicle</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  window.open(`https://maps.google.com/?q=${selectedFacility.latitude},${selectedFacility.longitude}`, '_blank');
                }}
                className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </button>

              <button
                onClick={() => setSelectedFacility(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
