export type ScoreLevel = 'high' | 'mid' | 'low'

export function scoreLevel(score: number): ScoreLevel {
  if (score >= 80) return 'high'
  if (score >= 60) return 'mid'
  return 'low'
}

export const currentUser = {
  name: '윤효연',
  email: 'loveyhy2002@gmail.com',
  initials: '윤효',
  role: '프론트엔드 개발자',
  phone: '010-1234-5678',
}

export const githubProfile = {
  username: 'yoonhyoyeon',
  bio: '사용자 경험과 코드 품질을 모두 챙기는 프론트엔드 개발자. React/TS/Tailwind, 디자인 시스템에 관심이 많습니다.',
}

export const githubExtractedSkills: Record<string, string[]> = {
  Frontend: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Vite'],
  Backend: ['Node.js', 'Python'],
  Tooling: ['Figma', 'Storybook'],
}

export const githubOssContributions = [
  { id: 'oss1', repo: 'facebook/react', title: 'docs: fix useEffect example' },
  { id: 'oss2', repo: 'vercel/next.js', title: 'fix(image): correct srcset for fill prop' },
]

export const dashboardStats = [
  {
    key: 'total',
    label: '총 면접 횟수',
    value: '12',
    suffix: '회',
    delta: '+3 vs 지난달',
    trend: 'up' as const,
    icon: 'Mic',
  },
  {
    key: 'average',
    label: '평균 면접 점수',
    value: '82.4',
    suffix: '점',
    delta: '+3.2 vs 지난주',
    trend: 'up' as const,
    icon: 'Sparkles',
  },
  {
    key: 'weakness',
    label: '감지된 약점',
    value: '8',
    suffix: '개',
    delta: '−2 vs 지난주',
    trend: 'down' as const,
    icon: 'AlertTriangle',
  },
  {
    key: 'improvement',
    label: '개선율',
    value: '+12',
    suffix: '%',
    delta: '꾸준히 상승 중',
    trend: 'up' as const,
    icon: 'TrendingUp',
  },
]

export const recentInterviews = [
  {
    id: 'iv-104',
    title: '프론트엔드 개발자 모의면접',
    position: '프론트엔드',
    date: '2026.06.20',
    score: 84,
    mode: 'practice' as const,
  },
  {
    id: 'iv-103',
    title: '백엔드 개발자 모의면접',
    position: '백엔드',
    date: '2026.06.15',
    score: 78,
    mode: 'practice' as const,
  },
  {
    id: 'iv-102',
    title: '프론트엔드 실전면접',
    position: '프론트엔드',
    date: '2026.06.10',
    score: 88,
    mode: 'real' as const,
  },
  {
    id: 'iv-101',
    title: '풀스택 모의면접',
    position: '풀스택',
    date: '2026.06.04',
    score: 72,
    mode: 'practice' as const,
  },
]

export const topWeaknesses = [
  {
    rank: 1,
    title: '기술 선택 근거 설명 부족',
    count: 5,
    summary: '왜 이 기술을 선택했는지 비교 근거를 함께 제시하지 못함',
  },
  {
    rank: 2,
    title: '트러블슈팅 디테일 부족',
    count: 4,
    summary: '원인 분석/시도/결과 흐름이 끊겨 설득력이 약함',
  },
  {
    rank: 3,
    title: '확장성 논의 부족',
    count: 3,
    summary: '트래픽 증가 시나리오와 대응 전략 언급 빈도가 낮음',
  },
]

export const scoreHistory = [
  { label: '03.12', score: 64 },
  { label: '03.27', score: 69 },
  { label: '04.09', score: 72 },
  { label: '04.21', score: 70 },
  { label: '05.06', score: 76 },
  { label: '05.22', score: 78 },
  { label: '06.10', score: 88 },
  { label: '06.20', score: 84 },
]

