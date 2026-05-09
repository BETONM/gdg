# Google Stack MVP Plan: Daily Mission Agent

## 1. Goal

4시간 안에 Google 제품을 명확히 활용한 웹앱 MVP를 만든다.

제품 컨셉:

> 처음 독립한 20대 1인 가구가 하루에 한 번 자신의 상태를 체크하면, Gemini가 지금 할 만한 미션 3개를 만들고, Google Maps/Places 기반 주변 spot과 연결해 포인트를 받을 수 있게 하는 Daily Mission Agent.

## 2. Must-have Google Stack

아래 스택은 MVP에 반드시 포함한다.

| Stack | 역할 | 왜 필요한가 |
|---|---|---|
| Gemini API | 사용자 상태 분석과 미션 3개 생성 | 핵심 LLM 사용 지점 |
| Gemini Structured Output | Gemini 응답을 JSON schema로 고정 | UI 안정성, Prompt/Spec Quality |
| Google Maps JavaScript API | 미션 spot을 지도 위에 표시 | Google 지도 제품 사용 명확화 |
| Google Places API | 미션과 관련된 주변 장소 검색 | 사용자 상태와 실제 장소 연결 |
| Firebase Hosting | 완성된 웹앱 배포 | Google stack 기반 Completeness |

## 3. Optional Google Stack

시간이 남을 때만 추가한다.

| Stack | 역할 | 우선순위 |
|---|---|---:|
| Gemini TTS | 미션 시작 전 짧은 음성 안내 | 1 |
| Cloud Text-to-Speech Chirp 3 HD | 고품질 한국어 음성 안내 | 2 |
| Gemini Vision | 인증샷이 미션 기준에 맞는지 검수 | 2 |
| Cloud Vision OCR | 영수증 금액/품목 추출 | 3 |
| Firebase Cloud Messaging | 하루 1회 체크인 알림 | 3 |
| Cloud Run Functions | API key 보호용 서버리스 함수 | 3 |

## 4. App Flow

```text
Daily Check-in
-> Gemini state analysis
-> Gemini mission generation
-> Places API nearby spot search
-> Google Map markers
-> Mission selection
-> Point completion
-> Firebase deployed URL
```

## 5. Core Screens

### Screen 1. Daily Check-in

사용자에게 현재 상태를 묻는다.

입력 항목:

- 시간대: 아침, 점심, 저녁, 밤
- 밥 먹었는지 여부
- 에너지 수준: 낮음, 보통, 높음
- 오늘 외출 여부
- 오늘 필요한 것: 식사, 휴식, 외출, 집관리, 사람과의 연결, 안전
- 예산
- 자유 입력

### Screen 2. Gemini Agent Analysis

Gemini가 사용자의 답변을 구조화한다.

표시 항목:

- 현재 상태 요약
- 오늘 우선순위
- 에너지 수준
- 긴급도
- Agent Plan

Agent Plan 예시:

```text
1. 사용자의 시간대와 식사 여부를 확인했습니다.
2. 예산과 에너지 수준으로 가능한 행동을 좁혔습니다.
3. 주변 장소와 연결 가능한 미션 3개를 생성했습니다.
```

### Screen 3. Mission Cards

Gemini가 생성한 미션 3개를 카드로 표시한다.

각 카드 필드:

- 미션 제목
- 설명
- 포인트
- 예상 시간
- 예상 비용
- 인증 방식
- 장소 검색 키워드
- 실행 단계
- 미션 선택 버튼

### Screen 4. Google Map

선택한 미션의 `placeSearchQuery`를 기반으로 Google Places API를 호출하고, 주변 장소를 Google Map에 마커로 표시한다.

예시 매핑:

| Mission Category | Places Query |
|---|---|
| meal | convenience store, supermarket, restaurant |
| rest | cafe, park |
| outdoor | park, walking trail |
| homecare | laundromat, supermarket, hardware store |
| social | cafe, bookstore, community center |
| safety | pharmacy, police station, hospital |

### Screen 5. Completion

사용자가 미션을 완료했다고 누르면 포인트를 지급한다.

MVP에서는 실제 인증 대신 mock 처리한다.

표시 항목:

- 획득 포인트
- 오늘 누적 포인트
- 생활 영역 점수
- 짧은 완료 메시지

## 6. Gemini Prompt Contract

Gemini는 Daily Mission Designer 역할을 수행한다.

```text
You are a Daily Mission Designer for young adults living alone for the first time.
Your job is to convert the user's current state into 3 small, realistic missions they can complete today.

Rules:
- Output valid JSON only.
- Do not provide medical, legal, or financial diagnosis.
- Missions must be small enough to complete within 5 to 30 minutes.
- Prefer low-cost actions.
- Consider food, rest, outdoor movement, home care, safety, and light social connection.
- Each mission must include points, proof type, and place search query.
- At least 2 missions should be connectable to a nearby place.
- Keep the tone warm but practical.
```

