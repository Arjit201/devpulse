import {cn} from '@/lib/utils'

export function Input({className,...props}){
    return (
        <input className={cn(
            'flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm',
            'placeholder:text-slate-400 transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-400',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        {...props}
        />
    )
}
export function FormField({label,error,children,className}){
    return(
        <div className={cn('flex flex-col gap-1.5',className)}>
            {label && (
                <label className="text-sm font-medium text-slate-700">{label}</label>
            )}
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    )
}