// src/MandoIcon.tsx
export default function MandoIcon() {
  return (
    <div className="w-80 h-48 mb-4 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" className="w-full h-full">
        {/* 1. 은빛 베스카 메탈 그라데이션 정의 */}
        <defs>
          <linearGradient id="beskarSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" /> {/* slate-300 */}
            <stop offset="50%" stopColor="#94a3b8" /> {/* slate-400 */}
            <stop offset="100%" stopColor="#64748b" /> {/* slate-500 */}
          </linearGradient>
          <linearGradient id="beskarDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* 2. 만달로리안 어깨/목 갑옷 라인 */}
        <path d="M 65 95 C 65 95, 100 85, 135 95 L 145 115 L 55 115 Z" fill="url(#beskarDark)" />
        <path d="M 80 92 L 100 87 L 120 92 L 115 105 L 85 105 Z" fill="#334155" />

        {/* 3. 투구 전체 외곽 (베스카 실버) */}
        <path d="M 70 35 C 70 20, 130 20, 130 35 L 130 80 C 130 88, 122 92, 115 92 L 85 92 C 78 92, 70 88, 70 80 Z" fill="url(#beskarSilver)" />

        {/* 4. 투구 이마 위쪽 중심 칼날 주름 (Mando 특유의 이마 라인) */}
        <path d="M 98 22 L 102 22 L 101 45 L 99 45 Z" fill="#f1f5f9" opacity="0.4" />

        {/* 5. 뺨 안쪽 음영 굴곡 파트 (좌우 깎인 각도) */}
        <path d="M 70 60 L 82 65 L 82 82 L 72 80 Z" fill="#475569" opacity="0.7" />
        <path d="M 130 60 L 118 65 L 118 82 L 128 80 Z" fill="#334155" opacity="0.7" />

        {/* 6. ★핵심★ 상징적인 T자형 검은색 바이저 (눈 & 코 라인) */}
        {/* 가로 눈 스캔 라인 */}
        <path d="M 76 48 L 124 48 L 124 54 L 76 54 Z" fill="#0f172a" />
        {/* 세로 코 중심 라인 */}
        <path d="M 96 54 L 104 54 L 103 84 L 97 84 Z" fill="#0f172a" />

        {/* 7. 투구 아래턱 테두리 음영 마감 */}
        <path d="M 85 92 L 100 84 L 115 92" stroke="#475569" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}
