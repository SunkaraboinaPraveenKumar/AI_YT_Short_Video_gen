import React, { useState } from 'react'

const options = [
    {
        name: 'Youtuber',
        style: 'font-bold text-2xl uppercase text-red-600',
    },
    {
        name: 'Supreme',
        style: 'font-extrabold text-3xl uppercase text-white px-2 py-1 tracking-wide',
    },
    {
        name: 'Neon',
        style: 'font-mono font-semibold text-2xl text-green-400 drop-shadow-[0_0_10px_rgba(57,255,20,1)]',
    },
    {
        name: 'Glitch',
        style: 'relative font-bold text-2xl uppercase text-pink-600 before:content-[attr(data-text)] before:absolute before:top-0 before:left-1 before:text-blue-600 before:opacity-75 before:blur-[2px]',
    },
    {
        name: 'Fire',
        style: 'font-bold text-2xl text-yellow-400 bg-gradient-to-t from-red-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent',
    },
    {
        name: 'Futuristic',
        style: 'font-sans font-semibold text-2xl uppercase text-cyan-400 tracking-wide drop-shadow-[0_0_10px_rgba(56,189,248,0.8)] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent',
    }
];


function Captions({ onHandleInputChange }) {
    const [selectedCaptionStyle, setSelectedCaptionStyle] = useState();
    return (
        <div className='mt-5'>
            <h2>Caption Style</h2>
            <p className='text-sm text-gray-400'>Select Caption Style</p>

            <div className='flex flex-wrap gap-4 mt-3'>
                {options.map((option, index) => (
                    <div
                    key={index}
                        className={`p-2 hover:border rounded-lg bg-slate-900 border-gray-300 cursor-pointer
                    ${option?.name == selectedCaptionStyle && 'border'}
                    `}
                        onClick={() => {
                            setSelectedCaptionStyle(option?.name)
                            onHandleInputChange('caption', option)
                        }}
                    >
                        <h2 key={index} className={option?.style}>{option?.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Captions