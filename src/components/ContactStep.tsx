/* src/components/ContactStep.tsx */

import { formatPhoneNumber, formatZip } from '../lib/formatters'
import type { StepProps } from '../types/leakForm'

import '@/styles/steps/contact-step.css'

export function ContactStep({ formData, updateField, hasFieldError }: StepProps) {
    return (
        <div className="stepBody formGrid">
            <section className="subSection">
                <div className="subSectionHeader">
                    <h3>Service address</h3>
                    <p>Where the leak happened.</p>
                </div>

                <label>
                    Street address
                    <input
                        className={
                            hasFieldError(!formData.serviceAddress.trim()) ? 'inputError' : ''
                        }
                        value={formData.serviceAddress}
                        onChange={(event) => updateField('serviceAddress', event.target.value)}
                        placeholder="1234 SW 82nd Ave"
                    />
                </label>

                <div className="formGrid cityStateZipGrid">
                    <label>
                        City
                        <input
                            className={
                                hasFieldError(!formData.serviceCity.trim()) ? 'inputError' : ''
                            }
                            value={formData.serviceCity}
                            onChange={(event) => updateField('serviceCity', event.target.value)}
                            placeholder="Miami"
                        />
                    </label>

                    <label>
                        State
                        <input value="FL" disabled />
                    </label>

                    <label>
                        Zip
                        <input
                            className={
                                hasFieldError(formData.serviceZip.length !== 5)
                                    ? 'inputError'
                                    : ''
                            }
                            value={formData.serviceZip}
                            onChange={(event) =>
                                updateField('serviceZip', formatZip(event.target.value))
                            }
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="33155"
                        />
                    </label>
                </div>
            </section>

            <section className="subSection">
                <div className="sectionHeaderRow">
                    <div className="subSectionHeader">
                        <h3>Mailing address</h3>
                        <p>Where Miami-Dade can contact you.</p>
                    </div>

                    <label className="inlineCheck">
                        <input
                            type="checkbox"
                            checked={formData.mailingAddressSameAsService}
                            onChange={(event) =>
                                updateField('mailingAddressSameAsService', event.target.checked)
                            }
                        />
                        Same as service
                    </label>
                </div>

                <label>
                    Street address
                    <input
                        className={
                            hasFieldError(!formData.mailingAddress.trim()) ? 'inputError' : ''
                        }
                        value={formData.mailingAddress}
                        onChange={(event) => updateField('mailingAddress', event.target.value)}
                        disabled={formData.mailingAddressSameAsService}
                        placeholder="1234 SW 82nd Ave"
                    />
                </label>

                <div className="formGrid cityStateZipGrid">
                    <label>
                        City
                        <input
                            className={
                                hasFieldError(!formData.mailingCity.trim()) ? 'inputError' : ''
                            }
                            value={formData.mailingCity}
                            onChange={(event) => updateField('mailingCity', event.target.value)}
                            disabled={formData.mailingAddressSameAsService}
                            placeholder="Miami"
                        />
                    </label>

                    <label>
                        State
                        <input value="FL" disabled />
                    </label>

                    <label>
                        Zip
                        <input
                            className={
                                hasFieldError(formData.mailingZip.length !== 5)
                                    ? 'inputError'
                                    : ''
                            }
                            value={formData.mailingZip}
                            onChange={(event) =>
                                updateField('mailingZip', formatZip(event.target.value))
                            }
                            disabled={formData.mailingAddressSameAsService}
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="33155"
                        />
                    </label>
                </div>
            </section>

            <section className="subSection">
                <div className="subSectionHeader">
                    <h3>Contact information</h3>
                </div>

                <div className="formGrid twoColumns">
                    <label>
                        Cell phone
                        <input
                            className={
                                hasFieldError(!formData.cellPhone.trim()) ? 'inputError' : ''
                            }
                            value={formData.cellPhone}
                            onChange={(event) =>
                                updateField('cellPhone', formatPhoneNumber(event.target.value))
                            }
                            inputMode="tel"
                            placeholder="(305) 555-1234"
                        />
                    </label>

                    <label>
                        Email address
                        <input
                            className={
                                hasFieldError(!formData.email.trim()) ? 'inputError' : ''
                            }
                            value={formData.email}
                            onChange={(event) => updateField('email', event.target.value)}
                            inputMode="email"
                            placeholder="you@example.com"
                        />
                    </label>
                </div>

                <div className="formGrid twoColumns">
                    <label>
                        Home phone
                        <input
                            value={formData.homePhone}
                            onChange={(event) =>
                                updateField('homePhone', formatPhoneNumber(event.target.value))
                            }
                            inputMode="tel"
                            placeholder="Optional"
                        />
                    </label>

                    <label>
                        Business phone
                        <input
                            value={formData.businessPhone}
                            onChange={(event) =>
                                updateField('businessPhone', formatPhoneNumber(event.target.value))
                            }
                            inputMode="tel"
                            placeholder="Optional"
                        />
                    </label>
                </div>
            </section>
        </div>
    )
}