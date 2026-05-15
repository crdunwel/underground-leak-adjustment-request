/* src/data/leakFormData.ts */

import type { LeakFormData, WorkflowStep } from '../types/leakForm'

export const steps: WorkflowStep[] = [
    {
        id: 'account',
        label: 'Account',
        title: 'Who is on the water account?',
        description: 'This helps match the official request to your Miami-Dade account.',
    },
    {
        id: 'contact',
        label: 'Contact',
        title: 'Where should Miami-Dade contact you?',
        description: 'Add the service address, mailing address, phone number, and email.',
    },
    {
        id: 'repair',
        label: 'Repair',
        title: 'Tell us about the repair',
        description: 'Include who completed it, when it was done, and what was fixed.',
    },
    {
        id: 'requirements',
        label: 'Requirements',
        title: 'What you need before submitting',
        description: 'Review the documents, photos, and repair requirements Miami-Dade asks for.',
    },
    {
        id: 'photos',
        label: 'Photos',
        title: 'Add repair photos',
        description: 'Upload before and after photos, then arrange them in the order that tells the story.',
    },
    {
        id: 'invoice',
        label: 'Invoice',
        title: 'Add your invoice or repair statement',
        description: 'Upload proof showing the repair date, location, work completed, and materials used.',
    },
    {
        id: 'documents',
        label: 'Docs',
        title: 'Add supporting documents',
        description: 'Optional extra receipts, statements, work orders, or evidence that strengthens the packet.',
    },
    {
        id: 'signature',
        label: 'Sign',
        title: 'Sign the request',
        description: 'Your signature is added to the official adjustment request PDF.',
    },
    {
        id: 'review',
        label: 'Download',
        title: 'Review and download',
        description: 'Generate the completed PDF packet and submit it with the required documents.',
    },
]

export const initialLeakFormData: LeakFormData = {
    accountOwnerType: '',
    nameOnAccount: '',
    accountNumber: '',

    serviceAddress: '',
    serviceCity: '',
    serviceState: 'FL',
    serviceZip: '',

    mailingAddressSameAsService: true,
    mailingAddress: '',
    mailingCity: '',
    mailingState: 'FL',
    mailingZip: '',

    homePhone: '',
    cellPhone: '',
    businessPhone: '',
    email: '',

    repairsCompletedBy: '',
    dateOfRepair: '',
    plumberLicenseNumber: '',
    licenseType: '',
    repairDescription: '',
    wantsLifetimeAdjustment: true,
}

export const sampleLeakFormData: LeakFormData = {
    accountOwnerType: 'self',
    nameOnAccount: 'Alex Rivera',
    accountNumber: '1234567890',

    serviceAddress: '1234 SW 82nd Ave',
    serviceCity: 'Miami',
    serviceState: 'FL',
    serviceZip: '33155',

    mailingAddressSameAsService: true,
    mailingAddress: '1234 SW 82nd Ave',
    mailingCity: 'Miami',
    mailingState: 'FL',
    mailingZip: '33155',

    homePhone: '',
    cellPhone: '(305) 555-1234',
    businessPhone: '',
    email: 'alex.rivera@example.com',

    repairsCompletedBy: 'Reliable Plumbing Services',
    dateOfRepair: '2026-05-14',
    plumberLicenseNumber: 'CFC 1234567',
    licenseType: 'state',
    repairDescription:
        'Repaired concealed underground water supply line leak located in the front yard near the service line connection. Damaged section of pipe was exposed, removed, replaced, pressure tested, and confirmed no longer leaking.',
    wantsLifetimeAdjustment: true,
}