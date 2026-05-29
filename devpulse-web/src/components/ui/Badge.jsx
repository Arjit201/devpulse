import {cn} from '@/lib/utils'
import {STAGE_CONFIG} from '@/lib/stages'

export function StageBadge({stage,className}){
    const cfg = STAGE_CONFIG[stage]
    if(!cfg)return null
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border',cfg.color,className)}>
            <span className={cn('w-1.5 h-1.5 rounded-full',cfg.dot)}/>
            {cfg.label}
        </span>
    )
}

export function Badge({variant = 'default',className,children}){
    const variants = {
        default:'bg-slate-100 text-slate-700 border-slate-200',
        green:'bg-emerald-100 text-emerald-700 border-emerald-200',
        blue:'bg-blue-100 text-blue-700 border-blue-200',
        amber:'bg-amber-100 text-amber-700 border-amber-200',
        red:'bg-red-100 text-red-700 border-red-200',
        violet:'bg-violet-100 text-violet-700 border-violet-200',
    }
    return (
        <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',variants[variant],className)}>
            {children}
        </span>
    )
}