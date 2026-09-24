import React from 'react';
import { 
  Radar, 
  Plane,
  AlertTriangle,
  Activity,
  Clock,
  TrendingDown,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useGcs } from '../contexts/GcsContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';

// Dummy data for sections C, D, E (Section A and B use uavFleet)
const DUMMY_ALERTS = [
  { time: '10:42 AM', uav: 'UAV-RUSTOM-09', type: 'Thermal Limit Exceeded', severity: 'Critical', param: 'EGT / CHT', status: 'Active' },
  { time: '10:15 AM', uav: 'UAV-ARCHER-04', type: 'Sensor Drift Detected', severity: 'Warning', param: 'Oil Pressure', status: 'Acknowledged' },
  { time: '09:30 AM', uav: 'UAV-TAPAS-201', type: 'Fuel Imbalance', severity: 'Info', param: 'Fuel System', status: 'Resolved' },
  { time: '08:45 AM', uav: 'UAV-SWIFT-07', type: 'High Vibration Level', severity: 'Critical', param: 'Engine Mount', status: 'Active' },
];

const DUMMY_ADVISORIES = [
  { prio: 'P1 (Immediate)', uav: 'UAV-RUSTOM-09', action: 'Emergency Engine Shutdown / RTB', reason: 'EGT > 900°C, Oil < 150 kPa', time: 'Immediate' },
  { prio: 'P2 (High)', uav: 'UAV-ARCHER-04', action: 'Schedule Oil System Inspection', reason: 'Accelerated RUL degradation', time: 'Post-flight' },
  { prio: 'P3 (Medium)', uav: 'UAV-TAPAS-201', action: 'Monitor Fuel Flow Sensors', reason: 'Transient fuel imbalance resolved', time: 'Next routine maintenance' },
];

const getAlertColor = (severity: string) => {
  if (severity === 'Critical') return 'text-red-400 bg-red-950/40 border-red-800/60';
  if (severity === 'Warning') return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
  return 'text-blue-400 bg-blue-950/40 border-blue-800/60';
};

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
    <Icon className="w-4 h-4 text-cyan-400" />
    <h3 className="font-heading font-bold text-sm text-slate-100">{title}</h3>
  </div>
);

