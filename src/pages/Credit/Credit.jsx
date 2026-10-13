import './Credit.css';
import creditMockup from '../../assets/img/Credit.png';
/*
import { committee, DMD, professors } from './creditData';
*/

export default function Credit() {
    return (
        <main className="credit">
            {/*
            <section className="credit-hero">
                <div className="credit-hero-image">
                </div>
                <span>계원예술대학교 디지털미디어디자인과 졸업전시회</span>
                <span>Delight Insight 2026 : SYNCOPATE</span>
            </section>

            <CreditSection
                title="졸업준비위원회"
                data={committee}
            />

            <CreditSection
                title="디지털미디어디자인과"
                data={DMD}
            />

            <CreditSection
                title="교수진"
                data={professors}
            />
            <div className="credit-logo"></div>
            */}
            <img
                src={creditMockup}
                alt="Credit"
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                }}
            />
        </main>
    );
}

/*
function CreditSection({ title, data }) {
    return (
        <section className="credit-section">
            <h2 className="credit-section-title">
                {title}
            </h2>

            <ul className="credit-list">
                {data.map((group, groupIndex) => (
                    <li
                        className="credit-row"
                        key={`${group.title}-${groupIndex}`}
                    >
                        <span className="credit-label">
                            {group.title}
                        </span>

                        <ul className="credit-members">
                            {group.members.map((member, memberIndex) => (
                                <li
                                    className="credit-member"
                                    key={`${member}-${memberIndex}`}
                                >
                                    {member}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </section>
    );
}
*/
