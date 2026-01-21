import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { iframeScript } from '../data/assets'
import '../assets/styles/cmps/ProjectPreview.css'
import { EditorPanel } from './EditorPanel'



export const ProjectPreview = forwardRef(({ project, isGenerating, device = 'desktop', showEditorPanel = true }, ref) => {

    const iframeRef = useRef(null)
    const resolution = {
        phone: 'w-[412px]',
        tablet: 'w-[768px]',
        desktop: 'w-full',
    }
    useImperativeHandle(ref, () => ({
        getCode: () => {
            const doc = iframeRef.current?.contentDocument
            if(!doc) return undefined
            //remove all selected elements
            doc.querySelectorAll('.ai-selected-element, [data-ai-selected]').forEach(el => {
                el.classList.remove('ai-selected-element')
                el.removeAttribute('data-ai-selected')
                el.style.outline = ''
            })
            const previewStyle = doc.getElementById('ai-preview-style')
            if(previewStyle) previewStyle.remove()

            const previewScript = doc.getElementById('ai-preview-script')
            if(previewScript) previewScript.remove()
            
            const html = doc.documentElement.outerHTML
            return html
        }
    }))
    const [selectedElement, setSelectedElement] = useState(null)

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(event.data.payload)
            } else if (event.data.type === 'CLEAR_SELECTION') {
                setSelectedElement(null)
            }
        }
        
        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    const handleUpdate = (updates)=>{
        if(iframeRef.current?.contentWindow){
            iframeRef.current.contentWindow.postMessage({type: 'UPDATE_ELEMENT', payload: updates}, '*')
        }
    }
    
    const injectPreview = (html) => {
        if (!html) return ''
        if (!showEditorPanel) return html
        if (html.includes('</body>')) {
            return html.replace('</body>', `${iframeScript}</body>`)
        } else {
            return html + iframeScript
        }
    }

    return (
        <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2 px-4">
            {project.current_code ? (
                <>
                    <iframe
                        srcDoc={injectPreview(project.current_code)}
                        sandbox="allow-scripts allow-same-origin"
                        ref={iframeRef}
                        className={`h-full max-sm:w-full ${resolution[device]} mx-auto transition-all flex items-center justify-center`}
                    />
                    {showEditorPanel && selectedElement &&(
                        <EditorPanel selectedElement={selectedElement} onUpdate={handleUpdate} onClose={() => {
                            setSelectedElement(null)
                            if(iframeRef.current?.contentWindow){
                                iframeRef.current.contentWindow.postMessage({type: 'CLEAR_SELECTION_REQUEST'}, '*')
                            }
                        }} />
                    )}
                </>
            ) : isGenerating && (
                <div className="no-preview">Generating preview...</div>
            )}
        </div>
    )
})

ProjectPreview.displayName = 'ProjectPreview'