/* src/components/WorkflowProgress.tsx */

import type { WorkflowStep } from '../types/leakForm'

type WorkflowProgressProps = {
    steps: WorkflowStep[]
    currentStepIndex: number
}

export function WorkflowProgress({
                                     steps,
                                     currentStepIndex,
                                 }: WorkflowProgressProps) {
    return (
        <section className="sideCard">
            <h3>Your Progress</h3>

            <ol className="progressList">
                {steps.map((step, index) => (
                    <li
                        key={step.id}
                        className={
                            index === currentStepIndex
                                ? 'active'
                                : index < currentStepIndex
                                    ? 'done'
                                    : ''
                        }
                    >
                        <span>{index + 1}</span>
                        {step.label}
                    </li>
                ))}
            </ol>
        </section>
    )
}