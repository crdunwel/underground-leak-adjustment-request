/* src/components/WorkflowHeader.tsx */

type WorkflowHeaderProps = {
    currentStepIndex: number
    totalSteps: number
    currentStepTitle: string
    currentStepDescription: string
    progressPercent: number
    onReset: () => void
}

export function WorkflowHeader({
                                   currentStepIndex,
                                   totalSteps,
                                   currentStepTitle,
                                   currentStepDescription,
                                   progressPercent,
                                   onReset,
                               }: WorkflowHeaderProps) {
    return (
        <>
            <div className="stepHeader">
                <div className="stepHeaderTop">
                    <p>
                        Step {currentStepIndex + 1} of {totalSteps}
                    </p>

                    <button
                        type="button"
                        className="resetButton"
                        onClick={onReset}
                    >
                        Reset
                    </button>
                </div>

                <h2>{currentStepTitle}</h2>

                <span>{currentStepDescription}</span>
            </div>

            <div className="progressTrack">
                <div style={{ width: `${progressPercent}%` }} />
            </div>
        </>
    )
}