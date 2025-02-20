"use client"
import React, { useEffect, useState } from 'react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/app/provider';

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
];

function Explore() {
  const [videoList, setVideoList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const convex = useConvex();
  const {user}=useAuthContext();
  useEffect(() => {
    user&&fetchVideos();
  }, [user]);

  const fetchVideos = async () => {
    try {
      // Fetch all videos and filter only completed ones.
      const result = await convex.query(api.videoData.GetUserVideos, {
        uid: user?._id
      })
      const completedVideos = result.filter(video => video.status == 'completed');
      setVideoList(completedVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // Filter videos by title and video style (if selected).
  const filteredVideos = videoList.filter(video => {
    const matchesTitle = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = selectedStyle ? video.videoStyle === selectedStyle : true;
    return matchesTitle && matchesStyle;
  });

  return (
    <div className="px-4 py-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Video Style Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          {options.map((option) => (
            <button
              key={option.name}
              onClick={() =>
                setSelectedStyle(prev => prev === option.name ? '' : option.name)
              }
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${selectedStyle === option.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300'
                }`}
            >
              <Image src={option.image} alt={option.name} width={24} height={24} />
              <span>{option.name}</span>
            </button>
          ))}
          {selectedStyle && (
            <button
              onClick={() => setSelectedStyle('')}
              className="px-4 py-2 border rounded-lg bg-red-500 text-white transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-28 gap-5 p-5 border border-dashed rounded-xl py-16">
            <Image src="/logo.png" height={60} width={60} alt="logo" />
            <h2 className="text-gray-400 text-lg">
              No videos found. Try different filters or create a new one.
            </h2>
            <Link href="/create-new-video">
              <Button>Create New Video</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
            {filteredVideos.map((video, index) => (
              <Link key={index} href={`/play-video/${video._id}`} className="cursor-pointer">
                <div className="relative">
                  <Image
                    src={video.images[0]}
                    alt={video.title}
                    width={500}
                    height={500}
                    className="w-full object-cover rounded-xl aspect-[2/3]"
                  />
                  <div className="absolute bottom-3 px-5 w-full">
                    <h2 className="text-white font-semibold">{video.title}</h2>
                    <h2 className="text-sm text-gray-300">
                      {moment(video._creationTime).fromNow()}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
