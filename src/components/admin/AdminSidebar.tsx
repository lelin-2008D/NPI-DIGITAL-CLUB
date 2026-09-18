import React from 'react';
import { Link } from 'react-router-dom';

export type AdminTab =
  | 'dashboard'
  | 'hero'
  | 'story'
  | 'services'
  | 'projects'
  | 'events'
  | 'gallery'
  | 'team'
  | 'testimonials'
  | 'contact';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
}

const TABS: Array<{ id: AdminTab; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard & Data', icon: '⚃' },
  { id: 'hero', label: 'Hero Section', icon: '⚡' },
  { id: 'story', label: 'Our Story', icon: '📖' },
  { id: 'services', label: 'Services / Craft', icon: '🛠' },
  { id: 'projects', label: 'Project Portfolio', icon: '📁' },
  { id: 'events', label: 'Roadmap Timeline', icon: '📅' },
  { id: 'gallery', label: 'Photo Gallery', icon: '📸' },
  { id: 'team', label: 'Executive Committee', icon: '👥' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
  { id: 'contact', label: 'Contact & Philosophy', icon: '✉' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  return (
    <aside className="admin-sidebar glass-panel">
      <div className="sidebar-header">
        <span className="logo-symbol">N</span>
        <div className="header-texts">
          <span className="brand space-grotesk">NPI DIGITAL</span>
          <span className="env space-mono">CONSOLE v2.0</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Console Modules">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="view-site-btn space-mono">
          <span>↗ Public Site</span>
        </Link>
        <button type="button" className="logout-btn space-mono" onClick={onLogout}>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
