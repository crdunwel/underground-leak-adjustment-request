/* src/components/SeoFaq.tsx */

export function SeoFaq() {
    const contactSubject =
        'Question about Underground Leak Adjustment Request'

    const contactBody = [
        'Hello Water and Sewer Department,',
        '',
        'I have a question about the Underground / Concealed Leak Adjustment Request.',
        '',
        'My question:',
        '',
        '',
        'Name:',
        'Service address:',
        'Account number:',
        '',
    ].join('\n')

    return (
        <section className="seoFaq" aria-labelledby="seo-faq-title">
            <div className="seoFaqHeader">
                <h2 id="seo-faq-title">
                    Common questions about underground leak adjustments
                </h2>

                <p>
                    This helper prepares a PDF packet for the Miami-Dade
                    Underground or Concealed Leak Adjustment Request. It does
                    not submit the request for you.
                </p>
            </div>

            <div className="seoFaqGrid">
                <article>
                    <h3>What is an underground or concealed leak?</h3>
                    <p>
                        An underground or concealed leak is usually a plumbing
                        leak hidden underground, behind a wall, under concrete,
                        or somewhere you cannot easily see. Many homeowners
                        first discover it after receiving an unusually large
                        water bill.
                    </p>
                </article>

                <article>
                    <h3>Why did my water bill suddenly become so high?</h3>
                    <p>
                        A hidden plumbing leak can allow water to run
                        continuously for days or weeks without being obvious.
                        Many people only realize there is a problem after
                        receiving a much larger bill than normal.
                    </p>
                </article>

                <article>
                    <h3>What does this app help me do?</h3>
                    <p>
                        It helps you complete the official Miami-Dade adjustment
                        request, organize repair photos and documents, sign the
                        form digitally, and generate one PDF packet ready for
                        submission.
                    </p>
                </article>

                <article>
                    <h3>What documents should I include?</h3>
                    <p>
                        You should include the completed signed form generated
                        by this tool, a repair invoice or repair statement, and
                        before and after photos of the plumbing repair.
                    </p>
                </article>

                <article>
                    <h3>Do repairs need to be completed first?</h3>
                    <p>
                        Usually yes. Repairs should generally be completed
                        before submitting the adjustment request. Keep clear
                        photos of the repair area before it gets covered.
                    </p>
                </article>

                <article>
                    <h3>Does this app submit the request for me?</h3>
                    <p>
                        No. This app only helps prepare the completed packet.
                        You still need to submit the documents to Miami-Dade
                        Water and Sewer Department yourself.
                    </p>
                </article>

                <article>
                    <h3>Does this app store my information?</h3>
                    <p>
                        Your draft, signature, photos, and documents stay in
                        your browser. They are not uploaded to a server by this
                        app.
                    </p>
                </article>

                <article>
                    <h3>Can approval be guaranteed?</h3>
                    <p>
                        No. Miami-Dade decides whether an adjustment is approved
                        after reviewing the request and supporting
                        documentation.
                    </p>
                </article>

                <article className="submitPacketCard">
                    <div>
                        <h3>Where do I submit the completed packet?</h3>
                        <p>
                            The official form currently lists this contact
                            information for Miami-Dade Water and Sewer.
                        </p>
                    </div>

                    <div className="faqContactCard">
                        <a
                            className="faqEmailLink"
                            href={`mailto:WASD-CreditRequest@miamidade.gov?subject=${encodeURIComponent(
                                contactSubject,
                            )}&body=${encodeURIComponent(contactBody)}`}
                        >
                            ✉️ WASD-CreditRequest@miamidade.gov
                        </a>

                        <a className="faqPhoneLink" href="tel:3056657477">
                            📞 305-665-7477
                        </a>

                        <div className="faqAddress">
                            <strong>Water and Sewer Department</strong>
                            <span>3071 SW 38 Avenue</span>
                            <span>Miami, FL 33146-1520</span>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    )
}