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
            <h3>Your PDF is ready to generate</h3>

            <p>
                This will download a completed copy of the Miami-Dade underground leak
                adjustment form using the information you entered.
            </p>

            <div className="requirementList">
                <h4>Remember to submit with:</h4>

                <ul>
                    <li>Completed and signed adjustment request form</li>
                    <li>Repair invoice or repair statement</li>
                    <li>Before and after photos of the plumbing repair</li>
                </ul>
            </div>

            {showErrors && allMissingItems.length > 0 && (
                <StepErrorBox title="Missing before download:" items={allMissingItems} />
            )}

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
                        : 'Download completed PDF'}
                </span>
            </button>

        </div>
    )
}