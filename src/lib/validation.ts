/* src/lib/validation.ts */

import type { LeakFormData, StepId } from '../types/leakForm'

type GetStepMissingItemsArgs = {
    stepId: StepId
    formData: LeakFormData
    signatureDataUrl: string
}

function isValidZip(value: string) {
    return /^\d{5}$/.test(value)
}

function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function getStepMissingItems({
                                        stepId,
                                        formData,
                                        signatureDataUrl,
                                    }: GetStepMissingItemsArgs) {
    if (stepId === 'account') {
        return [
            !formData.accountOwnerType && 'Who the account is under',
            !formData.nameOnAccount.trim() && 'Name on account',
            !formData.accountNumber.trim() && 'Account number',
        ].filter(Boolean) as string[]
    }

    if (stepId === 'contact') {
        return [
            !formData.serviceAddress.trim() && 'Service address',
            !formData.serviceCity.trim() && 'Service city',
            !isValidZip(formData.serviceZip) && 'Service zip must be 5 digits',
            !formData.mailingAddress.trim() && 'Mailing address',
            !formData.mailingCity.trim() && 'Mailing city',
            !isValidZip(formData.mailingZip) && 'Mailing zip must be 5 digits',
            !formData.email.trim() && 'Email address',
            formData.email.trim() && !isValidEmail(formData.email) && 'Valid email address',
            !formData.cellPhone.trim() && 'Cell phone',
        ].filter(Boolean) as string[]
    }

    if (stepId === 'repair') {
        return [
            !formData.repairsCompletedBy.trim() && 'Repairs completed by',
            !formData.dateOfRepair.trim() && 'Date of repair',
            !formData.repairDescription.trim() && 'Description of repair',
        ].filter(Boolean) as string[]
    }

    if (stepId === 'signature') {
        return [!signatureDataUrl && 'Signature'].filter(Boolean) as string[]
    }

    return []
}