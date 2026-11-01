import SyncTypographyMotion from './SyncTypographyMotion.jsx'

export default function Section03({ closingText = '' }) {
  return (
    <section className="home-sync-video" aria-label="LET’S SYNC! 모션 영상">
      <div className="home-sync-video-intro">
        <h2 className="home-sync-video-title">Pull,Play<span>Syncopate</span></h2>
        <p className="home-sync-video-description">
          서로를 향한 당김은 작은 움직임에서 시작됩니다. 서로 다른 개성이 닿아 반응이 일어나고, 그 반응은 또 다른 만남으로 번져갑니다.
        </p>
      </div>
      <SyncTypographyMotion />
      <div className="home-sync-video-closing" hidden={!closingText}>
        {closingText && <p>{closingText}</p>}
      </div>
    </section>
  )
}
