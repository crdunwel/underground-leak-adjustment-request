/* src/App.tsx */

import { useEffect, useRef, useState } from 'react'

import { AccountStep } from './components/AccountStep'
import { ContactStep } from './components/ContactStep'
import { InvoiceStep } from './components/InvoiceStep'
import { PhotosStep } from './components/PhotosStep'
import { PreStartPage } from './components/PreStartPage'
import { RepairStep } from './components/RepairStep'
import { ReviewStep } from './components/ReviewStep'
import { SignatureStep } from './components/SignatureStep'
import { StepActions } from './components/StepActions'
import { StepErrorBox } from './components/StepErrorBox'
import { SupportingDocsStep } from './components/SupportingDocsStep'
import { WorkflowHeader } from './components/WorkflowHeader'
import { WorkflowProgress } from './components/WorkflowProgress'
import { RequirementsStep } from './components/RequirementsStep'
import { SiteFooter } from './components/SiteFooter'

import { TermsPage } from './pages/TermsPage'

import {
    pushRoute,
    readRouteFromUrl,
    replaceRoute,
    type AppRoute,
} from './lib/appRouter'

import {
    initialLeakFormData,
    sampleLeakFormData,
    steps,
} from './data/leakFormData'

import {
    clearDraft,
    clearDraftUploads,
    loadDraft,
    loadDraftUploads,
    saveDraft,
    saveDraftUploads,
    type StoredAppState,
} from './lib/draftStorage'

import { generateLeakAdjustmentPdf } from './lib/generateLeakAdjustmentPdf'
import { getStepMissingItems } from './lib/validation'

import type {
    LeakFormData,
    PacketFile,
    PacketPhoto,
    StepId,
} from './types/leakForm'

import './styles/base.css'
import './styles/layout.css'
import './styles/forms.css'
import './styles/steps/account-step.css'
import './styles/steps/contact-step.css'
import './styles/steps/repair-step.css'
import './styles/steps/document-step.css'
import './styles/steps/signature-step.css'
import './styles/steps/review-step.css'
import './styles/pre-start.css'
import './styles/terms.css'
import './styles/steps/requirements-step.css'
import './styles/print.css'
import './styles/seo-faq.css'

function getStepIndexFromId(stepId: StepId) {
    const index = steps.findIndex((step) => step.id === stepId)

    return index === -1 ? 0 : index
}

const USE_SAMPLE_DATA = false

function getInitialState(route: AppRoute): StoredAppState {
    const savedDraft = loadDraft(steps.length - 1)

    const fallbackFormData = USE_SAMPLE_DATA
        ? sampleLeakFormData
        : initialLeakFormData

    if (route.screen === 'workflow') {
        return {
            hasStarted: true,
            currentStepIndex: getStepIndexFromId(route.stepId),
            formData: savedDraft?.formData ?? fallbackFormData,
            signatureDataUrl: savedDraft?.signatureDataUrl ?? '',
        }
    }

    return {
        hasStarted: false,
        currentStepIndex: savedDraft?.currentStepIndex ?? 0,
        formData: savedDraft?.formData ?? fallbackFormData,
        signatureDataUrl: savedDraft?.signatureDataUrl ?? '',
    }
}

