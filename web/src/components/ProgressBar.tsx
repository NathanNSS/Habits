interface ProgressBarProps {
    progress: number
}

export function ProgressBar({progress}: ProgressBarProps) {
    return (
        <div className='h-3 rounded-xl bg-zinc-700 w-full mt-4 transition-all '>
            <div
                role="progressbar"
                aria-label="Progresso de hábitos completados nesse dia"
                aria-valuenow={progress}
                className="h-3 rounded-xl bg-violet-600 duration-300"
                style={{
                    width: `${progress}%`
                }}
            />
        </div>
    )
}