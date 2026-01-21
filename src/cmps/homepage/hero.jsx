import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { createProject } from '../../services/projectService.Remote'
import { getUserCredits } from '../../services/userService'
import LoginModal from '../LoginModal'

export function Hero() {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
  
    const onSubmitHandler = async (e) => {
      e.preventDefault()
      setError(null)

      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setShowLoginModal(true)
        return
      }

      // Check if textarea is empty
      if (!input.trim()) {
        setError('Please describe your website')
        return
      }

      // Check if user has credits (use user.credits if available, otherwise fetch)
      let userCredits = user?.credits
      if (userCredits === undefined) {
        try {
          const creditsData = await getUserCredits()
          userCredits = creditsData?.credits
        } catch (err) {
          console.error('Error fetching credits:', err)
        }
      }
      
      if (!userCredits || userCredits <= 4) {
        setError('You don\'t have enough credits to create a project')
        return
      }

      try {
        setIsLoading(true)

        // Create project with AI
        const response = await createProject({
          name: input.trim().substring(0, 50) || 'New Project', // Use first 50 chars as name
          initialPrompt: input.trim(),
          // No current_code - AI will generate it
        })

        if (response && response.data && response.data.id) {
          // Navigate to the new project
          navigate(`/project/${response.data.id}`)
        } else {
          setError('Failed to create project')
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Error creating project:', err)
        setError(err.message || 'Failed to create project. Please try again.')
        setIsLoading(false)
      }
    }
  
    return (
        <section className="flex flex-col items-center text-white text-sm pb-20 px-4 pt-20 font-poppins relative">
          <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
            Turn thoughts into a website instantly, with AI.
          </h1>
  
          <p className="text-center text-base max-w-md mt-2">
            Create, customize and deploy your website faster than ever with intelligent design powered by AI.
          </p>
  
          <form onSubmit={onSubmitHandler} className="hero-form bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all relative">
            <textarea 
              onChange={e => setInput(e.target.value)} 
              value={input}
              className="bg-transparent outline-none text-gray-300 resize-none w-full hero-textarea" 
              rows={4} 
              placeholder="Describe your website in details" 
              required 
              disabled={isLoading}
            />
            {error && (
              <div className="text-red-400 text-sm mt-2 mb-2">{error}</div>
            )}
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="hero-submit-btn flex items-center gap-2 bg-gradient-to-r from-[#CB52D4] to-indigo-600 rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create with AI'}
            </button>
          </form>
          {showLoginModal && (
            <LoginModal 
              isOpen={showLoginModal} 
              onClose={() => {
                setShowLoginModal(false)
                // After login, user can try again
              }}
            />
          )}
  
          <div className="flex flex-wrap items-center justify-center gap-16 md:gap-20 mx-auto mt-16">
            <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" alt="" />
            <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" alt="" />
            <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" alt="" />
            <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" alt="" />
            <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" alt="" />
          </div>
        </section>
    )
}