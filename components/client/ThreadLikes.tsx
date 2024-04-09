'use client'
import { fetchLikesForThread, likeThread } from '@/lib/actions/thread.actions';
import { Client } from '@clerk/nextjs/server';
import { useUser } from '@clerk/nextjs';

import Image from "next/image";
// ThreadLikes.tsx (Client Component)
import { useEffect, useState } from 'react';

interface ThreadLikesProps {
  initialLikesCount: number;
  threadId: string; // Add threadId prop to identify the thread
}

export const ThreadLikes: React.FC<ThreadLikesProps> = ({ initialLikesCount,threadId  }) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  const handleLikeClick = async () => {
    if (userId && !isUpdating) {
      try {
        setIsUpdating(true);
        // Call likeThread and toggle based on current state
        const response = await likeThread(threadId, userId); // Assume it returns new like state
        setIsLiked(response.liked);
        setLikesCount(response.likesCount); // Update likes count in UI
  
        // Trigger animation by toggling a class or state
        // Here, we use `isLiked` state to control the animation through CSS
      } catch (error) {
        console.error('Error toggling thread like:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };
  useEffect(() => {
    const initializeLikeState = async () => {
      if (userId) { // Ensure userId is available
        try {
          // Pass userId to fetchLikesForThread
          const { likesCount, isLikedByCurrentUser } = await fetchLikesForThread(threadId, userId);
          setLikesCount(likesCount);
          setIsLiked(isLikedByCurrentUser);
        } catch (error) {
          console.error("Failed to initialize likes state:", error);
        }
      }
    };
  
    initializeLikeState();
  }, [threadId, userId]);
  return (
    <div className='flex'>
      <button onClick={handleLikeClick}   className={`like-button ${isLiked ? 'liked' : ''}`}>
  {/* Example with an inline SVG */}
  <svg viewBox="0 0 24 24" className="heart-svg" width={24} height={24}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
  
</button>

      <span className='text-gray-200'>{likesCount}</span>
    </div>
  );
};