export const interviewers = [
  {
    id: 'sr-eng',
    name: '김도현',
    role: 'Senior Engineer',
    roleKo: '시니어 엔지니어',
    focus: ['기술 깊이', '아키텍처', '트러블슈팅'],
    accent: 'from-indigo-500 to-blue-500',
    initials: 'KD',
  },
  {
    id: 'hr',
    name: '박지영',
    role: 'HR Manager',
    roleKo: 'HR 매니저',
    focus: ['창의성', '협업', '동기부여'],
    accent: 'from-pink-500 to-rose-500',
    initials: 'PJ',
  },
  {
    id: 'cto',
    name: '이상민',
    role: 'CTO',
    roleKo: 'CTO',
    focus: ['비즈니스 임팩트', '제품 사고', '의사결정'],
    accent: 'from-amber-500 to-orange-500',
    initials: 'LS',
  },
]

export type TranscriptMsg = {
  id: string
  speakerId: string
  speakerName: string
  role: string
  text: string
  followUp?: boolean
  interrupt?: boolean
  side: 'left' | 'right'
  initials?: string
  accent?: string
  active?: boolean
}

export const transcript: TranscriptMsg[] = [
  {
    id: 'm1',
    speakerId: 'sr-eng',
    speakerName: '김도현',
    role: 'Senior Engineer',
    text: '안녕하세요. 본인 소개와 함께 가장 최근에 진행한 프로젝트를 간단히 말씀해 주세요.',
    side: 'left',
    initials: 'KD',
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'm2',
    speakerId: 'me',
    speakerName: '윤효연',
    role: '지원자',
    text: '안녕하세요. 3년차 프론트엔드 개발자 윤효연입니다. 최근에는 Zustand 기반의 실시간 협업 에디터를 설계·구현했습니다.',
    side: 'right',
  },
  {
    id: 'm3',
    speakerId: 'sr-eng',
    speakerName: '김도현',
    role: 'Senior Engineer',
    text: '말씀하신 그 프로젝트에서 Zustand 대신 Redux를 선택하지 않은 이유가 무엇인가요?',
    side: 'left',
    initials: 'KD',
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'm4',
    speakerId: 'me',
    speakerName: '윤효연',
    role: '지원자',
    text: '팀 규모가 작고 보일러플레이트를 줄이고 싶었습니다. 실시간 협업 특성상 selector 단위로 구독이 가능한 점도 컸습니다.',
    side: 'right',
  },
  {
    id: 'm5',
    speakerId: 'sr-eng',
    speakerName: '김도현',
    role: 'Senior Engineer',
    text: '좋아요. 그렇다면 상태가 복잡해졌을 때 Zustand의 한계는 어떻게 다루셨나요?',
    side: 'left',
    initials: 'KD',
    accent: 'from-indigo-500 to-blue-500',
    followUp: true,
  },
  {
    id: 'm6',
    speakerId: 'cto',
    speakerName: '이상민',
    role: 'CTO',
    text: '잠깐, 그 트레이드오프를 비즈니스 관점에서도 설명해 주실 수 있을까요? 결과적으로 사용자 경험에 어떤 차이를 만들었는지가 궁금합니다.',
    side: 'left',
    initials: 'LS',
    accent: 'from-amber-500 to-orange-500',
    interrupt: true,
  },
  {
    id: 'm7',
    speakerId: 'me',
    speakerName: '윤효연',
    role: '지원자',
    text: '도입 후 첫 입력 반응 속도가 평균 180ms에서 95ms로 줄었고, 동시 편집 충돌 신고가 월 30건에서 4건으로 감소했습니다.',
    side: 'right',
  },
  {
    id: 'm8',
    speakerId: 'hr',
    speakerName: '박지영',
    role: 'HR Manager',
    text: '팀에서 이런 기술 결정이 있을 때, 동료들과 어떻게 합의를 만들어 가셨는지 궁금합니다.',
    side: 'left',
    initials: 'PJ',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    id: 'm9',
    speakerId: 'me',
    speakerName: '윤효연',
    role: '지원자',
    text: 'RFC 문서를 먼저 공유하고, 작은 프로토타입 두 개를 비교 데모로 만들었습니다. 정량 지표를 함께 본 게 합의가 빨라진 결정적인 이유였습니다.',
    side: 'right',
    active: true,
  },
]

