import React from 'react';
import { SecurityFinding } from './types';
import { Shield, ShieldAlert, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface SecurityViewProps {
  findings: SecurityFinding[];
}

export const SecurityView: React.FC<SecurityViewProps> = ({ findings }) => {
  const failedIssues = findings.filter(f => f.status === 'failed');
  const passedIssues = findings.filter(f => f.status === 'passed');
  const securityScore = findings.length > 0 ? Math.round((passedIssues.length / findings.length) * 100) : 100;

  const getSeverityIcon = (severity: SecurityFinding['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" /> Security Audit
          </h1>
          <p className="text-slate-400 text-xs mt-1">AWS IAM, network isolation, and encryption analysis</p>
        </div>

        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3 text-xs">
          <ShieldAlert className="w-4 h-4 text-purple-400 animate-bounce" />
          <div>
            <div className="text-slate-400 font-medium">Security Index Score</div>
            <div className="text-sm font-extrabold text-white">{securityScore}%</div>
          </div>
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">No Security Risks Found</h3>
          <p className="text-slate-550 text-[10px] mt-1 max-w-[280px]">
            Static vulnerability checks show zero public exposes, missing logs, or unencrypted assets.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Detailed Security List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Failures & Remediation</h2>
              {failedIssues.length === 0 ? (
                <p className="text-xs text-slate-500 p-2">Zero active configuration errors detected.</p>
              ) : (
                <div className="space-y-3">
                  {failedIssues.map(issue => (
                    <div key={issue.id} className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 text-xs flex items-start gap-3">
                      <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="font-bold text-slate-200">{issue.title}</div>
                        <p className="text-slate-400 text-[10px] leading-relaxed">{issue.description}</p>
                        {issue.recommendation && (
                          <div className="text-[9px] text-red-400 font-medium mt-1">
                            Fix: {issue.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Successful Guardrails</h2>
              {passedIssues.length === 0 ? (
                <p className="text-xs text-slate-500 p-2">No successfully verified policies. Set up correct VPC or IAM controls.</p>
              ) : (
                <div className="space-y-2">
                  {passedIssues.map(issue => (
                    <div key={issue.id} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1 font-semibold text-slate-300">{issue.title}</div>
                      <span className="text-[8px] bg-emerald-900/40 px-2 py-0.5 rounded text-emerald-400 border border-emerald-800">Pass</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Security Best Practice Recommendations Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col space-y-4 h-fit">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">AWS Best Practices Audit</h2>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-purple-400 font-bold">01</span>
                <div>
                  <h4 className="font-bold text-slate-200">Enforce IAM Roles for EC2</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Never store long-term Access Keys directly within application instances or servers.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-purple-400 font-bold">02</span>
                <div>
                  <h4 className="font-bold text-slate-200">Strict VPC Subnets Layering</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Partition database storage RDS instances inside private subnets without public routers.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-purple-400 font-bold">03</span>
                <div>
                  <h4 className="font-bold text-slate-200">HTTPS CloudFront Traffic</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Configure certificate redirect triggers on all edge CDN endpoints for end-to-end encryption.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
