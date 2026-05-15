/* src/components/PhotosStep.tsx */

import { createPacketFile, formatFileSize } from '../lib/fileHelpers'
import type { PacketPhoto } from '../types/leakForm'

type PhotosStepProps = {
    photos: PacketPhoto[]
    setPhotos: (photos: PacketPhoto[]) => void
    hasError: boolean
}

const ALLOWED_PHOTO_TYPES = [
    'image/jpeg',
    'image/heic',
    'image/heif',
    'image/png',
    'image/webp',
]

const ALLOWED_PHOTO_EXTENSIONS = [
    '.jpg',
    '.jpeg',
    '.heic',
    '.heif',
    '.png',
    '.webp',
]

const PHOTO_ACCEPT_STRING = [
    ...ALLOWED_PHOTO_EXTENSIONS,
    ...ALLOWED_PHOTO_TYPES,
].join(',')

function isAllowedPhoto(file: File) {
    const fileName = file.name.toLowerCase()

    return (
        ALLOWED_PHOTO_TYPES.includes(file.type) ||
        ALLOWED_PHOTO_EXTENSIONS.some((extension) =>
            fileName.endsWith(extension),
        )
    )
}

export function PhotosStep({
                               photos,
                               setPhotos,
                               hasError,
                           }: PhotosStepProps) {
    async function addPhotos(files: FileList | null) {
        if (!files) return

        const imageFiles = Array.from(files).filter(isAllowedPhoto)

        if (imageFiles.length === 0) {
            alert(
                'Only JPG, JPEG, PNG, WEBP, HEIC, and HEIF photos are allowed.',
            )

            return
        }

        const nextPhotos = await Promise.all(
            imageFiles.map(async (file) => {
                const packetFile = await createPacketFile(file)

                return {
                    ...packetFile,
                    caption: '',
                }
            }),
        )

        setPhotos([...photos, ...nextPhotos])
    }

    function updateCaption(id: string, caption: string) {
        setPhotos(
            photos.map((photo) =>
                photo.id === id
                    ? {
                        ...photo,
                        caption,
                    }
                    : photo,
            ),
        )
    }

    function removePhoto(id: string) {
        const confirmed = window.confirm(
            'Remove this photo from the packet?',
        )

        if (!confirmed) return

        setPhotos(
            photos.filter((photo) => photo.id !== id),
        )
    }

    function movePhoto(fromIndex: number, toIndex: number) {
        const nextPhotos = [...photos]

        const [moved] = nextPhotos.splice(fromIndex, 1)

        nextPhotos.splice(toIndex, 0, moved)

        setPhotos(nextPhotos)
    }

    return (
        <div className="stepBody formGrid">
            <section className="subSection">
                <div className="subSectionHeader">
                    <h3>Repair photos</h3>

                    <p>
                        Upload before and after photos.
                        Drag them into the order that
                        best tells the repair story.
                    </p>
                </div>

                <div className="instructionCard">
                    <strong>
                        What Miami-Dade asks for
                    </strong>

                    <p>
                        Include legible color photos
                        before and after repair. Use
                        close-up photos plus wider
                        photos that show where the leak
                        was located in relation to the
                        home or building.
                    </p>
                </div>

                <label
                    className={
                        hasError
                            ? 'uploadBox inputError'
                            : 'uploadBox'
                    }
                >
                    <div className="uploadBoxIcon">
                        👆
                    </div>

                    <span>
                        Click here to upload repair photos
                    </span>

                    <small>
                        JPG, PNG, WEBP, HEIC, or HEIF only
                    </small>

                    <input
                        type="file"
                        accept={PHOTO_ACCEPT_STRING}
                        multiple
                        onChange={(event) =>
                            addPhotos(event.target.files)
                        }
                    />
                </label>

                {hasError && (
                    <p className="fieldError">
                        Add at least two photos,
                        ideally before and after.
                    </p>
                )}
            </section>

            {photos.length > 0 && (
                <section className="photoStoryList">
                    {photos.map((photo, index) => (
                        <article
                            key={photo.id}
                            className="photoStoryCard"
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData(
                                    'text/plain',
                                    String(index),
                                )
                            }}
                            onDragOver={(event) => {
                                event.preventDefault()
                            }}
                            onDrop={(event) => {
                                event.preventDefault()

                                const fromIndex =
                                    Number(
                                        event.dataTransfer.getData(
                                            'text/plain',
                                        ),
                                    )

                                if (
                                    Number.isNaN(fromIndex)
                                ) {
                                    return
                                }

                                if (fromIndex === index) {
                                    return
                                }

                                movePhoto(
                                    fromIndex,
                                    index,
                                )
                            }}
                        >
                            <div className="photoStoryImageWrap">
                                <img
                                    src={photo.dataUrl}
                                    alt={photo.name}
                                />

                                <span>
                                    {index + 1}
                                </span>
                            </div>

                            <div className="photoStoryContent">
                                <div className="photoStoryMeta">
                                    <strong>
                                        {photo.name}
                                    </strong>

                                    <small>
                                        {formatFileSize(
                                            photo.size,
                                        )}
                                    </small>
                                </div>

                                <label>
                                    Optional caption

                                    <textarea
                                        rows={5}
                                        value={
                                            photo.caption
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateCaption(
                                                photo.id,
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="Example: Before repair, front yard service line exposed."
                                    />
                                </label>

                                <div className="photoStoryActions">
                                    <button
                                        type="button"
                                        className="removeFileButton"
                                        onClick={() =>
                                            removePhoto(
                                                photo.id,
                                            )
                                        }
                                    >
                                        Delete photo
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    )
}