export const FleetMonitoringPage: React.FC = () => {
  const { uavFleet, setSelectedUavId, setActiveTab } = useGcs();
  const sortedByRul = [...uavFleet].sort((a, b) => a.predictedRulHours - b.predictedRulHours);

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-xl text-slate-100">
              Fleet Monitoring
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono-code font-bold">
              GLOBAL HEALTH TRACKING
            </span>
          </div>
          <p className="text-xs font-mono-code text-slate-400 mt-0.5">
            Fleet-wide diagnostic matrix & predictive degradation monitoring for Digital Twin UAVs
          </p>
        </div>
      </div>

      {/* A. Fleet Overview Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard title="Total UAVs" value={uavFleet.length.toString()} status="NORMAL" change="Registered platforms" changeType="neutral" icon={Plane} />
        <MetricCard title="Active UAVs" value={uavFleet.filter(u => u.status === 'ACTIVE_MISSION').length.toString()} status="NORMAL" change="Airborne" changeType="positive" icon={Radar} />
        <MetricCard title="Critical Alerts" value="2" status="CRITICAL" change="Requires attention" changeType="negative" icon={AlertTriangle} />
        <MetricCard title="Average Health Score" value={`${(uavFleet.reduce((acc, u) => acc + u.engineHealthIndex, 0) / uavFleet.length).toFixed(1)}%`} status="NORMAL" change="Fleet baseline" changeType="positive" icon={Activity} />
        <MetricCard title="Average RUL" value={`${(uavFleet.reduce((acc, u) => acc + u.predictedRulHours, 0) / uavFleet.length).toFixed(1)}h`} status="NORMAL" change="Estimated endurance" changeType="neutral" icon={Clock} />
      </div>

      {/* B. Individual Engine Health Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <SectionHeader title="B. Individual Engine Health Status" icon={Activity} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {uavFleet.map(uav => (
            <div key={uav.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="font-heading font-bold text-sm text-slate-100">{uav.callsign}</span>
                <StatusBadge status={uav.status} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-code text-slate-400">
                <div className="flex justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span>HEALTH:</span>
                  <span className={`font-bold ${uav.engineHealthIndex < 50 ? 'text-red-400' : uav.engineHealthIndex < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{uav.engineHealthIndex}%</span>
                </div>
                <div className="flex justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span>RUL:</span>
                  <span className="font-bold text-cyan-300">{uav.predictedRulHours}h</span>
                </div>
                <div className="flex justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span>CHT / EGT:</span>
                  <span className="font-bold text-slate-200">185° / 740°</span>
                </div>
                <div className="flex justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                  <span>FUEL:</span>
                  <span className="font-bold text-slate-200">{uav.fuelRemainingKg}kg</span>
                </div>
              </div>
              <button onClick={() => { setSelectedUavId(uav.id); setActiveTab('dashboard'); }} className="mt-1 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-bold rounded font-mono-code transition-colors">
                INSPECT TELEMETRY →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* C. Fleet Alerts & Anomalies */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <SectionHeader title="C. Fleet Alerts & Anomalies" icon={AlertCircle} />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="pb-2 font-semibold">Time</th>
                  <th className="pb-2 font-semibold">UAV ID</th>
                  <th className="pb-2 font-semibold">Alert Type</th>
                  <th className="pb-2 font-semibold text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {DUMMY_ALERTS.map((alert, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-slate-500">{alert.time}</td>
                    <td className="py-2.5 font-bold text-slate-200">{alert.uav}</td>
                    <td className="py-2.5">{alert.type}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider ${getAlertColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* D. RUL & Degradation Ranking */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <SectionHeader title="D. RUL & Degradation Ranking" icon={TrendingDown} />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="pb-2 font-semibold">Rank</th>
                  <th className="pb-2 font-semibold">UAV ID</th>
                  <th className="pb-2 font-semibold">Current RUL</th>
                  <th className="pb-2 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {sortedByRul.map((uav, i) => (
                  <tr key={uav.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-slate-500">#{i + 1}</td>
                    <td className="py-2.5 font-bold text-slate-200">{uav.id}</td>
                    <td className={`py-2.5 font-bold ${uav.predictedRulHours < 50 ? 'text-red-400' : 'text-cyan-300'}`}>{uav.predictedRulHours.toFixed(1)}h</td>
                    <td className="py-2.5">
                      <span className={`text-[10px] font-bold ${uav.predictedRulHours < 50 ? 'text-red-400' : uav.predictedRulHours < 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {uav.predictedRulHours < 50 ? 'SEVERE' : uav.predictedRulHours < 100 ? 'ACCELERATED' : 'STABLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* E. Maintenance Advisory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <SectionHeader title="E. Maintenance Advisory" icon={Wrench} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="pb-2 font-semibold">Priority</th>
                <th className="pb-2 font-semibold">UAV ID</th>
                <th className="pb-2 font-semibold">Recommended Action</th>
                <th className="pb-2 font-semibold">Reason</th>
                <th className="pb-2 font-semibold">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {DUMMY_ADVISORIES.map((adv, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                      adv.prio.includes('P1') ? 'bg-red-950/40 border-red-800/60 text-red-400' :
                      adv.prio.includes('P2') ? 'bg-amber-950/40 border-amber-800/60 text-amber-400' : 
                      'bg-blue-950/40 border-blue-800/60 text-blue-400'
                    }`}>
                      {adv.prio}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-slate-200">{adv.uav}</td>
                  <td className="py-2.5 text-slate-100">{adv.action}</td>
                  <td className="py-2.5 text-slate-400">{adv.reason}</td>
                  <td className="py-2.5 text-slate-300">{adv.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
