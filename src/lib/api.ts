const BASE_URL = 'http://43.202.227.251:3000'

export async function getGithubLoginUrl(): Promise<{ url: string; state: string }> {
  const res = await fetch(`${BASE_URL}/github/login`)
  if (!res.ok) throw new Error('GitHub 로그인 URL 요청 실패')
  return res.json()
}

export type GithubCallbackResult = {
  sessionToken: string
  userId: string
  username: string
}

export async function exchangeGithubCode(
  code: string,
  state: string,
): Promise<GithubCallbackResult> {
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

export async function getGithubRepos(sessionToken: string): Promise<GithubRepo[]> {
  const res = await fetch(`${BASE_URL}/github/repos`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  if (!res.ok) throw new Error('레포 목록 조회 실패')
  const data = await res.json()
  return Array.isArray(data) ? data.map(mapRepo) : []
}

export type PortfolioSummary = {
  id: string
  title: string
  status: string
  updatedAt?: string
  slug?: string
  description?: string
  projectsCount?: number
  views?: number
  theme?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPortfolioSummary(d: any): PortfolioSummary {
  return {
    id: d.id,
    title: d.title ?? d.structured?.title ?? '(제목 없음)',
    status: d.status ?? '',
    updatedAt: (d.updatedAt ?? '').slice(0, 10),
  }
}

export async function getPortfolioList(sessionToken: string): Promise<PortfolioSummary[]> {
  const res = await fetch(`${BASE_URL}/portfolio`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  if (!res.ok) throw new Error('포트폴리오 목록 조회 실패')
  const data = await res.json()
  return Array.isArray(data) ? data.map(mapPortfolioSummary) : []
}

export type Portfolio = {
  id: string
  status: string
  title: string
  phone: string | null
  email: string | null
  github: string | null
  homepage: string | null
  bio: string | null
  experiences: { company: string; role: string; period: string }[]
  projects: { name: string; period?: string; summary?: string; stack: string[]; detail?: string }[]
  educations: { school: string; period: string }[]
  activities: { title: string; description: string }[]
  skills: Record<string, string[]>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPortfolio(d: any): Portfolio {
  const s = d.structured ?? {}
  return {
    id: d.id,
    status: d.status ?? '',
    title: s.title ?? d.title ?? '',
    phone: s.phone ?? null,
    email: s.email ?? null,
    github: s.github ?? null,
    homepage: s.homepage ?? null,
    bio: s.bio ?? null,
    experiences: s.experiences ?? [],
    projects: s.projects ?? [],
    educations: s.educations ?? [],
    activities: s.activities ?? [],
    skills: s.skills ?? {},
  }
}

export async function getPortfolio(id: string, sessionToken: string): Promise<Portfolio> {
  const res = await fetch(`${BASE_URL}/portfolio/${id}`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  if (!res.ok) throw new Error('포트폴리오 조회 실패')
  return mapPortfolio(await res.json())
}

export type GeneratePortfolioInput = {
  githubAccessToken: string
  selectedRepoNames: string[]
  homepage: string
  experiences: { company: string; role: string; period: string }[]
  educations: { school: string; period: string }[]
  activities: { title: string; description: string }[]
}

export async function generatePortfolio(input: GeneratePortfolioInput): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/portfolio/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.githubAccessToken}`,
    },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('포트폴리오 생성 실패')
  return res.json()
}

export type InterviewSession = {
  id: string
  portfolioId: string
  sessionNo: number
  status: 'ENDED' | 'ACTIVE'
  finalScore: number | null
  createdAt: string
  endedAt: string | null
  _count: { questions: number; answers: number }
}

export async function getInterviewList(sessionToken: string): Promise<InterviewSession[]> {
  const res = await fetch(`${BASE_URL}/interviews`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  if (!res.ok) throw new Error('면접 리포트 목록 조회 실패')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export type InterviewReport = {
  session: {
    id: string
    sessionNo: number
    status: string
    createdAt: string
    endedAt: string | null
  }
  scores: {
    overall: number | null
    byCategory: {
      category: string
      average: number | null
      questionCount: number
    }[]
  }
  interviewerFeedbacks: {
    interviewerKey: string
    displayName: string
    messages: string[]
  }[]
  questions: {
    id: string
    category: string
    kind: 'MAIN' | 'FOLLOW_UP'
    question: string
    parentQuestionId: string | null
    answer: {
      transcript: string
      score: number | null
      feedback: string
    } | null
  }[]
  attitude: {
    eyeContact: number
    headDownCount: number
    handMovementCount: number
    postureStability: number
  } | null
  speechMetrics: {
    avgResponseDelaySec: number
    avgSpeakingRateCps: number
    turnCount: number
  } | null
}

export async function getInterviewReport(id: string, sessionToken: string): Promise<InterviewReport> {
  const res = await fetch(`${BASE_URL}/interviews/${id}/report`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  if (!res.ok) throw new Error('면접 리포트 조회 실패')
  return res.json()
}

export async function submitAttitude(
  id: string,
  data: { eyeContact: number; headDownCount: number; handMovementCount: number; postureStability: number },
  sessionToken: string,
): Promise<void> {
  await fetch(`${BASE_URL}/interviews/${id}/attitude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(data),
  })
}

export async function submitSpeechMetrics(
  id: string,
  data: { avgResponseDelaySec: number; avgSpeakingRateCps: number; turnCount: number },
  sessionToken: string,
): Promise<void> {
  await fetch(`${BASE_URL}/interviews/${id}/speech-metrics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(data),
  })
}

export const SESSION_TOKEN_KEY = 'session_token'
export const GITHUB_USERNAME_KEY = 'github_username'
export const GITHUB_TOKEN_KEY = SESSION_TOKEN_KEY
