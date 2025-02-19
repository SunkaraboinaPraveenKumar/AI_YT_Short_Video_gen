"use client"
import React, { useState } from 'react'
import { Player } from "@remotion/player";
import RemotionComposition from '@/app/_components/RemotionComposition';

function RemotionPlayer({ videoData }) {
    const [durationInFrames, setDurationInFrames] = useState(100);
    return (
        <div>
            <Player
                component={RemotionComposition}
                durationInFrames={Number(durationInFrames?.toFixed(0)) + 100}
                compositionWidth={720}
                compositionHeight={1280}
                fps={30}
                controls
                inputProps={{
                    videoData: videoData,
                    setDurationInFrames: (frameValue) => setDurationInFrames(frameValue)
                }}
                style={{
                    width: '25vw',
                    height: '70vh'
                }}
            />
        </div>
    )
}

export default RemotionPlayer;