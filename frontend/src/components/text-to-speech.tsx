import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineSpeakerphone, HiOutlinePause, HiOutlineStop } from 'react-icons/hi';
import { Button } from './index';

interface TextToSpeechProps {
  text: string;
  className?: string;
}

export default function TextToSpeech({ text, className = '' }: TextToSpeechProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = () => {
    // Stop any existing speech
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }

    // Create new speech utterance
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    // Set voice (prefer a natural-sounding voice)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Natural') || 
      voice.name.includes('Premium')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      speechRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      speechRef.current = null;
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    speechRef.current = null;
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      speak();
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  // Cleanup on unmount
  const cleanup = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }
  };

  // Add cleanup to window beforeunload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup);
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        onClick={handleTogglePlay}
        variant="ghost"
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        title={isPlaying ? (isPaused ? t('news.resume') : t('news.pause')) : t('news.listenToArticle')}
      >
        {isPlaying ? (
          isPaused ? (
            <HiOutlineSpeakerphone className="h-4 w-4" />
          ) : (
            <HiOutlinePause className="h-4 w-4" />
          )
        ) : (
          <HiOutlineSpeakerphone className="h-4 w-4" />
        )}
      </Button>
      
      {isPlaying && (
        <Button
          onClick={stop}
          variant="ghost"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          title={t('news.stop')}
        >
          <HiOutlineStop className="h-4 w-4" />
        </Button>
      )}
      
      {isPlaying && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isPaused ? t('news.paused') : t('news.playing')}
        </span>
      )}
    </div>
  );
} 