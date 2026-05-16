/* src/components/SignatureStep.tsx */

import { useEffect, useRef, useState } from 'react'

import '@/styles/steps/signature-step.css'
import {assetPath} from "@/lib/assetPath.ts";

type SignatureStepProps = {
    hasError: boolean
    signatureDataUrl: string
    onSignatureChange: (signatureDataUrl: string) => void
    onTermsClick?: () => void
}

export function SignatureStep({
                                  hasError,
                                  signatureDataUrl,
                                  onSignatureChange,
                                  onTermsClick,
                              }: SignatureStepProps) {
    const [isSigning, setIsSigning] = useState(false)

    const [hasAcknowledged, setHasAcknowledged] =
        useState(false)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')

        if (!canvas || !context || !signatureDataUrl) return

        const image = new Image()

        image.onload = () => {
            context.clearRect(
                0,
                0,
                canvas.width,
                canvas.height,
            )

            context.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height,
            )
        }

        image.src = signatureDataUrl
    }, [signatureDataUrl])

    function getCanvasPoint(
        event: React.PointerEvent<HTMLCanvasElement>,
    ) {
        const canvas = event.currentTarget
        const rect = canvas.getBoundingClientRect()

        return {
            x:
                ((event.clientX - rect.left) /
                    rect.width) *
                canvas.width,

            y:
                ((event.clientY - rect.top) /
                    rect.height) *
                canvas.height,
        }
    }

    function persistSignature(canvas: HTMLCanvasElement) {
        onSignatureChange(
            canvas.toDataURL('image/png'),
        )
    }

    function startSignature(
        event: React.PointerEvent<HTMLCanvasElement>,
    ) {
        if (!hasAcknowledged) return

        const canvas = event.currentTarget

        const context = canvas.getContext('2d')

        const point = getCanvasPoint(event)

        if (!context) return

        canvas.setPointerCapture(event.pointerId)

        context.beginPath()

        context.moveTo(point.x, point.y)

        setIsSigning(true)
    }

    function drawSignature(
        event: React.PointerEvent<HTMLCanvasElement>,
    ) {
        if (!isSigning || !hasAcknowledged) return

        const context =
            event.currentTarget.getContext('2d')

        const point = getCanvasPoint(event)

        if (!context) return

        context.lineTo(point.x, point.y)

        context.strokeStyle = '#111827'
        context.lineWidth = 4
        context.lineCap = 'round'
        context.lineJoin = 'round'

        context.stroke()
    }

    function endSignature(
        event: React.PointerEvent<HTMLCanvasElement>,
    ) {
        if (!hasAcknowledged) return

        const canvas = event.currentTarget

        try {
            canvas.releasePointerCapture(
                event.pointerId,
            )
        } catch {
            // Pointer capture may already
            // be released on some browsers.
        }

        setIsSigning(false)

        persistSignature(canvas)
    }

    function clearSignature() {
        const canvas = canvasRef.current

        const context = canvas?.getContext('2d')

        if (!canvas || !context) return

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height,
        )

        onSignatureChange('')
    }

    return (
        <div className="stepBody">
            <div className="signatureExplainer">
                <h3>Sign the completed adjustment request</h3>

                <p>
                    In the next step we will generate
                    your completed Underground Leak
                    Adjustment Request packet using the
                    information, photos, and documents
                    you provided.
                </p>

                <a
                    className="signatureFormLink"
                    href="https://www.miamidade.gov/resources/water/documents/forms/underground-leak-adjustment-request.pdf"
                    target="_blank"
                    rel="noreferrer"
                >
                    📄 View the official Miami-Dade form
                </a>

                <div
                    className={
                        hasAcknowledged
                            ? 'checkCard checked'
                            : 'checkCard'
                    }
                >
                    <input
                        id="signature-acknowledgement"
                        type="checkbox"
                        checked={hasAcknowledged}
                        onChange={(event) =>
                            setHasAcknowledged(
                                event.target.checked,
                            )
                        }
                    />

                    <label htmlFor="signature-acknowledgement">
                        I understand this signature
                        will be placed onto the
                        completed leak adjustment
                        request form generated by this
                        tool.
                    </label>
                </div>

                <p className="signatureTermsText">
                    By continuing, you also agree to
                    the{' '}

                    <button
                        type="button"
                        className="inlineTermsButton"
                        onClick={onTermsClick}
                    >
                        Terms of Use
                    </button>
                    .
                </p>
            </div>

            <div className="signaturePad">
                <div className="signaturePadHeader">
                    <strong>
                        Customer signature
                    </strong>

                    <button
                        type="button"
                        className="secondaryButton"
                        onClick={clearSignature}
                    >
                        Clear
                    </button>
                </div>

                <canvas
                    ref={canvasRef}
                    width={900}
                    height={220}
                    className={
                        hasError
                            ? 'signatureCanvas inputError'
                            : 'signatureCanvas'
                    }
                    onPointerDown={startSignature}
                    onPointerMove={drawSignature}
                    onPointerUp={endSignature}
                    onPointerCancel={endSignature}
                    onPointerLeave={(event) => {
                        if (isSigning) {
                            endSignature(event)
                        }
                    }}
                />

                {!hasAcknowledged && (
                    <p className="signatureDisabledHint">
                        Please acknowledge the form
                        generation notice above before
                        signing.
                    </p>
                )}

                {hasError && (
                    <p className="fieldError">
                        Signature is required.
                    </p>
                )}

                <p>
                    Sign with your finger, mouse, or
                    trackpad.
                </p>
            </div>
        </div>
    )
}