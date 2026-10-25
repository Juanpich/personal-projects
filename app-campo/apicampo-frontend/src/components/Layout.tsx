import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canManageUsers } from "../config/permissions";
import { Button } from "./ui";

const tabs: { to: string; label: string; end?: boolean; manageUsersOnly?: boolean }[] = [
  { to: "/", label: "Escanear", end: true },
  { to: "/animales", label: "Animales" },
  { to: "/categorias", label: "Categorías" },
  { to: "/lotes", label: "Lotes" },
  { to: "/usuarios", label: "Usuarios", manageUsersOnly: true },
];

export function Layout({ children }: { children: ReactNode }) {
  const { logout, roles } = useAuth();
  const visibleTabs = tabs.filter((t) => !t.manageUsersOnly || canManageUsers(roles));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <span className="font-bold text-lg">Traza Campo</span>
        <Button variant="ghost" onClick={logout} className="!py-1.5 !px-3 text-sm">
          Salir
        </Button>
      </header>

      <nav className="flex overflow-x-auto border-b border-[var(--color-border)] px-2">
        {visibleTabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-[var(--color-accent)] text-[var(--color-text)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">{children}</main>
    </div>
  );
}