## 7. Gemini Structured Output Schema

```json
{
  "stateSummary": {
    "timeOfDay": "morning | afternoon | evening | night",
    "primaryNeed": "meal | rest | outdoor | homecare | social | safety",
    "energyLevel": "low | medium | high",
    "urgency": "low | medium | high",
    "summary": "string"
  },
  "agentPlan": [
    "string"
  ],
  "missions": [
    {
      "title": "string",
      "description": "string",
      "lifeArea": "meal | rest | outdoor | homecare | social | safety",
      "difficulty": "easy | normal | challenge",
      "estimatedMinutes": 10,
      "estimatedCostKRW": 0,
      "points": 30,
      "proofType": "self_check | photo | receipt | location | text",
      "proofCriteria": [
        "string"
      ],
      "steps": [
        "string"
      ],
      "placeSearchQuery": "string",
      "needsMapSpot": true,
      "soloFriendly": true,
      "whyThisMission": "string"
    }
  ],
  "safetyNote": "string"
}
```

## 8. Example Demo Scenario

사용자 입력:

```json
{
  "timeOfDay": "evening",
  "hasEaten": false,
  "energyLevel": "low",
  "wentOutsideToday": false,
  "currentNeed": "meal",
  "budgetKRW": 8000,
  "mood": "a little lonely and tired"
}
```

기대 결과:

- Gemini가 저녁 식사와 가벼운 외출을 우선순위로 분석한다.
- 3개 미션을 생성한다.
- 그중 2개 이상은 Google Places로 주변 장소를 찾을 수 있다.
- 사용자가 미션을 선택하면 Google Map에 주변 spot이 표시된다.
- 완료 버튼을 누르면 포인트가 증가한다.

## 9. 4-hour Implementation Plan

### 0:00-0:40

- 새 웹앱 세팅
- Tailwind 또는 CSS 세팅
- 기본 레이아웃 구성

### 0:40-1:20

- Daily Check-in UI 구현
- Mission card mock 데이터 렌더링
- 포인트 완료 UI mock 구현

### 1:20-2:20

- Gemini API route 구현
- Structured Output 연결
- fallback sample JSON 추가

### 2:20-3:10

- Google Maps JavaScript API 연동
- 현재 위치 또는 기본 위치 표시
- mission 선택 시 마커 표시

### 3:10-3:40

- Google Places API 연동
- `placeSearchQuery` 기반 주변 spot 검색
- 지도 마커와 장소 리스트 표시

### 3:40-4:00

- Firebase Hosting 배포
- 데모 시나리오 고정
- 발표용 문장 정리

## 10. Environment Variables

```bash
GEMINI_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Firebase Hosting을 쓸 경우:

```bash
FIREBASE_PROJECT_ID=
```

## 11. Fallback Rules

데모 안정성을 위해 fallback은 필수다.

- Gemini API 실패 시 `sampleMissionResult.json` 사용
- Places API 실패 시 미리 정의한 demo places 사용
- 위치 권한 거부 시 기본 위치 사용
- 지도 로딩 실패 시 미션 카드와 장소 리스트는 계속 표시

## 12. Judging Criteria Alignment

### Prompt/Spec Quality

- Gemini 역할, 제약, 출력 schema가 명확하다.
- 사용자의 상태를 mission spec으로 변환한다.

### Agentic Thinking

- 앱은 단순 챗봇이 아니라 다음 순서로 작동한다.

```text
Analyze state
-> Decide mission categories
-> Generate mission specs
-> Search nearby places
-> Present actionable missions
-> Award points
```

### Impact

- 처음 독립한 20대 1인 가구의 식사, 외출, 집관리, 사회적 연결 문제를 매일 실행 가능한 작은 행동으로 바꾼다.

### Completeness

- Gemini, Maps, Places, Firebase Hosting까지 포함한 배포 가능한 웹앱이다.

## 13. Demo Pitch

```text
Hi Spot Daily는 처음 독립한 20대 1인 가구를 위한 Daily Mission Agent입니다.
사용자가 오늘 상태를 체크하면 Gemini가 상태를 분석하고, 지금 할 만한 미션 3개를 생성합니다.
각 미션은 Google Places 기반 주변 spot과 연결되고, 사용자는 지도에서 장소를 확인한 뒤 미션을 완료해 포인트를 얻습니다.
이 앱은 단순한 일정표나 커뮤니티가 아니라, 혼자 사는 청년의 하루를 작은 실행으로 바꾸는 agentic 생활 루틴 서비스입니다.
```
