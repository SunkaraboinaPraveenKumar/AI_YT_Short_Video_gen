"use client"
import { useAuthContext } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { RefreshCcw } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function VideoList() {
    const [videoList, setVideoList] = useState([]);
    const convex = useConvex();
    const { user } = useAuthContext();
    useEffect(() => {
        user && GetUserVideoList();
    }, [user])
    const GetUserVideoList = async () => {
        // All user videos
        const result = await convex.query(api.videoData.GetUserVideos, {
            uid: user?._id
        })
        // console.log(result);
        setVideoList(result);
        const isPendingVideo = result?.find((item) => item.status == 'pending')
        isPendingVideo && GetPendingVideoStatus(isPendingVideo);
    }

    const GetPendingVideoStatus = (pendingVideo) => {
        const intervalId = setInterval(async () => {
            // Get VideoData by id
            const result = await convex.query(api.videoData.GetVideoById, {
                videoId: pendingVideo?._id
            })

            if (result?.status == 'completed') {
                clearInterval(intervalId);
                console.log("Video Process Completed...")
                GetUserVideoList();
            }
            console.log("Still Executing...")
        }, 10000)
    }
    return (
        <div>
            {videoList?.length == 0 ?
                <div className='flex flex-col items-center justify-center mt-28 gap-5 p-5 border border-dashed rounded-xl py-16'>
                    <Image src={'/logo.png'} height={60} width={60} alt='logo' />
                    <h2 className='text-gray-400 text-lg'>You don't have any videos created. Create a new one...</h2>
                    <Link href={'/create-new-video'}>
                        <Button>Create New Video</Button>
                    </Link>
                </div>
                :
                <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10'>
                    {videoList?.map((video, index) => (
                        <Link key={index} href={'/play-video/'+video?._id} className='cursor-pointer'>
                            <div className='relative'>
                                {video.status == 'completed' ?
                                    <Image
                                        src={video?.images[0]}
                                        alt={video?.title}
                                        width={500}
                                        height={500}
                                        className='w-full object-cover rounded-xl aspect-[2/3]'
                                    /> :
                                    <div className='flex items-center justify-center gap-2 aspect-[2/3] p-5 w-full rounded-xl bg-slate-900'>
                                        <RefreshCcw className='animate-spin' />
                                        <h2>Generating...</h2>
                                    </div>
                                }
                                <div className='absolute bottom-3 px-5 w-full'>
                                    <h2>{video?.title}</h2>
                                    <h2 className='text-sm'>{moment(video?._creationTime).fromNow()}</h2>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            }
        </div>
    )
}

export default VideoList