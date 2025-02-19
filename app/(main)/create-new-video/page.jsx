"use client"
import React, { useState } from 'react'
import Topic from './_components/Topic'
import VideoStyle from './_components/VideoStyle';
import Voice from './_components/Voice';
import Captions from './_components/Captions';
import { Button } from '@/components/ui/button';
import { LoaderIcon, WandSparkles } from 'lucide-react';
import Preview from './_components/Preview';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthContext } from '@/app/provider';
import { toast } from 'sonner';

function CreateNewVideo() {
    const {user}=useAuthContext();
    const CreateInitialVideoRecord=useMutation(api.videoData.CreateVideoData);
    const [formData,setFormData]=useState();
    const [loading,setLoading]=useState(false);
    const onHandleInputChange=(fieldName,fieldValue)=>{
        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }))
        console.log(formData);
    }
    const GenerateVideo = async () => {
        if(user?.credits<=0){
            toast('Please Upgrade to get More Credits...')
            return;
        }
        if (!formData?.title || !formData?.script || !formData?.videoStyle || !formData?.caption || !formData?.topic || !formData?.voice) {
            console.error("Please fill all required fields");
            return;
        }
        setLoading(true);
        // Save video data first
        const resp = await CreateInitialVideoRecord({
            title: formData?.title,
            topic: formData?.topic,
            videoStyle: formData?.videoStyle,
            script: formData?.script,
            voice: formData?.voice,
            caption: formData?.caption,
            uid: user?._id,
            createdBy: user?.email,
            credits: user?.credits
        })

        // console.log(resp);
        try {
            const result = await axios.post('/api/generate-video-data', {
                ...formData,
                recordId:resp,
            });
            //console.log(result.data);
        } catch (error) {
            console.error("Error generating video:", error);
        }
        setLoading(false);
    };    
    return (
        <div>
            <h2 className='text-3xl'>Create New Video</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-7'>
                <div className='col-span-2 p-7 border rounded-xl h-[72vh] overflow-auto'>
                    {/* Topic and Script Component */}
                    <Topic onHandleInputChange={onHandleInputChange} title={formData?.title}/>
                    {/* Video Image style */}
                    <VideoStyle onHandleInputChange={onHandleInputChange}/>
                    {/* Voice  */}
                    <Voice onHandleInputChange={onHandleInputChange}/>
                    {/* captions */}
                    <Captions onHandleInputChange={onHandleInputChange}/>

                    <Button 
                    disabled={loading}
                    onClick={GenerateVideo}
                    className='w-full mt-5'>
                        {loading?
                        <LoaderIcon className='animate-spin'/>
                        :<WandSparkles/>
                        }   
                        Generate Video
                    </Button>
                </div>
                <div>
                    <Preview formData={formData}/>
                </div>
            </div>
        </div>
    )
}

export default CreateNewVideo