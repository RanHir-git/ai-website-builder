/**
 * AI Service
 * Handles AI operations for generating and modifying HTML code
 */

import OpenAI from 'openai'

// Lazy initialization: Create OpenAI client only when needed (after env vars are loaded)
let openai = null

const getOpenAIClient = () => {
  if (!openai) {
    const apiKey = (process.env.OPENAI_API_KEY || '').trim()
    console.log('🔍 AI Service: Creating OpenAI client (lazy init)')
    console.log('🔍 AI Service: Key available:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO')
    if (apiKey) {
      console.log('🔍 AI Service: First 15 chars:', apiKey.substring(0, 15))
    }
    openai = new OpenAI({
      apiKey: apiKey,
    })
  }
  return openai
}

/**
 * System prompts from System Prompt.txt
 */
const SYSTEM_PROMPTS = {
  enhanceCreate: `You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

Enhance this prompt by:
1. Adding specific design details (layout, color scheme, typography)
2. Specifying key sections and features
3. Describing the user experience and interactions
4. Including modern web design best practices
5. Mentioning responsive design requirements
6. Adding any missing but important elements

Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).`,

  generateCreate: (enhancedPrompt) => `You are an expert web developer. Create a complete, production-ready website based on this request: "${enhancedPrompt}"

CRITICAL REQUIREMENTS:
- You MUST output valid HTML ONLY. 
- Use Tailwind CSS for ALL styling
- Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
- Use Tailwind utility classes extensively for styling, animations, and responsiveness
- Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
- Use modern, beautiful design with great UX using Tailwind classes
- Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
- Use Tailwind animations and transitions (animate-*, transition-*)
- Include all necessary meta tags
- Use Google Fonts CDN if needed for custom fonts
- Use placeholder images from https://placehold.co/600x400
- Use Tailwind gradient classes for beautiful backgrounds
- Make sure all buttons, cards, and components use Tailwind styling

MULTI-PAGE HANDLING (CRITICAL):
- If the user requests "separate pages", "multiple pages", or navigation to different sections (like Home, About, Services, Portfolio, Contact), you MUST create a SINGLE-PAGE APPLICATION (SPA)
- ALL content must be in ONE HTML file with multiple sections
- Use JavaScript to show/hide different sections when navigation links are clicked
- Navigation links should use JavaScript event listeners (onclick or addEventListener), NOT href links to separate files like "about.html"
- Each section should have a unique ID (e.g., id="home", id="about", id="services")
- When a nav link is clicked, hide all sections and show only the clicked section
- Add smooth transitions between sections
- Example: <section id="home">...</section><section id="about" style="display:none">...</section>
- JavaScript should handle: document.getElementById('about').style.display = 'block' and hide others with display='none'

CRITICAL HARD RULES:
1. You MUST put ALL output ONLY into message.content.
2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
4. Do NOT include markdown, explanations, notes, or code fences.
5. Do NOT create separate HTML files - everything must be in ONE HTML file with JavaScript navigation.

The HTML should be complete and ready to render as-is with Tailwind CSS.`,

  enhanceModify: `You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

Enhance this by:
1. Being specific about what elements to change
2. Mentioning design details (colors, spacing, sizes)
3. Clarifying the desired outcome
4. Using clear technical terms

Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`,

  generateModify: `You are an expert web developer. 

CRITICAL REQUIREMENTS:
- Return ONLY the complete updated HTML code with the requested changes.
- Use Tailwind CSS for ALL styling (NO custom CSS).
- Use Tailwind utility classes for all styling changes.
- Include all JavaScript in <script> tags before closing </body>
- Make sure it's a complete, standalone HTML document with Tailwind CSS
- Return the HTML Code Only, nothing else
- If the user requests separate pages or multiple pages, maintain the single-page application (SPA) structure with JavaScript navigation
- All content must remain in ONE HTML file - do NOT create separate files
- Use JavaScript show/hide functionality for multi-page navigation

Apply the requested changes while maintaining the Tailwind CSS styling approach and single-file structure.`
}

/**
 * Enhance user prompt for creating a project
 * @param {string} userPrompt - Original user prompt
 * @returns {Promise<string>} Enhanced prompt
 */
export const enhanceCreatePrompt = async (userPrompt) => {
  try {
    const client = getOpenAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo', // Free tier compatible
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.enhanceCreate,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error enhancing create prompt:', error)
    // Provide more specific error message
    if (error.message) {
      throw new Error(`Failed to enhance prompt: ${error.message}`)
    }
    throw new Error('Failed to enhance prompt. Please check your OpenAI API key and try again.')
  }
}

/**
 * Generate HTML code for creating a project
 * @param {string} enhancedPrompt - Enhanced prompt
 * @returns {Promise<string>} Generated HTML code
 */
