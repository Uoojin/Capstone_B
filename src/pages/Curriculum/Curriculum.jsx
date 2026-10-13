import './Curriculum.css';
import curriculumMockup from '../../assets/img/Curriculum.png';

export default function Curriculum() {
    return (
        <main className="curriculum">
            {/*
            <section className="curriculum-hero">
                <div className="curriculum-hero-image">
                </div>
                <span>We are</span>
                <span>디지털미디어디자인과는 디자인과 과학기술, 그리고 미디어의 융합 교육과 산업 수요를 반영한 스튜디오 중심의 교육을 통해 디지털 미디어 산업의 창조적인 문화콘텐츠를 생산할 수 있는 융합형 인재를 양성합니다.</span>
            </section>

            <section className="curriculum-circle">CONVERGENCE EDUCATION
            </section>
            <section className="curriculum-section">CURRICULUM
            </section>
            */}
            <img
                src={curriculumMockup}
                alt="Curriculum"
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                }}
            />
        </main>
    );
}
