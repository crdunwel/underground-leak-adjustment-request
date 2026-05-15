/* src/lib/generateLeakAdjustmentPdf.ts */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

import { assetPath } from './assetPath'
import {
    formatDateForPdf,
    joinCityStateZip,
    makeSafeFilenamePart,
} from './formatters'
import type {
    LeakFormData,
    PacketFile,
    PacketPhoto,
} from '../types/leakForm'

type GenerateLeakAdjustmentPdfArgs = {
    formData: LeakFormData
    signatureDataUrl: string
    photos?: PacketPhoto[]
    invoiceFiles?: PacketFile[]
    supportingFiles?: PacketFile[]
}

type PageIndex = 0 | 1

type TextPosition = {
    page: PageIndex
    x: number
    y: number
    size: number
    maxWidth?: number
    maxLines?: number
}

type SignaturePosition = {
    page: PageIndex
    x: number
    y: number
    maxWidth: number
    maxHeight: number
}

const DEBUG_COORDINATES = false

const PACKET_HELPER_NAME = 'Underground Leak Packet Helper'
const PACKET_HELPER_URL =
    'https://crdunwel.github.io/underground-leak-adjustment-request'

const TEXT_POSITIONS = {
    page1Date: { page: 0, x: 390, y: 183, size: 10, maxWidth: 95 },
    page1Name: { page: 0, x: 70, y: 115, size: 10, maxWidth: 180 },
    page1Account: { page: 0, x: 390, y: 115, size: 10, maxWidth: 120 },

    nameOnAccount: { page: 1, x: 152, y: 652, size: 10, maxWidth: 210 },
    accountNumber: { page: 1, x: 450, y: 652, size: 10, maxWidth: 115 },
    mailingAddress: { page: 1, x: 152, y: 622, size: 10, maxWidth: 210 },

    homePhone: { page: 1, x: 450, y: 632, size: 10, maxWidth: 110 },
    cellPhone: { page: 1, x: 450, y: 605, size: 10, maxWidth: 110 },

    mailingCityStateZip: { page: 1, x: 152, y: 575, size: 10, maxWidth: 210 },
    businessPhone: { page: 1, x: 450, y: 575, size: 10, maxWidth: 110 },

    serviceAddress: { page: 1, x: 152, y: 535, size: 10, maxWidth: 250 },
    email: { page: 1, x: 450, y: 555, size: 9, maxWidth: 145 },

    repairsCompletedBy: { page: 1, x: 152, y: 487, size: 10, maxWidth: 205 },
    dateOfRepair: { page: 1, x: 460, y: 487, size: 10, maxWidth: 95 },
    plumberLicenseNumber: { page: 1, x: 152, y: 455, size: 10, maxWidth: 170 },

    repairDescription: {
        page: 1,
        x: 45,
        y: 400,
        size: 10,
        maxWidth: 540,
        maxLines: 20,
    },

    page2FirstSignatureDate: { page: 1, x: 475, y: 182, size: 10, maxWidth: 80 },
    page2LifetimeSignatureDate: { page: 1, x: 475, y: 103, size: 10, maxWidth: 80 },
} satisfies Record<string, TextPosition>

const CHECK_POSITIONS = {
    page1CompletedForm: { page: 0, x: 76, y: 460 },
    page1Invoice: { page: 0, x: 76, y: 437 },
    page1Pictures: { page: 0, x: 76, y: 342 },
    page1RepairsFinal: { page: 0, x: 76, y: 257 },

    stateLicense: { page: 1, x: 450, y: 467 },
    miamiDadeLicense: { page: 1, x: 450, y: 452 },
} satisfies Record<string, { page: PageIndex; x: number; y: number }>

const SIGNATURE_POSITIONS = {
    page1CustomerSignature: {
        page: 0,
        x: 75,
        y: 175,
        maxWidth: 220,
        maxHeight: 25,
    },

    page2CustomerSignature: {
        page: 1,
        x: 150,
        y: 160,
        maxWidth: 220,
        maxHeight: 30,
    },

    page2LifetimeSignature: {
        page: 1,
        x: 150,
        y: 80,
        maxWidth: 220,
        maxHeight: 30,
    },
} satisfies Record<string, SignaturePosition>

