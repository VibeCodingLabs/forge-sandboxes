import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMiB(mib: number): string {
  return mib >= 1024 ? `${(mib / 1024).toFixed(1)} GiB` : `${mib} MiB`
}
