import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Lottie from "lottie-react"
import loadingAnimation from "../assets/imgs/loadingJSON.json"
import { ProjectPreview } from "../cmps/projectPreview"
import { getProject } from "../services/projectService.Remote"


export function PreviewPage() {
    const {projectId} = useParams()
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchCode = async () => {
        try {
            const response = await getProject(projectId)
            if(response && response.data){
                setTimeout(() => {
                    setCode(response.data.current_code)
                    setLoading(false)
                }, 2000)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching project:', error)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCode()
    }, [])
    if(loading){
        return <div className="flex h-screen justify-center items-center">
            <Lottie animationData={loadingAnimation} loop={true} style={{ width: '100px', height: '100px' }} />
        </div>
    }
    return (
        <div className="preview-page h-screen">
            {code && <ProjectPreview project={{current_code: code}} isGenerating={false} showEditorPanel={false}/>}
        </div>
    )
}