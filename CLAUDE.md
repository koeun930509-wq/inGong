# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains **no implementation code** — only `PRD.md` (the product requirements document) and an empty `index.html` placeholder. There is no `package.json`, build tooling, linter, or test runner set up yet.

Before writing code, read `PRD.md` in full — it is the source of truth for scope, architecture, and data model. In particular:
- **Section 13 ("기술 스택 요약")** fixes the stack: React + Vite (SPA), deployed to Vercel, Recharts for charts, Supabase for Auth (email/password) + Database with RLS.
- **Section 16 ("오픈 이슈 / 확인 필요 사항")** lists open questions (exact public-data API spec, congestion metric shape, favorites limits, email verification, etc.) that are still unresolved. If a task requires an answer to one of these and it isn't otherwise specified, ask the user rather than guessing — don't invent API field names or a stack choice that contradicts the PRD.

## Intended architecture (per PRD.md)

No backend server. The client talks directly to two external services:

1. **공공데이터포털 (Korean open-data portal) API** — Incheon Airport passenger congestion (today/tomorrow forecast only). Called directly from the browser with a service key; there is no proxy. This is a deliberate, confirmed decision (see PRD §11) — the key is expected to be visible in client-side network requests/bundles. Do not "fix" this by adding a serverless proxy unless the user asks for it.
2. **Supabase** — Auth (email/password) and a `favorites` table protected by Row Level Security (`auth.uid() = user_id` on SELECT/INSERT/DELETE). Never use or expose the Supabase **service role key** on the client — only the anon key.

