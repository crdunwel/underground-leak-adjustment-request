/* src/lib/draftStorage.ts */

import { sampleLeakFormData } from '../data/leakFormData'
import type {
    LeakFormData,
    PacketFile,
    PacketPhoto,
} from '../types/leakForm'

export type StoredAppState = {
    hasStarted: boolean
    currentStepIndex: number
    formData: LeakFormData
    signatureDataUrl: string
}

export type StoredUploadState = {
    photos: PacketPhoto[]
    invoiceFiles: PacketFile[]
    supportingFiles: PacketFile[]
}

const STORAGE_KEY = 'undergroundLeakAdjustmentDraft'

const UPLOAD_DB_NAME = 'undergroundLeakAdjustmentDraftUploads'
const UPLOAD_DB_VERSION = 1
const UPLOAD_STORE_NAME = 'draftUploads'
const UPLOAD_STATE_KEY = 'currentUploadState'

const EMPTY_UPLOAD_STATE: StoredUploadState = {
    photos: [],
    invoiceFiles: [],
    supportingFiles: [],
}

// =========================================================
// ▶ Form draft storage: localStorage
// =========================================================

export function loadDraft(maxStepIndex: number): StoredAppState | null {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)

        if (!stored) return null

        const parsed = JSON.parse(stored) as Partial<StoredAppState>

        return {
            hasStarted: parsed.hasStarted ?? false,
            currentStepIndex:
                typeof parsed.currentStepIndex === 'number'
                    ? Math.min(Math.max(parsed.currentStepIndex, 0), maxStepIndex)
                    : 0,
            formData: {
                ...sampleLeakFormData,
                ...parsed.formData,
            },
            signatureDataUrl: parsed.signatureDataUrl ?? '',
        }
    } catch (error) {
        console.warn('Could not load saved draft.', error)
        return null
    }
}

export function saveDraft(state: StoredAppState) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearDraft() {
    window.localStorage.removeItem(STORAGE_KEY)
}

// =========================================================
// ▶ Upload draft storage: IndexedDB
// =========================================================

function openUploadDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(
            UPLOAD_DB_NAME,
            UPLOAD_DB_VERSION,
        )

        request.onupgradeneeded = () => {
            const database = request.result

            if (!database.objectStoreNames.contains(UPLOAD_STORE_NAME)) {
                database.createObjectStore(UPLOAD_STORE_NAME)
            }
        }

        request.onsuccess = () => {
            resolve(request.result)
        }

        request.onerror = () => {
            reject(request.error)
        }
    })
}

export async function loadDraftUploads(): Promise<StoredUploadState> {
    try {
        const database = await openUploadDatabase()

        return await new Promise((resolve, reject) => {
            const transaction = database.transaction(
                UPLOAD_STORE_NAME,
                'readonly',
            )

            const store = transaction.objectStore(UPLOAD_STORE_NAME)
            const request = store.get(UPLOAD_STATE_KEY)

            request.onsuccess = () => {
                resolve({
                    ...EMPTY_UPLOAD_STATE,
                    ...(request.result as Partial<StoredUploadState> | undefined),
                })
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    } catch (error) {
        console.warn('Could not load saved uploads.', error)
        return EMPTY_UPLOAD_STATE
    }
}

export async function saveDraftUploads(
    uploadState: StoredUploadState,
): Promise<void> {
    try {
        const database = await openUploadDatabase()

        await new Promise<void>((resolve, reject) => {
            const transaction = database.transaction(
                UPLOAD_STORE_NAME,
                'readwrite',
            )

            const store = transaction.objectStore(UPLOAD_STORE_NAME)

            const request = store.put(
                {
                    photos: uploadState.photos,
                    invoiceFiles: uploadState.invoiceFiles,
                    supportingFiles: uploadState.supportingFiles,
                },
                UPLOAD_STATE_KEY,
            )

            request.onsuccess = () => {
                resolve()
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    } catch (error) {
        console.warn('Could not save uploaded files.', error)
    }
}

export async function clearDraftUploads(): Promise<void> {
    try {
        const database = await openUploadDatabase()

        await new Promise<void>((resolve, reject) => {
            const transaction = database.transaction(
                UPLOAD_STORE_NAME,
                'readwrite',
            )

            const store = transaction.objectStore(UPLOAD_STORE_NAME)
            const request = store.delete(UPLOAD_STATE_KEY)

            request.onsuccess = () => {
                resolve()
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    } catch (error) {
        console.warn('Could not clear saved uploads.', error)
    }
}