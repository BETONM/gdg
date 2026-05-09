# PRD: Hi Spot Daily Mission Agent

## 1. Summary

Hi Spot Daily는 처음 독립한 20대 1인 가구가 하루에 한 번 자신의 상태를 체크하면, Gemini가 지금 할 만한 작은 미션 3개를 제안하고, 사용자가 생활 꿀팁을 커뮤니티에 공유하면 Gemini가 이를 정리·개선·점수화해 포인트를 부여하는 웹앱이다.

핵심은 단순 일정표, 지도 앱, 커뮤니티 게시판이 아니라 **Gemini가 하루 행동과 생활 지식을 포인트화하는 Daily Life Mission Agent**를 만드는 것이다.

## 2. Problem

처음 독립한 20대는 밥, 외출, 집관리, 안전, 돈 관리, 사람과의 연결 같은 생활 루틴이 쉽게 무너진다. 문제를 느껴도 지금 무엇부터 해야 할지 정리하기 어렵고, 혼자 해결하다 보니 행동으로 이어지지 않는 경우가 많다.

또한 편의점 조합, 식비 절약, 청소·빨래 루틴 같은 실전 자취 꿀팁은 흩어져 있고 품질이 들쭉날쭉하다. 커뮤니티에 올라온 팁도 실제로 얼마가 드는지, 얼마나 실행 가능한지, 처음 자취하는 사람에게 적합한지 한눈에 보기 어렵다.

## 3. Target User

- 처음 자취를 시작한 20대
- 대학생, 사회초년생, 취준생
- 식사, 외출, 집관리, 정서 루틴이 자주 밀리는 사람
- 편의점 조합, 식비 절약, 집관리 팁 같은 실전 생활 정보가 필요한 사람
- 커뮤니티 참여는 부담스럽지만 가벼운 기여와 포인트 보상에는 동기부여되는 사람

## 4. Core Flow

```text
Daily Check-in
-> Gemini state analysis
-> Gemini mission generation with points
-> Optional Google Maps/Places spot connection
-> Community tip sharing
-> Gemini tip review and point scoring
```

## 5. Three Core Screens

### Screen 1. Daily Check-in

사용자가 하루에 한 번 현재 상태를 Gemini의 음성 대화를 통해 입력한다.

Required inputs:

- 시간대: 아침, 점심, 저녁, 밤
- 밥 먹었는지 여부
- 에너지 수준: 낮음, 보통, 높음
- 오늘 외출 여부
- 오늘 필요한 것: 식사, 휴식, 외출, 집관리, 사람과의 연결, 안전
- 예산
- 자유 입력

Primary CTA:

- `오늘의 미션 만들기`

### Screen 2. Gemini Agent Analysis + Mission Cards

Gemini가 사용자의 답변을 분석하고 지금 할 만한 행동 3개를 미션으로 만든다.

Required content:

- 현재 상태 요약
- Agent Plan 3단계
  1. 상태 분석
  2. 미션 카테고리 결정
  3. 포인트와 인증 기준 생성
- 생활 영역 badge
- 에너지/긴급도 표시
- 미션 카드 3개

Each mission card includes:

- 미션 제목
- 설명
- 포인트
- 예상 시간
- 예상 비용
- 인증 방식
- 실행 단계
- 지도 기반 spot 필요 여부
- `이 미션 선택` 버튼

Example missions:

- 8천원 편의점 균형식 챌린지
- 집 앞 10분 환기 산책
- 싱크대 5분 리셋

### Screen 3. Community Tip Sharing

사용자가 오늘의 자취 꿀팁을 올리고, Gemini가 이를 정리·개선·점수화해 포인트를 제안한다.

Required content:

- 제목: `오늘의 자취 꿀팁`
- 포인트 안내: `유용한 꿀팁을 공유하면 최대 50pt`
- 꿀팁 작성 카드
  - 카테고리: 편의점 조합, 식비 절약, 집관리, 안전, 외로움 해소, 청소·빨래
  - 제목 입력
  - 내용 입력
  - 예상 비용 입력
  - 사진 업로드 placeholder
  - CTA: `Gemini로 꿀팁 다듬기`
