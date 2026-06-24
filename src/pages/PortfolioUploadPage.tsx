import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Save, UploadCloud, X } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function PortfolioUploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const handleFile = (incoming: File) => {
    if (fileUrl) URL.revokeObjectURL(fileUrl)
    const url = URL.createObjectURL(incoming)
    setFile(incoming)
    setFileUrl(url)
  }

  const clear = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl)
    setFile(null)
    setFileUrl(null)
  }

  return (
    <>
      <PageHeader
        title="포트폴리오·이력서 업로드"
        description="PDF 파일을 올리면 그대로 포트폴리오로 저장됩니다."
      />

      <Card className="w-full">
        {!fileUrl ? (
          <label className="flex min-h-[480px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] p-8 transition-colors hover:bg-[var(--color-surface)]">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand)]">
              <UploadCloud className="h-7 w-7" />
            </span>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-[var(--color-fg)]">
                PDF 파일을 올려주세요
              </p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                클릭하거나 드래그해서 업로드 · 최대 25MB
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
                e.target.value = ''
              }}
            />
          </label>
        ) : (
          <div className="flex flex-col">
            {/* File bar */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--color-brand-subtle)] text-[var(--color-brand)]">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-fg)]">{file?.name}</p>
                  <p className="text-[11px] text-[var(--color-fg-muted)]">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clear}
                className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-fg-subtle)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)]"
                aria-label="파일 제거"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* PDF viewer */}
            <iframe
              src={fileUrl}
              title="PDF 미리보기"
              className="h-[640px] w-full rounded-b-[var(--radius-lg)]"
            />
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-8 py-5">
          <Button variant="ghost" size="md" onClick={() => navigate('/portfolio')}>
            취소
          </Button>
          <Button
            size="md"
            disabled={!file}
            onClick={() => navigate('/portfolio')}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            저장하기
          </Button>
        </div>
      </Card>

      <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">
        <Link to="/portfolio" className="underline-offset-4 hover:underline">
          포트폴리오 목록으로 돌아가기
        </Link>
      </p>
    </>
  )
}
