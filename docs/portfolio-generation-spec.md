# 포트폴리오 자동 생성 API 명세

## 개요

사용자가 GitHub 계정을 OAuth로 연동하고, 추가 정보를 직접 입력하면  
서버에서 이를 조합해 포트폴리오 데이터를 생성·저장하는 API입니다.

---

## 입력 (Input)

입력 데이터는 출처에 따라 세 가지로 나뉩니다.

### 1. 계정 정보 — 서버에서 자동 조회 (별도 전달 불필요)

| 필드 | 설명 |
|------|------|
| `name` | 사용자 이름 |
| `phone` | 전화번호 |
| `email` | 이메일 |
| `role` | 직무 (예: 프론트엔드 개발자) |

> 포트폴리오 제목은 서버에서 `"안녕하세요, {role} {name}입니다."` 형식으로 자동 생성합니다.

---

### 2. GitHub 정보 — OAuth Access Token으로 API 조회

프론트에서 GitHub OAuth 로그인 완료 후 `access_token`을 서버로 전달합니다.  
서버는 이 토큰으로 GitHub API를 호출해 아래 정보를 수집합니다.

| GitHub API | 수집 항목 |
|------------|----------|
| `GET /user` | `login` (username), `bio` (자기소개) |
| `GET /user/repos?type=all` | 저장소 목록 (공개 + 비공개) |
| `GET /repos/{owner}/{repo}` | 저장소별 name, description, language, topics, stargazers_count, forks_count |
| `GET /repos/{owner}/{repo}/commits` | 기여 이력 (오픈소스 활동 판별용) |

> `access_token`은 저장하지 않고 조회 후 즉시 폐기합니다.  
> 필요 OAuth scope: `repo` (비공개 레포 포함), `read:user`

---

### 3. 사용자 직접 입력 — 프론트에서 JSON으로 전달

```json
{
  "selectedRepoNames": ["proofolio-frontend", "pose-coach-sdk"],

  "homepage": "https://yhy.dev",

  "experiences": [
    {
      "company": "토스",
      "role": "프론트엔드 개발자",
      "period": "2024.03 ~ 현재"
    }
  ],

  "educations": [
    {
      "school": "한국대학교 컴퓨터공학과",
      "period": "2018.03 ~ 2022.02"
    }
  ],

  "activities": [
    {
      "title": "2025 FEConf 발표",
      "description": "MediaPipe로 만드는 실시간 AI 코칭 발표"
    }
  ]
}
```

---

## 처리 흐름

```
프론트 → POST /portfolio/generate
         {
           githubAccessToken: string,
           selectedRepoNames: string[],
           homepage?: string,
           experiences: Experience[],
           educations: Education[],
           activities: Activity[]
         }

서버
  1. access_token으로 GitHub API 호출
  2. 계정 정보 DB에서 조회
  3. 선택된 레포 기준으로 projects 구성
     - README, description, language, topics → AI로 summary·detail 보강
  4. GitHub bio → 자기소개로 사용
  5. GitHub 언어/토픽 분석 → 스킬 카테고리 자동 분류
  6. 오픈소스 기여 이력 추출 → activities에 자동 추가
  7. 포트폴리오 데이터 생성·저장
  8. 생성된 portfolio ID 반환
```

---

## 출력 (Output) — 포트폴리오 데이터 스키마

```json
{
  "id": "pf-001",
  "createdAt": "2026-06-25T00:00:00Z",

  "title": "안녕하세요, 프론트엔드 개발자 윤효연입니다.",
  "phone": "010-1234-5678",
  "email": "loveyhy2002@gmail.com",
  "homepage": "https://yhy.dev",
  "github": "https://github.com/yoonhyoyeon",

  "bio": "사용자 경험과 코드 품질을 모두 챙기는 프론트엔드 개발자입니다...",

  "experiences": [
    {
      "company": "토스",
      "role": "프론트엔드 개발자",
      "period": "2024.03 ~ 현재"
    }
  ],

  "projects": [
    {
      "name": "Proofolio — AI 면접 코칭 서비스",
      "period": "2025.09 ~ 현재",
      "summary": "실시간 자세·시선 분석과 STT를 결합한 AI 면접 코칭 플랫폼.",
      "stack": ["React", "TypeScript", "MediaPipe"],
      "detail": "AI가 생성한 프로젝트 상세 설명..."
    }
  ],

  "educations": [
    {
      "school": "한국대학교 컴퓨터공학과",
      "period": "2018.03 ~ 2022.02"
    }
  ],

  "activities": [
    {
      "title": "2025 FEConf 발표",
      "description": "MediaPipe로 만드는 실시간 AI 코칭"
    },
    {
      "title": "vercel/next.js 오픈소스 기여",
      "description": "fix(image): correct srcset for fill prop"
    }
  ],

  "skills": {
    "Frontend": ["React", "TypeScript", "Next.js", "TailwindCSS"],
    "Backend": ["Node.js", "Python"],
    "Design": ["Figma", "Storybook"],
    "Tooling": ["Git", "Turborepo"]
  }
}
```

---

## 필드 출처 요약

| 필드 | 출처 |
|------|------|
| title | 계정 (name + role 조합, 서버 생성) |
| phone | 계정 |
| email | 계정 |
| homepage | 사용자 직접 입력 |
| github | GitHub OAuth (`/user` → login) |
| bio | GitHub OAuth (`/user` → bio) |
| experiences | 사용자 직접 입력 |
| projects | GitHub 선택 레포 + AI 보강 |
| educations | 사용자 직접 입력 |
| activities | 사용자 직접 입력 + GitHub 오픈소스 기여 자동 추출 |
| skills | GitHub 레포 언어/토픽 분석 → 카테고리 자동 분류 |