- Gemini Tip Review 카드
  - 유용성 점수
  - 예상 포인트
  - 개선된 제목
  - 정리된 꿀팁 문장
  - 왜 유용한지 설명
- 커뮤니티 피드 미리보기
  - 다른 사용자의 꿀팁 카드 2~3개
  - 좋아요/저장 수
  - 포인트 badge
- CTA: `커뮤니티에 올리고 포인트 받기`

Example tip:

```text
8천원 편의점 균형식 조합
삼각김밥 + 닭가슴살 + 두유
예상 비용: 7,900원
Gemini 유용성 점수: 86점
획득 포인트: +40pt
```

## 6. MVP Requirements

### Must Have

- Daily Check-in form
- Gemini API state analysis
- Gemini structured output for 3 missions
- Mission cards with points
- Community tip input
- Gemini tip review, rewrite, usefulness score, suggested points
- Point total UI
- Fallback sample data for Gemini failures
- Firebase Hosting deployment readiness

### Should Have

- Sample check-in button
- Sample tip button
- Optional Google Maps/Places area for map-based missions
- Default demo location when geolocation is denied
- Clean mobile-first UI

### Nice to Have

- Google Places for 편의점/카페/공원 spot search
- Gemini TTS mission guide
- Gemini Vision or Cloud Vision OCR for receipt/photo tip proof
- Firebase Cloud Messaging daily reminder

## 7. Non-goals

- Authentication
- Database
- Payment or real point exchange
- Full chat or matching
- Large community system
- Medical, legal, or financial diagnosis

## 8. Required Google Stack

| Stack | Purpose |
|---|---|
| Gemini API | State analysis, mission generation, tip review |
| Gemini Structured Output | Reliable JSON schema for missions and tips |
| Firebase Hosting | Deployment |
| Google Maps JavaScript API | Optional map area for map-based missions |
| Google Places API | Optional nearby spot search for missions like 편의점 조합 or 산책 |

## 9. Mission Output Shape

```json
{
  "stateSummary": {
    "timeOfDay": "morning | afternoon | evening | night",
    "primaryNeed": "meal | rest | outdoor | homecare | social | safety",
    "energyLevel": "low | medium | high",
    "urgency": "low | medium | high",
    "summary": "string"
  },
  "agentPlan": ["string"],
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
      "proofCriteria": ["string"],
      "steps": ["string"],
      "placeSearchQuery": "string",
      "needsMapSpot": true,
      "soloFriendly": true,
      "whyThisMission": "string"
    }
  ],
  "safetyNote": "string"
}
```

## 10. Tip Review Output Shape

```json
{
  "category": "convenience_combo | budget | homecare | safety | loneliness | cleaning_laundry",
  "improvedTitle": "string",
  "improvedTip": "string",
  "estimatedCostKRW": 7900,
  "usefulnessScore": 86,
  "suggestedPoints": 40,
  "whyUseful": "string",
  "tags": ["string"],
  "safetyOrHealthNote": "string"
}
```

## 11. Demo Scenario

Input:

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

Expected demo:

- Gemini identifies meal and light recovery as priorities
- Gemini creates 3 missions with points
- User sees `8천원 편의점 균형식 챌린지`
- User opens Community Tip Sharing
- User writes a rough convenience store combo tip
- Gemini improves it, scores usefulness, and suggests points
- User posts it and total points increase

## 12. Judging Alignment

### Prompt/Spec Quality

The app uses defined Gemini roles, constraints, and structured output schemas for both mission generation and tip review.

### Agentic Thinking

The app follows an agent workflow: analyze state, generate missions, assign proof/points, review user-generated tips, improve them, and score their usefulness.

### Impact

The app turns common 20s one-person-household problems into daily actions and reusable community knowledge.

### Completeness

The MVP can be deployed as a working web app with Gemini, points, mission cards, community tip review, and fallback data.
