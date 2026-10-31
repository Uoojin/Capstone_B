import letsSync from "../../../../assets/LET'SSYNC!.svg"

export default function Section05() {
  return <section className="home-sync-finale" aria-label="LET’S SYNC!">
    <div className="home-sync-finale-content">
      <img src={letsSync} alt="LET’S SYNC!" width="1267" height="322" draggable="false" />
      <p className="home-sync-finale-description">
        <span>서로 다른 우리는 함께 배우고 시도하며 서로의 가능성을 넓혀왔습니다.</span>
        <span>함께 나눈 생각과 경험은 각자의 다음으로 이어집니다.</span>
        <span>앞으로도 우리는 새로운 만남과 연결 속에서 또 다른 가능성을 만들어갈 것입니다.</span>
      </p>
    </div>
  </section>
}
