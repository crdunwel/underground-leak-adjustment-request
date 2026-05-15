/* src/components/RequirementsStep.tsx */

export function RequirementsStep() {
    return (
        <div className="stepBody formGrid">
            <section className="subSection">
                <div className="subSectionHeader">
                    <h3>Next, we’ll build your packet</h3>

                    <p>
                        In the next few steps, you’ll upload the documents
                        Miami-Dade asks for. At the end, we’ll generate one
                        signed PDF packet for you to download.
                    </p>
                </div>

                <div className="requirementsGrid">
                    <article className="requirementCard">
                        <div className="requirementIcon">📸</div>

                        <div className="requirementContent">
                            <strong>Step 1: Add repair photos</strong>

                            <p>
                                Upload before and after photos of the repair.
                                Wider photos are helpful because they show where
                                the repair was located on the property.
                            </p>
                        </div>
                    </article>

                    <article className="requirementCard">
                        <div className="requirementIcon">🧾</div>

                        <div className="requirementContent">
                            <strong>Step 2: Add the repair document</strong>

                            <p>
                                Upload the invoice, repair statement, receipt,
                                or work order that supports what was repaired,
                                when it was repaired, and where it was repaired.
                            </p>
                        </div>
                    </article>

                    <article className="requirementCard">
                        <div className="requirementIcon">📎</div>

                        <div className="requirementContent">
                            <strong>Step 3: Add anything extra</strong>

                            <p>
                                If you have extra receipts, third-party damage
                                paperwork, or other proof, you can add it too.
                                This step is optional.
                            </p>
                        </div>
                    </article>

                    <article className="requirementCard">
                        <div className="requirementIcon">✍️</div>

                        <div className="requirementContent">
                            <strong>Step 4: Sign and download</strong>

                            <p>
                                After you sign, we’ll create the completed
                                adjustment request form and attach your uploaded
                                documents into one PDF packet.
                            </p>
                        </div>
                    </article>
                </div>

                <div className="simpleNotice">
                    <strong>Important:</strong>
                    <p>
                        Repairs should be complete before submitting. If the
                        repair area has not been covered yet, take clear photos
                        first. Miami-Dade may need to verify the repair.
                    </p>
                </div>
            </section>
        </div>
    )
}