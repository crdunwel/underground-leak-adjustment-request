/* src/components/PreStartPage.tsx */

import { SeoFaq } from './SeoFaq'
import { SiteFooter } from './SiteFooter'

import { assetPath } from '../lib/assetPath'

import '@/styles/pre-start.css'

type PreStartPageProps = {
    onStart: () => void
    onTermsClick: () => void
}

export function PreStartPage({ onStart,  onTermsClick }: PreStartPageProps) {
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

                        {/* src/components/PreStartPage.tsx */}

                        <div className="preStartLeakBanner" aria-hidden="true">
                            <img
                                src={assetPath('illustration.png')}
                                alt=""
                                className="preStartLeakBannerImage"
                            />
                        </div>

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
                                href={assetPath(
                                    'underground-leak-adjustment-request.pdf',
                                )}
                                target="_blank"
                                rel="noreferrer"
                            >
                                📄 View official PDF
                            </a>
                        </div>

                        <p className="browserNote">
                            🔒 Your information stays in this browser.
                        </p>
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
                                🚰
                            </span>

                            <h3>What it is</h3>

                            <p>
                                A Miami-Dade form for requesting a
                                leak-related water bill adjustment.
                            </p>
                        </article>

                        <article className="overviewCard">
                            <span className="overviewIcon greenIcon">
                                ✅
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
                                📁
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
                                🚫
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

            <div className="preStartDivider" aria-hidden="true" />

            <SeoFaq />
            <SiteFooter onTermsClick={onTermsClick} />
        </main>
    )
}