export const realtimeFeedback = [
  {
    id: 'f1',
    severity: 'warning' as const,
    title: '시선을 자주 돌리고 있어요',
    detail: '최근 30초 동안 화면 밖으로 시선이 6회 벗어났습니다.',
  },
  {
    id: 'f2',
    severity: 'warning' as const,
    title: '말이 다소 빠릅니다',
    detail: '분당 약 312자, 권장 범위(220~270자)보다 빠른 편입니다.',
  },
  {
    id: 'f3',
    severity: 'info' as const,
    title: '필러 단어가 많아요',
    detail: '"음...", "어..."가 마지막 답변에서 7회 감지되었습니다.',
  },
  {
    id: 'f4',
    severity: 'info' as const,
    title: '자세가 살짝 흔들려요',
    detail: '몸이 좌우로 자주 움직이고 있어요. 어깨를 고정해 보세요.',
  },
]

export const liveScores = [
  { label: '기술 지식', value: 82, color: 'indigo' as const },
  { label: '창의성', value: 76, color: 'sky' as const },
  { label: '자신감', value: 71, color: 'violet' as const },
  { label: '면접 태도', value: 84, color: 'emerald' as const },
]

export const categoryScores = [
  { axis: '기술 지식', value: 86, full: 100 },
  { axis: '창의성', value: 78, full: 100 },
  { axis: '문제 해결', value: 82, full: 100 },
  { axis: '협업', value: 74, full: 100 },
  { axis: '면접 태도', value: 88, full: 100 },
]

export type PortfolioStatus = 'published' | 'draft'

export const myPortfolios = [
  {
    id: 'pf-001',
    title: '윤효연 · 프론트엔드 포트폴리오',
    slug: 'yhy-frontend',
    description: 'React, TypeScript 기반 6개 프로젝트를 모은 메인 포트폴리오',
    status: 'published' as PortfolioStatus,
    source: 'github' as const,
    theme: 'Aurora',
    projectsCount: 6,
    views: 1284,
    updatedAt: '2026-06-20',
  },
  {
    id: 'pf-002',
    title: 'AI 사이드 프로젝트 모음',
    slug: 'yhy-ai-lab',
    description: 'LLM 활용 프로토타입 위주의 실험적 포트폴리오',
    status: 'draft' as PortfolioStatus,
    source: 'github' as const,
    theme: 'Midnight',
    projectsCount: 3,
    views: 0,
    updatedAt: '2026-06-12',
  },
  {
    id: 'pf-003',
    title: '이력서 2026',
    slug: '',
    description: 'yhy_resume_2026.pdf',
    status: 'draft' as PortfolioStatus,
    source: 'pdf' as const,
    theme: '',
    projectsCount: 0,
    views: 0,
    updatedAt: '2026-06-10',
  },
]