export const generateHTML = async (enhancedPrompt) => {
  try {
    const client = getOpenAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo', // Free tier compatible
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.generateCreate(enhancedPrompt),
        },
        {
          role: 'user',
          content: 'Generate the website code now.',
        },
      ],
      temperature: 0.7,
      max_tokens: 4000, // HTML can be long
    })

    let htmlCode = response.choices[0].message.content.trim()

    // Remove markdown code fences if present
    htmlCode = htmlCode.replace(/^```html\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim()

    return htmlCode
  } catch (error) {
    console.error('Error generating HTML:', error)
    // Provide more specific error message
    if (error.message) {
      throw new Error(`Failed to generate HTML code: ${error.message}`)
    }
    throw new Error('Failed to generate HTML code. Please check your OpenAI API key and try again.')
  }
}

/**
 * Enhance user prompt for modifying a project
 * @param {string} userPrompt - Original modification request
 * @returns {Promise<string>} Enhanced modification request
 */
export const enhanceModifyPrompt = async (userPrompt) => {
  try {
    const client = getOpenAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo', // Free tier compatible
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.enhanceModify,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error enhancing modify prompt:', error)
    throw new Error('Failed to enhance modification prompt')
  }
}

/**
 * Modify existing HTML code based on user request
 * @param {string} currentHTML - Current HTML code
 * @param {string} enhancedPrompt - Enhanced modification request
 * @returns {Promise<string>} Modified HTML code
 */
export const modifyHTML = async (currentHTML, enhancedPrompt) => {
  try {
    const client = getOpenAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo', // Free tier compatible
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.generateModify,
        },
        {
          role: 'user',
          content: `Current HTML code:\n\n${currentHTML}\n\n\nRequested changes: ${enhancedPrompt}\n\nGenerate the updated HTML code.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    let htmlCode = response.choices[0].message.content.trim()

    // Remove markdown code fences if present
    htmlCode = htmlCode.replace(/^```html\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim()

    return htmlCode
  } catch (error) {
    console.error('Error modifying HTML:', error)
    throw new Error('Failed to modify HTML code')
  }
}

/**
 * Generate a descriptive summary of what was created
 * @param {string} userPrompt - Original user prompt
 * @param {string} htmlCode - Generated HTML code
 * @returns {Promise<string>} Descriptive summary message
 */
const generateCreationSummary = async (userPrompt, htmlCode) => {
  try {
    const client = getOpenAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Based on the user\'s request and the generated HTML code, write a brief, friendly message (2-3 sentences) describing what website was created. Focus on key features, design elements, and sections. Be conversational and positive.',
        },
        {
          role: 'user',
          content: `User requested: "${userPrompt}"\n\nGenerated HTML code preview (first 500 chars): ${htmlCode.substring(0, 500)}\n\nWrite a friendly message describing what was created.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating creation summary:', error)
    // Fallback to a simple message
    return `I've created your website based on your request: "${userPrompt}". The website is now ready with all the features you requested!`
  }
}

/**
 * Generate a descriptive summary of what was modified
 * @param {string} userRequest - User's modification request
 * @param {string} htmlCode - Modified HTML code
 * @returns {Promise<string>} Descriptive summary message
 */
const generateModificationSummary = async (userRequest, htmlCode) => {
  try {
    const client = getOpenAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Based on the user\'s modification request, write a brief, friendly message (1-2 sentences) describing what changes were made. Be specific about what was changed (colors, layout, content, etc.). Be conversational and positive.',
        },
        {
          role: 'user',
          content: `User requested: "${userRequest}"\n\nWrite a friendly message describing what was changed. Be specific - if colors were changed, mention which colors. If layout changed, mention what changed.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating modification summary:', error)
    // Fallback to a simple message
    return `I've updated your website based on your request: "${userRequest}". The changes have been applied successfully!`
  }
}

/**
 * Complete flow: Create project with AI generation
 * @param {string} userPrompt - Original user prompt
 * @returns {Promise<Object>} { enhancedPrompt, htmlCode, userMessage, aiMessage }
 */
export const createProjectWithAI = async (userPrompt) => {
  // Step 1: Enhance the prompt
  const enhancedPrompt = await enhanceCreatePrompt(userPrompt)

  // Step 2: Generate HTML
  const htmlCode = await generateHTML(enhancedPrompt)

  // Step 3: Generate descriptive summary message
  const summaryMessage = await generateCreationSummary(userPrompt, htmlCode)

  // Return data for saving conversations
  return {
    enhancedPrompt,
    htmlCode,
    userMessage: userPrompt, // Original user prompt
    aiMessage: summaryMessage, // Descriptive summary instead of HTML
  }
}

/**
 * Complete flow: Modify project with AI
 * @param {string} currentHTML - Current HTML code
 * @param {string} userRequest - User's modification request
 * @returns {Promise<Object>} { enhancedPrompt, htmlCode, userMessage, aiMessage }
 */
export const modifyProjectWithAI = async (currentHTML, userRequest) => {
  // Step 1: Enhance the modification request
  const enhancedPrompt = await enhanceModifyPrompt(userRequest)

  // Step 2: Modify HTML
  const htmlCode = await modifyHTML(currentHTML, enhancedPrompt)

  // Step 3: Generate descriptive summary message
  const summaryMessage = await generateModificationSummary(userRequest, htmlCode)

  // Return data for saving conversations
  return {
    enhancedPrompt,
    htmlCode,
    userMessage: userRequest, // Original user request
    aiMessage: summaryMessage, // Descriptive summary instead of HTML
  }
}
