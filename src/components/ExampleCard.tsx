/* src/components/ExampleCard.tsx */

type ExampleCardProps = {
  title: string
  description: string
}

function ExampleCard({ title, description }: ExampleCardProps) {
  return (
    <section className="exampleCard">
      <p className="eyebrow">React + Vite</p>
      <h1>{title}</h1>
      <p>{description}</p>

      <div className="commandList">
        <code>npm run dev</code>
        <code>npm run build</code>
        <code>npm run deploy</code>
      </div>
    </section>
  )
}

export default ExampleCard
