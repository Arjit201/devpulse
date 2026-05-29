import {cn} from '@/lib/utils'

const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    outline:'border border-brand-300 text-brand-700 hover:bg-brand-50',
}
const sizes = {
    sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
    md: 'h-9 px-4 text-sm rounded-lg gap-2',
    lg: 'h-11 px-5 text-base rounded-lg gap-2',
    icon: 'h-9 w-9 rounded-lg',
}

export function Button({variant='primary',size='md',className,disabled,children,...props}){
    return(
        <button className={cn('inline-flex items-center justify-center font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            'disabled:pointer-events-none disabled:opacity-50',
            variants[variant],
            sizes[size],
            className
        )}
        disabled={disabled}
        {...props}>
            {children}
        </button>
    )
}