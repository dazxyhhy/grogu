// src/GroguIcon.tsx
interface GroguIconProps {
  isRunning: boolean
}

export default function GroguIcon({ isRunning }: GroguIconProps) {
  return (
    <div className="w-80 h-48 mb-4 flex items-center justify-center">
      <style>{`
        /* ========================================================
           [귀 움직임 제어 파트] 
           - rotate(-5deg) 에서 rotate(-12deg) 등으로 숫자를 조절하면 
             귀가 까딱거리는 폭(각도) 미세 조정 가능.
           - translateY(-1px)의 숫자를 키우면 위로 더 높이 들림.
        ======================================================== */
        
        @keyframes inlineEarLeft {
          0%, 100% { transform: rotate(0deg); }      /* 👈 [왼쪽 귀] 처음 정지 상태 및 정점각도 */
          50% { transform: rotate(-5deg) translateY(-1px); } /* 👈 [왼쪽 귀] 움직일 때의 최대 쫑긋 각도 (현재 5도 차이) */
        }
        @keyframes inlineEarRight {
          0%, 100% { transform: rotate(0deg); }        /* 👈 [오른쪽 귀] 처음 정지 상태 및 정점각도 */
          50% { transform: rotate(5.5deg) translateY(-1px); }  /* 👈 [오른쪽 귀] 움직일 때의 최대 쫑긋 각도 (현재 5도 차이) */
        }
        
        /* ========================================================
           [애니메이션 속도 제어 파트]
           - 1.4s를 1.0s로 줄이면 더 기민하게 움직이고, 2.0s로 늘리면 엄청 느긋해짐.
        ======================================================== */
        .force-ear-left {
          animation: inlineEarLeft 2.0s ease-in-out infinite; /* 👈 왼쪽 귀의 속도 (2초에 1회 반복) */
        }
        .force-ear-right {
          animation: inlineEarRight 2.0s ease-in-out infinite; /* 👈 오른쪽 귀의 속도 (2초에 1회 반복) */
        
        }
      `}</style>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <radialGradient id="forceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity={isRunning ? "0.3" : "0.1"} />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="55" r="60" fill="url(#forceGlow)" className={isRunning ? "animate-pulse duration-1000" : ""} />

        {/* 왼쪽 귀 그룹 */}
        <g
          key={isRunning ? "left-running" : "left-stopped"}
          className="transition-transform duration-500"
          style={{
            transformOrigin: "75px 55px" /* 👈 귀가 머리에 붙어있는 회전 축 위치 고정 (수정 금지) */,
            transform: isRunning ? undefined : "rotate(-5deg)" /* 👈 [정지 상태 기본 각도] 위 @keyframes의 0% 각도와 꼭 맞춰주세요! */,
          }}
          {...(isRunning ? { className: "force-ear-left" } : {})}
        >
          <path d="M 80 50 C 40 35, 15 45, 10 55 C 20 65, 55 65, 80 60 Z" fill="#6ee7b7" />
          <path d="M 75 52 C 45 42, 25 50, 18 55 C 25 60, 55 62, 75 58 Z" fill="#fca5a5" opacity="0.6" />
        </g>

        {/* 오른쪽 귀 그룹 */}
        <g
          key={isRunning ? "right-running" : "right-stopped"}
          className="transition-transform duration-500"
          style={{
            transformOrigin: "125px 55px" /* 👈 귀가 머리에 붙어있는 회전 축 위치 고정 (수정 금지) */,
            transform: isRunning ? undefined : "rotate(5deg)" /* 👈 [정지 상태 기본 각도] 위 @keyframes의 0% 각도와 꼭 맞춰주세요! */,
          }}
          {...(isRunning ? { className: "force-ear-right" } : {})}
        >
          <path d="M 120 50 C 160 35, 185 45, 190 55 C 180 65, 145 65, 120 60 Z" fill="#6ee7b7" />
          <path d="M 125 52 C 155 42, 175 50, 182 55 C 175 60, 145 62, 125 58 Z" fill="#fca5a5" opacity="0.6" />
        </g>

        {/* 3. 머리통 및 얼굴 요소 */}
        {/* 🟢 머리 전체: 중심(100, 55) 기준으로 가로 반경 24, 세로 반경 18짜리 타원 */}
        <ellipse cx="100" cy="55" rx="24" ry="18" fill="#6ee7b7" />

        {/* 🟢 왼쪽 눈동자:  Slate-900 계열의 어두운 진한 눈동자 원 */}
        <circle cx="91" cy="53" r="5" fill="#0f172a" />
        {/* 🟢 왼쪽 눈 하이라이트: 초롱초롱한 눈빛을 만들어주는 흰색 작은 점 */}
        <circle cx="89.5" cy="51.5" r="1.2" fill="#ffffff" />

        {/* 🟢 오른쪽 눈동자: Slate-900 계열의 어두운 진한 눈동자 원 */}
        <circle cx="109" cy="53" r="5" fill="#0f172a" />
        {/* 🟢 오른쪽 눈 하이라이트: 초롱초롱한 눈빛을 만들어주는 흰색 작은 점 */}
        <circle cx="107.5" cy="51.5" r="1.2" fill="#ffffff" />

        {/* 🟢 왼쪽 콧구멍: 짙은 초록색의 아주 작은 원 점 (투명도 50%) */}
        <circle cx="98.5" cy="58" r="0.6" fill="#047857" opacity="0.5" />
        {/* 🟢 오른쪽 콧구멍: 짙은 초록색의 아주 작은 원 점 (투명도 50%) */}
        <circle cx="101.5" cy="58" r="0.6" fill="#047857" opacity="0.5" />

        {/* 🟢 수줍은 입: 베지에 곡선(Q)을 이용해 (97, 63)에서 시작해 (103, 63)까지 살짝 미소 짓는 부드러운 선 */}
        <path d="M 97 63 Q 100 65, 103 63" stroke="#047857" strokeWidth="0.8" fill="none" strokeLinecap="round" />

        {/* 🟢 로브 두툼한 겉 옷깃: 그로구 특유의 포근하고 두꺼운 베이지색 카라 베이스 */}
        <path d="M 72 70 C 72 70, 100 64, 128 70 C 132 82, 68 82, 72 70 Z" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="0.5" />
        {/* 🟢 로브 안쪽 음영 옷깃: 목 바로 아래쪽에 깊이감을 주는 조금 더 어두운 회베이지색 포인트 */}
        <path
          d="M 76 68 C 76 68, 100 64.5, 124 68 C 124 74, 76 74, 76 68 Z" 
          fill="#d6d3d1"
        />
      </svg>
    </div>
  )
}
