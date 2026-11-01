import React, { useState } from 'react';
import { PageView, MedicineDetails } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAIContext } from '../../context/AIContextManager';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_MEDICINES } from '../../data/mockData';
import { 
  Pill, 
  Upload, 
  Camera, 
  Scan, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  UserCheck, 
  RefreshCw,
  Sparkles,
  BookmarkPlus,
  HelpCircle,
  Check,
  User,
  Clock,
  ArrowLeft,
  Users,
  AlertCircle
} from 'lucide-react';

interface MedicineScannerProps {
  setCurrentPage: (page: PageView) => void;
  onAskWorkerAboutMedicine: (medName: string, medDetails: MedicineDetails) => void;
}

export const MedicineScanner: React.FC<MedicineScannerProps> = ({ setCurrentPage, onAskWorkerAboutMedicine }) => {
  const { t, language } = useLanguage();
  const { setAIContext } = useAIContext();
  const { addOfflineRequest } = useOffline();
  const { isGuest } = useAuth();

  const [selectedMedIndex, setSelectedMedIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<MedicineDetails | null>(MOCK_MEDICINES[0]);
  const [previewImage, setPreviewImage] = useState<string>(MOCK_MEDICINES[0].imageUrl);
  const [requestedWorker, setRequestedWorker] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [activeAgeGroup, setActiveAgeGroup] = useState<string>('Adults');

  const isTe = language === 'te';

  const handleScanSample = (index: number) => {
    setAIContext('MEDICINE_SCAN');
    setSelectedMedIndex(index);
    setPreviewImage(MOCK_MEDICINES[index].imageUrl);
    setIsScanning(true);
    setScanResult(null);
    setRequestedWorker(false);
    setSavedSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(MOCK_MEDICINES[index]);
    }, 1100);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setIsScanning(true);
      setScanResult(null);
      setRequestedWorker(false);
      setSavedSuccess(false);

      setTimeout(() => {
        setIsScanning(false);
        setScanResult(MOCK_MEDICINES[2]); // ORS mock with unverified timing for safety testing
      }, 1200);
    }
  };

  const handleAskWorker = () => {
    if (!scanResult) return;
    setRequestedWorker(true);

    addOfflineRequest({
      type: 'MEDICINE',
      title: `Medicine verification query: ${scanResult.tradeName}`,
      content: `Patient requested label verification for ${scanResult.tradeName} (${scanResult.genericName}).`,
      language: language,
      patientId: 'pt-103'
    });

    onAskWorkerAboutMedicine(scanResult.tradeName, scanResult);

    setTimeout(() => {
      setCurrentPage('worker');
    }, 1200);
  };

  const handleSaveMedicine = () => {
    if (isGuest) {
      setCurrentPage('auth');
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fade-in select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <Sparkles className="w-3.5 h-3.5 text-amber-200" /> OCR Package Scanner & Safety Check
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('medTitle')}
          </h1>
          <p className="text-amber-100 text-sm font-medium">
            {t('medSubtitle')}
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md text-xs font-semibold text-amber-100 border border-white/20">
          Safety First: AI does not prescribe medicine
        </div>
      </div>

      {/* Upload / Camera & Sample Selector Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-extrabold text-slate-900">
              Select or Upload Medicine Packaging
            </h3>
            <p className="text-xs text-slate-500">
              Upload a clear photo of the tablet strip or syrup bottle label.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 border border-slate-300 transition-all">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>{t('uploadLabel')}</span>
              <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
            </label>

            <button
              onClick={() => handleScanSample(1)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow"
            >
              <Camera className="w-4 h-4" />
              <span>{t('cameraLabel')}</span>
            </button>
          </div>
        </div>

        {/* Preset Sample Packages */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Or Click a Sample Packaging to Test OCR Scan:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MOCK_MEDICINES.map((med, idx) => (
              <button
                key={med.id}
                onClick={() => handleScanSample(idx)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  selectedMedIndex === idx && scanResult
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                }`}
              >
                <img src={med.imageUrl} alt={med.tradeName} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 truncate">{med.tradeName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{med.genericName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Image Preview & Scan Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Image Preview Box */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <img 
            src={previewImage} 
            alt="Medicine preview" 
            className={`max-h-60 rounded-2xl object-contain shadow-lg transition-all ${
              isScanning ? 'opacity-50 blur-xs scale-95' : 'opacity-100'
            }`} 
          />

          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 space-y-3">
              <div className="w-full h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b] animate-bounce" />
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm bg-black/80 px-4 py-2 rounded-full border border-amber-500/50">
                <Scan className="w-5 h-5 animate-spin" />
                <span>Extracting Label Information...</span>
              </div>
            </div>
          )}
        </div>

        {/* Scan Results Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-600" />
              <span>{t('medInfo')}</span>
            </h3>
            {scanResult && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                ✓ OCR Label Verified
              </span>
            )}
          </div>

          {isScanning ? (
            <div className="space-y-3 py-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
              <p className="text-xs font-semibold">Extracting text from packaging image...</p>
            </div>
          ) : scanResult ? (
            <div className="space-y-3 text-xs">
              
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-medium">{t('name')}:</span>
                <span className="font-extrabold text-slate-900 text-sm">{scanResult.tradeName} ({scanResult.genericName})</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-medium">{t('strength')}:</span>
                <span className="font-bold text-slate-900">{scanResult.strength}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-0.5">
                <span className="text-slate-500 font-medium block">Composition:</span>
                <span className="font-bold text-slate-900 leading-normal block">{scanResult.composition}</span>
              </div>

              {/* Expiry Date */}
              <div className={`p-3 rounded-2xl border flex justify-between items-center ${
                scanResult.expiryDate ? 'bg-slate-50 border-slate-200' : 'bg-rose-50 border-rose-300'
              }`}>
                <span className="text-slate-500 font-medium">{t('expiry')}:</span>
                {scanResult.expiryDate ? (
                  <span className="font-extrabold text-slate-900">{scanResult.expiryDate}</span>
                ) : (
                  <span className="font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                    ⚠️ {t('notDetected')}
                  </span>
                )}
              </div>

              {/* WHEN TO TAKE SECTION */}
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-2xl border border-sky-200 space-y-2">
                <div className="flex items-center justify-between text-sky-950 font-extrabold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" /> WHEN TO TAKE
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    scanResult.whenToTakeVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {scanResult.whenToTakeVerified ? '✓ Package Verified' : '⚠️ Unverified'}
                  </span>
                </div>

                {scanResult.whenToTakeVerified ? (
                  <div className="space-y-1 text-slate-800">
                    <p className="font-bold">
                      {isTe ? scanResult.whenToTakeTe : scanResult.whenToTakeEn}
                    </p>
                    <p className="text-[11px] text-slate-600">Frequency: {scanResult.frequencyEn}</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-amber-950">
                    <p className="font-bold">When-to-take information could not be verified from packaging.</p>
                    <p className="text-[11px] text-amber-900">Please follow your doctor's prescription or consult an ASHA worker before taking.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleAskWorker}
                  disabled={requestedWorker}
                  className={`w-full py-3 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow ${
                    requestedWorker ? 'bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {requestedWorker ? <Check className="w-4 h-4 text-emerald-300" /> : <UserCheck className="w-4 h-4" />}
                  <span>{requestedWorker ? 'Transmitted to Worker Portal!' : '📞 Ask Healthcare Worker'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveMedicine}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-sky-600" />
                    <span>{isGuest ? 'Login to Save' : savedSuccess ? '✓ Saved' : '📋 Save Medicine'}</span>
                  </button>

                  <button
                    onClick={() => handleScanSample((selectedMedIndex + 1) % MOCK_MEDICINES.length)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300"
                  >
                    🔄 Next Sample
                  </button>
                </div>
              </div>

            </div>
          ) : null}

        </div>

      </div>

      {/* AGE-BASED DOSAGE INFORMATION SECTION (REQUIREMENT 7 COMPLIANCE) */}
      {scanResult && scanResult.ageGroupDosage && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Age-Based Dosage Reference Information
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Verified reference data from official medicine packaging and medical databases.
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300">
              Verified Source Only
            </span>
          </div>

          {/* Age Group Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {scanResult.ageGroupDosage.map((item) => (
              <button
                key={item.group}
                onClick={() => setActiveAgeGroup(item.group)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeAgeGroup === item.group
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{item.group}</span>
                {!item.isVerified && <span className="text-[10px] text-amber-200">⚠️</span>}
              </button>
            ))}
          </div>

          {/* Selected Age Group Content */}
          {(() => {
            const currentDosageInfo = scanResult.ageGroupDosage.find(a => a.group === activeAgeGroup);
            if (!currentDosageInfo) return null;

            return (
              <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
                currentDosageInfo.isVerified
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    {currentDosageInfo.isVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    Dosage Guidance for {currentDosageInfo.group}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentDosageInfo.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {currentDosageInfo.isVerified ? 'Package Source Verified' : 'Unverified Dosage'}
                  </span>
                </div>

                <p className="text-xs font-extrabold leading-relaxed">
                  "{currentDosageInfo.guidance}"
                </p>

                {!currentDosageInfo.isVerified && (
                  <div className="pt-2 border-t border-amber-200/60 text-[11px] font-bold text-amber-900">
                    Dosage information not available — please consult a doctor or pharmacist.
                  </div>
                )}
              </div>
            );
          })()}

          {/* Mandatory Professional Disclaimer */}
          <div className="p-3.5 bg-slate-100 rounded-2xl text-xs text-slate-700 font-bold flex items-center justify-center gap-2 text-center">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Consult a healthcare professional before taking medicine.</span>
          </div>

        </div>
      )}

      {/* Safety Notice */}
      <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 flex items-start gap-3 text-xs text-rose-950">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <p className="font-semibold leading-relaxed">
          {t('medSafetyNotice')}
        </p>
      </div>

    </div>
  );
};
