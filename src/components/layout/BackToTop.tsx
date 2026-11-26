'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }}
      className="
        fixed bottom-18 right-6 z-50
        flex h-14 w-14 items-center justify-center
        rounded-full
        bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500
        text-white
        shadow-lg shadow-orange-500/30
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        focus-visible:outline-none
        focus-visible:ring-4 focus-visible:ring-orange-300
      "
    >
        <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        >
        <path d="M12 19V5" />
        <path d="M7 10.5L12 5.5L17 10.5" />
        </svg>
    </button>
  );
}