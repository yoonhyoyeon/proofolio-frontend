import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Mic,
  FileText,
  FolderKanban,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { currentUser } from '@/lib/mock'
import { Avatar } from '@/components/ui/avatar'

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const nav: NavItem[] = [
  { to: '/', label: '대시보드', icon: LayoutDashboard, end: true },
  { to: '/interview/new', label: '면접 연습', icon: Mic },
  { to: '/reports', label: '면접 리포트', icon: FileText },
  { to: '/portfolio', label: '내 포트폴리오', icon: FolderKanban },
  { to: '/settings', label: '설정', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-[var(--color-border)] bg-white">
      <div className="flex items-center gap-2 px-5 pt-6 pb-5">
        <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[var(--shadow-soft)]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold tracking-tight text-[var(--color-fg)]">
            Proofolio
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            AI Interview
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
          메인
        </p>
        <ul className="flex flex-col gap-0.5">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]'
                      : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[var(--color-brand)]"
                      />
                    )}
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-[var(--color-brand)]' : '',
                      )}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-3 mb-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <div className="flex items-center gap-3">
          <Avatar
            initials={currentUser.initials}
            size="md"
            accent="from-indigo-500 to-blue-500"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--color-fg)]">
              {currentUser.name}
            </p>
            <p className="truncate text-[11px] text-[var(--color-fg-muted)]">
              {currentUser.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