export const portfolioDetails: Record<string, {
  title: string
  phone: string
  email: string
  homepage?: string
  github: string
  bio: string
  experiences: { company: string; role: string; period: string }[]
  projects: { name: string; period: string; summary: string; stack: string[]; detail: string }[]
  educations: { school: string; period: string }[]
  activities: { title: string; description: string }[]
  skills: Record<string, string[]>
}> = {
  'pf-001': {
    title: '안녕하세요, 프론트엔드 개발자 윤효연입니다.',
    phone: '010-1234-5678',
    email: 'loveyhy2002@gmail.com',
    homepage: 'https://yhy.dev',
    github: 'https://github.com/yoonhyoyeon',
    bio: '사용자 경험과 코드 품질을 모두 챙기는 프론트엔드 개발자입니다. React/TypeScript 기반으로 3년간 서비스를 개발했고, 디자인 시스템 구축과 인터랙션 디테일에 강합니다. 팀의 DX를 개선하는 작업을 즐깁니다.',
    experiences: [
      { company: '토스', role: '프론트엔드 개발자', period: '2024.03 ~ 현재' },
      { company: '카카오엔터프라이즈', role: '프론트엔드 개발자', period: '2022.07 ~ 2024.02' },
      { company: '넥스트스텝', role: '프론트엔드 인턴', period: '2022.01 ~ 2022.06' },
    ],
    projects: [
      {
        name: 'Proofolio — AI 면접 코칭 서비스',
        period: '2025.09 ~ 현재',
        summary: '실시간 자세·시선 분석과 STT를 결합한 AI 면접 코칭 플랫폼.',
        stack: ['React', 'TypeScript', 'TailwindCSS', 'MediaPipe', 'Vite'],
        detail: 'MediaPipe FaceLandmarker/PoseLandmarker로 카메라 피드를 실시간 분석해 정면 응시·자세 안정성·움직임 지수를 산출합니다. Web Speech API 기반 STT로 필러 단어와 발화 속도를 감지하고, 면접 종료 후 종합 리포트를 생성합니다.',
      },
      {
        name: '디자인 시스템 v2 구축',
        period: '2024.06 ~ 2024.11',
        summary: '레거시 컴포넌트 230개를 토큰 기반 디자인 시스템으로 재구축.',
        stack: ['React', 'TypeScript', 'Storybook', 'CSS Variables', 'Figma'],
        detail: 'CSS Custom Properties를 활용한 멀티 테마 시스템 도입. Storybook + Chromatic으로 시각적 회귀 테스트를 자동화했고, 빌드 번들 사이즈 22% 절감, 컴포넌트 재사용률 68%까지 향상했습니다.',
      },
      {
        name: 'Pose Coach SDK',
        period: '2025.03 ~ 2025.07',
        summary: 'MediaPipe 기반 자세 분석 라이브러리. GitHub 87 stars.',
        stack: ['TypeScript', 'MediaPipe', 'Canvas API', 'Rollup'],
        detail: '브라우저에서 실행 가능한 경량 자세 분석 SDK. GPU delegate 활용으로 추론 속도 40% 개선, 60fps 드로잉 루프와 16fps 추론 루프를 분리해 UI 블로킹을 최소화했습니다.',
      },
    ],
    educations: [
      { school: '한국대학교 컴퓨터공학과', period: '2018.03 ~ 2022.02' },
    ],
    activities: [
      { title: '2025 FEConf 발표 — "MediaPipe로 만드는 실시간 AI 코칭"', description: '600명 이상 참석. 브라우저 내 실시간 ML 추론 패턴 공유.' },
      { title: 'React 공식 문서 한국어 번역 기여', description: 'useEffect, useMemo 섹션 번역 및 리뷰 참여.' },
      { title: '기술 블로그 운영', description: 'https://yhy.dev/blog — 월 평균 8,000 PV, 구독자 1,200명.' },
    ],
    skills: {
      Frontend: ['HTML', 'CSS/SCSS', 'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Vite', 'TailwindCSS'],
      Design: ['Figma', 'Storybook', 'CSS Variables'],
      Backend: ['Node.js', 'Python'],
      Tooling: ['Git', 'Turborepo', 'Chromatic', 'Sentry'],
    },
  },
  'pf-002': {
    title: '안녕하세요, 프론트엔드 개발자 윤효연입니다.',
    phone: '010-1234-5678',
    email: 'loveyhy2002@gmail.com',
    github: 'https://github.com/yoonhyoyeon',
    bio: 'LLM과 브라우저 기술을 연결하는 실험적인 사이드 프로젝트를 주로 합니다.',
    experiences: [
      { company: '토스', role: '프론트엔드 개발자', period: '2024.03 ~ 현재' },
    ],
    projects: [
      {
        name: 'LLM Router',
        period: '2026.01 ~ 2026.03',
        summary: '여러 LLM 공급자를 라우팅하는 경량 게이트웨이.',
        stack: ['Python', 'FastAPI', 'OpenAI SDK', 'Anthropic SDK'],
        detail: '프롬프트 복잡도와 비용을 기준으로 Claude / GPT-4o / Gemini를 자동 선택. 폴백 로직과 스트리밍 지원 포함.',
      },
      {
        name: 'LLM Prompt Experiments',
        period: '2025.11 ~ 2026.01',
        summary: 'CoT, RAG, Function Calling 패턴 실험 저장소.',
        stack: ['Python', 'LangChain', 'ChromaDB'],
        detail: '다양한 프롬프트 전략을 비교 실험하고 결과를 Markdown으로 문서화.',
      },
    ],
    educations: [
      { school: '한국대학교 컴퓨터공학과', period: '2018.03 ~ 2022.02' },
    ],
    activities: [
      { title: 'LLM Router — Product Hunt #3 of the Day', description: '2026년 3월 출시 당일 Product Hunt 3위 달성.' },
    ],
    skills: {
      Frontend: ['React.js', 'TypeScript'],
      Backend: ['Python', 'FastAPI', 'Node.js'],
      AI: ['LangChain', 'ChromaDB', 'OpenAI API', 'Anthropic API'],
    },
  },
}

