/* src/lib/fileHelpers.ts */

import { convertUploadImageToPdfSafeFile } from './imageConversion'
import type { PacketFile } from '../types/leakForm'

export async function createPacketFile(file: File): Promise<PacketFile> {
    const safeFile = file.type.startsWith('image/')
        ? await convertUploadImageToPdfSafeFile(file)
        : file

    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve({
                id: crypto.randomUUID(),
                name: safeFile.name,
                type: safeFile.type || 'application/octet-stream',
                size: safeFile.size,
                dataUrl: String(reader.result ?? ''),
                description: '',
            })
        }

        reader.onerror = () => {
            reject(new Error(`Could not read ${safeFile.name}`))
        }

        reader.readAsDataURL(safeFile)
    })
}

export function formatFileSize(size: number) {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`

    return `${(size / 1024 / 1024).toFixed(1)} MB`
}