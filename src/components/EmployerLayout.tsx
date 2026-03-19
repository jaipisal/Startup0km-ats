import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase, Users, LogOut, LayoutDashboard, Menu, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import LogoutDialog from "@/components/LogoutDialog";
import { Logo } from "@/components/Logo";

const navItems = [
  { to: "/employer", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/employer/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/employer/candidates", icon: Users, label: "Candidates" },
];

const EmployerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background animated-gradient-bg flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-strong m-4 rounded-3xl border border-white/40 shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+32px)]"}`}>
        <div className="flex items-center justify-between h-20 px-6">
          <Logo size="md" />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-black/5 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 mt-2">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] text-muted-foreground hover:bg-white/40 hover:text-foreground transition-all duration-200 group"
              activeClassName="bg-white/80 text-primary font-bold shadow-[0_4px_12px_rgba(0,0,0,0.03)] scale-[1.02]"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-secondary group-hover:scale-110 transition-transform duration-200">
                <Icon className="h-4 w-4" />
              </div>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="glass-dark p-4 rounded-2xl border border-white/20 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
                {user?.name?.[0] || "U"}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-foreground truncate">{user?.name || "Employer"}</div>
                <div className="text-[11px] text-muted-foreground truncate">{user?.company || "Company"}</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2 h-9 text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all" 
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/60 bg-card/80 glass flex items-center px-6 gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <Logo size="sm" />
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      <LogoutDialog open={logoutOpen} onConfirm={handleLogout} onCancel={() => setLogoutOpen(false)} />
    </div>
  );
};

export default EmployerLayout;
