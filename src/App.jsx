import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { MyProjectsPage } from './pages/MyProjectsPage'
import { CommunityPage } from './pages/CommunityPage'
import { PricingPage } from './pages/PricingPage'
import { ProjectPage } from './pages/Project'
import { PreviewPage } from './pages/Preview'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/MyProjects" element={<MyProjectsPage />} />
        <Route path="/Company" element={<CommunityPage />} />
        <Route path="/Pricing" element={<PricingPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/preview/:projectId" element={<PreviewPage />}/>
        <Route path="/preview/:projectId/:versionId" element={<PreviewPage />}/>
        <Route path="/view/:projectId" element={<PreviewPage />}/>
      </Routes>
    </div>
  )
}

export default App
