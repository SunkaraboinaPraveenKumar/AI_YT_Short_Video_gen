"use client"
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader, SparklesIcon } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuthContext } from '@/app/provider'

const suggestions = [
    "Historical Story",
    "Kids Story",
    "Movie Stories",
    "AI Innovations",
    "Space Mysteries",
    "Horror Stories",
    "Mythological Tales",
    "Tech Breakthroughs",
    "True Crime Stories",
    "Fantasy Adventures",
    "Science Experiments",
    "Motivational Stories",
    "SCIFI Stories"
]

function Topic({ onHandleInputChange, title }) {
    const [selectedTopic, setSelectedTopic] = useState();
    const [selectedScriptIndex, setSelectedScriptIndex] = useState();
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user}=useAuthContext();
    const GenerateScript = async () => {
        if(user?.credits<=0){
            toast('Please Upgrade to get More Credits...')
            return;
        }
        setLoading(true);
        setSelectedScriptIndex(null);
        try {
            const result = await axios.post('/api/generate-script', {
                topic: selectedTopic,
                title:title
            })
            console.log(result.data.scripts);
            setScripts(result.data.scripts);
        }
        catch (error) {
            setLoading(false);
            console.log(error);
        }
        setLoading(false);
    }
    return (
        <div>
            <h2 className='mb-1'>Project Title</h2>
            <Input placeholder="Enter Project Title..."
                onChange={(e) => onHandleInputChange('title', e.target.value)} />
            <div className='mt-5'>
                <h2>Video Topic</h2>
                <p className='text-sm text-gray-600'>Select topic for your Video...</p>
                <Tabs defaultValue="suggestion" className="w-full mt-2">
                    <TabsList>
                        <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
                        <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="suggestion">
                        <div className=''>
                            {suggestions.map((suggestion, index) => (
                                <Button key={index} variant='outline'
                                    className={`m-1 ${selectedTopic == suggestion && 'bg-secondary'}`}
                                    onClick={() => {
                                        setSelectedTopic(suggestion)
                                        onHandleInputChange('topic', suggestion)
                                    }}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="your_topic">
                        <div>
                            <h2 className='mb-1'>Enter your own topic</h2>
                            <Textarea placeholder='Enter Your Topic....'
                                onChange={(e) => onHandleInputChange('topic', e.target.value)} />
                        </div>
                    </TabsContent>
                </Tabs>
                {scripts?.length > 0 &&
                    <div className='mt-3'>
                        <h2>Select the Script</h2>
                        <div className='grid grid-cols-2 gap-5 mt-1'>
                            {scripts?.map((item, index) => (
                                <div key={index}
                                    onClick={() => {setSelectedScriptIndex(index)
                                        onHandleInputChange('script',item?.content)
                                    }}
                                    className={`p-3 border rounded-lg mt-3 cursor-pointer
                                ${selectedScriptIndex == index && 'bg-secondary border-white'}
                                `}>
                                    <h2 className='line-clamp-4 text-sm text-gray-400'>{item?.content}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
            <Button className='mt-3' size="sm"
                onClick={GenerateScript}
                disabled={loading}
            >
                {loading ?
                    <Loader className='animate-spin' />
                    :
                    <SparklesIcon />
                }
                Generate Script
            </Button>
        </div>
    )
}

export default Topic