function App() {
    const initialRouteRef = useRef<AppRoute>(readRouteFromUrl())
    const initialStateRef = useRef<StoredAppState>(
        getInitialState(initialRouteRef.current),
    )

    const [route, setRoute] = useState<AppRoute>(initialRouteRef.current)

    const [formData, setFormData] = useState<LeakFormData>(
        initialStateRef.current.formData,
    )

    const [currentStepIndex, setCurrentStepIndex] = useState(
        initialStateRef.current.currentStepIndex,
    )

    const [signatureDataUrl, setSignatureDataUrl] = useState(
        initialStateRef.current.signatureDataUrl,
    )

    const [photos, setPhotos] = useState<PacketPhoto[]>([])
    const [invoiceFiles, setInvoiceFiles] = useState<PacketFile[]>([])
    const [supportingFiles, setSupportingFiles] = useState<PacketFile[]>([])
    const [uploadsRestored, setUploadsRestored] = useState(false)

    const [showErrors, setShowErrors] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    const currentStep = steps[currentStepIndex]

    const progressPercent =
        ((currentStepIndex + 1) / steps.length) * 100

    const currentMissingItems = getStepMissingItems({
        stepId: currentStep.id,
        formData,
        signatureDataUrl,
    })

    const allMissingItems = steps.flatMap((step) =>
        getStepMissingItems({
            stepId: step.id,
            formData,
            signatureDataUrl,
        }),
    )

    const canGoNext = currentMissingItems.length === 0
    const canGenerate = allMissingItems.length === 0

    // =========================================================
    // ▶ Router
    // =========================================================

    useEffect(() => {
        replaceRoute(route)

        function handlePopState() {
            const nextRoute = readRouteFromUrl()

            setShowErrors(false)
            setRoute(nextRoute)

            if (nextRoute.screen === 'workflow') {
                setCurrentStepIndex(getStepIndexFromId(nextRoute.stepId))
            }
        }

        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    function navigate(nextRoute: AppRoute) {
        setShowErrors(false)
        setRoute(nextRoute)
        pushRoute(nextRoute)

        if (nextRoute.screen === 'workflow') {
            setCurrentStepIndex(getStepIndexFromId(nextRoute.stepId))
        }
    }

    // =========================================================
    // ▶ Draft persistence
    // =========================================================

    useEffect(() => {
        saveDraft({
            hasStarted: route.screen === 'workflow',
            currentStepIndex,
            formData,
            signatureDataUrl,
        })
    }, [
        route.screen,
        currentStepIndex,
        formData,
        signatureDataUrl,
    ])

    useEffect(() => {
        let isMounted = true

        async function restoreUploads() {
            const storedUploads = await loadDraftUploads()

            if (!isMounted) return

            setPhotos(storedUploads.photos)
            setInvoiceFiles(storedUploads.invoiceFiles)
            setSupportingFiles(storedUploads.supportingFiles)
            setUploadsRestored(true)
        }

        restoreUploads()

        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if (!uploadsRestored) return

        saveDraftUploads({
            photos,
            invoiceFiles,
            supportingFiles,
        })
    }, [
        uploadsRestored,
        photos,
        invoiceFiles,
        supportingFiles,
    ])

    // =========================================================
    // ▶ Field updates
    // =========================================================

    function updateField<Key extends keyof LeakFormData>(
        field: Key,
        value: LeakFormData[Key],
    ) {
        setFormData((current) => {
            const next = {
                ...current,
                [field]: value,
            }

            if (
                field === 'mailingAddressSameAsService' ||
                (
                    current.mailingAddressSameAsService &&
                    [
                        'serviceAddress',
                        'serviceCity',
                        'serviceState',
                        'serviceZip',
                    ].includes(field)
                )
            ) {
                return syncMailingAddress(next)
            }

            return next
        })
    }

    function syncMailingAddress(data: LeakFormData): LeakFormData {
        if (!data.mailingAddressSameAsService) {
            return data
        }

        return {
            ...data,
            mailingAddress: data.serviceAddress,
            mailingCity: data.serviceCity,
            mailingState: data.serviceState,
            mailingZip: data.serviceZip,
        }
    }

    // =========================================================
    // ▶ Workflow actions
    // =========================================================

    function startWorkflow() {
        navigate({
            screen: 'workflow',
            stepId: 'account',
        })
    }

    async function resetToBlank() {
        const confirmed = window.confirm(
            'Reset the form and go back to step 1? This will clear your current answers, uploads, and signature.',
        )

        if (!confirmed) return

        clearDraft()
        await clearDraftUploads()

        setFormData(initialLeakFormData)
        setSignatureDataUrl('')
        setPhotos([])
        setInvoiceFiles([])
        setSupportingFiles([])
        setUploadsRestored(true)
        setCurrentStepIndex(0)
        setShowErrors(false)

        replaceRoute({
            screen: 'workflow',
            stepId: 'account',
        })

        setRoute({
            screen: 'workflow',
            stepId: 'account',
        })
    }

    // function resetToSample() {
    //     setFormData(sampleLeakFormData)
    //     setSignatureDataUrl('')
    //     setPhotos([])
    //     setInvoiceFiles([])
    //     setSupportingFiles([])
    //     setUploadsRestored(true)
    //     setCurrentStepIndex(0)
    //     setShowErrors(false)
    // }

    function goNext() {
        setShowErrors(true)

        if (!canGoNext) return

        const nextIndex = Math.min(
            currentStepIndex + 1,
            steps.length - 1,
        )

        navigate({
            screen: 'workflow',
            stepId: steps[nextIndex].id,
        })
    }

    function goBack() {
        setShowErrors(false)

        if (currentStepIndex === 0) {
            navigate({ screen: 'intro' })
            return
        }

        const previousIndex = currentStepIndex - 1

        navigate({
            screen: 'workflow',
            stepId: steps[previousIndex].id,
        })
    }

    function hasFieldError(condition: boolean) {
        return showErrors && condition
    }

    async function handleGeneratePdf() {
        setShowErrors(true)

        if (!canGenerate || isGenerating) return

        setIsGenerating(true)

        try {
            await generateLeakAdjustmentPdf({
                formData,
                signatureDataUrl,
                photos,
                invoiceFiles,
                supportingFiles,
            })
        } catch (error) {
            console.error(error)

            alert(
                'Could not generate the PDF. Check the console for details.',
            )
        } finally {
            setIsGenerating(false)
        }
    }

    // =========================================================
    // ▶ Route rendering
    // =========================================================

    if (route.screen === 'terms') {
        return (
            <TermsPage
                onBack={() => {
                    if (window.history.length > 1) {
                        window.history.back()
                        return
                    }

                    navigate({ screen: 'intro' })
                }}
            />
        )
    }

    if (route.screen === 'intro') {
        return (
            <PreStartPage
                onStart={startWorkflow}
                onTermsClick={() => {
                    navigate({ screen: 'terms' })
                }}
            />
        )
    }

    // =========================================================
    // ▶ Main workflow
    // =========================================================

    return (
        <main className="appShell">
            <section className="hero">
                <div className="heroTopline">
                    <p className="departmentPill">
                        Miami-Dade Water & Sewer Department
                    </p>

                    {/* Local debugging only */}
                    {/*
                    <div className="debugActions">
                        <button
                            type="button"
                            className="smallButton"
                            onClick={resetToSample}
                        >
                            Sample data
                        </button>
                    </div>
                    */}
                </div>

                <h1>Underground Leak Adjustment</h1>

                <p className="heroIntro">
                    Request a reduction to your water bill
                    for an underground or concealed
                    plumbing leak.
                </p>
            </section>

            <section className="workflowLayout">
                <article className="workflowCard">
                    <WorkflowHeader
                        currentStepIndex={currentStepIndex}
                        totalSteps={steps.length}
                        currentStepTitle={currentStep.title}
                        currentStepDescription={currentStep.description}
                        progressPercent={progressPercent}
                        onReset={resetToBlank}
                    />

                    {showErrors &&
                        currentMissingItems.length > 0 && (
                            <StepErrorBox
                                title="Before continuing:"
                                items={currentMissingItems}
                            />
                        )}

                    {currentStep.id === 'account' && (
                        <AccountStep
                            formData={formData}
                            updateField={updateField}
                            hasFieldError={hasFieldError}
                        />
                    )}

                    {currentStep.id === 'contact' && (
                        <ContactStep
                            formData={formData}
                            updateField={updateField}
                            hasFieldError={hasFieldError}
                        />
                    )}

                    {currentStep.id === 'repair' && (
                        <RepairStep
                            formData={formData}
                            updateField={updateField}
                            hasFieldError={hasFieldError}
                        />
                    )}

                    {currentStep.id === 'requirements' && (
                        <RequirementsStep />
                    )}

                    {currentStep.id === 'photos' && (
                        <PhotosStep
                            photos={photos}
                            setPhotos={setPhotos}
                            hasError={hasFieldError(photos.length < 2)}
                        />
                    )}

                    {currentStep.id === 'invoice' && (
                        <InvoiceStep
                            invoiceFiles={invoiceFiles}
                            setInvoiceFiles={setInvoiceFiles}
                            hasError={hasFieldError(invoiceFiles.length === 0)}
                        />
                    )}

                    {currentStep.id === 'documents' && (
                        <SupportingDocsStep
                            supportingFiles={supportingFiles}
                            setSupportingFiles={setSupportingFiles}
                        />
                    )}

                    {currentStep.id === 'signature' && (
                        <SignatureStep
                            hasError={hasFieldError(!signatureDataUrl)}
                            signatureDataUrl={signatureDataUrl}
                            onSignatureChange={setSignatureDataUrl}
                        />
                    )}

                    {currentStep.id === 'review' && (
                        <ReviewStep
                            showErrors={showErrors}
                            allMissingItems={allMissingItems}
                            isGenerating={isGenerating}
                            onGeneratePdf={handleGeneratePdf}
                        />
                    )}

                    {currentStep.id !== 'review' && (
                        <StepActions
                            canGoBack
                            onBack={goBack}
                            onNext={goNext}
                        />
                    )}
                </article>

                <aside className="sideStack">
                    <WorkflowProgress
                        steps={steps}
                        currentStepIndex={currentStepIndex}
                    />

                    <section className="sideCard trustCard">
                        <div className="shieldIcon">🛡️</div>

                        <h3>We’re not the government</h3>

                        <p>
                            We simplify the process.
                            You submit to the agency.
                        </p>

                        <button
                            type="button"
                            className="termsInlineLink"
                            onClick={() => {
                                navigate({ screen: 'terms' })
                            }}
                        >
                            See Terms of Use →
                        </button>
                    </section>

                    <section className="sideCard plumberCard">
                        <div className="plumberIcon">🔧</div>

                        <h3>Looking for a plumber in Miami?</h3>

                        <p>
                            We may be able to help connect
                            you with someone local.
                        </p>

                        <button
                            type="button"
                            className="plumberButton"
                            onClick={() => {
                                alert('Plumber matching coming soon.')
                            }}
                        >
                            Click here
                        </button>
                    </section>
                </aside>
            </section>

            <SiteFooter
                onTermsClick={() => {
                    navigate({ screen: 'terms' })
                }}
            />
        </main>
    )
}

export default App