function dataUrlToUint8Array(dataUrl: string) {
    const base64 = dataUrl.split(',')[1]

    if (!base64) {
        throw new Error('Invalid data URL.')
    }

    const binary = window.atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index)
    }

    return bytes
}

function isPdfFile(file: PacketFile) {
    return (
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
    )
}

function isJpegFile(file: PacketFile) {
    return (
        file.type === 'image/jpeg' ||
        file.name.toLowerCase().endsWith('.jpg') ||
        file.name.toLowerCase().endsWith('.jpeg') ||
        file.dataUrl.startsWith('data:image/jpeg')
    )
}

function isPngFile(file: PacketFile) {
    return (
        file.type === 'image/png' ||
        file.name.toLowerCase().endsWith('.png') ||
        file.dataUrl.startsWith('data:image/png')
    )
}

function isEmbeddableImageFile(file: PacketFile) {
    return isJpegFile(file) || isPngFile(file)
}

function wrapText(
    text: string,
    maxWidth: number,
    size: number,
    font: Awaited<ReturnType<PDFDocument['embedFont']>>,
) {
    const safeText = text.trim()

    if (!safeText) return []

    const words = safeText.split(/\s+/)
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
        const nextLine = currentLine ? `${currentLine} ${word}` : word
        const width = font.widthOfTextAtSize(nextLine, size)

        if (width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
        } else {
            currentLine = nextLine
        }
    }

    if (currentLine) lines.push(currentLine)

    return lines
}

