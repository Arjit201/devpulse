import {clsx} from 'clsx'
import {twMerger} from 'tailwind-merge'

export function cn(...inputs){
    return twMerger(clsx(inputs))
}