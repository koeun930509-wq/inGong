# 인천공항 혼잡도 대시보드

인천국제공항 여객 혼잡도(오늘/내일 예측)를 조회하고, 로그인 사용자가 관심 시간대를 즐겨찾기로 관리할 수 있는 웹 대시보드입니다. 상세 요구사항은 [`PRD.md`](./PRD.md) 참고.

## 기술 스택

- **프론트엔드**: React + Vite (SPA)
- **차트**: Recharts
- **인증/DB**: Supabase (Auth: 이메일/비밀번호, Database + RLS)
- **외부 데이터**: 공공데이터포털 `getPassgrAnncmt` API (브라우저에서 직접 호출, 프록시 없음)

## 아키텍처

별도 백엔드 서버 없이 브라우저가 두 외부 서비스와 직접 통신합니다.

```
브라우저 (React SPA)
 ├─ 공공데이터포털 getPassgrAnncmt API (fetch, 서비스 키는 클라이언트에 노출됨 — 의도된 설계)
 └─ Supabase JS Client
     ├─ Auth (이메일/비밀번호)
     └─ Database: favorites 테이블 (RLS로 본인 행만 접근)
```

## 핵심 기능

- 진입 시 오늘/내일 혼잡도 자동 조회, 로딩/에러(+재시도) 상태 표시
- 날짜(오늘/내일) × 시간(1시간 단위 24슬롯) 선택 → 터미널(T1/T2) × 구역(입국장/출국장) 상세 카드
  - 출국장은 게이트별(T1: 1~6번, T2: 1~2번) 세부 인원수까지 표시
  - 혼잡도(인원수)가 100명 이상이면 카드 배경을 빨간 계열로 강조(숫자 표시는 유지, 색상에만 의존하지 않음)
- 터미널별 비교 막대그래프, 시간대별 추이 꺾은선 그래프 (다크모드 대응 팔레트)
- 다크모드 토글, `localStorage` 저장, 최초 진입 시 `prefers-color-scheme` 반영
- Supabase Auth 이메일/비밀번호 회원가입·로그인·로그아웃 (비로그인 사용자도 혼잡도 조회는 그대로 가능)
- 로그인 사용자 전용 즐겨찾기: 상세 카드에서 항목별로 추가, 목록에서 클릭 시 해당 날짜/시간으로 이동, 삭제
  - 즐겨찾기 시간대가 현재 로딩된 탭 기준으로 혼잡 기준치를 넘으면 목록에 🔥 표시
- 인천공항 실시간 날씨 표시(OpenWeatherMap, 공항 좌표 고정)
- 주차장 현황 카드: 터미널(T1/T2) 토글로 층별 주차 대수 / 전체 면수 실시간 조회, 미운영 층 구분 표시

## 외부 API 연동 (`getPassgrAnncmt`)

- 서비스: 공공데이터포털 "인천국제공항공사_출입국별 승객 예고 정보 조회서비스" (`B551177/passgrAnncmt`)
- `src/services/passgrAnncmtApi.js`: `getPassgrAnncmt(selectdate)` — `selectdate` 0=오늘, 1=내일. `type=json`으로 호출, `resultCode`가 `00`이 아니면 에러 throw.
- `src/services/congestionService.js`: 위 API의 raw 응답(`t1eg*`, `t1dg*`, `t2eg*`, `t2dg*`, `adate`, `atime`)을 앱 전역에서 쓰는 행 shape `{ date, time, terminal, zone, value, gates? }`로 변환.
  - `atime`("00_01"~"23_00")을 그대로 시간 슬롯 키로 사용
  - `value`는 인원수(raw headcount) — 등급/점수 없음
  - 출국장 행에는 게이트별(`t1dg1~6`/`t2dg1~2`) 세부 `gates` 배열 포함
  - 응답의 합계(총계) 행은 `atime === '합계'`로 필터링해서 제외

## 주차 현황 연동 (`getTrackingParking`)

