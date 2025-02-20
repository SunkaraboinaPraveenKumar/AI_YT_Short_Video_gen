// hooks/useAudioRecorder.js
import { useState, useRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/configs/firebaseConfig";

const storage = getStorage(app);

export default function useAudioRecorder() {
  const [audioURL, setAudioURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async (text) => {
    if (!navigator.mediaDevices || !window.speechSynthesis) {
      throw new Error("Browser does not support required APIs.");
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      // Upload to Firebase Storage
      const fileName = `audio/${Date.now()}.wav`;
      const audioRef = ref(storage, fileName);
      await uploadBytes(audioRef, audioBlob);
      const downloadURL = await getDownloadURL(audioRef);
      setAudioURL(downloadURL);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
    // When speech synthesis finishes, stop recording
    utterance.onend = () => {
      mediaRecorderRef.current.stop();
      setRecording(false);
    };
    synth.speak(utterance);
  };

  return { audioURL, recording, startRecording };
}
