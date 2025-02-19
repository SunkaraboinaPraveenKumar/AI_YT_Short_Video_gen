"use client"
import React, { useEffect } from 'react'
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

function RemotionComposition({ videoData, setDurationInFrames }) {
    console.log(videoData?.caption?.style);
    const { fps } = useVideoConfig();
    const captions = videoData?.captionJson;
    const frame = useCurrentFrame();
    const imagesList = videoData?.images;

    useEffect(() => {
        if (videoData) {
            const totalDuration = getDurationFrame();
            setDurationInFrames(totalDuration);
        }
    }, [videoData]);

    const getDurationFrame = () => {
        const totalDuration = captions&&captions[captions?.length - 1]?.end * fps;
        return totalDuration;
    };

    const getCurrentCaption = () => {
        const currentTime = frame / fps;
        const currentCaption = captions?.find((item) => currentTime >= item.start && currentTime <= item.end);
        return currentCaption ? currentCaption?.word : '';
    };

    return (
        <div>
            <AbsoluteFill>
                {imagesList?.map((item, index) => {
                    const startTime = (index * getDurationFrame()) / imagesList?.length;
                    const duration = getDurationFrame();
                    const scale = (index) => interpolate(
                        frame,
                        [startTime, startTime + duration / 2, startTime + duration],
                        index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    );
                    return (
                        <Sequence key={index} from={startTime} durationInFrames={duration}>
                            <AbsoluteFill>
                                <Img
                                    src={item}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transform: `scale(${scale(index)})`
                                    }}
                                />
                            </AbsoluteFill>
                        </Sequence>
                    );
                })}
            </AbsoluteFill>
            <AbsoluteFill
            style={{
                justifyContent:'center',
                bottom:50,
                height:2000,
                textAlign:'center',
             }}
            >
                <h2 className={`${videoData?.caption?.style} text-5xl`}>
                    {getCurrentCaption()}
                </h2>
                {videoData?.audioUrl && <Audio src={videoData?.audioUrl} />}
            </AbsoluteFill>
        </div>
    );
}

export default RemotionComposition;