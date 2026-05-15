/* src/components/SupportingDocsStep.tsx */

import { createPacketFile, formatFileSize } from '../lib/fileHelpers'
import type { PacketFile } from '../types/leakForm'

type SupportingDocsStepProps = {
    supportingFiles: PacketFile[]
    setSupportingFiles: (files: PacketFile[]) => void
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

export function SupportingDocsStep({
                                       supportingFiles,
                                       setSupportingFiles,
                                   }: SupportingDocsStepProps) {
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

        setSupportingFiles([...supportingFiles, ...nextFiles])
    }

    function updateDescription(id: string, description: string) {
        setSupportingFiles(
            supportingFiles.map((file) =>
                file.id === id ? { ...file, description } : file,
            ),
        )
    }

    function removeFile(id: string) {
        const confirmed = window.confirm(
            'Remove this supporting document from the packet?',
        )

        if (!confirmed) return

        setSupportingFiles(supportingFiles.filter((file) => file.id !== id))
    }

    return (
        <div className="stepBody formGrid">
            <section className="subSection">
                <div className="subSectionHeader">
                    <h3>Additional documentation</h3>
                    <p>
                        Add anything else that supports the request. This step
                        is optional.
                    </p>
                </div>

                <div className="instructionCard">
                    <strong>Useful examples</strong>
                    <p>
                        Third-party damage statement, extra receipts, responsible
                        party work order, extra repair notes, or additional
                        location photos.
                    </p>
                </div>

                <label className="uploadBox">
                    <div className="uploadBoxIcon">👆</div>

                    <span>
                        Click here to upload supporting documents
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
            </section>

            {supportingFiles.length > 0 && (
                <section className="fileList">
                    {supportingFiles.map((file) => (
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
                                    placeholder="Example: Receipt for repair materials."
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