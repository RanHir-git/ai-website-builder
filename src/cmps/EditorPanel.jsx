import { useState, useEffect } from 'react'
import { X } from 'lucide-react'



export function EditorPanel({ selectedElement, onUpdate, onClose }) {

    const [values, setValues] = useState(() => ({
        text: selectedElement?.text || '',
        className: selectedElement?.className || '',
        styles: selectedElement?.styles || {
            padding: '',
            margin: '',
            fontSize: '',
            backgroundColor: '',
            color: ''
        }
    }))

    useEffect(() => {
        setValues({
            text: selectedElement?.text || '',
            className: selectedElement?.className || '',
            styles: selectedElement?.styles || {
                padding: '',
                margin: '',
                fontSize: '',
                backgroundColor: '',
                color: ''
            }
        })
    }, [selectedElement])

    const handleChange = (field, value) => {
        const newValues = { ...values, [field]: value }
        setValues(newValues)
        onUpdate({ [field]: value })
    }

    const handleStyleChange = (styleName, value) => {
        const newStyles = { ...values.styles, [styleName]: value }
        setValues({ ...values, styles: newStyles })
        onUpdate({ styles: { [styleName]: value } })
    }

    if (!selectedElement || !values) return null
    return (
        <div className="absolute top-4 right-4 w-64 sm:w-72 md:w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50 p-3 sm:p-4 z-50 animate-fade-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Edit Element</h3>
                <button onClick={onClose} className="-1 hover:bg-gray-100/50 rounded-full p-1">
                    <X className="size-3 sm:size-4 text-gray-500" />
                </button>
            </div>
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-black">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Text Content</label>
                    <textarea className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none min-h-16 sm:min-h-20" value={values.text} onChange={(e) => handleChange('text', e.target.value)}></textarea>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Class Name</label>
                    <input type="text" className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" value={values.className || ''} onChange={(e) => handleChange('className', e.target.value)}></input>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Padding</label>
                        <input type="text" className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" value={values.styles.padding} onChange={(e) => handleStyleChange('padding', e.target.value)}></input>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Margin</label>
                        <input type="text" className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" value={values.styles.margin} onChange={(e) => handleStyleChange('margin', e.target.value)}></input>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Font Size</label>
                        <input type="text" className="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" value={values.styles.fontSize} onChange={(e) => handleStyleChange('fontSize', e.target.value)}></input>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Background</label>
                        <div className="flex items-center gap-1.5 sm:gap-2 border border-gray-400 rounded-md p-0.5 sm:p-1">
                            <input type="color" className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer border-none p-0" value={values.styles.backgroundColor === 'rgba(0,0,0,0)' ? '#ffffff' : values.styles.backgroundColor} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}></input>
                            <span className="text-xs text-gray-500 truncate">{values.styles.backgroundColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Text Color</label>
                        <div className="flex items-center gap-1.5 sm:gap-2 border border-gray-400 rounded-md p-0.5 sm:p-1">
                            <input type="color" className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer border-none p-0" value={values.styles.color} onChange={(e) => handleStyleChange('color', e.target.value)}></input>
                            <span className="text-xs text-gray-500 truncate">{values.styles.color}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}