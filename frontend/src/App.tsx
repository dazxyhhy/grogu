import { useState, useEffect, useRef } from "react"
import GroguIcon from "./GroguIcon"

function App() {
  const [time, setTime] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [targetMinutes, setTargetMinutes] = useState<number>(10)
  const timerRef = useRef<number | null>(null)

  const targetTimeMs = targetMinutes * 60 * 1000

  // 1. 켜질 때 로컬스토리지에서 이전 상태 복구
  useEffect(() => {
    const savedTime = localStorage.getItem("stopwatch_time")
    const savedTarget = localStorage.getItem("stopwatch_targetMinutes")
    const savedIsRunning = localStorage.getItem("stopwatch_isRunning")
    const savedIsCompleted = localStorage.getItem("stopwatch_isCompleted")

    if (savedTime) setTime(parseInt(savedTime, 10))
    if (savedTarget) setTargetMinutes(parseInt(savedTarget, 10))
    if (savedIsCompleted === "true") setIsCompleted(true)
    if (savedIsRunning === "true" && savedIsCompleted !== "true") setIsRunning(true)
  }, [])

  // 2. 타이머 핵심 로직
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          const nextTime = prevTime + 10

          // 🎉 목표 시간 도달 완료 시점 발생
          if (nextTime >= targetTimeMs) {
            setIsRunning(false)
            setIsCompleted(true) // 완료 상태로 전환
            localStorage.setItem("stopwatch_time", targetTimeMs.toString())
            localStorage.setItem("stopwatch_isCompleted", "true")
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

  // ⟲ 초기화 및 리셋 핸들러
  const handleReset = () => {
    setIsRunning(false)
    setIsCompleted(false)
    setTime(0)
    localStorage.removeItem("stopwatch_time")
    localStorage.removeItem("stopwatch_isRunning")
    localStorage.removeItem("stopwatch_isCompleted")
  }

  // 🎯 목표 시간 조절 핸들러 (시작 후엔 차단됨)
  const adjustTarget = (amount: number) => {
    if (isRunning || time > 0) return // 이미 시작했거나 흐른 시간이 있다면 수정 불가
    setTargetMinutes((prev) => {
      const next = prev + amount
      return next > 0 ? next : 1
    })
  }

  // ⚔️ 광선검 진척도 퍼센트 계산
  const progressPercent = Math.min((time / targetTimeMs) * 100, 100)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-stone-100 font-sans antialiased overflow-hidden relative">
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

        {/* 그로구 캐릭터 패널 */}
        <div className="relative z-20 -mb-1">
          <GroguIcon isRunning={isRunning} />
        </div>

        {/* 🔄 조건부 렌더링 파트 🔄 */}
        {!isCompleted ? (
          <>
            {/* [1] 미완료 상태: 타이머 디스플레이 */}
            <div className="w-full bg-slate-950/80 border border-stone-800 rounded-2xl py-6 px-4 text-center shadow-inner relative z-10 -mt-21">
              <div className="absolute top-0 left-4 w-4 h-px bg-emerald-400/40" />
              <div className="absolute bottom-0 right-4 w-4 h-px bg-emerald-400/40" />
              <h1 className="pt-2 text-5xl font-mono font-bold tracking-normal text-emerald-400 tabular-nums drop-shadow-[0_0_12px_rgba(52,211,153,0.3)] md:text-6xl">{formatTime(time)}</h1>
            </div>

            {/* 미니멀 시간 세팅 UI (타이머가 0일 때만 조작 가능, 시작하면 비활성화 및 투명화) */}
            <div className="w-full mt-6 flex justify-center items-center font-mono select-none">
              <div className="flex items-center gap-4 text-stone-500">
                <button
                  disabled={isRunning || time > 0}
                  onClick={() => adjustTarget(-1)}
                  className="text-stone-600 hover:text-emerald-400 disabled:opacity-0 disabled:pointer-events-none transition-all font-bold text-lg px-2 active:scale-90"
                >
                  ◀
                </button>

                <div className={`flex items-center gap-2 transition-all ${isRunning || time > 0 ? "opacity-20" : ""}`}>
                  <span className="text-[11px] tracking-[0.2em] uppercase font-medium">Target</span>
                  <span className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] tabular-nums">{targetMinutes.toString().padStart(2, "0")}</span>
                  <span className="text-xs font-bold text-stone-400">MINS</span>
                </div>

                <button
                  disabled={isRunning || time > 0}
                  onClick={() => adjustTarget(1)}
                  className="text-stone-600 hover:text-emerald-400 disabled:opacity-0 disabled:pointer-events-none transition-all font-bold text-lg px-2 active:scale-90"
                >
                  ▶
                </button>
              </div>
            </div>
          </>
        ) : (
          /* [2] 🎉 완료 상태: 타이머와 설정창을 없애고 웅장한 완료 메시지 띄움 */
          <div className="w-full bg-slate-950/90 border border-emerald-500/30 rounded-2xl py-8 px-4 text-center shadow-[0_0_20px_rgba(16,185,129,0.1)] relative z-10 -mt-21 animate-fade-in">
            <span className="text-xs font-mono tracking-[0.4em] text-emerald-500 uppercase font-bold block mb-2 animate-bounce">MISSION SUCCESS</span>
            <h2 className="text-2xl font-mono font-bold text-stone-100 tracking-wide">포스가 함께 하길!</h2>
            <p className="text-xs font-mono text-stone-500 mt-2">설정한 {targetMinutes}분의 집중을 성공적으로 마쳤습니다.</p>
          </div>
        )}

        {/* ⚔️ 광선검 게이지 (완료되면 100% 꽉 찬 상태로 유지) */}
        <div className="w-full mt-6 px-2 flex items-center">
          {/* 광선검 손잡이 (Hilt) */}
          <div className="w-6 h-3 bg-gradient-to-b from-stone-400 via-stone-600 to-stone-800 rounded-l border-r border-stone-900 shadow relative">
            <div className="w-1 h-1 rounded-full bg-emerald-500 absolute -bottom-0.5 right-1 scale-70" />
          </div>

          {/* 광선검 날 튜브 */}
          <div className="flex-1 h-2 bg-stone-900/90 rounded-r border border-stone-800 p-0.5 overflow-hidden flex items-center shadow-inner">
            {/* 실시간 플라즈마 에너지 (0% -> 100%) */}
            <div
              style={{ width: `${progressPercent}%` }}
              className={`h-full rounded-r transition-all duration-75 ${
                isRunning
                  ? "bg-emerald-300 shadow-[0_0_12px_#00ff00,0_0_24px_#008000,0_0_35px_rgba(0,255,0,0.6)] animate-pulse"
                  : isCompleted
                    ? "bg-emerald-400 shadow-[0_0_15px_#00ff00] animate-pulse" // 완료 시 축하 메시지와 함께 영롱하게 반짝임
                    : progressPercent > 0
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(0,255,0,0.4)]"
                      : ""
              }`}
            />
          </div>
        </div>
        <p className="mt-8 mb-4 text-xl font-mono text-stone-400 tracking-wide text-center">This is the way.</p>

        {/* 하단 제어 버튼 분기 세트 */}
        <div className="mt-6 flex gap-4 w-full">
          {!isCompleted ? (
            <>
              {/* 평소 상태의 버튼 구조 */}
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
            </>
          ) : (
            /* 🎉 완료 상태일 때 등장하는 단독 '새로 설정하기' 버튼 */
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-xl font-mono text-sm font-bold tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950/40 border border-emerald-400/20 transition-all duration-200 active:scale-98"
            >
              ⟲ NEW TARGET
            </button>
          )}
        </div>
      </div>

      <span className="absolute bottom-4 right-6 text-[10px] font-mono text-stone-600 tracking-wider">EST. 2026 / GROGU LAB</span>
    </div>
  )
}

export default App
