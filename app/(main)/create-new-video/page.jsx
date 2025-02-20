"use client";
import React, { useState, useEffect } from "react";
import Topic from "./_components/Topic";
import VideoStyle from "./_components/VideoStyle";
import Voice from "./_components/Voice";
import Captions from "./_components/Captions";
import { Button } from "@/components/ui/button";
import { LoaderIcon, WandSparkles } from "lucide-react";
import Preview from "./_components/Preview";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthContext } from "@/app/provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAudioRecorder from "@/hooks/UseAudioRecorder";

function CreateNewVideo() {
  const { user } = useAuthContext();
  const router = useRouter();
  const CreateInitialVideoRecord = useMutation(api.videoData.CreateVideoData);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { audioURL, recording, startRecording } = useAudioRecorder();

  // isFormComplete: all required fields are present AND audioURL is available
  const isFormComplete =
    formData?.title &&
    formData?.script &&
    formData?.videoStyle &&
    formData?.caption &&
    formData?.topic &&
    formData?.voice &&
    audioURL;

  // As soon as the user selects a script, start recording automatically
  useEffect(() => {
    if (formData.script && !recording && !audioURL) {
      startRecording(formData.script).catch((error) => {
        console.error("Error during recording:", error);
        toast("Error recording audio, please try again.");
      });
    }
  }, [formData.script]);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GenerateVideo = async () => {
    if (user?.credits <= 0) {
      toast("Please Upgrade to get More Credits...");
      return;
    }
    if (!isFormComplete) {
      toast("Please complete all fields and wait until audio is recorded.");
      return;
    }
    setLoading(true);
    // Save the initial video record in your database
    const recordId = await CreateInitialVideoRecord({
      title: formData.title,
      topic: formData.topic,
      videoStyle: formData.videoStyle,
      script: formData.script,
      voice: formData.voice,
      caption: formData.caption,
      uid: user._id,
      createdBy: user.email,
      credits: user.credits,
    });

    try {
      await axios.post("/api/generate-video-data", {
        script:formData?.script,
        videoStyle:formData?.videoStyle,
        voice: formData?.voice,
        recordId,
        audioUrl: audioURL,
      });
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error generating video:", error);
      toast("There was an error generating your video. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-3xl">Create New Video</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-7">
        <div className="col-span-2 p-7 border rounded-xl h-[72vh] overflow-auto">
          <Topic onHandleInputChange={onHandleInputChange} title={formData?.title} />
          <VideoStyle onHandleInputChange={onHandleInputChange} />
          <Voice onHandleInputChange={onHandleInputChange} />
          <Captions onHandleInputChange={onHandleInputChange} />
          <Button
            disabled={!isFormComplete || loading}
            onClick={GenerateVideo}
            className="w-full mt-5"
          >
            {loading ? <LoaderIcon className="animate-spin" /> : <WandSparkles />}
            Generate Video
          </Button>
        </div>
        <div>
          <Preview formData={formData} />
        </div>
      </div>
    </div>
  );
}

export default CreateNewVideo;
