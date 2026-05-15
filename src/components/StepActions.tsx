/* src/components/StepActions.tsx */

type StepActionsProps = {
    canGoBack: boolean
    onBack: () => void
    onNext: () => void
}

export function StepActions({ canGoBack, onBack, onNext }: StepActionsProps) {
    return (
        <div className="actionRow">
            <button
                type="button"
                className="secondaryButton"
                onClick={onBack}
                disabled={!canGoBack}
            >
                Back
            </button>

            <button type="button" className="primaryButton" onClick={onNext}>
                Continue
            </button>
        </div>
    )
}