"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "@/src/lib/hooks/useAuth";
import { Button } from "@/src/components/ui/Button";

import "./DashboardLayout.css";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    name: "Technicians",
    href: "/technicians",
    icon: Users,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="sidebar-inner">
      <div className="sidebar-header">
        <Link
          href="/dashboard"
          className="brand"
          onClick={() => mobile && setSidebarOpen(false)}
        >
          <div className="brand-icon">F</div>

          <div className="brand-text">
            <span className="brand-name">FieldOps</span>
            <span className="brand-label">Admin Portal</span>
          </div>
        </Link>

        {mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-button"
          >
            <X size={20} />
          </Button>
        )}
      </div>

      <div className="sidebar-content">
        <div className="navigation-section">
          <p className="navigation-label">MAIN MENU</p>

          <nav className="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={`navigation-link ${
                    active ? "navigation-link-active" : ""
                  }`}
                >
                  <Icon className="navigation-icon" size={19} />

                  <span>{item.name}</span>

                  {active && <span className="active-indicator" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="user-info">
            <p className="user-name">{user?.name || "Administrator"}</p>

            <p className="user-email">{user?.email || "admin@fieldops.com"}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="logout-button"
          >
            <LogOut size={17} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`mobile-sidebar ${sidebarOpen ? "mobile-sidebar-open" : ""}`}
      >
        <SidebarContent mobile />
      </aside>

      <div className="dashboard-content">
        <header className="mobile-header">
          <Link href="/dashboard" className="mobile-brand">
            <div className="brand-icon">F</div>

            <div className="mobile-brand-text">
              <span>FieldOps</span>
              <small>Admin Portal</small>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="mobile-menu-button"
          >
            <Menu size={22} />
          </Button>
        </header>

        <main className="dashboard-main">
          <div className="dashboard-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
