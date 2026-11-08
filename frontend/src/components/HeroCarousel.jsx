import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Send, ShieldCheck, ArrowRight, Pause, Play } from 'lucide-react';
import { HERO_SLIDES } from '../data/mockData';
import { openGeneralTelegram } from '../utils/telegram';

export default function HeroCarousel({ onExploreClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isPlaying]);

  return (
    <div 
      className="relative w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-7xl mx-auto mt-6 sm:mt-8 rounded-3xl overflow-hidden bg-[#F5F5F7] select-none group border border-black/[0.06] shadow-apple"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-apple h-[400px] sm:h-[440px] md:h-[480px] lg:h-[520px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 relative overflow-hidden h-full grid grid-cols-1 md:grid-cols-12 items-center bg-[#F5F5F7]"
          >
            {/* Left Content Column — Clean Apple Store Editorial Typography */}
            <div className="relative z-10 md:col-span-6 lg:col-span-6 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-8">
              <div className="max-w-xl space-y-3 sm:space-y-4">
                
                {/* Badge / Tag */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/[0.06] text-[#1D1D1F]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {slide.tag}
                  </span>
                  <span className="text-xs text-[#6E6E73] font-medium">
                    {slide.badge}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-[1.06]">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#6E6E73] max-w-lg font-normal leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={onExploreClick}
                    className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#1D1D1F] hover:bg-[#000000] text-white font-medium text-sm transition shadow-apple"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={openGeneralTelegram}
                    className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white hover:bg-black/[0.04] border border-black/[0.12] text-[#1D1D1F] font-medium text-sm transition group/btn"
                  >
                    <Send className="w-4 h-4 text-[#1D1D1F] group-hover/btn:translate-x-0.5 transition" />
                    <span>@{`eangsambath`}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="hidden md:block md:col-span-6 lg:col-span-6 h-full relative overflow-hidden">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-1000 ease-apple"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F5F5F7] to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#1D1D1F] border border-black/[0.08] flex items-center justify-center backdrop-blur-md transition shadow-apple opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#1D1D1F] border border-black/[0.08] flex items-center justify-center backdrop-blur-md transition shadow-apple opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Controls Bar: Dots & Play/Pause */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.06] shadow-sm">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            className="text-[#6E6E73] hover:text-[#1D1D1F] transition p-0.5"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>

          {/* Dots Indicators */}
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? 'w-6 h-1.5 bg-[#1D1D1F]'
                    : 'w-1.5 h-1.5 bg-black/20 hover:bg-black/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