export const portfolioTemplates = [
  {
    id: 'aurora',
    name: 'Aurora',
    description: '그라데이션과 화이트 톤. 프론트엔드/디자이너 추천.',
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: '딥블루 배경에 미니멀 타이포. 백엔드/AI 추천.',
    accent: 'from-slate-700 to-slate-900',
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    description: '밝은 코랄/오렌지 톤. 풀스택/사이드프로젝트에 적합.',
    accent: 'from-amber-400 to-rose-500',
  },
]

export const githubRepos = [
  {
    id: 'r1',
    name: 'proofolio-frontend',
    description: 'AI 면접 코칭 서비스의 프론트엔드 (React + TS)',
    language: 'TypeScript',
    stars: 142,
    forks: 18,
    updatedAt: '2026-06-22',
    topics: ['react', 'vite', 'tailwind'],
    visibility: 'public' as const,
  },
  {
    id: 'r2',
    name: 'pose-coach-sdk',
    description: 'MediaPipe 기반 자세 분석 SDK',
    language: 'TypeScript',
    stars: 87,
    forks: 9,
    updatedAt: '2026-05-30',
    topics: ['mediapipe', 'sdk', 'computer-vision'],
    visibility: 'public' as const,
  },
  {
    id: 'r3',
    name: 'next-blog-template',
    description: 'MDX 기반 개발 블로그 보일러플레이트',
    language: 'TypeScript',
    stars: 56,
    forks: 12,
    updatedAt: '2026-04-11',
    topics: ['nextjs', 'mdx', 'blog'],
    visibility: 'public' as const,
  },
  {
    id: 'r4',
    name: 'proofolio-internal-experiments',
    description: '사내 실험용 비공개 레포 — LLM 프롬프트 실험',
    language: 'Python',
    stars: 0,
    forks: 0,
    updatedAt: '2026-06-03',
    topics: ['llm', 'experiments'],
    visibility: 'private' as const,
  },
  {
    id: 'r5',
    name: 'side-fintech-app',
    description: '개인 사이드 프로젝트 — 가계부 + 카드 추천 (비공개)',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-15',
    topics: ['nextjs', 'fintech'],
    visibility: 'private' as const,
  },
  {
    id: 'r6',
    name: 'dotfiles',
    description: '개인 개발 환경 설정 모음',
    language: 'Shell',
    stars: 8,
    forks: 0,
    updatedAt: '2026-02-18',
    topics: ['zsh', 'neovim'],
    visibility: 'public' as const,
  },
]

