import {cn} from '@/lib/utils'

export function Card({className,children,...props}){
    return (
        <div className={cn(
            'bg-white rounded-xl border border-slate-200 shadow-sm',className
        ,{...props})}>
            {children}
        </div>
    )
}
export function CardHeader({className,children}){
    return (
        <div className={cn('px-5 py-4 border-b border-slate-200',className)}>
            {children}
        </div>
    )
}
export function CardContent({className,children}){
    return(
        <div className={cn('px-5 py-4',className)}>
            {children}
        </div>
    )
}