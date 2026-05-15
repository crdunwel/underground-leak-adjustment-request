/* src/components/AccountStep.tsx */

import type { StepProps } from '../types/leakForm'

export function AccountStep({ formData, updateField, hasFieldError }: StepProps) {
    return (
        <div className="stepBody">
            <fieldset>
                <legend>Who is the water account under?</legend>

                <div className="choiceGrid">
                    <button
                        type="button"
                        className={
                            formData.accountOwnerType === 'self'
                                ? 'choiceCard selected'
                                : 'choiceCard'
                        }
                        onClick={() => updateField('accountOwnerType', 'self')}
                    >
                        <span className="choiceIcon">👤</span>
                        <strong>My name</strong>
                        <small>I’m the account holder</small>
                    </button>

                    <button
                        type="button"
                        className={
                            formData.accountOwnerType === 'someone-else'
                                ? 'choiceCard selected'
                                : 'choiceCard'
                        }
                        onClick={() => updateField('accountOwnerType', 'someone-else')}
                    >
                        <span className="choiceIcon">👥</span>
                        <strong>Someone else</strong>
                        <small>Not in my name</small>
                    </button>
                </div>
            </fieldset>

            <div className="formGrid twoColumns">
                <label>
                    Name on account
                    <input
                        className={
                            hasFieldError(!formData.nameOnAccount.trim()) ? 'inputError' : ''
                        }
                        value={formData.nameOnAccount}
                        onChange={(event) => updateField('nameOnAccount', event.target.value)}
                        placeholder="Full name"
                    />
                </label>

                <label>
                    Account number
                    <input
                        className={
                            hasFieldError(!formData.accountNumber.trim()) ? 'inputError' : ''
                        }
                        value={formData.accountNumber}
                        onChange={(event) => updateField('accountNumber', event.target.value)}
                        placeholder="Miami-Dade WASD account number"
                    />
                </label>
            </div>

            <details className="whyBox">
                <summary>Why we ask this</summary>
                <p>
                    The official request asks for the name on account and account number on
                    both pages of the form.
                </p>
            </details>
        </div>
    )
}