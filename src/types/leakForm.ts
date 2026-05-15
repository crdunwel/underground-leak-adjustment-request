/* src/types/leakForm.ts */

export type StepId =
    | 'account'
    | 'contact'
    | 'repair'
    | 'requirements'
    | 'photos'
    | 'invoice'
    | 'documents'
    | 'signature'
    | 'review'

export type PacketFile = {
    id: string
    name: string
    type: string
    size: number
    dataUrl: string
    description: string
}

export type PacketPhoto = PacketFile & {
    caption: string
}

export type LeakFormData = {
    accountOwnerType: 'self' | 'someone-else' | ''
    nameOnAccount: string
    accountNumber: string

    serviceAddress: string
    serviceCity: string
    serviceState: 'FL'
    serviceZip: string

    mailingAddressSameAsService: boolean
    mailingAddress: string
    mailingCity: string
    mailingState: 'FL'
    mailingZip: string

    homePhone: string
    cellPhone: string
    businessPhone: string
    email: string

    repairsCompletedBy: string
    dateOfRepair: string
    plumberLicenseNumber: string
    licenseType: 'state' | 'miami-dade' | ''
    repairDescription: string
    wantsLifetimeAdjustment: boolean
}

export type WorkflowStep = {
    id: StepId
    label: string
    title: string
    description: string
}

export type UpdateLeakFormField = <Key extends keyof LeakFormData>(
    field: Key,
    value: LeakFormData[Key],
) => void

export type StepProps = {
    formData: LeakFormData
    updateField: UpdateLeakFormField
    hasFieldError: (condition: boolean) => boolean
}