Environment variables use the Vite `VITE_` prefix (`VITE_AIRPORT_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and are bundled client-side by design; kept in `.env.local` locally and in Vercel's Environment Variables for deployed environments. Never commit `.env*` files with real values.

## Hard rules (do not deviate without asking)

1. The public-data API key env var is named exactly `VITE_AIRPORT_API_KEY`.
2. The Supabase URL/anon key env vars are named exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. The `favorites` table must have RLS enabled from the moment it is created, with policies that restrict SELECT/INSERT/DELETE to rows where `auth.uid() = user_id` — never leave it open "temporarily" during development.
4. `.env`/`.env.local` must be added to `.gitignore` before any `.env` file with real values is ever created — do this first, not as an afterthought.
5. Build each screen/component against mock data first. Only wire up the real public-data API and Supabase calls last, once the UI renders correctly with mock data. Keep the mock data's shape identical to the real API/DB response shape so the swap doesn't require touching component code.
6. Function names and data shapes must match what `PRD.md` defines — don't invent alternate names or shapes ad hoc.
7. Any Supabase-side change (creating tables, writing/editing RLS policies, migrations) must be done through the **Supabase MCP tool** — not hand-written SQL files applied outside it, and not by asking the user to click through the dashboard.
8. Unless a specific call explicitly passes `--project-ref`, every Supabase MCP operation must target only the **"airport-dashboard"** project (`https://aeipftjmlikejemppxii.supabase.co`). Never touch any other Supabase project. If the MCP tool lists multiple projects or the target is ever ambiguous, stop and confirm with the user before running anything — especially anything destructive.

### Additional recommended rules (common mistakes in this stack)

9. Maintain an up-to-date `.env.example` listing every required variable name with no real values, so a fresh clone knows what to fill in.
10. Never use or reference the Supabase **service role key** in any client-side code, `VITE_`-prefixed env var, or committed file — it bypasses RLS entirely and must never leave a server context (which this project doesn't have).
11. Don't call `supabase.auth.admin.*` or any other Supabase admin API from the frontend — those require the service role key and have no place in this client-only architecture.
12. RLS is the actual access boundary for `favorites` — don't treat an app-side `.eq('user_id', ...)` filter as the security control. Query with RLS doing the enforcement; any client-side filtering is UX convenience only, never a substitute.
13. Don't hardcode the Supabase project URL/ref or the airport API key as a fallback/default value in code "just in case the env var is missing" — a missing env var should fail loudly, not silently fall back to a hardcoded value that could point at the wrong project.
14. Mock data must match the real API's date/time slot granularity and terminal/zone value strings once those are confirmed (PRD §16, items 1–2). If that's still unresolved when you need to build mock data, ask rather than guessing a format — reshaping mock data, UI, and the real integration later is expensive.
15. Before running any Supabase MCP operation that drops, alters, or truncates existing tables/data, state which project and table it targets and get explicit confirmation first.

## Core features to implement (PRD §6)

1. Auto-load today/tomorrow congestion data on entry.
2. Date/time picker → detail view showing per-terminal (T1/T2) × per-zone (입국장/출국장) congestion as both numbers and a chart.
3. T1 vs T2 comparison chart (Recharts), zones distinguished by color/legend.
4. Dark mode toggle, persisted to `localStorage`, defaulting to `prefers-color-scheme`.
5. Email/password auth via Supabase; logged-in users can create, list, and delete only their own favorites (date/time/terminal/zone).

## Commands

None yet — no `package.json` exists. Once the project is scaffolded (expected: Vite + React), commands will follow standard Vite conventions (`npm run dev`, `npm run build`, `npm run lint`, `npm run test`). Update this section with the real commands as soon as they exist instead of assuming these.

---

## (한국어) 프로젝트 안내

### 현재 상태
이 저장소에는 **아직 구현 코드가 없습니다** — `PRD.md`(제품 요구사항 문서)와 빈 `index.html` 플레이스홀더만 존재합니다. `package.json`, 빌드 도구, 린터, 테스트 러너는 아직 설정되어 있지 않습니다.

코드를 작성하기 전에 `PRD.md` 전체를 반드시 읽으세요 — 범위, 아키텍처, 데이터 모델의 근거 문서입니다. 특히:
- **13장("기술 스택 요약")**: 스택이 확정되어 있습니다 — React + Vite(SPA), Vercel 배포, 차트는 Recharts, Supabase(이메일/비밀번호 Auth + RLS 적용 Database).
- **16장("오픈 이슈 / 확인 필요 사항")**: 아직 해결되지 않은 질문 목록(공공데이터 API 정확한 스펙, 혼잡도 지표 형태, 즐겨찾기 개수 제한, 이메일 인증 여부 등)이 있습니다. 이 중 하나에 대한 답이 필요한 작업이라면, 임의로 API 필드명을 지어내거나 PRD와 다른 스택을 선택하지 말고 사용자에게 먼저 확인하세요.

### 의도된 아키텍처 (PRD.md 기준)
별도의 백엔드 서버는 없습니다. 클라이언트가 두 개의 외부 서비스와 직접 통신합니다.

1. **공공데이터포털 API** — 인천공항 여객 혼잡도(오늘/내일 예측만 제공). 브라우저에서 서비스 키를 사용해 직접 호출하며, 프록시 서버는 없습니다. 이는 의도적으로 확정된 결정입니다(PRD §11 참고) — 키가 클라이언트 측 네트워크 요청/번들에 노출되는 것을 감수하기로 한 것입니다. 사용자가 요청하지 않는 한 임의로 서버리스 프록시를 추가해 "고쳐서는" 안 됩니다.
2. **Supabase** — 이메일/비밀번호 Auth와 Row Level Security(`auth.uid() = user_id` 기준 SELECT/INSERT/DELETE)로 보호되는 `favorites` 테이블. Supabase **service role key는 절대** 클라이언트에서 사용하거나 노출하지 마세요 — anon 키만 사용합니다.

환경변수는 Vite의 `VITE_` 접두사를 사용합니다(`VITE_AIRPORT_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). 이 값들은 설계상 클라이언트 번들에 포함되며, 로컬에서는 `.env.local`, 배포 환경에서는 Vercel 환경변수로 관리합니다. 실제 값이 들어간 `.env*` 파일은 절대 커밋하지 마세요.

### 반드시 지켜야 할 규칙 (임의로 벗어나지 말 것)

1. 공공데이터포털 API 키의 환경변수명은 정확히 `VITE_AIRPORT_API_KEY`로 한다.
2. Supabase URL/anon key의 환경변수명은 정확히 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`로 한다.
3. `favorites` 테이블은 생성하는 그 순간부터 RLS를 켜고, `auth.uid() = user_id` 조건으로 SELECT/INSERT/DELETE를 제한하는 정책을 만든다 — 개발 중이라도 "나중에 켜야지"하며 RLS 없이 두지 않는다.
4. 실제 값이 들어간 `.env` 파일을 만들기 **전에** `.env`/`.env.local`을 `.gitignore`에 먼저 추가한다 — 나중에 챙기는 것이 아니라 먼저 한다.
5. 각 화면(컴포넌트)은 먼저 목업 데이터로 완성한다. 실제 공공데이터 API/Supabase 연결은 UI가 목업 데이터로 정상 동작하는 것을 확인한 뒤 **가장 마지막에** 붙인다. 목업 데이터의 형태(shape)를 실제 API/DB 응답과 동일하게 맞춰서, 나중에 연결만 바꿔도 컴포넌트 코드를 손대지 않도록 한다.
6. 함수 이름과 데이터 형태는 `PRD.md`에 정리된 것을 그대로 따른다 — 임의로 다른 이름/형태를 만들지 않는다.
7. 테이블 생성, RLS 정책 작성/수정, 마이그레이션 등 Supabase 관련 작업은 반드시 **Supabase MCP 도구**를 통해 수행한다 — MCP 밖에서 SQL 파일을 직접 작성하거나, 사용자에게 대시보드에서 직접 클릭하라고 요청하지 않는다.
8. 특정 호출에서 `--project-ref`를 명시적으로 지정하지 않은 이상, 모든 Supabase MCP 작업은 오직 **"airport-dashboard"** 프로젝트(`https://aeipftjmlikejemppxii.supabase.co`)만 대상으로 한다. 다른 Supabase 프로젝트는 절대 건드리지 않는다. MCP 도구가 여러 프로젝트를 보여주거나 대상이 조금이라도 애매하면, 특히 파괴적인 작업이라면 즉시 멈추고 사용자에게 먼저 확인한다.

#### 추가로 권장하는 규칙 (이런 구조에서 흔히 나오는 실수 예방)

9. 실제 값 없이 변수 이름만 나열한 `.env.example`을 항상 최신 상태로 유지해서, 새로 clone했을 때 무엇을 채워야 하는지 알 수 있게 한다.
10. Supabase **service role key**는 클라이언트 코드, `VITE_` 접두사 환경변수, 커밋되는 어떤 파일에도 절대 사용/노출하지 않는다 — 이 키는 RLS를 완전히 우회하며, 서버가 없는 이 프로젝트 구조에서는 애초에 쓸 자리가 없다.
11. `supabase.auth.admin.*` 등 Supabase admin API를 프론트엔드에서 호출하지 않는다 — 이런 API는 service role key가 필요하며 이 클라이언트 전용 아키텍처와 맞지 않는다.
12. `favorites`의 실제 접근 통제는 RLS다 — 앱 코드에서 `.eq('user_id', ...)` 같은 필터를 걸었다고 해서 그것이 보안 경계라고 착각하지 않는다. 조회는 RLS가 강제하는 것이고, 앱 단의 필터링은 어디까지나 UX 편의일 뿐 보안 대체 수단이 아니다.
13. "혹시 환경변수가 없을 때를 대비해서" Supabase 프로젝트 URL/ref나 공항 API 키를 코드에 하드코딩된 기본값으로 넣지 않는다 — 환경변수가 없으면 조용히 잘못된 값으로 대체되는 대신 명확하게 실패해야 한다.
14. 목업 데이터는 실제 API의 날짜/시간 슬롯 단위, 터미널/구역 값 표기(PRD §16의 1~2번 오픈 이슈)가 확정된 뒤 그 형식을 그대로 따라야 한다. 목업 데이터를 만들어야 하는 시점에 이 부분이 아직 미정이라면, 임의로 형식을 추측하지 말고 먼저 물어본다 — 나중에 목업/UI/실제 연동을 한꺼번에 다시 바꾸는 비용이 크다.
15. 기존 테이블/데이터를 삭제·변경·초기화하는 Supabase MCP 작업을 실행하기 전에는, 대상 프로젝트와 테이블이 무엇인지 먼저 밝히고 명시적으로 확인받는다.

### 구현해야 할 핵심 기능 (PRD §6)
1. 진입 시 오늘/내일 혼잡도 데이터 자동 조회.
2. 날짜·시간 선택 → 터미널(T1/T2) × 구역(입국장/출국장)별 혼잡도를 숫자와 그래프로 함께 보여주는 상세 화면.
3. T1 vs T2 비교 그래프(Recharts), 구역은 색상/범례로 구분.
4. 다크모드 토글, `localStorage`에 저장, 기본값은 `prefers-color-scheme` 반영.
5. Supabase 기반 이메일/비밀번호 로그인, 로그인 사용자는 본인의 즐겨찾기(날짜/시간/터미널/구역)만 생성·조회·삭제 가능.

### 명령어
아직 없습니다 — `package.json`이 존재하지 않습니다. 프로젝트가 스캐폴딩되면(Vite + React 예상) 표준 Vite 명령(`npm run dev`, `npm run build`, `npm run lint`, `npm run test`)을 따를 예정입니다. 실제 명령이 생기면 추측하지 말고 이 섹션을 실제 값으로 갱신하세요.
2