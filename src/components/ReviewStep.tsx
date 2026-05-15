/* src/components/ReviewStep.tsx */

import { StepErrorBox } from './StepErrorBox'

type ReviewStepProps = {
    showErrors: boolean
    allMissingItems: string[]
    isGenerating: boolean
    onGeneratePdf: () => void
}

export function ReviewStep({
                               showErrors,
                               allMissingItems,
                               isGenerating,
                               onGeneratePdf,
                           }: ReviewStepProps) {
    return (
        <div className="stepBody reviewPanel">
            <div className="reviewIntro">
                <h3>Your leak adjustment packet is ready</h3>

                <p>
                    We will generate a completed PDF packet
                    containing your signed adjustment form,
                    repair photos, invoices, and supporting
                    documentation.
                </p>
            </div>

            <section className="requirementList">
                <h4>Your packet includes</h4>

                <ul>
                    <li>
                        Completed and signed adjustment request form
                    </li>

                    <li>
                        Repair invoice or repair statement
                    </li>

                    <li>
                        Before and after repair photos
                    </li>

                    <li>
                        Additional supporting documents
                    </li>
                </ul>
            </section>

            <button
                type="button"
                className={
                    isGenerating
                        ? 'primaryButton generatingButton'
                        : 'primaryButton'
                }
                onClick={onGeneratePdf}
                disabled={isGenerating}
            >
                {isGenerating && (
                    <span className="buttonSpinner" />
                )}

                <span>
                    {isGenerating
                        ? 'Generating PDF packet...'
                        : 'Download completed PDF packet'}
                </span>
            </button>

            <section className="nextStepsCard">
                <h4>What to do next</h4>

                <ol className="nextStepsList">
                    <li>
                        Review the packet to confirm the
                        information and attachments look correct.
                    </li>

                    <li>
                        Email the completed packet to:
                    </li>
                </ol>

                <a
                    className="submissionBox"
                    href={`mailto:WASD-CreditRequest@miamidade.gov?subject=${encodeURIComponent(
                        'Underground Leak Adjustment Request',
                    )}&body=${encodeURIComponent(
                        [
                            'Hello Miami-Dade Water & Sewer Department,',
                            '',
                            'Attached is my Underground/Concealed Leak Adjustment Request packet.',
                            '',
                            'Thank you.',
                        ].join('\n'),
                    )}`}
                >
                    <strong>
                        WASD-CreditRequest@miamidade.gov
                    </strong>

                    <span>
                        Tap to open your email app
                    </span>
                </a>

                <p className="nextStepsNote">
                    You can also mail the packet to:
                    3071 SW 38 Avenue, Miami, FL 33146-1520
                </p>
            </section>

            <section className="submissionReminder">
                <strong>Important reminders</strong>

                <p>
                    Miami-Dade requires repairs to be final
                    and completed before adjustment review.
                    Requests should generally be submitted
                    within 30 days of notification of the
                    high water usage.
                </p>
            </section>

            {showErrors && allMissingItems.length > 0 && (
                <StepErrorBox
                    title="Missing before download:"
                    items={allMissingItems}
                />
            )}

        </div>
    )
}