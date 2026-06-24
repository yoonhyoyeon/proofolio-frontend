// Local test fixtures for exercising the interviewer TTS without the backend.

const FAMILY_NAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신']
const MALE_GIVEN_NAMES = [
  '민준', '도현', '하준', '주원', '시우', '지호', '지훈', '현우', '건우', '재윤',
  '준서', '도윤', '시윤', '우진', '예준', '선우',
]
const FEMALE_GIVEN_NAMES = [
  '서연', '지우', '서윤', '예은', '수아', '하은', '유진', '소율', '다은', '지아',
  '채원', '윤서', '민서', '수빈', '하린', '예린',
]

export type Gender = 'MALE' | 'FEMALE'

export type RoleKey =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'ai'
  | 'pm'
  | 'designer'
  | 'marketer'

/** Behavioral / personality questions — asked by the HR interviewer. */
export const COMMON_QUESTIONS = [
  '간단하게 자기소개 부탁드립니다.',
  '왜 저희 회사에 지원하셨는지 궁금합니다.',
  '본인의 가장 큰 강점과 약점은 무엇이라고 생각하시나요?',
  '팀에서 의견 충돌이 있었을 때 어떻게 해결하셨나요?',
  '협업할 때 본인만의 커뮤니케이션 원칙이 있나요?',
  '가장 기억에 남는 프로젝트와 본인의 역할을 설명해 주세요.',
  '실패했던 경험과 그로부터 배운 점을 말씀해 주세요.',
  '5년 후 어떤 모습으로 성장해 있고 싶으신가요?',
]

/** Role-specific technical questions — asked by the technical interviewers. */
export const ROLE_QUESTIONS: Record<RoleKey, string[]> = {
  frontend: [
    'React에서 상태 관리를 어떤 기준으로 설계하시는지 설명해 주세요.',
    '불필요한 리렌더링을 줄이기 위해 어떤 방법을 사용하셨나요?',
    '브라우저의 렌더링 과정을 아는 대로 설명해 주세요.',
    '웹 접근성을 위해 평소 어떤 점을 고려하시나요?',
    '번들 사이즈나 초기 로딩 속도를 최적화한 경험을 말씀해 주세요.',
  ],
  backend: [
    '데이터베이스 인덱스가 어떻게 동작하는지 설명해 주세요.',
    '트랜잭션 격리 수준에 대해 설명해 주세요.',
    'REST API를 설계할 때 가장 중요하게 생각하는 원칙은 무엇인가요?',
    '대용량 트래픽을 처리하기 위한 캐싱 전략을 말씀해 주세요.',
    '동시성 문제를 다뤄본 경험과 해결 방법을 설명해 주세요.',
  ],
  fullstack: [
    '프론트엔드와 백엔드 사이의 API 계약을 어떻게 관리하시나요?',
    '하나의 기능을 처음부터 끝까지 설계한 경험을 설명해 주세요.',
    '인증과 인가를 전체 스택에서 어떻게 처리하셨나요?',
    '배포 파이프라인을 구성해본 경험이 있다면 말씀해 주세요.',
  ],
  ai: [
    '모델 서빙 아키텍처를 어떻게 구성하시는지 설명해 주세요.',
    '데이터 파이프라인을 설계할 때 고려하는 점은 무엇인가요?',
    '과적합을 방지하기 위해 어떤 기법을 사용하시나요?',
    'LLM의 출력 품질을 어떻게 평가하고 개선하시나요?',
    '추론 비용을 줄이기 위한 방법을 말씀해 주세요.',
  ],
  pm: [
    '제한된 리소스에서 우선순위를 어떻게 결정하시나요?',
    '제품의 성공을 측정하는 핵심 지표를 어떻게 정의하시나요?',
    '사용자 리서치를 진행했던 방법을 구체적으로 말씀해 주세요.',
    '이해관계자를 설득해 의사결정을 이끈 경험을 설명해 주세요.',
  ],
  designer: [
    '디자인 시스템을 구축하거나 운영한 경험을 말씀해 주세요.',
    '특정 UX 의사결정을 내린 근거를 설명해 주세요.',
    '사용성 테스트를 진행하고 반영한 경험이 있나요?',
    '개발자와 협업할 때 디자인 의도를 어떻게 전달하시나요?',
  ],
  marketer: [
    '그로스 실험을 설계하고 검증한 경험을 말씀해 주세요.',
    '캠페인 성과를 어떤 지표로 측정하시나요?',
    '타깃 사용자에 맞춘 콘텐츠 전략을 설명해 주세요.',
    'CAC와 LTV를 개선하기 위해 어떤 시도를 하셨나요?',
  ],
}

/** Map an interview position label (Korean) to a role key. */
export function roleKeyFromPosition(position: string): RoleKey | null {
  const p = position.toLowerCase()
  if (p.includes('프론트')) return 'frontend'
  if (p.includes('풀스택')) return 'fullstack'
  if (p.includes('백엔드') || p.includes('서버')) return 'backend'
  if (p.includes('ai') || p.includes('엔지니어')) return 'ai'
  if (p.includes('pm') || p.includes('매니저') || p.includes('프로덕트')) return 'pm'
  if (p.includes('디자')) return 'designer'
  if (p.includes('마케')) return 'marketer'
  return null
}

/**
 * Pick a question appropriate for who is asking:
 * the HR interviewer asks behavioral questions, technical interviewers ask
 * role-specific questions (falling back to behavioral when the role is unknown).
 */
export function pickQuestionFor(interviewerId: string, roleKey: RoleKey | null): string {
  if (interviewerId === 'hr') return pickRandom(COMMON_QUESTIONS)
  const roleQuestions = roleKey ? ROLE_QUESTIONS[roleKey] : null
  return pickRandom(roleQuestions && roleQuestions.length ? roleQuestions : COMMON_QUESTIONS)
}

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Random Korean full name (matched to gender) + 2-char initials for an avatar. */
export function randomKoreanName(gender: Gender): { name: string; initials: string } {
  const given = gender === 'FEMALE' ? FEMALE_GIVEN_NAMES : MALE_GIVEN_NAMES
  const name = `${pickRandom(FAMILY_NAMES)}${pickRandom(given)}`
  return { name, initials: name.slice(0, 2) }
}