export const pdfExtractedPreview = {
  fileName: 'yhy_portfolio_2026.pdf',
  pages: 7,
  projects: [
    {
      id: 'p1',
      title: 'Proofolio · AI 면접 코칭',
      summary:
        '실시간 자세/시선 분석과 음성 STT를 결합한 AI 면접 코칭 서비스. 프론트엔드 리드.',
      tags: ['React', 'TypeScript', 'MediaPipe'],
    },
    {
      id: 'p2',
      title: '디자인 시스템 마이그레이션',
      summary:
        '레거시 UI 컴포넌트 230개를 토큰 기반 디자인 시스템으로 재구축, 빌드 사이즈 22% 절감.',
      tags: ['Design System', 'Tailwind', 'Storybook'],
    },
    {
      id: 'p3',
      title: '커머스 결제 모듈 리팩토링',
      summary:
        '결제 흐름의 상태 머신을 도입해 결제 실패율 1.4%p 개선, A/B 테스트 인프라 정착.',
      tags: ['XState', 'A/B Test', 'Sentry'],
    },
  ],
  skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Node.js'],
}

export const portfolioSkillSuggestions = [
  'React',
  'TypeScript',
  'Next.js',
  'Vite',
  'TailwindCSS',
  'Node.js',
  'GraphQL',
  'Figma',
  'Python',
  'MediaPipe',
  'AWS',
  'Docker',
]

export const interviewerFeedback = [
  {
    interviewerId: 'sr-eng',
    name: '김도현',
    role: 'Senior Engineer',
    initials: 'KD',
    accent: 'from-indigo-500 to-blue-500',
    strengths: [
      '시스템 설계 시 트레이드오프를 명확하게 비교함',
      '실제 측정 지표를 인용해 의사결정 근거를 제시함',
    ],
    weaknesses: [
      '트러블슈팅 과정에서 원인-시도-결과의 흐름이 끊김',
      '확장성 시나리오에서 깊이가 부족했음',
    ],
  },
  {
    interviewerId: 'hr',
    name: '박지영',
    role: 'HR Manager',
    initials: 'PJ',
    accent: 'from-pink-500 to-rose-500',
    strengths: [
      '지원 동기가 명확하고 톤이 안정적임',
      '협업 사례를 구체적인 예시와 함께 전달함',
    ],
    weaknesses: [
      '답변 길이가 길어 핵심이 흐려지는 구간이 있음',
      '갈등 상황에서의 본인 역할 묘사가 다소 모호함',
    ],
  },
  {
    interviewerId: 'cto',
    name: '이상민',
    role: 'CTO',
    initials: 'LS',
    accent: 'from-amber-500 to-orange-500',
    strengths: [
      '기술 선택을 제품 임팩트로 연결해서 설명함',
      '의사결정 우선순위가 명확함',
    ],
    weaknesses: [
      '비즈니스 지표 인용이 적어 설득력이 약함',
      '실패 사례에서 배운 점의 일반화가 부족함',
    ],
  },
]

export const weaknessAnalysis = [
  {
    id: 'w1',
    title: '기술 선택 근거 설명이 약합니다',
    description: '여러 답변에서 "왜 이 기술인지"를 비교군과 함께 제시하지 못했어요.',
  },
  {
    id: 'w2',
    title: '트러블슈팅 설명이 디테일 부족',
    description: '원인 추적과 시도의 순서가 명시되지 않아 신뢰도가 떨어집니다.',
  },
  {
    id: 'w3',
    title: '확장성 지식이 부족합니다',
    description: '트래픽 10배 시나리오에 대한 대응 전략을 구체화해 보세요.',
  },
]

