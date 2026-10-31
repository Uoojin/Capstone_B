import exhibitionFilm from '../../../../assets/sync_story.webm'

export default function Video({ filmRef }) {
  return (
    <section className="home-film" aria-label="LET’S SYNC! 전시 영상">
      <video ref={filmRef} src={exhibitionFilm} muted playsInline preload="metadata" />
    </section>
  )
}
