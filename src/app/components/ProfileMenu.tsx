import { useEffect, useRef, useState } from "react";
import { Bot, Egg, Globe2, Leaf, LogIn, LogOut, Pencil, X } from "lucide-react";
import { updateProfile, type AuthUser } from "../../services/api";

type AvatarId = "leaf" | "egg" | "robot" | "planet" | null;

interface ProfileMenuProps {
  user: AuthUser | null;
  darkMode?: boolean;
  onRequestLogin: () => void;
  onLogout: () => void;
  onProfileChange: (user: AuthUser) => void;
}

const avatarChoices: { id: Exclude<AvatarId, null>; label: string; Icon: typeof Leaf; color: string }[] = [
  { id: "leaf", label: "Folha", Icon: Leaf, color: "bg-emerald-500" },
  { id: "egg", label: "Ovo", Icon: Egg, color: "bg-amber-400" },
  { id: "robot", label: "Robo", Icon: Bot, color: "bg-sky-500" },
  { id: "planet", label: "Planeta", Icon: Globe2, color: "bg-violet-500" },
];

function initials(user: AuthUser): string {
  const source = user.name?.trim() || user.email;
  return source.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function AvatarCircle({ user, className = "" }: { user: AuthUser; className?: string }) {
  const choice = avatarChoices.find((option) => option.id === user.avatar);
  if (choice) {
    const Icon = choice.Icon;
    return <span className={"inline-flex items-center justify-center rounded-full text-white " + choice.color + " " + className}><Icon className="h-1/2 w-1/2" strokeWidth={2.3} /></span>;
  }
  return <span className={"inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#98FFD9] to-[#4cbfa2] font-black text-[#001F3F] " + className}>{initials(user)}</span>;
}

export function ProfileMenu({ user, darkMode = false, onRequestLogin, onLogout, onProfileChange }: ProfileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && !user.name) {
      setName("");
      setAvatar(user.avatar as AvatarId);
      setEditing(true);
    }
  }, [user?.id]);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const openEditor = () => {
    if (!user) return;
    setName(user.name ?? "");
    setAvatar((user.avatar as AvatarId) ?? null);
    setError("");
    setMenuOpen(false);
    setEditing(true);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updatedUser = await updateProfile({ name, avatar });
      onProfileChange(updatedUser);
      setEditing(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Nao foi possivel salvar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  const panel = darkMode ? "bg-[#0d1b2e] border-white/10 text-white" : "bg-white border-black/10 text-[#001F3F]";

  return (
    <div className="relative" ref={rootRef}>
      {user ? (
        <button
          type="button"
          aria-label="Abrir menu do perfil"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full p-0.5 ring-2 ring-[#98FFD9]/50 transition hover:ring-[#98FFD9]"
        >
          <AvatarCircle user={user} className="h-9 w-9 text-xs" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onRequestLogin}
          className={"inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold " + (darkMode ? "border-white/10 bg-white/5 text-white" : "border-black/10 bg-white/60 text-[#001F3F]")}
        >
          <LogIn className="h-4 w-4" /> Entrar
        </button>
      )}

      {user && menuOpen && (
        <div role="menu" className={"absolute right-0 top-full z-[60] mt-2 w-56 rounded-2xl border p-2 shadow-2xl " + panel}>
          <div className={"border-b px-3 py-2 " + (darkMode ? "border-white/10" : "border-black/10")}>
            <p className="truncate text-sm font-bold">{user.name || "Seu perfil"}</p>
            <p className={"truncate text-xs " + (darkMode ? "text-slate-400" : "text-slate-500")}>{user.email}</p>
          </div>
          <button type="button" role="menuitem" onClick={openEditor} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-[#98FFD9]/15">
            <Pencil className="h-4 w-4" /> Editar Perfil
          </button>
          <button type="button" role="menuitem" onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-500/10">
            <LogOut className="h-4 w-4" /> Sair (Logout)
          </button>
        </div>
      )}

      {editing && user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="profile-title" className={"w-full max-w-md rounded-3xl border p-6 shadow-2xl " + panel}>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 id="profile-title" className="text-xl font-black">Seu perfil</h2>
                <p className={"mt-1 text-xs " + (darkMode ? "text-slate-400" : "text-slate-500")}>Escolha como voce aparece no painel.</p>
              </div>
              <button type="button" onClick={() => setEditing(false)} aria-label="Fechar perfil" className="rounded-full p-2 hover:bg-white/10"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={save} className="space-y-5">
              <label className="block text-sm font-bold">
                Nome de exibicao
                <input
                  autoFocus
                  required
                  maxLength={60}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Como quer ser chamado?"
                  className={"mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-[#6EDDC4] " + (darkMode ? "border-white/10 bg-white/5 text-white placeholder:text-slate-500" : "border-black/10 bg-slate-50 text-[#001F3F] placeholder:text-slate-400")}
                />
              </label>

              <fieldset>
                <legend className="mb-2 text-sm font-bold">Avatar (opcional)</legend>
                <div className="grid grid-cols-5 gap-2">
                  <button type="button" onClick={() => setAvatar(null)} aria-label="Usar iniciais" className={"flex flex-col items-center gap-1 rounded-xl border p-2 text-[10px] " + (avatar === null ? "border-[#98FFD9] bg-[#98FFD9]/10" : darkMode ? "border-white/10" : "border-black/10")}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#98FFD9] to-[#4cbfa2] text-xs font-black text-[#001F3F]">{initials(user)}</span>
                    Iniciais
                  </button>
                  {avatarChoices.map(({ id, label, Icon, color }) => (
                    <button key={id} type="button" onClick={() => setAvatar(id)} aria-label="Avatar" className={"flex flex-col items-center gap-1 rounded-xl border p-2 text-[10px] " + (avatar === id ? "border-[#98FFD9] bg-[#98FFD9]/10" : darkMode ? "border-white/10" : "border-black/10")}>
                      <span className={"flex h-9 w-9 items-center justify-center rounded-full text-white " + color}><Icon className="h-5 w-5" /></span>
                      {label}
                    </button>
                  ))}
                </div>
                <p className={"mt-2 text-xs " + (darkMode ? "text-slate-400" : "text-slate-500")}>Folha, ovo, robo ou planeta.</p>
              </fieldset>

              {error && <p role="alert" className="text-sm text-rose-500">{error}</p>}
              <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#98FFD9] py-3 font-extrabold text-[#001F3F] disabled:opacity-60">
                {saving ? "Salvando..." : "Salvar perfil"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}