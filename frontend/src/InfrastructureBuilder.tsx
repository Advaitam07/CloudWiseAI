import React, { useState } from 'react';
import { CloudResource, ResourceType } from './types';
import { Plus, Database, Cpu, Cloud, Layers, Settings, Trash, Check, Move } from 'lucide-react';

interface InfrastructureBuilderProps {
  resources: CloudResource[];
  onAddResource: (type: ResourceType) => void;
  onUpdateResource: (updated: CloudResource) => void;
  onRemoveResource: (id: string) => void;
}

export const InfrastructureBuilder: React.FC<InfrastructureBuilderProps> = ({
  resources,
  onAddResource,
  onUpdateResource,
  onRemoveResource
}) => {
  const [selectedResId, setSelectedResId] = useState<string | null>(null);

  // Available resource template catalogs to inject into canvas
  const resourceCatalog: { type: ResourceType; label: string; desc: string; icon: React.ReactNode }[] = [
    { type: 'VPC', label: 'VPC Network', desc: 'Secure logical isolation boundary', icon: <Layers className="w-4 h-4 text-indigo-400" /> },
    { type: 'CloudFront', label: 'CloudFront CDN', desc: 'Global content delivery cache network', icon: <Cloud className="w-4 h-4 text-purple-400" /> },
    { type: 'ALB', label: 'Application Load Balancer', desc: 'Traffic routing & distribution layer', icon: <Cpu className="w-4 h-4 text-blue-400" /> },
    { type: 'EC2', label: 'EC2 Virtual Machine', desc: 'Resizable compute instance node', icon: <Cpu className="w-4 h-4 text-sky-400" /> },
    { type: 'RDS', label: 'RDS Relational Database', desc: 'Managed Postgres/MySQL instance', icon: <Database className="w-4 h-4 text-amber-400" /> },
    { type: 'Lambda', label: 'Lambda Serverless Function', desc: 'Event-driven serverless computing', icon: <Cpu className="w-4 h-4 text-orange-400" /> },
    { type: 'DynamoDB', label: 'DynamoDB NoSQL Table', desc: 'Fast, key-value document database', icon: <Database className="w-4 h-4 text-emerald-400" /> },
    { type: 'S3', label: 'S3 Object Storage', desc: 'Infinite static storage bucket', icon: <Database className="w-4 h-4 text-cyan-400" /> },
  ];

  const activeResource = resources.find(r => r.id === selectedResId);

  // Configuration field updater helpers
  const handleConfigChange = (field: string, val: string | number | boolean) => {
    if (!activeResource) return;
    const updated = {
      ...activeResource,
      config: {
        ...activeResource.config,
        [field]: val
      }
    };

    // Auto update live costs based on selection config parameters
    if (activeResource.type === 'EC2') {
      const scaleCount = Number(updated.config.count || 1);
      const instance = String(updated.config.instanceType || 't3.micro');
      let baseRate = 8.50;
      if (instance === 't3.medium') baseRate = 24.09;
      if (instance === 'c6g.xlarge') baseRate = 120.45;
      updated.cost = baseRate * scaleCount;
    } else if (activeResource.type === 'RDS') {
      const hasMulti = updated.config.multiAz === true;
      const rdsClass = String(updated.config.instanceClass || 'db.t3.micro');
      let baseRate = 15.00;
      if (rdsClass === 'db.m6g.large') baseRate = 69.25;
      if (rdsClass === 'db.m6g.xlarge') baseRate = 138.50;
      updated.cost = baseRate * (hasMulti ? 2 : 1);
    } else if (activeResource.type === 'S3') {
      const size = Number(updated.config.sizeGb || 0);
      const storage = String(updated.config.storageClass || 'Standard');
      const rate = storage === 'Standard' ? 0.023 : 0.00099; // standard vs glacier
      updated.cost = size * rate;
    } else if (activeResource.type === 'Lambda') {
      const executions = Number(updated.config.executionsPerMonth || 0);
      updated.cost = (executions / 1000000) * 0.20;
    }

    onUpdateResource(updated);
  };

  const handlePositionShift = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!activeResource) return;
    const updated = { ...activeResource };
    if (direction === 'up') updated.position.y = Math.max(20, updated.position.y - 40);
    if (direction === 'down') updated.position.y = Math.min(480, updated.position.y + 40);
    if (direction === 'left') updated.position.x = Math.max(20, updated.position.x - 40);
    if (direction === 'right') updated.position.x = Math.min(800, updated.position.x + 40);
    onUpdateResource(updated);
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* 1. Resources Catalog Menu */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">AWS Resources</h2>
          <p className="text-slate-500 text-[10px] mt-0.5">Click to instantiate nodes onto the canvas map</p>
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[450px] pr-1">
          {resourceCatalog.map(catalog => (
            <button
              key={catalog.type}
              onClick={() => onAddResource(catalog.type)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-purple-500/40 hover:bg-slate-900 transition-all flex items-start gap-3 group text-xs cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-slate-900 group-hover:bg-purple-950/40 transition-colors">
                {catalog.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-200 group-hover:text-purple-400 transition-colors flex items-center justify-between">
                  {catalog.label}
                  <Plus className="w-3 h-3 text-slate-500 group-hover:text-purple-400" />
                </div>
                <p className="text-slate-500 text-[9px] mt-0.5 leading-normal truncate">{catalog.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Canvas Visualizer Map */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 lg:col-span-2 flex flex-col h-[520px]">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Architecture Visualizer</h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Dynamic diagram of layout connections</p>
          </div>
          <span className="text-[10px] bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-400">
            Interactive Canvas
          </span>
        </div>

        {/* Dynamic Topology Canvas */}
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden grid-bg select-none">
          {resources.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <Cloud className="w-12 h-12 text-slate-700 animate-pulse mb-3" />
              <p className="text-xs font-semibold">Your Infrastructure is Empty</p>
              <p className="text-[10px] text-slate-650 mt-1 max-w-[240px]">
                Click resources on the catalog panel to load servers, networks, databases, and buckets.
              </p>
            </div>
          ) : (
            <>
              {/* Draw Simulated Connections to Gateway and DB Nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {resources.map((res, i) => {
                  // Connect VPC elements or database nodes for dynamic visuals
                  const nextNode = resources[i + 1];
                  if (!nextNode) return null;
                  return (
                    <line
                      key={`link-${res.id}-${nextNode.id}`}
                      x1={res.position.x + 40}
                      y1={res.position.y + 20}
                      x2={nextNode.position.x + 40}
                      y2={nextNode.position.y + 20}
                      stroke="rgba(139, 92, 246, 0.15)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>

              {/* Render Draggable / Selectable Nodes */}
              {resources.map(res => {
                const isSelected = selectedResId === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResId(res.id);
                    }}
                    style={{ left: `${res.position.x}px`, top: `${res.position.y}px` }}
                    className={`absolute p-2 px-3 rounded-lg border text-left cursor-pointer transition-all z-10 w-36 ${
                      isSelected
                        ? 'bg-purple-950/20 border-purple-500 shadow-md shadow-purple-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 justify-between">
                      <span className={`text-[8px] font-semibold px-1 rounded uppercase tracking-wider ${
                        res.type === 'VPC' ? 'bg-indigo-950 border border-indigo-800 text-indigo-400' :
                        res.type === 'RDS' || res.type === 'DynamoDB' ? 'bg-amber-950 border border-amber-800 text-amber-400' :
                        res.type === 'EC2' || res.type === 'Lambda' ? 'bg-sky-950 border border-sky-850 text-sky-400' :
                        'bg-purple-950 border border-purple-800 text-purple-400'
                      }`}>
                        {res.type}
                      </span>
                      <span className="text-[9px] font-medium text-slate-400 font-mono">${res.cost.toFixed(1)}/m</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-100 truncate">{res.name}</div>
                    <div className="text-[8px] text-slate-500 truncate">{res.region}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* 3. Selected Node Inspector Config Editor */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1">
            <Settings className="w-4 h-4 text-purple-400" /> Resource Inspector
          </h2>
          <p className="text-slate-500 text-[10px] mt-0.5">Edit attributes and recalculate costs</p>
        </div>

        {activeResource ? (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div className="font-bold text-slate-200">{activeResource.name}</div>
              <div className="text-slate-500 text-[10px] mt-0.5">Type: {activeResource.type}</div>
              <div className="text-purple-400 font-mono font-bold mt-2 text-sm">${activeResource.cost.toFixed(2)}/mo</div>
            </div>

            {/* Common fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Resource Name</label>
                <input
                  type="text"
                  value={activeResource.name}
                  onChange={(e) => onUpdateResource({ ...activeResource, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Region</label>
                <select
                  value={activeResource.region}
                  onChange={(e) => onUpdateResource({ ...activeResource, region: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="us-east-1">us-east-1 (N. Virginia)</option>
                  <option value="us-west-2">us-west-2 (Oregon)</option>
                  <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                  <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                </select>
              </div>

              {/* Dynamic Type Config Parameters */}
              {activeResource.type === 'EC2' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Instance Type</label>
                    <select
                      value={String(activeResource.config.instanceType || 't3.micro')}
                      onChange={(e) => handleConfigChange('instanceType', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="t3.micro">t3.micro (1 vCPU, 1GB RAM) &bull; ~$8.50</option>
                      <option value="t3.medium">t3.medium (2 vCPU, 4GB RAM) &bull; ~$24.09</option>
                      <option value="c6g.xlarge">c6g.xlarge (4 vCPU, 8GB RAM) &bull; ~$120.45</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Instance Count: {Number(activeResource.config.count || 1)}</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={Number(activeResource.config.count || 1)}
                      onChange={(e) => handleConfigChange('count', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </>
              )}

              {activeResource.type === 'RDS' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Instance Class</label>
                    <select
                      value={String(activeResource.config.instanceClass || 'db.t3.micro')}
                      onChange={(e) => handleConfigChange('instanceClass', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="db.t3.micro">db.t3.micro &bull; ~$15.00</option>
                      <option value="db.m6g.large">db.m6g.large &bull; ~$69.25</option>
                      <option value="db.m6g.xlarge">db.m6g.xlarge &bull; ~$138.50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="multiAz"
                      checked={activeResource.config.multiAz === true}
                      onChange={(e) => handleConfigChange('multiAz', e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                    />
                    <label htmlFor="multiAz" className="text-[10px] font-bold text-slate-400">Multi-AZ Redundancy (+100% cost)</label>
                  </div>
                </>
              )}

              {activeResource.type === 'S3' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Storage Class</label>
                    <select
                      value={String(activeResource.config.storageClass || 'Standard')}
                      onChange={(e) => handleConfigChange('storageClass', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Standard">S3 Standard &bull; $0.023/GB</option>
                      <option value="Glacier">S3 Glacier Deep &bull; $0.00099/GB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Storage (GB): {Number(activeResource.config.sizeGb || 0)}</label>
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={50}
                      value={Number(activeResource.config.sizeGb || 0)}
                      onChange={(e) => handleConfigChange('sizeGb', Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="s3versioning"
                      checked={activeResource.config.versioning === true}
                      onChange={(e) => handleConfigChange('versioning', e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                    />
                    <label htmlFor="s3versioning" className="text-[10px] font-bold text-slate-400">Enable Versioning</label>
                  </div>
                </>
              )}
            </div>

            {/* Position tweaks */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Shift Position</label>
              <div className="grid grid-cols-3 gap-1 max-w-[120px]">
                <div />
                <button onClick={() => handlePositionShift('up')} className="bg-slate-950 border border-slate-850 hover:bg-slate-900 p-1.5 rounded text-center text-[10px] cursor-pointer">▲</button>
                <div />
                <button onClick={() => handlePositionShift('left')} className="bg-slate-950 border border-slate-850 hover:bg-slate-900 p-1.5 rounded text-center text-[10px] cursor-pointer">◀</button>
                <div className="flex items-center justify-center"><Move className="w-3 h-3 text-slate-600" /></div>
                <button onClick={() => handlePositionShift('right')} className="bg-slate-950 border border-slate-850 hover:bg-slate-900 p-1.5 rounded text-center text-[10px] cursor-pointer">▶</button>
                <div />
                <button onClick={() => handlePositionShift('down')} className="bg-slate-950 border border-slate-850 hover:bg-slate-900 p-1.5 rounded text-center text-[10px] cursor-pointer">▼</button>
                <div />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-850 flex gap-2">
              <button
                onClick={() => onRemoveResource(activeResource.id)}
                className="flex-1 py-2 bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 text-red-400 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5" /> Remove
              </button>
              <button
                onClick={() => setSelectedResId(null)}
                className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Done
              </button>
            </div>
          </div>
        ) : (
          <div className="h-48 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 text-center p-4">
            <Cpu className="w-8 h-8 text-slate-800 mb-2" />
            <p className="text-[10px] leading-normal">Select resource node on the canvas to configure variables and compute costs</p>
          </div>
        )}
      </div>
    </div>
  );
};
