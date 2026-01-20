import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';
import { getProject } from '../services/projectService.Remote';
import Lottie from 'lottie-react';
import { MessageSquare, SmartphoneIcon, TabletIcon, LaptopIcon, X, SaveIcon, FullscreenIcon, DownloadIcon, ShareIcon, EyeOffIcon, EyeIcon, Loader2 } from 'lucide-react';
import loadingSpinner from '../assets/imgs/loadingJSON.json';
import favicon from '../assets/imgs/favicon.svg';
import { Sidebar } from '../cmps/sidebar';
import { ProjectPreview } from '../cmps/projectPreview';
export function ProjectPage() {

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(true)
    const [device, setDevice] = useState("desktop")
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const previewRef = useRef(null)

    const { projectId } = useParams()
    const navigate = useNavigate()


    const fetchProject = async () => {
        try {
            const response = await getProject(projectId)
            if (response && response.data) {
                // Use conversation and versions from the project
                setProject({
                    ...response.data,
                    conversation: response.data.conversation || [],
                    versions: response.data.versions || [],
                    current_version_index: response.data.current_version_index || ''
                })
                // Set generating state based on whether code exists
                setIsGenerating(!response.data.current_code || response.data.current_code.trim() === '')
                setLoading(false)
            } else {
                navigate('/projects')
            }

        } catch (error) {
            console.error('Error fetching project:', error)
            setLoading(false)
            navigate('/projects')
        }
    }

    const saveProjet = async () => { }

    const downloadCode = () => { 
        const code = previewRef.current?.getCode() || project?.current_code
        if(!code){
            if(isGenerating){
                alert('Please wait for the code to be generated...')
                return
            }
            return
        }
        const element = document.createElement('a')
        const file = new Blob([code], { type: 'text/html' })
        element.href = URL.createObjectURL(file)
        element.download = `index.html`
        document.body.appendChild(element)
        element.click()
    }

    const togglePublish = async () => { }

    useEffect(() => {
        fetchProject();
    }, []);
    useEffect(() => {
        if (!projectId) {
            navigate('/projects')
        }
    }, [projectId, navigate])


    if (loading) {
        return <div className="flex justify-center items-center">
            <Lottie
                animationData={loadingSpinner}
                loop={true}
                style={{ width: '100px', height: '100px' }}
            />
        </div>
    }

    return (
        <div className="projects-page">
            <Header />
            {project ? (
                <main className="flex flex-col h-screen w-full bg-gray-900 text-white main-content">
                    <div className="builder-navbar flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar">
                        <div className="left-navbar-part flex item-center gap-2 sm:min-w-90 text-nowrap">
                            <img src={favicon} alt="project logo" className="h-6 cursor-pointer" onClick={() => navigate('/')} />
                            <div className="max-w-64 sm:max-w-xs">
                                <p className="text-sm text-medium capitalize truncate">{project.name}</p>
                                <p className="text-xs text-gray-400 -mt-0.5">Previewing last saved version</p>
                            </div>
                            <div className="sm:hidden flex-1 flex justify-end">
                                {isMenuOpen ? (
                                    <MessageSquare className="size-6 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
                                ) : (
                                    <X className="size-6 cursor-pointer" onClick={() => setIsMenuOpen(true)} />
                                )}
                            </div>
                        </div>
                        <div className="middle-navbar-part">
                            <SmartphoneIcon onClick={() => setDevice("phone")} className={`size-6 cursor-pointer p-1 rounded ${device === "phone" ? "bg-gray-700" : ""}`} />
                            <TabletIcon onClick={() => setDevice("tablet")} className={`size-6 cursor-pointer p-1 rounded ${device === "tablet" ? "bg-gray-700" : ""}`} />
                            <LaptopIcon onClick={() => setDevice("desktop")} className={`size-6 cursor-pointer p-1 rounded ${device === "desktop" ? "bg-gray-700" : ""}`} />
                        </div>
                        <div className="right-navbar-part flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm">
                            <button onClick={saveProjet} disabled={isSaving} className="cursor-pointer max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700">
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <SaveIcon size={16} />}
                                save
                            </button>
                            <Link target='_blank' to={`/preview/${project.id}`} className="cursor-pointer flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm transition-colors text-white no-underline" style={{ border: '1px solid rgba(156, 163, 175, 0.73)' }}>
                                <FullscreenIcon size={16} /> Preview
                            </Link>
                            <button onClick={downloadCode} className='cursor-pointer text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors' style={{ background: 'linear-gradient(to bottom right, rgb(29, 78, 216), rgb(37, 99, 235))' }}>
                                <DownloadIcon size={16} /> Download
                            </button>
                            <button onClick={togglePublish} className="cursor-pointer text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors" style={{ background: 'linear-gradient(to bottom right, rgb(67, 56, 202), rgb(79, 70, 229))' }}>
                                {project.isPublished ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                {project.isPublished ? "Unpublish" : "Publish"}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 flex overflow-hidden">
                        <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p) => setProject(p)} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />

                        <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} showEditorPanel={true} />
                        
                    </div>
                </main>
            ) : (
                <main className="text-2xl font-medium  text-gray-200 main-content">
                    <h1>No project found</h1>
                </main>
            )}
            <Footer />
        </div>
    )
}