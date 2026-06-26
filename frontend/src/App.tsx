import React, { useState } from 'react';
import { Project, CloudResource, ResourceType } from './types';
import { MOCK_PROJECTS, recalculateProjectScores, generateMockRecommendations, generateMockSecurityFindings } from './mockData';
import { LandingPage } from './LandingPage';
import { Auth } from './Auth';
import { DashboardView } from './DashboardView';
import { InfrastructureBuilder } from './InfrastructureBuilder';
import { RecommendationsView } from './RecommendationsView';
import { SecurityView } from './SecurityView';
import { ReportGenerator } from './ReportGenerator';
import { AdminDashboard } from './AdminDashboard';
import { Cloud, Layout, Layers, ShieldCheck, Sparkles, FileText, Users, LogOut, Sun, Moon, Plus, Folder } from 'lucide-react';

const App: React.FC = () => {
  // Navigation & User State
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'app'>('landing');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // App internal views
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder' | 'recommendations' | 'security' | 'reports' | 'admin'>('dashboard');

  // Workspace / Project states
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjId, setSelectedProjId] = useState<string>('proj-1');
  const [isNewProjModalOpen, setIsNewProjModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  // AI analysis loader simulation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Retrieve current project reference
  const currentProject = projects.find(p => p.id === selectedProjId) || projects[0];

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    const html = document.documentElement;
    if (next === 'light') {
      html.classList.remove('dark');
      html.classList.add('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
  };

  // Auth helper callbacks
  const handleAuthSuccess = (userData: { email: string; name: string }) => {
    setUser(userData);
    setCurrentPage('app');
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  // Project manager triggers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjName,
      description: newProjDesc,
      createdAt: new Date().toISOString(),
      resources: [],
      healthScore: { overall: 100, security: 100, cost: 100, reliability: 100, scalability: 100 },
      recommendations: [],
      securityFindings: [],
      logs: ['Project created. Sandbox environment initialized.']
    };

    setProjects([...projects, newProj]);
    setSelectedProjId(newProj.id);
    setNewProjName('');
    setNewProjDesc('');
    setIsNewProjModalOpen(false);
    setActiveTab('builder'); // jump to layout editor automatically
  };

  // Node operations in builder
  const handleAddResource = (type: ResourceType) => {
    if (!currentProject) return;

    const randomX = 100 + Math.random() * 300;
    const randomY = 100 + Math.random() * 200;

    const baseConfigs: Record<ResourceType, Record<string, string | number | boolean>> = {
      VPC: { cidr: '10.0.0.0/16', subnets: 2 },
      CloudFront: { edgeLocations: 'global', sslEnabled: true },
      ALB: { scheme: 'internet-facing', targetGroups: 1 },
      EC2: { instanceType: 't3.micro', count: 1, scaleTarget: 70 },
      RDS: { instanceClass: 'db.t3.micro', multiAz: false, storageGb: 20 },
      Lambda: { memoryMb: 128, timeoutSec: 3, executionsPerMonth: 100000 },
      DynamoDB: { billingMode: 'PAY_PER_REQUEST' },
      S3: { storageClass: 'Standard', sizeGb: 10, versioning: false }
    };

    const baseCosts: Record<ResourceType, number> = {
      VPC: 0,
      CloudFront: 2.50,
      ALB: 22.26,
      EC2: 8.50,
      RDS: 15.00,
      Lambda: 0.20,
      DynamoDB: 5.00,
      S3: 0.23
    };

    const newRes: CloudResource = {
      id: `res-${Date.now()}`,
      name: `${type.toLowerCase()}-${currentProject.resources.length + 1}`,
      type,
      region: 'us-east-1',
      cost: baseCosts[type],
      config: baseConfigs[type],
      position: { x: randomX, y: randomY }
    };

    const updatedResources = [...currentProject.resources, newRes];
    updateProjectData(updatedResources);
  };

  const handleUpdateResource = (updatedRes: CloudResource) => {
    if (!currentProject) return;
    const updatedResources = currentProject.resources.map(r => r.id === updatedRes.id ? updatedRes : r);
    updateProjectData(updatedResources);
  };

  const handleRemoveResource = (resId: string) => {
    if (!currentProject) return;
    const updatedResources = currentProject.resources.filter(r => r.id !== resId);
    updateProjectData(updatedResources);
  };

  // Recalculates metrics automatically on state updates
  const updateProjectData = (updatedResources: CloudResource[]) => {
    const score = recalculateProjectScores(updatedResources);
    const recs = generateMockRecommendations(updatedResources);
    const findings = generateMockSecurityFindings(updatedResources);

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProjId) {
        return {
          ...p,
          resources: updatedResources,
          healthScore: score,
          recommendations: recs,
          securityFindings: findings,
          logs: [...p.logs, `Infrastructure configuration updated. Resources count: ${updatedResources.length}`]
        };
      }
      return p;
    });

    setProjects(updatedProjects);
  };

  // Trigger analysis audit via AWS API Gateway API (with dynamic local fallback)
  const handleRefreshAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Get environment variables or default mock route
    const apiEndpoint = ((import.meta as any).env?.VITE_AWS_API_GATEWAY_URL || '').replace(/\/$/, '') + '/analyze';

    if (apiEndpoint && apiEndpoint !== '/analyze') {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(user ? { 'Authorization': `Bearer simulated-token` } : {})
          },
          body: JSON.stringify({ resources: currentProject.resources })
        });

        if (response.ok) {
          const data = await response.json();
          // Update project states using real AWS API Gateway outputs
          const updatedProjects = projects.map(p => {
            if (p.id === selectedProjId) {
              return {
                ...p,
                healthScore: {
                  ...p.healthScore,
                  overall: data.score
                },
                recommendations: data.recommendations.length > 0 ? data.recommendations : p.recommendations,
                securityFindings: data.securityFindings.length > 0 ? data.securityFindings : p.securityFindings,
                logs: [...p.logs, `AWS Audit completed successfully via API Gateway on ${data.timestamp}`]
              };
            }
            return p;
          });
          setProjects(updatedProjects);
          setIsAnalyzing(false);
          return;
        }
      } catch (err) {
        console.warn('API Gateway connection failed. Defaulting to local simulator engine:', err);
      }
    }

    // Local simulation fallback
    setTimeout(() => {
      setIsAnalyzing(false);
      updateProjectData(currentProject.resources);
    }, 1500);
  };

  // Branch layouts based on route page state
  if (currentPage === 'landing') {
    return <LandingPage onStart={() => setCurrentPage('auth')} />;
  }

  if (currentPage === 'auth') {
    return <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentPage('landing')} />;
  }

  return (
    <div className={`min-h-screen font-sans flex text-slate-100 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. Sidebar Navigation panel */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-8">
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 p-2 rounded-xl shadow-lg">
              <Cloud className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              CloudWise AI
            </span>
          </div>

          {/* Project switcher selector */}
          <div className="space-y-2">
            <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider">Active Workspace</label>
            <div className="relative">
              <select
                value={selectedProjId}
                onChange={(e) => setSelectedProjId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setIsNewProjModalOpen(true)}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Create Project
            </button>
          </div>

          {/* Tab selector navs */}
          <nav className="space-y-1.5">
            <label className="block text-[9px] font-bold text-slate-550 uppercase tracking-wider mb-2">Navigation</label>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Layout className="w-4 h-4" /> },
              { id: 'builder', label: 'Infra Builder', icon: <Layers className="w-4 h-4" /> },
              { id: 'recommendations', label: 'AI Optimization', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'security', label: 'Security Guard', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
              { id: 'admin', label: 'System Admin', icon: <Users className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-purple-950/20 text-purple-400 border-l-2 border-purple-500'
                    : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer auth indicators */}
        <div className="p-4 border-t border-slate-900 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-xs font-bold text-purple-400 border border-purple-800">
              {user?.name?.slice(0, 2).toUpperCase() || 'CW'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Engineer Profile'}</div>
              <div className="text-[9px] text-slate-500 truncate">{user?.email || 'console@cloudwise.ai'}</div>
            </div>
            <button onClick={toggleTheme} className="p-1.5 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-slate-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left py-2 px-3 hover:bg-red-950/20 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main content viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        
        {/* Mobile top navigation */}
        <header className="md:hidden border-b border-slate-900 p-4 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-purple-500" />
            <span className="font-extrabold text-sm text-white">CloudWise AI</span>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-slate-900 border border-slate-850 text-xs text-slate-200 rounded p-1.5 focus:outline-none"
            >
              <option value="dashboard">Dashboard</option>
              <option value="builder">Infra Builder</option>
              <option value="recommendations">AI Optimization</option>
              <option value="security">Security Guard</option>
              <option value="reports">Reports</option>
              <option value="admin">System Admin</option>
            </select>
            <button onClick={handleSignOut} className="p-1.5 bg-slate-900 rounded border border-slate-800 text-red-400">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Viewport container */}
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              project={currentProject}
              onRefreshAnalysis={handleRefreshAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeTab === 'builder' && (
            <InfrastructureBuilder
              resources={currentProject.resources}
              onAddResource={handleAddResource}
              onUpdateResource={handleUpdateResource}
              onRemoveResource={handleRemoveResource}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsView recommendations={currentProject.recommendations} />
          )}

          {activeTab === 'security' && (
            <SecurityView findings={currentProject.securityFindings} />
          )}

          {activeTab === 'reports' && (
            <ReportGenerator project={currentProject} />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard projects={projects} />
          )}
        </div>
      </main>

      {/* New Project creation popup Modal */}
      {isNewProjModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Folder className="w-5.5 h-5.5 text-purple-400" /> Instantiate New Stack Space
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Partition workspace variables and logs for independent modeling</p>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serverless Dev API"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-2.5 text-slate-200 placeholder:text-slate-650 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  placeholder="Add infrastructure design notes..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-2.5 text-slate-200 placeholder:text-slate-650 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsNewProjModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl font-bold text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-600/10 cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
