import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, FileText, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import LogoutDialog from "@/components/LogoutDialog";
import { Logo } from "@/components/Logo";

const navItems = [
  { to: "/jobseeker", icon: Search, label: "Job Board", end: true },
  { to: "/jobseeker/applications", icon: FileText, label: "My Applications" },
];

const JobseekerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background animated-gradient-bg">
      <nav className="border-b border-border/60 glass sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-8">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className="px-3.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all duration-100"
                  activeClassName="bg-primary/8 text-primary font-medium"
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
                {user?.name?.[0] || "U"}
              </div>
              <span className="text-sm text-foreground font-medium">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLogoutOpen(true)} className="text-muted-foreground hover:text-foreground hidden md:inline-flex">
              <LogOut className="h-4 w-4" />
            </Button>
            <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border/60 px-6 py-3 space-y-1 bg-card">
            {navItems.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                className="block px-3 py-2.5 rounded-lg text-sm text-muted-foreground"
                activeClassName="bg-primary/8 text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <button onClick={() => setLogoutOpen(true)} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-muted-foreground">Log out</button>
          </div>
        )}
      </nav>
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
      <LogoutDialog open={logoutOpen} onConfirm={handleLogout} onCancel={() => setLogoutOpen(false)} />
    </div>
  );
};

export default JobseekerLayout;
