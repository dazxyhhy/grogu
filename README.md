# 🪐 Grogu Study Timer (v1)

스타워즈 '그로구' 테마와 '광선검 게이지'를 결합한 React/TypeScript 기반의 몰입형 집중 타이머.

<br/>

## 📸 프로젝트 스크린샷
<img width="1891" height="847" alt="image" src="https://github.com/user-attachments/assets/f04dda25-36d4-438b-92ce-85105a2aac1a" />
<img width="1902" height="867" alt="image" src="https://github.com/user-attachments/assets/6100a383-4882-43ef-b145-649e933b93bf" />
<br/>

<br/>

## 🚀 핵심 기능

* **아기자기한 동적 SVG 캐릭터 애니메이션:**
    * GroguIcon을 코드로 제어 가능한 컴포넌트형 SVG로 구현하여 해상도 깨짐 없는 선명한 인터랙션을 제공
    * 타이머 가동 상태(isRunning)에 맞춰 그로구 캐릭터가 포스를 사용하는 듯한 아기자기한 모션 그래픽 애니메이션 연출
* **백그라운드 오차 보정:** `Date.now()` 절대 시간 계산으로 탭 이동 시 타이머가 멈추는 버그 해결
* **초록색 광선검 게이지:** 목표 대비 진척도를 루크 스카이워커 테마의 초록빛 레이저(네온 이펙트)로 시각화
* **세션 지속성:** 로컬스토리지 연동으로 새로고침 시에도 시간 및 완료 상태 완벽 복구

<br/>

## 🛠️ 기술 스택

* **Core:** React / TypeScript / React Hooks (`useState`, `useEffect`, `useRef`)
* **Styling:** Tailwind CSS (네온 블러 및 오로라 그라데이션)
