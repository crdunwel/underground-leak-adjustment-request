/* src/components/StepErrorBox.tsx */

type StepErrorBoxProps = {
    title: string
    items: string[]
}

export function StepErrorBox({ title, items }: StepErrorBoxProps) {
    return (
        <div className="errorBox">
            <strong>{title}</strong>

            <ul>
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    )
}