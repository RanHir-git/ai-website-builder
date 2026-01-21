import { useState, useRef, useEffect } from 'react'
import { BotIcon, UserIcon, EyeIcon, SendIcon, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { updateProject } from '../services/projectService.Remote'


export function Sidebar({ isMenuOpen, project, setProject, isGenerating, setIsGenerating }) {
    const messagesRef = useRef(null)
    const [input, setInput] = useState('')
    const handleRollBack = async (verId) => {
        // Find the version by ID
        const version = project?.versions?.find(v => v.id === verId)
        if (!version || !project?.id) return

        try {
            // Update project with rolled-back version
            const response = await updateProject(project.id, {
                current_code: version.code,
                current_version_index: verId,
            })

            if (response && response.data) {
                // Update project state with rolled-back version
                setProject({
                    ...response.data,
                    conversation: response.data.conversation || project.conversation || [],
                    versions: response.data.versions || project.versions || [],
                    current_version_index: verId,
                    current_code: version.code,
                })
            }
        } catch (error) {
            console.error('Error rolling back version:', error)
            alert('Failed to roll back version: ' + error.message)
        }
    }
    const handleRevision = async (e) => {
        e.preventDefault()
        
        if (!input.trim() || !project?.id) return

        setIsGenerating(true)
        const userRequest = input.trim()
        setInput('') // Clear input

        try {
            // Call backend to modify project with AI
            const response = await updateProject(project.id, {
                modificationRequest: userRequest,
                // Don't send current_code - backend will get it from database
            })

            if (response && response.data) {
                // Update project with new data (includes updated conversation and code)
                setProject({
                    ...response.data,
                    conversation: response.data.conversation || project.conversation || [],
                    versions: response.data.versions || project.versions || [],
                    current_version_index: response.data.current_version_index || project.current_version_index || ''
                })
                setIsGenerating(false)
            } else {
                throw new Error('Failed to update project')
            }
        } catch (error) {
            console.error('Error modifying project:', error)
            setIsGenerating(false)
            // Optionally show error to user
            alert(error.message || 'Failed to modify project. Please try again.')
        }
    }

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [project?.conversation?.length, isGenerating])
    return (
        <div className="sidebar">
            <main className={`sidebar-main-content h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="massages-container flex-1 overflow-y-auto px-3 flex flex-col gap-4">
                        {[...(project?.conversation || []), ...(project?.versions || [])].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((message) => {
                                const isMessage = 'content' in message
                                if (isMessage) {
                                    const msg = message
                                    const isUser = msg.role === 'user'
                                    return (
                                        <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`} >
                                            {!isUser && (
                                                <div>
                                                    <BotIcon className='size-5 text-white' />
                                                </div>
                                            )}
                                            <div className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-relaxed ${isUser ? 'text-white rounded-tr-none' : 'rounded-tl-none bg-gray-800 text-gray-100'}`} style={isUser ? { background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(79, 70, 229))' } : {}}>
                                                {msg.content}
                                            </div>
                                            {isUser && (
                                                <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center'>
                                                    <UserIcon className='size-5 text-gray-200' />
                                                </div>
                                            )}
                                        </div>
                                    )
                                }
                                else {
                                    const ver = message
                                    return (
                                        <div key={ver.id} className="w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col gap-2">
                                            <div className="text-xs font-medium">
                                                code updated<br /><span className='text-xs text-gray-500 font-normal'>
                                                    {new Date(ver.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                {project.current_version_index === ver.id ? (
                                                    <button className='px-3 py-1 rounded-md text-xs bg-gray-700 text-gray-300'>Current version</button>
                                                ) : (
                                                    <button onClick={() => handleRollBack(ver.id)} className='px-3 py-1 rounded-md text-xs bg-indigo-500 hover:bg-indigo-600 text-white'>Roll back to this version</button>
                                                )}
                                                <Link target='_blank' to={`/preview/${project.id}/${ver.id}`}>
                                                    <EyeIcon className='size-6 bg-gray-700 hover:bg-indigo-500 transition-colors rounded' />
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        {isGenerating && (
                            <div className='flex items-start justify-start gap-3'>
                                <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ background: 'linear-gradient(to bottom right, rgb(79, 70, 229), rgb(67, 56, 202))' }}>
                                    <BotIcon className='size-5 text-white' />
                                </div>
                                <div className="three-dots flex gap-1.5 h-full items-end">
                                    <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{ animationDelay: '0s' }} />
                                    <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{ animationDelay: '0.2s' }} />
                                    <span className='size-2 rounded-full animate-bounce bg-gray-600' style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesRef} />
                    </div>
                    <form className="input-area-container m-3 relative" onSubmit={handleRevision}>
                        <div className='flex items-center gap-2'>
                            <textarea onChange={e => setInput(e.target.value)} value={input} rows={4} placeholder='Describe your website or request changes...' className='flex-1 p-3 rounded-xl resize-none text-sm outline-none ring ring-gray-700 focus:ring-indigo-500 bg-gray-800 text-gray-100 placeholder:text-gray-400 transition-all' disabled={isGenerating} />
                            <button type="submit" disabled={isGenerating || !input.trim()} className='cursor-pointer rounded-full p-1.5 transition-all disabled:opacity-50 flex-shrink-0 border-none outline-none hover:opacity-90' style={{ background: 'linear-gradient(to bottom right, rgb(79, 70, 229), rgb(67, 56, 202))' }}>
                                {isGenerating ? <Loader2 className='size-5 text-white animate-spin' />
                                    : <SendIcon className='size-5 text-white' style={{ transform: 'translate(-1px, 2px)' }} />}
                            </button>
                        </div>
                    </form>

                </div>
            </main>
        </div>
    )

}