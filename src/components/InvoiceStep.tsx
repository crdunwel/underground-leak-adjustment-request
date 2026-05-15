/* src/components/InvoiceStep.tsx */

import { createPacketFile, formatFileSize } from '../lib/fileHelpers'
import type { PacketFile } from '../types/leakForm'

type InvoiceStepProps = {
    invoiceFiles: PacketFile[]
    setInvoiceFiles: (files: PacketFile[]) => void
    hasError: boolean
}

const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
]

const ALLOWED_DOCUMENT_EXTENSIONS = [
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
]

const DOCUMENT_ACCEPT_STRING = [
    ...ALLOWED_DOCUMENT_EXTENSIONS,
    ...ALLOWED_DOCUMENT_TYPES,
].join(',')

function isAllowedDocument(file: File) {
    const fileName = file.name.toLowerCase()

    return (
        ALLOWED_DOCUMENT_TYPES.includes(file.type) ||
        ALLOWED_DOCUMENT_EXTENSIONS.some((extension) =>
            fileName.endsWith(extension),
        )
    )
}

export function InvoiceStep({
                                invoiceFiles,
                                setInvoiceFiles,
                                hasError,
                            }: InvoiceStepProps) {
    async function addFiles(files: FileList | null) {
        if (!files) return

        const allowedFiles = Array.from(files).filter(isAllowedDocument)

        if (allowedFiles.length === 0) {
            alert('Only PDF, JPG, JPEG, and PNG files are allowed.')
            return
        }

        const nextFiles = await Promise.all(
            allowedFiles.map(createPacketFile),
        )

        setInvoiceFiles([...invoiceFiles, ...nextFiles])
    }

    function updateDescription(id: string, description: string) {
        setInvoiceFiles(
            invoiceFiles.map((file) =>
                file.id === id ? { ...file, description } : file,
            ),
        )
    }

    function removeFile(id: string) {
        const confirmed = window.confirm(
            'Remove this invoice or repair document from the packet?',
        )

        if (!confirmed) return

        setInvoiceFiles(invoiceFiles.filter((file) => file.id !== id))
    }

    return (
        <div className="stepBody formGrid">
            <section className="subSection">
                <div className="subSectionHeader">
                    <h3>Invoice or repair statement</h3>
                    <p>
                        Upload the document that proves the repair was completed.
                    </p>
                </div>

                <div className="instructionCard">
                    <strong>What this should show</strong>
                    <p>
                        The repair document should detail the repairs completed,
                        repair date, repair location, and materials used.
                    </p>
                </div>

                <label
                    className={
                        hasError
                            ? 'uploadBox inputError'
                            : 'uploadBox'
                    }
                >
                    <div className="uploadBoxIcon">👆</div>

                    <span>
                        Click here to upload invoices or receipts
                    </span>

                    <small>
                        PDF, JPG, or PNG only
                    </small>

                    <input
                        type="file"
                        multiple
                        accept={DOCUMENT_ACCEPT_STRING}
                        onChange={(event) => addFiles(event.target.files)}
                    />
                </label>

                {hasError && (
                    <p className="fieldError">
                        Add at least one invoice, repair statement, receipt, or
                        work order.
                    </p>
                )}
            </section>

            {invoiceFiles.length > 0 && (
                <section className="fileList">
                    {invoiceFiles.map((file) => (
                        <article key={file.id} className="fileCard">
                            <div>
                                <strong>{file.name}</strong>
                                <small>{formatFileSize(file.size)}</small>
                            </div>

                            <label>
                                Optional note
                                <textarea
                                    rows={3}
                                    value={file.description}
                                    onChange={(event) =>
                                        updateDescription(file.id, event.target.value)
                                    }
                                    placeholder="Example: Contractor invoice showing pipe replacement and repair date."
                                />
                            </label>

                            <button
                                type="button"
                                className="removeFileButton"
                                onClick={() => removeFile(file.id)}
                            >
                                Delete document
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </div>
    )
}