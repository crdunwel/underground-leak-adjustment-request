/* src/components/PreStartPage.tsx */

/* src/components/PreStartPage.tsx */

import { SeoFaq } from './SeoFaq'
import { SiteFooter } from './SiteFooter'

import { assetPath } from '../lib/assetPath'

import '@/styles/pre-start.css'

type PreStartPageProps = {
    onStart: () => void
    onTermsClick: () => void
}

function FaucetIcon() {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9 9h9" />
            <path d="M14 9V6h8v3" />
            <path d="M18 9v5h4a5 5 0 0 1 5 5v1" />
            <path d="M7 14h12" />
            <path d="M7 14v5h8v-5" />
            <path d="M25 22c1.4 1.7 2.1 3 2.1 4a2.1 2.1 0 0 1-4.2 0c0-1 .7-2.3 2.1-4Z" />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="11" />

            <path d="M10.5 16.5 14.5 20.5 22 12.5" />
        </svg>
    )
}

function FolderIcon() {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M4 10h9l2.5 3H28v13H4z" />
            <path d="M4 10v-2h8l2 2" />
        </svg>
    )
}

function NoIcon() {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="12" />
            <path d="M8 8l16 16" />
        </svg>
    )
}

export function PreStartPage({
                                 onStart,
                                 onTermsClick,
                             }: PreStartPageProps) {
    return (
        <main className="appShell preStartShell">
            <section className="preStartPanel">
                <div className="preStartHeroRow">
                    <div className="preStartCopy">
                        <p className="departmentPill">
                            Miami-Dade Water & Sewer Department
                        </p>

                        <h1>Underground Leak Adjustment</h1>

                        <p className="preStartIntro">
                            This tool helps you fill out the official
                            Miami-Dade underground leak adjustment form
                            and generate a completed PDF packet for
                            submission.
                        </p>

                        <picture>
                            <source
                                srcSet={assetPath('illustration.webp')}
                                type="image/webp"
                            />

                            <img
                                src={assetPath('illustration.jpg')}
                                alt=""
                                className="preStartLeakBannerImage"
                            />
                        </picture>

                        <div className="preStartActions">
                            <button
                                type="button"
                                className="primaryButton"
                                onClick={onStart}
                            >
                                → Start the form
                            </button>

                            <a
                                className="secondaryLinkButton"
                                href="https://www.miamidade.gov/resources/water/documents/forms/underground-leak-adjustment-request.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
                                📄 View Official PDF
                            </a>
                        </div>

                        <div className="preStartTrustNotes">
                            <p className="browserNote">
                                🔒 Your information stays in this browser.
                            </p>

                            <p className="officialOptionNote">
                                You can also complete this process directly through the official Miami-Dade website.
                            </p>

                            <a
                                className="officialSiteLink"
                                href="https://www.miamidade.gov/global/service.page?Mduid_service=ser1481317436214369"
                                target="_blank"
                                rel="noreferrer"
                            >
                                ↗ Official Miami-Dade leak page
                            </a>
                        </div>
                    </div>

                    <div
                        className="preStartIllustration"
                        aria-hidden="true"
                    >
                        <div className="clipboardIcon">
                            <div className="clipTop" />

                            <strong>
                                Leak Adjustment Request
                            </strong>

                            <span />
                            <span />
                            <span />
                            <span />
                        </div>

                        <div className="dropBadge">💧</div>
                    </div>
                </div>

                <div className="overviewBlock">
                    <h2>Quick overview</h2>

                    <div className="overviewGrid">
                        <article className="overviewCard">
                            <span className="overviewIcon blueIcon">
                                <FaucetIcon />
                            </span>

                            <h3>What it is</h3>

                            <p>
                                A Miami-Dade form for requesting a
                                leak-related water bill adjustment.
                            </p>
                        </article>

                        <article className="overviewCard">
                            <span className="overviewIcon greenIcon">
                                <CheckIcon />
                            </span>

                            <h3>Use it when</h3>

                            <p>
                                Your water bill increased because of
                                an underground or concealed leak and
                                the repair is complete.
                            </p>
                        </article>

                        <article className="overviewCard">
                            <span className="overviewIcon goldIcon">
                                <FolderIcon />
                            </span>

                            <h3>What you need</h3>

                            <p>
                                Repair documents and before/after
                                photos. We help generate the signed
                                PDF packet.
                            </p>
                        </article>

                        <article className="overviewCard">
                            <span className="overviewIcon redIcon">
                                <NoIcon />
                            </span>

                            <h3>What it is not</h3>

                            <p>
                                We are not Miami-Dade County and
                                cannot approve or deny adjustments.
                            </p>
                        </article>
                    </div>

                    <div className="preStartNotice">
                        <span>🛡️</span>

                        <p>
                            We are not the Miami-Dade Government.
                            This tool only helps you complete and
                            organize the official form.
                        </p>
                    </div>
                </div>
            </section>

            <div
                className="preStartDivider"
                aria-hidden="true"
            />

            <SeoFaq />

            <SiteFooter onTermsClick={onTermsClick} />
        </main>
    )
}