export async function generateLeakAdjustmentPdf({
                                                    formData,
                                                    signatureDataUrl,
                                                    photos = [],
                                                    invoiceFiles = [],
                                                    supportingFiles = [],
                                                }: GenerateLeakAdjustmentPdfArgs) {
    if (!signatureDataUrl) {
        throw new Error('Signature is required.')
    }

    const pdfUrl = assetPath('underground-leak-adjustment-request.pdf')
    const pdfBytes = await fetch(pdfUrl).then((response) => {
        if (!response.ok) {
            throw new Error('Could not load underground-leak-adjustment-request.pdf')
        }

        return response.arrayBuffer()
    })

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()

    if (pages.length < 2) {
        throw new Error('Expected a 2-page underground leak adjustment PDF.')
    }

    const firstPage = pages[0]
    const secondPage = pages[1]

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const textColor = rgb(0.05, 0.08, 0.16)
    const mutedColor = rgb(0.35, 0.4, 0.5)
    const lineColor = rgb(0.82, 0.86, 0.92)
    const checkColor = rgb(0, 0, 0)
    const debugColor = rgb(1, 0, 0)

    const today = formatDateForPdf(new Date().toISOString().slice(0, 10))

    const mailingCityStateZip = joinCityStateZip(
        formData.mailingCity,
        formData.mailingState,
        formData.mailingZip,
    )

    const serviceCityStateZip = joinCityStateZip(
        formData.serviceCity,
        formData.serviceState,
        formData.serviceZip,
    )

    const serviceFullAddress = [formData.serviceAddress, serviceCityStateZip]
        .filter(Boolean)
        .join(', ')

    function getPage(pageIndex: PageIndex) {
        return pageIndex === 0 ? firstPage : secondPage
    }

    function drawDebugMarker(position: TextPosition | SignaturePosition) {
        if (!DEBUG_COORDINATES) return

        const page = getPage(position.page)

        page.drawLine({
            start: { x: position.x - 5, y: position.y },
            end: { x: position.x + 5, y: position.y },
            thickness: 0.5,
            color: debugColor,
        })

        page.drawLine({
            start: { x: position.x, y: position.y - 5 },
            end: { x: position.x, y: position.y + 5 },
            thickness: 0.5,
            color: debugColor,
        })
    }

    function drawText(position: TextPosition, text: string) {
        const page = getPage(position.page)
        const safeText = text.trim()

        drawDebugMarker(position)

        if (!safeText) return

        if (!position.maxWidth) {
            page.drawText(safeText, {
                x: position.x,
                y: position.y,
                size: position.size,
                font,
                color: textColor,
            })

            return
        }

        const lines = wrapText(
            safeText,
            position.maxWidth,
            position.size,
            font,
        )

        lines.slice(0, position.maxLines ?? 1).forEach((line, index) => {
            page.drawText(line, {
                x: position.x,
                y: position.y - index * (position.size + 3),
                size: position.size,
                font,
                color: textColor,
            })
        })
    }

    function drawCheck(position: { page: PageIndex; x: number; y: number }) {
        const page = getPage(position.page)

        page.drawText('X', {
            x: position.x,
            y: position.y,
            size: 9,
            font: boldFont,
            color: checkColor,
        })
    }

    async function drawSignature(position: SignaturePosition) {
        const page = getPage(position.page)

        drawDebugMarker(position)

        const signatureImage = await pdfDoc.embedPng(signatureDataUrl)
        const originalSize = signatureImage.scale(1)

        const scale = Math.min(
            position.maxWidth / originalSize.width,
            position.maxHeight / originalSize.height,
        )

        const finalWidth = originalSize.width * scale
        const finalHeight = originalSize.height * scale

        page.drawImage(signatureImage, {
            x: position.x,
            y: position.y + (position.maxHeight - finalHeight) / 2,
            width: finalWidth,
            height: finalHeight,
        })
    }

    function drawPacketHeader(
        page: ReturnType<PDFDocument['addPage']>,
        title: string,
        subtitle?: string,
    ) {
        const { width, height } = page.getSize()

        page.drawText(title, {
            x: 42,
            y: height - 52,
            size: 18,
            font: boldFont,
            color: textColor,
        })

        if (subtitle) {
            page.drawText(subtitle, {
                x: 42,
                y: height - 73,
                size: 9,
                font,
                color: mutedColor,
            })
        }

        page.drawLine({
            start: { x: 42, y: height - 88 },
            end: { x: width - 42, y: height - 88 },
            thickness: 1,
            color: lineColor,
        })
    }

    function drawLines(
        page: ReturnType<PDFDocument['addPage']>,
        lines: string[],
        x: number,
        startY: number,
        size = 10,
        lineGap = 14,
    ) {
        lines.forEach((line, index) => {
            page.drawText(line, {
                x,
                y: startY - index * lineGap,
                size,
                font,
                color: textColor,
            })
        })
    }

    function drawPacketFooter(page: ReturnType<PDFDocument['addPage']>) {
        const { width } = page.getSize()

        const footerText =
            `Generated by ${PACKET_HELPER_NAME} • Not affiliated with Miami-Dade County`

        page.drawLine({
            start: { x: 42, y: 42 },
            end: { x: width - 42, y: 42 },
            thickness: 0.5,
            color: lineColor,
        })

        page.drawText(footerText, {
            x: 42,
            y: 24,
            size: 7,
            font,
            color: mutedColor,
        })

        page.drawText(PACKET_HELPER_URL, {
            x: width - 238,
            y: 24,
            size: 7,
            font,
            color: mutedColor,
        })
    }

    async function addPhotoPages() {
        if (photos.length === 0) return

        for (const [index, photo] of photos.entries()) {
            const page = pdfDoc.addPage([612, 792])
            const { width, height } = page.getSize()

            drawPacketHeader(
                page,
                `Repair Photo ${index + 1}`,
                'Photo appendix generated from uploaded repair documentation.',
            )

            drawPacketFooter(page)

            const imageBytes = dataUrlToUint8Array(photo.dataUrl)

            let embeddedImage

            if (isJpegFile(photo)) {
                embeddedImage = await pdfDoc.embedJpg(imageBytes)
            } else if (isPngFile(photo)) {
                embeddedImage = await pdfDoc.embedPng(imageBytes)
            } else {
                drawLines(
                    page,
                    [
                        `Could not embed this image format: ${photo.name}`,
                        'Supported embedded image formats are JPG and PNG.',
                        'HEIC, HEIF, and WEBP should be converted before final packet generation.',
                    ],
                    42,
                    height - 125,
                    10,
                    16,
                )

                continue
            }

            const imageBox = {
                x: 42,
                y: 190,
                width: width - 84,
                height: 465,
            }

            const imageSize = embeddedImage.scale(1)

            const scale = Math.min(
                imageBox.width / imageSize.width,
                imageBox.height / imageSize.height,
            )

            const finalWidth = imageSize.width * scale
            const finalHeight = imageSize.height * scale

            page.drawRectangle({
                x: imageBox.x,
                y: imageBox.y,
                width: imageBox.width,
                height: imageBox.height,
                borderColor: lineColor,
                borderWidth: 1,
            })

            page.drawImage(embeddedImage, {
                x: imageBox.x + (imageBox.width - finalWidth) / 2,
                y: imageBox.y + (imageBox.height - finalHeight) / 2,
                width: finalWidth,
                height: finalHeight,
            })

            page.drawText(photo.name, {
                x: 42,
                y: 155,
                size: 10,
                font: boldFont,
                color: textColor,
            })

            if (photo.caption.trim()) {
                const captionLines = wrapText(
                    photo.caption,
                    width - 84,
                    10,
                    font,
                )

                drawLines(
                    page,
                    captionLines.slice(0, 5),
                    42,
                    132,
                    10,
                    14,
                )
            }
        }
    }

    async function addMergedPdfFiles(files: PacketFile[]) {
        for (const file of files) {
            if (!isPdfFile(file)) continue

            try {
                const sourceBytes = dataUrlToUint8Array(file.dataUrl)
                const sourcePdf = await PDFDocument.load(sourceBytes)
                const sourcePages = await pdfDoc.copyPages(
                    sourcePdf,
                    sourcePdf.getPageIndices(),
                )

                sourcePages.forEach((page) => {
                    pdfDoc.addPage(page)
                })
            } catch (error) {
                console.warn(`Could not merge PDF: ${file.name}`, error)
            }
        }
    }

    async function addImageDocumentPages(files: PacketFile[], sectionTitle: string) {
        const imageFiles = files.filter(isEmbeddableImageFile)

        if (imageFiles.length === 0) return

        for (const [index, file] of imageFiles.entries()) {
            const page = pdfDoc.addPage([612, 792])
            const { width, height } = page.getSize()

            drawPacketHeader(
                page,
                `${sectionTitle} ${index + 1}`,
                file.description || file.name,
            )

            drawPacketFooter(page)

            const imageBytes = dataUrlToUint8Array(file.dataUrl)
            const embeddedImage = isJpegFile(file)
                ? await pdfDoc.embedJpg(imageBytes)
                : await pdfDoc.embedPng(imageBytes)

            const imageBox = {
                x: 42,
                y: 110,
                width: width - 84,
                height: height - 220,
            }

            const imageSize = embeddedImage.scale(1)

            const scale = Math.min(
                imageBox.width / imageSize.width,
                imageBox.height / imageSize.height,
            )

            const finalWidth = imageSize.width * scale
            const finalHeight = imageSize.height * scale

            page.drawRectangle({
                x: imageBox.x,
                y: imageBox.y,
                width: imageBox.width,
                height: imageBox.height,
                borderColor: lineColor,
                borderWidth: 1,
            })

            page.drawImage(embeddedImage, {
                x: imageBox.x + (imageBox.width - finalWidth) / 2,
                y: imageBox.y + (imageBox.height - finalHeight) / 2,
                width: finalWidth,
                height: finalHeight,
            })
        }
    }

    function addPacketSummaryPage() {
        const allFiles = [
            ...invoiceFiles.map((file) => ({
                section: 'Invoice / Repair Statement',
                file,
            })),
            ...supportingFiles.map((file) => ({
                section: 'Supporting Document',
                file,
            })),
        ]

        if (photos.length === 0 && allFiles.length === 0) return

        const page = pdfDoc.addPage([612, 792])
        const { height } = page.getSize()

        drawPacketHeader(
            page,
            'Submission Packet Summary',
            'Generated to help organize uploaded leak adjustment documentation.',
        )

        drawPacketFooter(page)

        const lines: string[] = [
            `Account holder: ${formData.nameOnAccount || 'Not provided'}`,
            `Account number: ${formData.accountNumber || 'Not provided'}`,
            `Service address: ${serviceFullAddress || 'Not provided'}`,
            '',
            `Repair photos uploaded: ${photos.length}`,
            `Invoice / repair files uploaded: ${invoiceFiles.length}`,
            `Additional supporting files uploaded: ${supportingFiles.length}`,
            '',
            'Notes:',
            'PDF files are merged into this packet.',
            'JPG and PNG files are embedded as packet pages.',
            'Unsupported files are skipped. Use PDF, JPG, or PNG for invoice/supporting documents.',
        ]

        drawLines(page, lines, 42, height - 125, 10, 16)

        let y = height - 355

        for (const { section, file } of allFiles.slice(0, 16)) {
            const mergeStatus = isPdfFile(file)
                ? 'Merged if readable'
                : isEmbeddableImageFile(file)
                    ? 'Embedded as image page'
                    : 'Listed only, manual attachment may be needed'

            page.drawText(section, {
                x: 42,
                y,
                size: 9,
                font: boldFont,
                color: textColor,
            })

            page.drawText(`${file.name} (${mergeStatus})`, {
                x: 42,
                y: y - 14,
                size: 9,
                font,
                color: mutedColor,
            })

            if (file.description?.trim()) {
                const descriptionLines = wrapText(
                    file.description,
                    520,
                    9,
                    font,
                )

                descriptionLines.slice(0, 2).forEach((line, index) => {
                    page.drawText(line, {
                        x: 42,
                        y: y - 30 - index * 12,
                        size: 9,
                        font,
                        color: mutedColor,
                    })
                })

                y -= 62
            } else {
                y -= 44
            }

            if (y < 80) break
        }
    }

    drawCheck(CHECK_POSITIONS.page1CompletedForm)
    drawCheck(CHECK_POSITIONS.page1Invoice)
    drawCheck(CHECK_POSITIONS.page1Pictures)
    drawCheck(CHECK_POSITIONS.page1RepairsFinal)

    await drawSignature(SIGNATURE_POSITIONS.page1CustomerSignature)

    drawText(TEXT_POSITIONS.page1Date, today)
    drawText(TEXT_POSITIONS.page1Name, formData.nameOnAccount)
    drawText(TEXT_POSITIONS.page1Account, formData.accountNumber)

    drawText(TEXT_POSITIONS.nameOnAccount, formData.nameOnAccount)
    drawText(TEXT_POSITIONS.accountNumber, formData.accountNumber)
    drawText(TEXT_POSITIONS.mailingAddress, formData.mailingAddress)
    drawText(TEXT_POSITIONS.homePhone, formData.homePhone)
    drawText(TEXT_POSITIONS.cellPhone, formData.cellPhone)
    drawText(TEXT_POSITIONS.mailingCityStateZip, mailingCityStateZip)
    drawText(TEXT_POSITIONS.businessPhone, formData.businessPhone)
    drawText(TEXT_POSITIONS.serviceAddress, serviceFullAddress)
    drawText(TEXT_POSITIONS.email, formData.email)

    drawText(TEXT_POSITIONS.repairsCompletedBy, formData.repairsCompletedBy)
    drawText(TEXT_POSITIONS.dateOfRepair, formatDateForPdf(formData.dateOfRepair))
    drawText(TEXT_POSITIONS.plumberLicenseNumber, formData.plumberLicenseNumber)

    if (formData.licenseType === 'state') {
        drawCheck(CHECK_POSITIONS.stateLicense)
    }

    if (formData.licenseType === 'miami-dade') {
        drawCheck(CHECK_POSITIONS.miamiDadeLicense)
    }

    drawText(TEXT_POSITIONS.repairDescription, formData.repairDescription)

    await drawSignature(SIGNATURE_POSITIONS.page2CustomerSignature)
    drawText(TEXT_POSITIONS.page2FirstSignatureDate, today)

    if (formData.wantsLifetimeAdjustment) {
        await drawSignature(SIGNATURE_POSITIONS.page2LifetimeSignature)
        drawText(TEXT_POSITIONS.page2LifetimeSignatureDate, today)
    }

    addPacketSummaryPage()
    await addPhotoPages()

    await addMergedPdfFiles(invoiceFiles)
    await addImageDocumentPages(invoiceFiles, 'Invoice / Statement')

    await addMergedPdfFiles(supportingFiles)
    await addImageDocumentPages(supportingFiles, 'Supporting Document')

    const completedPdfBytes = await pdfDoc.save()
    const pdfArrayBuffer = new ArrayBuffer(completedPdfBytes.byteLength)
    const pdfArray = new Uint8Array(pdfArrayBuffer)

    pdfArray.set(completedPdfBytes)

    const blob = new Blob([pdfArrayBuffer], {
        type: 'application/pdf',
    })

    const namePart = makeSafeFilenamePart(formData.nameOnAccount)
    const accountPart = makeSafeFilenamePart(formData.accountNumber)

    const fileName = [
        'underground-leak-adjustment-packet',
        namePart,
        accountPart,
    ]
        .filter(Boolean)
        .join('_')
        .concat('.pdf')

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
}