import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useGcs } from '../../contexts/GcsContext';

interface NavbarProps {
  onOpenConsole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { nightVisionMode, selectedUav, setActiveTab } = useGcs();

  return (
    <header className={`w-full border-b transition-colors z-40 ${
      nightVisionMode 
        ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' 
        : 'bg-white border-[#E2E8F0] text-[#0F172A]'
    } backdrop-blur-md sticky top-0 shadow-sm flex items-center justify-start gap-12 px-6 py-3`}>
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shadow-sm text-red-700">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-medium text-base tracking-wide text-gray-900 m-0 leading-tight">
            DRDO | GCS-X1
          </h1>
          <span className="text-sm font-semibold text-red-700">
            Aero Piston Twin
          </span>
        </div>
      </div>

      {/* Right side */}
      {selectedUav && (
        <>
          <div className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 shadow-sm font-mono-code text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] font-semibold flex flex-col uppercase leading-tight"><span>Engine</span><span>HLT:</span></span>
            <span className={`text-base font-bold ${
              selectedUav.engineHealthIndex > 80 ? 'text-green-700' :
              selectedUav.engineHealthIndex > 65 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {selectedUav.engineHealthIndex.toFixed(1)}%
            </span>
          </div>
          <div className="w-px h-6 bg-[#E2E8F0]"></div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] font-semibold uppercase">RUL:</span>
            <span className="text-base font-bold text-blue-800 flex flex-col leading-tight items-center">
              <span>{selectedUav.predictedRulHours.toFixed(1)}</span>
              <span className="text-[9px] text-[#64748B]">hrs</span>
            </span>
          </div>
          <div className="w-px h-6 bg-[#E2E8F0]"></div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] font-semibold flex flex-col uppercase leading-tight"><span>Twin</span><span>Sync:</span></span>
            <span className="text-base font-bold text-gray-800">
              {selectedUav.twinConfidenceScore.toFixed(1)}%
            </span>
          </div>
          <div className="w-px h-6 bg-[#E2E8F0]"></div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] font-semibold uppercase">Decision:</span>
            <span className={`px-2 py-1 rounded font-bold uppercase tracking-wide ${
              selectedUav.missionRiskScore < 25 ? 'bg-green-100 text-green-800 border border-green-200' :
              selectedUav.missionRiskScore < 60 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {selectedUav.missionRiskScore < 25 ? 'GO FLIGHT' : 'OBSERVE'}
            </span>
          </div>
          <div className="w-px h-6 bg-[#E2E8F0]"></div>
          <button 
            onClick={() => setActiveTab('alerts')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 rounded-lg text-red-500 font-bold text-xs tracking-wide transition-colors animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            ALERT
          </button>
          </div>
          
          {/* Simulator button pushed to far right */}
          <button
            onClick={() => window.open('http://localhost:3000/simulator', '_blank')}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-700 rounded-lg text-white font-bold text-sm tracking-wide transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
            SIMULATOR
          </button>
        </>
      )}
    </header>
  );
};