export const questionReview = [
  {
    id: 'q1',
    question: 'Zustand 대신 Redux를 선택하지 않은 이유가 무엇인가요?',
    summary: '팀 규모와 보일러플레이트 절감, selector 단위 구독을 근거로 답변함.',
    evaluation:
      '기술 결정의 근거를 정리해 답변한 점은 좋았으나, 결정의 정량적 임팩트가 후반에 등장해 흐름이 약했어요.',
    suggestion:
      '결정 → 근거(정성) → 근거(정량) → 결과 순으로 STAR 구조를 적용해 보세요.',
    expanded: true,
  },
  {
    id: 'q2',
    question: '실시간 협업 충돌은 어떻게 해결했나요?',
    summary: 'CRDT 기반의 자체 머지 정책 도입, 충돌 발생 시 사용자 노티 모달로 핸드오프.',
    evaluation:
      '대안과 트레이드오프 비교(CRDT vs OT)를 함께 언급한 점이 인상적이었습니다.',
    suggestion:
      '운영 환경 메트릭(에러율, 머지 시간)을 한 줄 더 덧붙이면 설득력이 올라가요.',
    expanded: true,
  },
  {
    id: 'q3',
    question: '트래픽이 10배가 된다면 가장 먼저 무엇을 보겠습니까?',
    summary: '엣지 캐싱, WebSocket 분산, DB 읽기 복제 순으로 답변함.',
    evaluation: '우선순위는 합리적이나, 각 항목에 대한 기준 지표가 부족했습니다.',
    suggestion: 'p95 latency, error budget 같은 SLO 지표와 함께 답변해 보세요.',
    expanded: false,
  },
  {
    id: 'q4',
    question: '팀 내 의견 충돌이 있었을 때 어떻게 합의를 만들었나요?',
    summary: 'RFC 작성 → 데모 프로토타입 비교 → 정량 지표 기준으로 결정.',
    evaluation: '구체적인 프로세스를 잘 설명했으나 본인 역할이 다소 일반적이에요.',
    suggestion: '본인이 실제로 작성한 RFC 섹션과 의사결정 키 모먼트를 특정해 주세요.',
    expanded: false,
  },
  {
    id: 'q5',
    question: '최근 1년간 가장 크게 배운 점은 무엇인가요?',
    summary: '제품 임팩트 중심 사고로 전환, 측정 가능한 목표 설정을 강조함.',
    evaluation: '학습-적용-결과 구조가 잘 잡혀 있지만 사례가 한 개로 다소 부족합니다.',
    suggestion: '서로 다른 도메인 사례 2개로 일반화해 보세요.',
    expanded: false,
  },
]

export const attitudeMetrics = [
  // 시각
  {
    key: 'eye',
    group: '시각' as const,
    label: '시선처리',
    value: 82,
    unit: '%',
    comment: '안정적인 시선 유지',
    tone: 'success' as const,
  },
  {
    key: 'head',
    group: '시각' as const,
    label: '고개숙임 횟수',
    value: 8,
    unit: '회',
    barPercent: 32,
    comment: '약간 잦은 편이에요',
    tone: 'warning' as const,
  },
  {
    key: 'hand',
    group: '시각' as const,
    label: '손 움직임 횟수',
    value: 12,
    unit: '회',
    barPercent: 40,
    comment: '보통 수준',
    tone: 'neutral' as const,
  },
  {
    key: 'posture',
    group: '시각' as const,
    label: '자세 안정성',
    value: 76,
    unit: '%',
    comment: '대체로 안정적',
    tone: 'success' as const,
  },
  // 음성
  {
    key: 'speed',
    group: '음성' as const,
    label: '발화속도',
    value: 320,
    unit: '음절/분',
    barPercent: 75,
    comment: '약간 빠른 편',
    tone: 'warning' as const,
  },
  {
    key: 'intonation',
    group: '음성' as const,
    label: '억양 안정성',
    value: 71,
    unit: '%',
    comment: '보통 수준',
    tone: 'neutral' as const,
  },
  {
    key: 'volume',
    group: '음성' as const,
    label: '음량',
    value: 68,
    unit: 'dB',
    barPercent: 68,
    comment: '적절한 음량',
    tone: 'success' as const,
  },
  {
    key: 'filler',
    group: '음성' as const,
    label: '습관어 횟수',
    value: 23,
    unit: '회',
    barPercent: 46,
    comment: '23회 감지됨',
    note: '음, 어, 그러니까',
    tone: 'warning' as const,
  },
  {
    key: 'delay',
    group: '음성' as const,
    label: '답변지연 시간',
    value: 4.2,
    unit: '초',
    barPercent: 42,
    comment: '평균 4.2초',
    tone: 'neutral' as const,
  },
]

