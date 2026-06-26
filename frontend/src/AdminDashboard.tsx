import React from 'react';
import { Project } from './types';
import { Users, Layout, ShieldCheck, Cpu } from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects }) => {
  const totalProjects = projects.length;
  const avgHealth = Math.round(projects.reduce((sum, p) => sum + p.healthScore.overall, 0) / (totalProjects || 1));
  const activeUsersCount = 124; // Simulated user telemetry

  // Compute most used services
  const serviceCounts: Record<string, number> = {};
  projects.forEach(p => {
    p.resources.forEach(r => {
      serviceCounts[r.type] = (serviceCounts[r.type] || 0) + 1;
    });
  });

  const sortedServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System Admin Telemetry</h1>
        <p className="text-slate-400 text-xs mt-1">Global workspace statistics and health benchmarks</p>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Platform Users</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{activeUsersCount}</span>
            <span className="text-xs text-slate-500 font-medium">Cognito Identity</span>
          </div>
          <div className="absolute right-3 -bottom-3 opacity-10">
            <Users className="w-16 h-16 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Architectures</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{totalProjects}</span>
            <span className="text-xs text-slate-500 font-medium font-sans">Active projects</span>
          </div>
          <div className="absolute right-3 -bottom-3 opacity-10">
            <Layout className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Health Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{avgHealth}%</span>
            <span className="text-xs text-slate-500 font-medium">Well-Architected</span>
          </div>
          <div className="absolute right-3 -bottom-3 opacity-10">
            <ShieldCheck className="w-16 h-16 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Infrastructure Nodes</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">
              {projects.reduce((sum, p) => sum + p.resources.length, 0)}
            </span>
            <span className="text-xs text-slate-500 font-medium">Deployed</span>
          </div>
          <div className="absolute right-3 -bottom-3 opacity-10">
            <Cpu className="w-16 h-16 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Most Used Services table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Most Used AWS Services</h3>
          {sortedServices.length === 0 ? (
            <p className="text-slate-500 text-xs py-4">No active resources have been mapped across workspaces yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedServices.map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-900 text-purple-400 border border-slate-800">
                      {type}
                    </span>
                    <span className="font-semibold text-slate-300">{type} Resource Configuration</span>
                  </div>
                  <div className="text-slate-450 font-medium">{count} active instances</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global logs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Audit Log</h3>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] text-[10px] font-mono text-slate-450">
            <div className="p-2 rounded bg-slate-950 border border-slate-850">
              <span className="text-purple-400 font-bold">[AUTH]</span> User user-194 signed in.
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-850">
              <span className="text-purple-400 font-bold">[BUILDER]</span> MediaAssetsBucket S3 rules optimized.
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-850">
              <span className="text-purple-400 font-bold">[CDK]</span> CloudFormation export compiled.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
