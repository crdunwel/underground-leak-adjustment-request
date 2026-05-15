/* src/pages/TermsPage.tsx */

type TermsPageProps = {
    onBack: () => void
}

export function TermsPage({ onBack }: TermsPageProps) {
    return (
        <main className="appShell termsShell">
            <section className="termsCard">
                <button
                    type="button"
                    className="secondaryButton"
                    onClick={onBack}
                >

                    ← Back
                </button>

                <h1>Terms of Use</h1>

                <p className="termsIntro">
                    This tool helps users prepare the official Miami-Dade Water & Sewer
                    Department Underground Leak Adjustment Request form.
                </p>

                <div className="termsSections">
                    <section>
                        <h2>Not affiliated with Miami-Dade County</h2>

                        <p>
                            This website is an independent tool and is not operated by,
                            endorsed by, or affiliated with Miami-Dade County or any
                            government agency.
                        </p>
                    </section>

                    <section>
                        <h2>Information and document preparation only</h2>

                        <p>
                            We help organize information and generate a completed PDF
                            using the information you provide. We do not submit forms on
                            your behalf, make approval decisions, or communicate with the
                            government for you.
                        </p>
                    </section>

                    <section>
                        <h2>You are responsible for your submission</h2>

                        <p>
                            Before submitting any document, you should review the final
                            PDF carefully and confirm that all information is accurate,
                            complete, and current.
                        </p>
                    </section>

                    <section>
                        <h2>No guarantee of approval</h2>

                        <p>
                            Using this tool does not guarantee approval, adjustments,
                            refunds, or any outcome from Miami-Dade County or any other
                            agency.
                        </p>
                    </section>

                    <section>
                        <h2>Use at your own discretion</h2>

                        <p>
                            This tool is provided “as is” without warranties of any kind.
                            We are not responsible for rejected submissions, processing
                            delays, incorrect information entered by users, or changes to
                            government forms or requirements.
                        </p>
                    </section>

                    <section>
                        <h2>Privacy</h2>

                        <p>
                            Your information stays in your browser unless you choose to
                            send it elsewhere. We currently do not require accounts or
                            store submitted form data on a server.
                        </p>
                    </section>

                    <section>
                        <h2>Contact</h2>

                        <p>
                            Questions or feedback:
                            {' '}
                            <a href="mailto:clayton.dunwell@gmail.com">
                                clayton.dunwell@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </section>
        </main>
    )
}