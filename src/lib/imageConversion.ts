/* src/lib/imageConversion.ts */

const PDF_SAFE_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
]

const CONVERTIBLE_IMAGE_TYPES = [
    'image/webp',
    'image/heic',
    'image/heif',
]

function getExtensionlessName(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, '')
}

function isHeicLike(file: File) {
    const name = file.name.toLowerCase()

    return (
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        name.endsWith('.heic') ||
        name.endsWith('.heif')
    )
}

function isWebp(file: File) {
    return (
        file.type === 'image/webp' ||
        file.name.toLowerCase().endsWith('.webp')
    )
}

function isPdfSafeImage(file: File) {
    return PDF_SAFE_IMAGE_TYPES.includes(file.type)
}

function blobToFile(blob: Blob, fileName: string) {
    return new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
    })
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob)
        const image = new Image()

        image.onload = () => {
            URL.revokeObjectURL(url)
            resolve(image)
        }

        image.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Could not decode image.'))
        }

        image.src = url
    })
}

async function convertBrowserReadableImageToPng(file: File): Promise<File> {
    const image = await loadImageFromBlob(file)

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
        throw new Error('Canvas is not available.')
    }

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    context.drawImage(image, 0, 0)

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Could not convert image to PNG.'))
                return
            }

            resolve(blob)
        }, 'image/png')
    })

    return blobToFile(
        pngBlob,
        `${getExtensionlessName(file.name)}.png`,
    )
}

async function convertHeicToPng(file: File): Promise<File> {
    const heic2anyModule = await import('heic2any')
    const heic2any = heic2anyModule.default

    const result = await heic2any({
        blob: file,
        toType: 'image/png',
        quality: 0.92,
    })

    const pngBlob = Array.isArray(result)
        ? result[0]
        : result

    return blobToFile(
        pngBlob,
        `${getExtensionlessName(file.name)}.png`,
    )
}

export async function convertUploadImageToPdfSafeFile(file: File): Promise<File> {
    if (isPdfSafeImage(file)) {
        return file
    }

    if (isHeicLike(file)) {
        return convertHeicToPng(file)
    }

    if (isWebp(file) || CONVERTIBLE_IMAGE_TYPES.includes(file.type)) {
        return convertBrowserReadableImageToPng(file)
    }

    return file
}