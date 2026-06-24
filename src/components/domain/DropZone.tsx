import { useState } from 'react'
import { FileText, Plus, UploadCloud, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface DropZoneProps {
  label: string
  hint: string
  accept: string
  initialFileName?: string
  multiple?: boolean
  initialFileNames?: string[]
}

export function DropZone({
  label,
  hint,
  accept,
  initialFileName,
  multiple = false,
  initialFileNames,
}: DropZoneProps) {
  const [files, setFiles] = useState<string[]>(() => {
    if (initialFileNames?.length) return initialFileNames
    if (initialFileName) return [initialFileName]
    return []
  })

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return
    const names = Array.from(incoming).map((f) => f.name)
    setFiles((prev) => (multiple ? [...prev, ...names] : [names[0]]))
  }

  const removeAt = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx))

  if (files.length > 0) {
    return (
      <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--color-fg-muted)]">
            {label}
          </p>
          {multiple && (
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--color-fg-muted)] hover:border-[var(--color-brand)]/40 hover:text-[var(--color-fg)]">
              <Plus className="h-3 w-3" />
              파일 추가
              <input
                type="file"
                accept={accept}
                multiple
                className="sr-only"
                onChange={(e) => {
                  addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          )}
        </div>
        <ul className="flex flex-col gap-2">
          {files.map((name, idx) => (
            <li
              key={`${name}-${idx}`}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-white text-[var(--color-brand)]">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[var(--color-fg)]">
                    {name}
                  </p>
                  <p className="text-[10px] text-[var(--color-fg-muted)]">
                    업로드됨
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="grid h-7 w-7 place-items-center rounded-full text-[var(--color-fg-subtle)] hover:bg-white hover:text-[var(--color-danger)]"
                aria-label="파일 제거"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <label
      className={cn(
        'group flex h-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-white p-6 text-center transition-colors',
        'hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)]',
      )}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand)] transition-colors group-hover:bg-white">
        <UploadCloud className="h-5 w-5" />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-[var(--color-fg)]">{label}</p>
        <p className="text-xs text-[var(--color-fg-muted)]">{hint}</p>
      </div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </label>
  )
}
