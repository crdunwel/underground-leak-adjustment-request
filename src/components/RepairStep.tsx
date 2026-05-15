/* src/components/RepairStep.tsx */

import type { LeakFormData, StepProps } from '../types/leakForm'

import '@/styles/steps/repair-step.css'

export function RepairStep({ formData, updateField, hasFieldError }: StepProps) {
    return (
        <div className="stepBody formGrid">
            <div className="formGrid twoColumns">
                <label>
                    Repairs completed by
                    <input
                        className={
                            hasFieldError(!formData.repairsCompletedBy.trim())
                                ? 'inputError'
                                : ''
                        }
                        value={formData.repairsCompletedBy}
                        onChange={(event) =>
                            updateField('repairsCompletedBy', event.target.value)
                        }
                        placeholder="Plumber, contractor, handyman, or person"
                    />
                </label>

                <label>
                    Date of repair
                    <input
                        className={
                            hasFieldError(!formData.dateOfRepair.trim()) ? 'inputError' : ''
                        }
                        value={formData.dateOfRepair}
                        onChange={(event) => updateField('dateOfRepair', event.target.value)}
                        type="date"
                    />
                </label>
            </div>

            <div className="formGrid twoColumns">
                <label>
                    Plumber license number
                    <input
                        value={formData.plumberLicenseNumber}
                        onChange={(event) =>
                            updateField('plumberLicenseNumber', event.target.value)
                        }
                        placeholder="For Example: CFC1234567"
                    />
                </label>

                <label>
                    Type of license
                    <select
                        value={formData.licenseType}
                        onChange={(event) =>
                            updateField(
                                'licenseType',
                                event.target.value as LeakFormData['licenseType'],
                            )
                        }
                    >
                        <option value="">Not applicable</option>
                        <option value="state">State of Florida</option>
                        <option value="miami-dade">Miami-Dade County</option>
                    </select>
                </label>
            </div>

            <label>
                Description of repair
                <textarea
                    className={
                        hasFieldError(!formData.repairDescription.trim()) ? 'inputError' : ''
                    }
                    value={formData.repairDescription}
                    onChange={(event) => updateField('repairDescription', event.target.value)}
                    rows={7}
                    placeholder="Include the exact type and location of the repair."
                />
            </label>

            <div className="lifetimeAdjustmentSection">
                <div
                    className={
                        formData.wantsLifetimeAdjustment
                            ? 'checkCard checked'
                            : 'checkCard'
                    }
                >
                    <input
                        id="lifetime-adjustment"
                        type="checkbox"
                        checked={formData.wantsLifetimeAdjustment}
                        onChange={(event) =>
                            updateField(
                                'wantsLifetimeAdjustment',
                                event.target.checked,
                            )
                        }
                    />

                    <label htmlFor="lifetime-adjustment">
                        Include signature for the once-per-lifetime
                        100% concealed leak adjustment request.
                    </label>
                </div>

                <details className="helpDetails">
                    <summary>
                        <span>?</span>
                        What is this?
                    </summary>

                    <p>
                        Miami-Dade may grant a one-time 100%
                        concealed leak adjustment. Check this box
                        if you want your completed form to request
                        that adjustment. Approval is not guaranteed.
                    </p>
                </details>
            </div>
        </div>
    )
}