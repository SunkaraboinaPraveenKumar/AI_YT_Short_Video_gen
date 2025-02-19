import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

const voiceOptions = [
    { "value": "af_sarah", "name": "\u{1F1FA}\u{1F1F8} Sarah (Female)" },  // 🇺🇸
    { "value": "af_sky", "name": "\u{1F1FA}\u{1F1F8} Sky (Female)" },     // 🇺🇸
    { "value": "am_adam", "name": "\u{1F1FA}\u{1F1F8} Adam (Male)" },     // 🇺🇸
    { "value": "hf_alpha", "name": "\u{1F1EE}\u{1F1F3} Alpha (Female)" }, // 🇮🇳
    { "value": "hf_beta", "name": "\u{1F1EE}\u{1F1F3} Beta (Female)" },  // 🇮🇳
    { "value": "hm_omega", "name": "\u{1F1EE}\u{1F1F3} Omega (Male)" },  // 🇮🇳
    { "value": "hm_psi", "name": "\u{1F1EE}\u{1F1F3} Psi (Male)" },     // 🇮🇳
    { "value": "aura-asteria-en", "name": "\u{1F1FA}\u{1F1F8} Asteria (Female)" },
    { "value": "aura-luna-en", "name": "\u{1F1FA}\u{1F1F8} Luna (Female)" },    
    { "value": "aura-stella-en", "name": "\u{1F1FA}\u{1F1F8} Stella (Female)" },
    { "value": "aura-athena-en", "name": "\u{1F1FA}\u{1F1F8} Athena (Female)" },
];

function Voice({ onHandleInputChange }) {
    const [selectedVoice, setSelectedVoice] = useState();
    return (
        <div className='mt-5'>
            <h2>Video Voice</h2>
            <p className='text-sm text-gray-400'>Select Voice for your Video...</p>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-3">
                <div className='grid grid-cols-2 gap-3'>
                    {voiceOptions.map((voice, index) => (
                        <h2 key={index} className=
                            {`cursor-pointer p-3 dark:bg-slate-900 dark:border-white rounded-lg hover:border
                    ${voice.name === selectedVoice && 'border'}
                `}
                            onClick={() => {setSelectedVoice(voice.name)
                                onHandleInputChange('voice',voice.value)
                            }}
                        >
                            {voice.name}
                        </h2>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default Voice