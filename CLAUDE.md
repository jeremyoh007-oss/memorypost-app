@AGENTS.md

# 추억 우체국 — 작업 인계

## 시작 규칙
- 사용자가 **"추억우체국"**(띄어쓰기 무관)이라고만 입력하면, 아래 "현재 상태"를 표 3줄 이내로 요약하고 "다음 할 일" 후보 중 무엇부터 할지 한 줄로 묻는다. 코드는 바로 고치지 않는다.
- 사용자: 오준석(Jeremy). 지시는 짧은 반말, 답변은 존댓말. 결론 먼저, 표 위주, 미사여구 없음.
- 확정 안 된 수치는 쓰지 않는다. 최종 보고 전 2회 자체 검수.
- 공유 범위는 다시 묻지 않는다(완성 후 본인이 공유).
- API 키가 채팅에 붙여넣어지면 저장하지 말고 마스킹을 권한다.

## 제품 한 줄
매일 인사하는 3D 반려 친구 앱. 슬로건 **"어서 와!"** ("다녀올게!"는 여행 출발 화면에서만).

## 확정 규칙
| 항목 | 내용 |
|---|---|
| 일상 | 시간대별 인사, 터치 반응, 오늘의 돌봄 3종(인사하기·쓰다듬기·밥 주기) → 친밀도 레벨업 |
| 대시보드 | 날씨(기상청)·미세먼지·강수확률·오늘 일정(기기 캘린더). 지역은 17개 시·도 직접 선택 |
| 여행 | 특별 이벤트. 티켓(주 1회 / 돌봄 누적 7일 / 시즌)으로 출발, 1·3·8시간. 엽서에 입힌 옷 표시 |
| 친구 5종 | 강아지(기본), 고양이(친밀도 Lv.5), 여우(엽서 6장 수집·판매 안 함), 사자(상점 4,400원), 펭귄(겨울 한정 ~11-30, 4,400원) |
| 이미지 | 친구별 표정 4(happy/sad/sleep/wave) + 옷 3(straw/beret/beanie). AI 생성 이미지, 실시간 3D 아님 |
| 금지 | 뽑기(가챠), 걷기·건강 기능, GPS |
| 결제 | 프로토타입은 더미("결제 중… → 구매 완료! → 이제 같이 해 봐요!") |

## 현재 상태 (2026-10-25)
| 구분 | 상태 |
|---|---|
| 앱 | Expo SDK 58 + expo-router + zustand. `app/`(홈·엽서함·옷장·친구들), `components/`, `store/`, `data/`, `services/` |
| 폰 설치 | EAS preview APK 빌드 성공, 본인 Android 폰에 설치 완료 (EAS 계정 `jeremyoh`, 프로젝트 `memorypost`) |
| 디버그 메뉴 | `EXPO_PUBLIC_DEV_MENU=1`일 때만 표시 (preview 프로필에 켜져 있음) |
| 날씨 | 연결됨(10-25). Worker `https://memorypost-weather.jeremyoh007.workers.dev` 배포, 키 `KMA_SERVICE_KEY` 는 Cloudflare 비밀값으로만 저장. `eas.json` preview 에 `EXPO_PUBLIC_WEATHER_URL` 넣음. 미세먼지는 아직 없음(에어코리아 별도). Windows PC는 wrangler 로그인됨 |
| 패키지명 | 아직 `com.example.memorypost` (출시 전 변경 필요, 후보 `com.jeremyoh.memorypost`) |
| 웹 시안 | https://claude.ai/artifact/SEjwM4zC5vMuDMG8yHu2ob (v8) |
| 사업계획서 | https://claude.ai/artifact/Ac5mQi3y7QasvPyut5WJ5f (첫해 비용 47만 원, 개발 100시간 추정) |
| 발표 자료 | https://claude.ai/artifact/MYZkmD853K4kNpmzKwDVht (16장) |

## 다음 할 일 후보
1. 폰에서 써 본 피드백 반영 (UI·반응·문구)
2. 미세먼지 연결 (에어코리아, 기상청 날씨는 10-25 연결 끝)
3. 패키지명 확정 후 재빌드
4. 출시 준비: production 프로필, 아이콘·스토어 문구, 비공개 테스트(12명·14일)

## 명령어 (Windows PC: `C:\dev\memorypost-app`)
```
npx expo start                                          # 개발 서버 (Expo Go)
npx eas-cli@latest build -p android --profile preview   # 폰 설치용 APK 재빌드
npx tsc --noEmit                                        # 타입 검사
```
- 린트: 저장소에 ESLint 설정이 아직 없다. `npx expo lint` 는 eslint 를 설치하고 package.json 을 바꾸니 쓰지 않는다. 바뀐 파일만 임시 설정으로 점검한다 — 루트에 `eslint.tmp.config.js`(`eslint-config-expo/flat` 를 `defineConfig` 로 감싼 것)를 만들고 `npx eslint -c eslint.tmp.config.js <파일>` 뒤 지운다.
- 패키지 추가는 반드시 `npx expo install <패키지>`.
- 코드 수정 후에는 위 타입 검사·린트를 통과시키고 커밋한다.