- 서비스: 공공데이터포털 "인천국제공항공사_주차 현황 조회 서비스" (`B551177/StatusOfParking`)
- `src/services/statusOfParkingApi.js`: `getTrackingParking()` — 오퍼레이션명을 그대로 함수명으로 사용, `type=json` 호출, `resultCode`가 `00`이 아니면 에러 throw.
- `src/services/parkingService.js`: `fetchParkingStatus()` — raw 응답(`floor`/`parking`/`parkingarea`/`datetm`)을 `{ floor, terminal, parking, parkingArea, operating, updatedAt }`로 변환.
  - `floor`는 19종류 자유 텍스트(예: `'T1 단기주차장 지상층'`) — 별도 코드 매핑 없이 원문 그대로 표시하고, 앞 2글자로만 터미널(T1/T2) 구분
  - `parking`(현재 주차 대수)이 0 이하이면 미운영으로 간주(활용가이드 V7.3에 음수 값 정의가 없어 미운영과 동일하게 처리)
  - 1분 주기로 갱신되는 실시간 데이터

## 날씨 연동 (OpenWeatherMap)

- `src/services/weatherService.js`: `getIncheonAirportWeather()` — 인천공항 좌표(37.4602, 126.4407) 고정으로 Current Weather API 호출, 섭씨 기온/날씨 설명/아이콘 코드 반환.

## Supabase 데이터 모델

`public.favorites` 테이블, 생성 시점부터 RLS 활성화:

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | `gen_random_uuid()` |
| user_id | uuid | FK → `auth.users.id`, `ON DELETE CASCADE` |
| terminal | text | `CHECK (terminal IN ('T1','T2'))` |
| zone | text | `CHECK (zone IN ('입국장','출국장'))` |
| target_date | date | |
| target_time | text | `getPassgrAnncmt`의 `atime` 슬롯 문자열 |
| label | text | nullable |
| created_at | timestamptz | `now()` |

RLS 정책 3개(SELECT/INSERT/DELETE) 모두 `auth.uid() = user_id` 조건. 클라이언트의 `.eq('user_id', ...)` 필터는 UX 편의일 뿐이며, 실제 접근 제어는 RLS가 담당합니다.

## 환경변수

`.env.local`에 아래 값을 채웁니다 (`.env.example` 참고, 실제 값은 커밋하지 않음):

```
VITE_SUPABASE_URL=          # Supabase 프로젝트 URL
VITE_SUPABASE_ANON_KEY=     # Supabase anon key (service role key는 절대 사용하지 않음)
VITE_OPENWEATHER_API_KEY=   # OpenWeatherMap 날씨 API 키
```

공공데이터포털 서비스 키(`AIRPORT_API_KEY`)는 더 이상 프론트엔드 `.env`에 두지 않습니다. Supabase Edge Function(`airport-proxy`, `parking-proxy`)의 Secret으로만 등록하며, `supabase secrets set AIRPORT_API_KEY=...` 또는 대시보드에서 관리합니다.

## 실행

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # ESLint
```

## 알아둘 점

- 공공데이터포털 API는 브라우저가 직접 호출하지 않고 Supabase Edge Function(`airport-proxy`, `parking-proxy`)을 통해서만 호출합니다. 서비스 키는 Edge Function Secret으로만 존재하며 클라이언트 번들/네트워크 요청에 노출되지 않습니다.
- Supabase 프로젝트의 `mailer_autoconfirm`이 켜져 있어 회원가입 시 이메일 인증 없이 즉시 로그인됩니다(개발 편의를 위한 설정).
- 즐겨찾기의 🔥 표시는 현재 로딩된 날짜 탭(오늘 또는 내일) 기준으로만 판단합니다 — 반대쪽 탭의 즐겨찾기는 그 탭으로 전환해야 반영됩니다(API 호출량을 늘리지 않기 위한 선택).
- 주차 현황 API(`parking-proxy`)는 혼잡도 API(`airport-proxy`)와 같은 Edge Function Secret(`AIRPORT_API_KEY`)을 공유합니다.
- 날씨 API 키가 없으면 날씨 표시만 비활성화되고, 나머지 기능(혼잡도/주차 현황/즐겨찾기)은 정상 동작합니다.

## 참고 문서

- [`PRD.md`](./PRD.md) — 제품 요구사항 문서
- [`DESIGN.md`](./DESIGN.md) — 디자인 가이드
- OpenAPI 활용가이드(공공데이터포털 원본 문서, 저장소 루트에 `.docx`로 보관): 출입국별 승객 예고 정보 조회서비스, 주차 현황 조회 서비스(V7.3)
