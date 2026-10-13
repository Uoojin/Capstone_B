import TypeInteraction from '../../components/TypeInteraction/TypeInteraction.jsx'
import './Home.css'

export default function Home() {
  return (
    <main className="home-page" aria-label="Home">
      <section className="home-hero" aria-label="TYPE interaction">
        <TypeInteraction />
      </section>
    </main>
  )
}
