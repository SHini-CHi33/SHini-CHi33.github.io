'use client';

import { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 计算滚动进度百分比
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };

    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
    // 初始化一次
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '4px', // 进度条的粗细
        // 下面这行就是橙黄渐变！
        background: 'linear-gradient(to right, #f97316, #facc15)',
        zIndex: 9999, // 保证它在网页最上层
        transition: 'width 0.1s ease-out', // 让滑动稍微平滑一点
      }}
    />
  );
}