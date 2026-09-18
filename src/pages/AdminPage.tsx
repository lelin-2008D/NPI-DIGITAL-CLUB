import React, { useState, useEffect } from 'react';
import { useSiteData } from '../hooks/useSiteData';
import { SupabaseService } from '../../src/services/supabaseService';
import { CustomCursor } from '../components/common/CustomCursor';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminSidebar, type AdminTab } from '../components/admin/AdminSidebar';
import { DashboardPanel } from '../components/admin/DashboardPanel';
import { SectionForms } from '../components/admin/SectionForms';
import { CRUDTable } from '../components/admin/CRUDTable';
import { LivePreview } from '../components/admin/LivePreview';

export const AdminPage: React.FC = () => {
  const { data, saveData, refreshData } = useSiteData();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [showPreview, setShowPreview] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (SupabaseService.isConfigured()) {
        try {
          const { role } = await SupabaseService.getSession();
          if (role === 'admin') {
            setIsAuthenticated(true);
            return;
          }
        } catch (e) {
          console.error('Supabase session check failed:', e);
        }
      }

      // Check local storage flag fallback
      const perm = localStorage.getItem('admin_logged_perm') === 'true';
      const session = sessionStorage.getItem('admin_logged') === 'true';
      setIsAuthenticated(perm || session);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    if (SupabaseService.isConfigured()) {
      try {
        await SupabaseService.signOut();
      } catch (e) {
        console.error('Sign out error:', e);
      }
    }
    sessionStorage.removeItem('admin_logged');
    localStorage.removeItem('admin_logged_perm');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-body min-h-screen bg-bg-primary text-text-primary">
        <CustomCursor />
        <AdminLogin onSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
        <div className="space-mono text-sm">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-body min-h-screen bg-bg-primary text-text-primary">
      <CustomCursor />

      <div className="admin-app-layout flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main Workspace */}
        <div className="admin-workspace-grid flex-1 flex overflow-hidden">
          {/* Editor Column */}
          <div className="editor-column flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="space-mono text-xs opacity-60">
                ACTIVE MODULE: {activeTab.toUpperCase()}
              </span>
              <button
                type="button"
                className="btn btn-secondary px-3 py-1 text-xs space-mono"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {activeTab === 'dashboard' && (
              <DashboardPanel data={data} onRefresh={refreshData} />
            )}

            {(activeTab === 'hero' ||
              activeTab === 'story' ||
              activeTab === 'services' ||
              activeTab === 'contact') && (
              <SectionForms
                activeTab={activeTab}
                data={data}
                onSave={saveData}
              />
            )}

            {activeTab === 'projects' && (
              <CRUDTable
                type="projects"
                title="Project Portfolio"
                subtitle="Manage showcase student hardware and software initiatives."
                items={data.projects || []}
                onUpdateItems={async (items) => {
                  await saveData({ ...data, projects: items });
                }}
              />
            )}

            {activeTab === 'events' && (
              <CRUDTable
                type="events"
                title="Roadmap & Timeline Events"
                subtitle="Manage milestones, workshops, and hackathon schedules."
                items={data.timeline || []}
                onUpdateItems={async (items) => {
                  await saveData({ ...data, timeline: items });
                }}
              />
            )}

            {activeTab === 'gallery' && (
              <CRUDTable
                type="gallery"
                title="Photo Archive Gallery"
                subtitle="Curate technical event snapshots and category filters."
                items={data.gallery || []}
                onUpdateItems={async (items) => {
                  await saveData({ ...data, gallery: items });
                }}
              />
            )}

            {activeTab === 'team' && (
              <CRUDTable
                type="team"
                title="Executive Committee"
                subtitle="Update student leads, coordinators, and social links."
                items={data.team || []}
                onUpdateItems={async (items) => {
                  await saveData({ ...data, team: items });
                }}
              />
            )}

            {activeTab === 'testimonials' && (
              <CRUDTable
                type="testimonials"
                title="Member Testimonials"
                subtitle="Manage student and faculty community reviews."
                items={data.testimonials || []}
                onUpdateItems={async (items) => {
                  await saveData({ ...data, testimonials: items });
                }}
              />
            )}
          </div>

          {/* Live Preview Column */}
          {showPreview && <LivePreview />}
        </div>
      </div>
    </div>
  );
};
