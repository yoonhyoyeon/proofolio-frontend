import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="flex h-screen bg-[var(--color-surface)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1280px] px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
