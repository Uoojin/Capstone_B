import { Link, useLocation } from 'react-router-dom'
import instagramIcon from '../../assets/footer/icon01.svg'
import youtubeIcon from '../../assets/footer/icon02.svg'
import socialIcon from '../../assets/footer/icon03.svg'
import './Footer.css'

const footerPages = new Set(['/', '/project', '/student', '/guestbook', '/curriculum'])

export default function Footer() {
  const { pathname } = useLocation()
  if (!footerPages.has(pathname.replace(/\/+$/, '') || '/')) return null

  return (
    <footer className={`site-footer${(pathname.replace(/\/+$/, '') || '/') === '/' ? ' site-footer--home' : ''}`} aria-label="전시 안내 및 연락처">
      <Link className="site-footer__brand" to="/">LET’S SYNC!</Link>
      <h2 className="site-footer__heading site-footer__about-heading">About</h2>
      <h2 className="site-footer__heading site-footer__contact-heading">Contact</h2>
      <div className="site-footer__socials" aria-label="SNS">
        <img src={instagramIcon} alt="Instagram" width="24" height="24" />
        <img src={youtubeIcon} alt="YouTube" width="24" height="24" />
        <img src={socialIcon} alt="추가 SNS" width="24" height="24" />
      </div>

      <div className="site-footer__socials" aria-label="SNS">
        <a
          href="https://www.instagram.com/kw_dmd/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src={instagramIcon} alt="" width="24" height="24" />
        </a>

        <a
          href="https://www.youtube.com/@계원예술대학교디지털"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <img src={youtubeIcon} alt="" width="24" height="24" />
        </a>

        <a
          href="https://m.blog.naver.com/PostList.naver?blogId=kaywon_dmd&tab=1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="추가 SNS"
        >
          <img src={socialIcon} alt="" width="24" height="24" />
        </a>
      </div>

      <div className="site-footer__about">
        <p>Kaywon University of Arts&amp;Design</p>
        <p>Digital Media Design</p>
        <p>33rd Delight Insight</p>
      </div>
      <dl className="site-footer__contact">
        <dt>Tell</dt><dd>031-424-7509</dd>
        <dt>FAX</dt><dd>1899-5823</dd>
        <dt>E-mail</dt><dd><a href="mailto:kaywon@kaywon.ac.kr">kaywon@kaywon.ac.kr</a></dd>
      </dl>
    </footer>
  )
}


