import videoSrc from '../../../../assets/sync-opate.webm'

export default function TypeVideo() {
  return (
    <section className="typeVideo" aria-label="타이포 인터랙션 영상">
      <div className="typeVideo__media">
        <video autoPlay loop muted playsInline preload="auto">
          <source src={videoSrc} type="video/webm" />
        </video>
      </div>
    </section>
  )
}
