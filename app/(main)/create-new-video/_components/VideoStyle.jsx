import Image from 'next/image'
import React, { useState } from 'react'

export const options = [
    {
        name: 'Realistic',
        image: '/realistic.png'
    },
    {
        name: 'Cinematic',
        image: '/cinematic.png'
    },
    {
        name: 'Cartoon',
        image: '/cartoon.png'
    },
    {
        name: 'Cyberpunk',
        image: '/cyberpunk.png'
    },
    {
        name: 'GTA',
        image: '/gta.png'
    },
    {
        name: 'Anim',
        image: '/anim.png'
    },
    {
        name: 'Water Color',
        image: '/watercolor.png'
    },
]

function VideoStyle({ onHandleInputChange }) {
    const [selectedStyle, setSelectedStyle] = useState();
    return (
        <div className='mt-5'>
            <h2>Video Styles</h2>
            <p className='text-sm text-gray-400 mb-1'>Select Video Style</p>

            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2'>
                {options.map((option, index) => (
                    <div className='relative'
                        key={index}
                        onClick={() => {
                            setSelectedStyle(option?.name);
                            onHandleInputChange('videoStyle', option?.name)
                        }}
                    >
                        {option?.image && (
                            <Image
                                src={option?.image}
                                alt={option?.name}
                                width={500}
                                height={120}
                                className={`object-cover h-[70px]
                                lg:h-[90px]
                                xl:h-[150px]
                                rounded-lg p-1
                                hover:border border-gray-300 cursor-pointer
                                ${option?.name == selectedStyle && 'border'}
                                `}
                            />
                        )}
                        <h2 className='absolute bottom-1 text-center w-full'>{option?.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoStyle