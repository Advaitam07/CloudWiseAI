import React, { useState } from 'react';
import { Project } from './types';
import { Download, FileText, Database, ShieldAlert, Check, RefreshCw } from 'lucide-react';

interface ReportGeneratorProps {
  project: Project;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ project }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const totalMonthlyCost = project.resources.reduce((sum, r) => sum + r.cost, 0);
  const totalSavings = project.recommendations.reduce((sum, r) => sum + r.estimatedSavings, 0);

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setDownloaded(true);
      
      // Auto open browser print layout to export page beautifully as PDF
      window.print();
      
      setTimeout(() => setDownloaded(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Report Generator</h1>
          <p className="text-slate-400 text-xs mt-1">Export full-stack AWS architecture metrics & security audits as PDF</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/40 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/10 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Generating PDF...
            </>
          ) : downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-450" />
              Exported!
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Export PDF Report
            </>
          )}
        </button>
      </div>

      {/* Interactive PDF Document Mock Preview */}
      <div id="pdf-report-preview" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-xs text-slate-300 space-y-8 print:bg-white print:text-black print:p-0 print:border-none shadow-2xl relative">
        <div className="absolute top-4 right-4 text-[10px] text-purple-400 font-bold uppercase tracking-wider print:hidden">
          Document Preview
        </div>

        {/* Section 1: Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-slate-300">
          <div>
            <div className="text-lg font-bold text-white print:text-black">CloudWise AI Architecture Assessment</div>
            <div className="text-slate-500 text-[10px] mt-1">Generated on: {new Date().toLocaleDateString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-purple-500">CloudWise AI</div>
            <div className="text-[9px] text-slate-500">System Code Assessment</div>
          </div>
        </div>

        {/* Section 2: Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white print:text-black uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-400" /> Executive Architecture Summary
          </h2>
          <p className="text-slate-400 leading-relaxed text-[11px] print:text-slate-700">
            This document outlines the design cost projections, high-availability optimization metrics, and cloud security policy gaps associated with project <strong>{project.name}</strong>.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl print:border-slate-300 print:bg-slate-100">
              <div className="text-slate-500 font-semibold uppercase text-[8px]">Overall Score</div>
              <div className="text-base font-bold text-white print:text-black mt-1">{project.healthScore.overall}%</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl print:border-slate-300 print:bg-slate-100">
              <div className="text-slate-500 font-semibold uppercase text-[8px]">Active Resources</div>
              <div className="text-base font-bold text-white print:text-black mt-1">{project.resources.length} Nodes</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl print:border-slate-300 print:bg-slate-100">
              <div className="text-slate-500 font-semibold uppercase text-[8px]">Projected Cost</div>
              <div className="text-base font-bold text-white print:text-black mt-1">${totalMonthlyCost.toFixed(2)}/mo</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl print:border-slate-300 print:bg-slate-100">
              <div className="text-slate-500 font-semibold uppercase text-[8px]">Potential Savings</div>
              <div className="text-base font-bold text-emerald-400 print:text-emerald-700 mt-1">${totalSavings.toFixed(2)}/mo</div>
            </div>
          </div>
        </div>

        {/* Section 3: Cost breakdown */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white print:text-black uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-blue-400" /> Resource Mapping & Monthly Pricing
          </h2>
          <div className="overflow-x-auto border border-slate-800 rounded-xl print:border-slate-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <th className="p-3 font-semibold text-slate-400 uppercase tracking-wider text-[9px]">Resource Name</th>
                  <th className="p-3 font-semibold text-slate-400 uppercase tracking-wider text-[9px]">AWS Service</th>
                  <th className="p-3 font-semibold text-slate-400 uppercase tracking-wider text-[9px]">Region</th>
                  <th className="p-3 font-semibold text-slate-400 uppercase tracking-wider text-[9px] text-right">Est. Monthly Cost</th>
                </tr>
              </thead>
              <tbody>
                {project.resources.map(res => (
                  <tr key={res.id} className="border-b border-slate-850/60 last:border-0 print:border-slate-300">
                    <td className="p-3 font-bold text-slate-200 print:text-black">{res.name}</td>
                    <td className="p-3">{res.type}</td>
                    <td className="p-3 font-mono">{res.region}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-200 print:text-black">${res.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Security Findings */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white print:text-black uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> High-Severity Policy Failures
          </h2>
          {project.securityFindings.filter(f => f.status === 'failed').length === 0 ? (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-400">
              No active infrastructure security failures detected.
            </div>
          ) : (
            <div className="space-y-2">
              {project.securityFindings.filter(f => f.status === 'failed').map(find => (
                <div key={find.id} className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 print:bg-slate-100 print:border-slate-350">
                  <div className="font-bold text-slate-250 print:text-black">{find.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Vulnerability Class: {find.severity} severity</div>
                  <p className="text-[10px] text-slate-400 print:text-slate-700 mt-1">{find.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
