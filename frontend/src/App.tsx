import { useState, useEffect, useRef } from "react"
import GroguIcon from "./GroguIcon"

function App() {
  const [time, setTime] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const timerRef = useRef<number | null>(null)

  // 💣 폭탄 시간 세팅 상태 (분 단위, 기본값: 10분)
  const [targetMinutes, setTargetMinutes] = useState<number>(10)

  // 목표 시간(ms) 총량 계산
  const targetTimeMs = targetMinutes * 60 * 1000

  // 1. 켜질 때 로컬스토리지에서 이전 시간/상태 복구
  useEffect(() => {
    const savedTime = localStorage.getItem("stopwatch_time")
    const savedTarget = localStorage.getItem("stopwatch_targetMinutes")
    const savedIsRunning = localStorage.getItem("stopwatch_isRunning")

    if (savedTime) setTime(parseInt(savedTime, 10))
    if (savedTarget) setTargetMinutes(parseInt(savedTarget, 10))
    if (savedIsRunning === "true") setIsRunning(true)
  }, [])

  // 2. 타이머 핵심 로직 및 로컬스토리지 동기화 (목표 시간 도달 로직 포함)
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          const nextTime = prevTime + 10

          // 🔥 폭탄 해제 실패: 목표 시간 도달 시 자동 정지 및 시간 고정
          if (nextTime >= targetTimeMs) {
            setIsRunning(false)
            localStorage.setItem("stopwatch_time", targetTimeMs.toString())
            return targetTimeMs
          }

          localStorage.setItem("stopwatch_time", nextTime.toString())
          return nextTime
        })
      }, 10)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    localStorage.setItem("stopwatch_isRunning", isRunning.toString())
    localStorage.setItem("stopwatch_targetMinutes", targetMinutes.toString())

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, targetTimeMs])

  // 3. 시간 포맷팅 함수 (분:초:밀리초)
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    localStorage.removeItem("stopwatch_time")
    localStorage.removeItem("stopwatch_isRunning")
  }

  // 💣 폭탄 시간 세팅 드럼 조절 함수 (증감)
  const adjustTarget = (amount: number) => {
    setTargetMinutes((prev) => {
      const next = prev + amount
      return next > 0 ? next : 1 // 최소 1분 고정
    })
  }

  // ⚔️ 광선검 진척도 퍼센트 계산
  const progressPercent = Math.min((time / targetTimeMs) * 100, 100)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-stone-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 overflow-hidden relative">
      {/* 배경 오로라 이펙트: 그로구 포스(Force) 그라데이션 원 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 전체 컨트롤 대시보드 컨테이너 */}
      <div className="relative z-10 flex flex-col items-center border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl shadow-emerald-950/20 max-w-md w-full mx-4">
        {/* 상단 뱃지 라인 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-s font-mono tracking-[0.3em] text-emerald-400 uppercase font-semibold">Grogu Study</span>
        </div>

        {/* 그로구를 타이머보다 위에 띄우고 하단 여백을 대폭 줄임 */}
        <div className="relative z-20 -mb-1">
          <GroguIcon isRunning={isRunning} />
        </div>

        {/* 음수 마진(-mt-7)을 주어 타이머 패널을 그로구 밑으로 슬쩍 겹치게 밀어 올림 */}
        <div className="w-full bg-slate-950/80 border border-stone-800 rounded-2xl pt-6 pb-5 px-4 text-center shadow-inner relative group z-10 -mt-21">
          {/* 모서리 SF 데코 라인 */}
          <div className="absolute top-0 left-4 w-4 h-px bg-emerald-400/40" />
          <div className="absolute bottom-0 right-4 w-4 h-px bg-emerald-400/40" />
          <h1 className="pt-2 text-5xl font-mono font-bold tracking-normal text-emerald-400 tabular-nums drop-shadow-[0_0_12px_rgba(52,211,153,0.3)] md:text-6xl">{formatTime(time)}</h1>
        </div>

        {/* 🎯 컨테이너 없이 텍스트만으로 녹여낸 미니멀 시간 세팅 UI */}
        <div className="w-full mt-6 flex justify-center items-center font-mono select-none">
          <div className="flex items-center gap-4 text-stone-500">
            {/* 다운 버튼: 컨테이너 없이 글자만 슥 노출 */}
            <button
              disabled={isRunning}
              onClick={() => adjustTarget(-1)}
              className="text-stone-600 hover:text-emerald-400 disabled:opacity-20 disabled:pointer-events-none transition-colors font-bold text-lg px-2 active:scale-90"
            >
              ◀
            </button>

            {/* 중앙 텍스트 정보 라인 */}
            <div className={`flex items-center gap-2 transition-opacity ${isRunning ? "opacity-30" : ""}`}>
              <span className="text-[11px] tracking-[0.2em] uppercase font-medium">Target</span>
              <span className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] tabular-nums">{targetMinutes.toString().padStart(2, "0")}</span>
              <span className="text-xs font-bold text-stone-400">MINS</span>
            </div>

            {/* 업 버튼: 컨테이너 없이 글자만 슥 노출 */}
            <button
              disabled={isRunning}
              onClick={() => adjustTarget(1)}
              className="text-stone-600 hover:text-emerald-400 disabled:opacity-20 disabled:pointer-events-none transition-colors font-bold text-lg px-2 active:scale-90"
            >
              ▶
            </button>
          </div>
        </div>

        {/* ⚔️ 핵심: 다시 돌아온 포스 광선검 게이지 ⚔️ */}
        <div className="w-full mt-6 px-2 flex items-center">
          {/* 광선검 손잡이 (Hilt) */}
          <div className="w-6 h-3 bg-gradient-to-b from-stone-400 via-stone-600 to-stone-800 rounded-l border-r border-stone-900 shadow relative">
            <div className="w-1 h-1 rounded-full bg-emerald-500 absolute -bottom-0.5 right-1 scale-70" /> {/* 작동 스위치 */}
          </div>

          {/* 광선검 날 튜브 */}
          <div className="flex-1 h-2 bg-stone-900/90 rounded-r border border-stone-800 p-0.5 overflow-hidden flex items-center shadow-inner">
            {/* 실시간 플라즈마 에너지 (0% -> 100%) */}
            <div
              style={{ width: `${progressPercent}%` }}
              className={`h-full rounded-r transition-all duration-75 ${
                isRunning
                  ? "bg-emerald-300 shadow-[0_0_12px_#00ff00,0_0_24px_#008000,0_0_35px_rgba(0,255,0,0.6)] " // 🟢 가동 중: 알맹이까지 쨍한 루크 쌤 그린!
                  : progressPercent > 0
                    ? "bg-emerald-400 shadow-[0_0_6px_rgba(0,255,0,0.4)]" // 🟢 멈춤: 은은하게 가라앉은 초록색 잔광
                    : ""
              }`}
            />
          </div>
        </div>
        <p className="mt-8 mb-4 text-xl font-mono text-stone-400 tracking-wide text-center">This is the way.</p>

        {/* 제어 버튼 세트 (그로구 로브 색상 계열 적용) */}
        <div className="mt-6 flex gap-4 w-full">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-3.5 rounded-xl font-mono text-sm font-bold tracking-widest transition-all duration-200 active:scale-98 shadow-md border ${
              isRunning
                ? "bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-700 shadow-amber-900/20"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-600 shadow-emerald-900/20"
            }`}
          >
            {isRunning ? "┃┃ PAUSE" : "▶ DEFUSE"}
          </button>

          <button
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-xl font-mono text-sm font-bold tracking-widest bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-all duration-200 active:scale-98 shadow-md"
          >
            ⟲ RESET
          </button>
        </div>
      </div>

      {/* 우측 하단 소심한 UI 데코 */}
      <span className="absolute bottom-4 right-6 text-[10px] font-mono text-stone-600 tracking-wider">EST. 2026 / GROGU LAB</span>
    </div>
  )
}

export default App
