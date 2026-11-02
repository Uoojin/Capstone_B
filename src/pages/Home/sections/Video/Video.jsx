import exhibitionFilm from '../../../../assets/sync_story.webm'

export default function Video({ filmRef }) {
  return (
    <section className="home-film" aria-label="LET’S SYNC! 전시 영상">
      <div className="home-film-stage">
        <div className="home-film-media">
          <video ref={filmRef} src={exhibitionFilm} muted loop playsInline preload="auto" />
        </div>
      </div>
    </section>
  )
}
