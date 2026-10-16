import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Project from './pages/Project/Project.jsx'
import Student from './pages/Student/Student.jsx'
import Credit from './pages/Credit/Credit.jsx'
import Curriculum from './pages/Curriculum/Curriculum.jsx'
import Syncopate from './pages/Content/Syncopate.jsx'
import Guestbook from './pages/Guestbook/Guestbook.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="/student" element={<Student />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/syncopate" element={<Syncopate />} />
        <Route path="/guestbook" element={<Guestbook />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
