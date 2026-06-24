const BASE_URL = 'http://43.202.227.251:3000'

export async function getGithubLoginUrl(): Promise<{ url: string; state: string }> {
  const res = await fetch(`${BASE_URL}/github/login`)
  if (!res.ok) throw new Error('GitHub 로그인 URL 요청 실패')
  return res.json()
}

export async function exchangeGithubCode(
  code: string,
  state: string,
): Promise<{ access_token: string }> {
  const params = new URLSearchParams({ code, state })
  const res = await fetch(`${BASE_URL}/github/callback?${params}`)
  if (!res.ok) throw new Error('GitHub 코드 교환 실패')
  return res.json()
}

export type GithubRepo = {
  id: string
  name: string
  description: string
  language: string
  stars: number
  forks: number
  updatedAt: string
  topics: string[]
  visibility: 'public' | 'private'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRepo(r: any): GithubRepo {
  return {
    id: String(r.id),
    name: r.name ?? '',
    description: r.description ?? '',
    language: r.language ?? 'Unknown',
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    updatedAt: (r.updated_at ?? r.updatedAt ?? '').slice(0, 10),
    topics: r.topics ?? [],
    visibility: r.private ? 'private' : 'public',
  }
}

export async function getGithubRepos(token: string): Promise<GithubRepo[]> {
  const res = await fetch(`${BASE_URL}/github/repos`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('레포 목록 조회 실패')
  const data = await res.json()
  return Array.isArray(data) ? data.map(mapRepo) : []
}

export const GITHUB_TOKEN_KEY = 'github_access_token'
