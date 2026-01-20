import { CircleIcon, ScanLineIcon, SquareIcon, TriangleIcon } from 'lucide-react'
import { useState , useEffect} from 'react'

const steps = [
    { icon: ScanLineIcon, label: "Analyzing your request..." },
    { icon: SquareIcon, label: "Generating layout structure..." },
    { icon: TriangleIcon, label: "Assembling UI components..." },
    { icon: CircleIcon, label: "Finalizing your website..." }
]

const STEP_DURATION = 45000

export function LoaderSteps() {
    const [current, setCurrent] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % steps.length)
        }, STEP_DURATION / steps.length)
        return () => clearInterval(interval)
    }, [])
    const Icon = steps[current]?.icon
    return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden text-white">
        <div className="absolute inset-0 blur-3xl animate-pulse" style={{ background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(217, 70, 239, 0.1))' }}></div>
        <div className="relative z-10 w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-30"/>
            <div className="absolute inset-4 rounded-full border border-purple-400/20"/>
            <Icon className="w-8 h-8 text-white opacity-80 animate-bounce"/>
        </div>
        <p key={current} className="mt-4 text-lg font-light text-white/90 tracking-wide transition-all duration-700 ease-in-out opacity-100">{steps[current]?.label}</p>
        <p className="text-xs text-gray-400 mt-2 transition-opacity duration-700 opacity-100">This may take around 2-3 minutes...</p>
    </div>
    )
}