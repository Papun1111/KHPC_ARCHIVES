"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;       // ms per character
  startDelay?: number;  // ms before starting
  enabled?: boolean;    // trigger the animation
}

export function useTypewriter({
  text,
  speed = 35,
  startDelay = 200,
  enabled = true,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const reset = useCallback(() => {
    setDisplayedText("");
    setIsComplete(false);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (!enabled || !text) {
      reset();
      return;
    }

    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    const startTyping = () => {
      setIsTyping(true);

      const typeNext = () => {
        if (charIndex < text.length) {
          charIndex++;
          setDisplayedText(text.slice(0, charIndex));
          timeout = setTimeout(typeNext, speed);
        } else {
          setIsComplete(true);
          setIsTyping(false);
        }
      };

      typeNext();
    };

    timeout = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [text, speed, startDelay, enabled, reset]);

  return { displayedText, isComplete, isTyping, reset };
}
