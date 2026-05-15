/* src/components/SiteFooter.tsx */

type SiteFooterProps = {
    onTermsClick: () => void
}

export function SiteFooter({ onTermsClick }: SiteFooterProps) {
    return (
        <footer className="siteFooter">
            <div className="footerPrimary">
                <span>🔒 Your data stays in this browser</span>

                <span>
                    🏛️ Not affiliated with Miami-Dade County
                </span>

                <a
                    href="#terms"
                    onClick={(event) => {
                        event.preventDefault()
                        onTermsClick()
                    }}
                >
                    Terms of Use
                </a>

                <a
                    href="https://github.com/crdunwel/underground-leak-adjustment-request"
                    target="_blank"
                    rel="noreferrer"
                >
                    Open source
                </a>
            </div>

            <div className="footerSecondary">
                <span>
                    Need custom software for your business?
                </span>

                <a
                    href={`mailto:clayton.dunwell@gmail.com?subject=${encodeURIComponent(
                        'Custom software inquiry',
                    )}&body=${encodeURIComponent(
                        [
                            'Hi Clayton,',
                            '',
                            'I found you through the Underground Leak Adjustment tool.',
                            '',
                            "I'm interested in:",
                            '',
                            '- Business / industry:',
                            '- Current workflow or problem:',
                            '- What feels frustrating or manual today:',
                            '- What outcome I’m hoping for:',
                            '',
                            'Additional details:',
                            '',
                        ].join('\n'),
                    )}`}
                >
                    Let’s talk →
                </a>
            </div>
        </footer>
    )
}