export const reportList = [
  {
    id: 'iv-104',
    title: '프론트엔드 개발자 모의면접',
    position: '프론트엔드',
    date: '2026.06.20',
    score: 84,
    mode: 'practice',
    status: '완료',
  },
  {
    id: 'iv-103',
    title: '백엔드 개발자 모의면접',
    position: '백엔드',
    date: '2026.06.15',
    score: 78,
    mode: 'practice',
    status: '완료',
  },
  {
    id: 'iv-102',
    title: '프론트엔드 실전면접',
    position: '프론트엔드',
    date: '2026.06.10',
    score: 88,
    mode: 'real',
    status: '완료',
  },
  {
    id: 'iv-101',
    title: '풀스택 모의면접',
    position: '풀스택',
    date: '2026.06.04',
    score: 72,
    mode: 'practice',
    status: '완료',
  },
  {
    id: 'iv-100',
    title: '프론트엔드 모의면접',
    position: '프론트엔드',
    date: '2026.05.28',
    score: 76,
    mode: 'practice',
    status: '완료',
  },
  {
    id: 'iv-099',
    title: '백엔드 실전면접',
    position: '백엔드',
    date: '2026.05.20',
    score: 81,
    mode: 'real',
    status: '완료',
  },
  {
    id: 'iv-098',
    title: 'AI 엔지니어 모의면접',
    position: 'AI 엔지니어',
    date: '2026.05.12',
    score: 69,
    mode: 'practice',
    status: '완료',
  },
  {
    id: 'iv-097',
    title: '프로덕트 디자이너 모의면접',
    position: '디자이너',
    date: '2026.05.03',
    score: 74,
    mode: 'practice',
    status: '완료',
  },
]

export const popularCompanies = [
  '네이버',
  '카카오',
  '토스',
  '쿠팡',
  '라인',
  '배민',
  '당근',
  '뤼튼',
]

export const positions = [
  { value: 'frontend', label: '프론트엔드 개발자', detail: '웹 UI/UX 구현 및 상태/성능 최적화' },
  { value: 'backend', label: '백엔드 개발자', detail: 'API/시스템 설계, 데이터·인프라 운영' },
  { value: 'fullstack', label: '풀스택 개발자', detail: '프론트엔드와 백엔드 모두 다룸' },
  { value: 'ai', label: 'AI 엔지니어', detail: 'LLM/모델 서빙, 데이터 파이프라인' },
  { value: 'pm', label: '프로덕트 매니저', detail: '제품 전략, 사용자 리서치, 우선순위' },
  { value: 'designer', label: '디자이너', detail: 'UI/UX, 디자인 시스템, 비주얼 디자인' },
  { value: 'marketer', label: '마케터', detail: '그로스, 콘텐츠, 캠페인 운영' },
  { value: 'other', label: '기타', detail: '직접 입력합니다' },
]

export const interviewMeta: {
  title: string
  company: string
  position: string
  date: string
  duration: string
  mode: 'practice' | 'real'
  totalScore: number
  comment: string
  trend: string[]
} = {
  title: '프론트엔드 개발자 모의면접',
  company: '토스',
  position: '프론트엔드',
  date: '2026.06.20',
  duration: '32분 12초',
  mode: 'practice',
  totalScore: 84,
  comment: '상위 18% 수준의 안정적인 답변이에요.',
  trend: ['자신감 ↑', '기술 깊이 ↑', '구조화 ↓'],
}
