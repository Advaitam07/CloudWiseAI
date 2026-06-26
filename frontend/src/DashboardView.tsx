import React from 'react';
import { Project } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Cpu, ShieldAlert, Award, DollarSign, RefreshCw, Zap, TrendingUp, Info } from 'lucide-react';

interface DashboardViewProps {
  project: Project;
  onRefreshAnalysis: () => void;
  isAnalyzing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ project, onRefreshAnalysis, isAnalyzing }) => {
  // Compute metrics from real project resource list
  const totalResources = project.resources.length;
  const totalMonthlyCost = project.resources.reduce((sum, r) => sum + r.cost, 0);
  const totalSavings = project.recommendations.reduce((sum, r) => sum + r.estimatedSavings, 0);

  // Generate Recharts chart datasets
  const costBreakdownData = project.resources
    .filter(r => r.cost > 0)
    .map(r => ({
      name: r.name,
      cost: r.cost,
      type: r.type,
    }));

  const monthlyTrendData = [
    { month: 'Jan', cost: totalMonthlyCost * 0.95 },
    { month: 'Feb', cost: totalMonthlyCost * 1.1 },
    { month: 'Mar', cost: totalMonthlyCost * 1.05 },
    { month: 'Apr', cost: totalMonthlyCost * 0.98 },
    { month: 'May', cost: totalMonthlyCost * 1.02 },
    { month: 'Jun', cost: totalMonthlyCost },
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Project Dashboard</h1>
          <p className="text-slate-400 text-xs mt-1">{project.name} &bull; Overall status statistics</p>
        </div>
        <button
          onClick={onRefreshAnalysis}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/40 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:scale-100 shadow-lg shadow-purple-600/10 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Running AI Engine...' : 'Run Optimization Audit'}
        </button>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric Card: Health Score */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-2 -bottom-2 opacity-10">
            <Award className="w-16 h-16 text-purple-400" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{project.healthScore.overall}%</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Healthy</span>
          </div>
          <div className="w-full bg-slate-850 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.healthScore.overall}%` }}
            />
          </div>
        </div>

        {/* Metric Card: Total Resources */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-2 -bottom-2 opacity-10">
            <Cpu className="w-16 h-16 text-blue-400" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resources</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{totalResources}</span>
            <span className="text-xs text-slate-400 font-medium">Nodes</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4">Calculated in the visual builder</p>
        </div>

        {/* Metric Card: Monthly Spend */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-2 -bottom-2 opacity-10">
            <DollarSign className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Cost</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-white">${totalMonthlyCost.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/mo</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4">Yearly projection: ${(totalMonthlyCost * 12).toFixed(2)}</p>
        </div>

        {/* Metric Card: Savings Opportunities */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-2 -bottom-2 opacity-10">
            <Zap className="w-16 h-16 text-yellow-400" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Savings</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-yellow-450 text-yellow-400">${totalSavings.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/mo</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold mt-4">
            {project.recommendations.length} action items active
          </p>
        </div>

        {/* Metric Card: Security Scans */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-2 -bottom-2 opacity-10">
            <ShieldAlert className="w-16 h-16 text-rose-400" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Alerts</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">
              {project.securityFindings.filter(f => f.status === 'failed').length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Critical Issues</span>
          </div>
          <p className="text-[10px] text-rose-400 font-semibold mt-4">Requires active remediation</p>
        </div>
      </div>

      {/* Chart Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cost Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Monthly Spend Trend Projections
            </h3>
            <span className="text-xs text-slate-400 border border-slate-800 rounded-md px-2 py-0.5">Forecast</span>
          </div>
          <div className="h-64 w-full">
            {totalMonthlyCost > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#c084fc', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No active resources configured to plot charts.
              </div>
            )}
          </div>
        </div>

        {/* Resources Cost Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" /> Service Resource Cost Share
          </h3>
          <div className="h-64 w-full">
            {costBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBreakdownData} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#82ca9d', fontSize: '12px' }}
                  />
                  <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                    {costBreakdownData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No resource estimates. Add resources to view cost graphs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
