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
      className="relative w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-7xl mx-auto mt-4 sm:mt-6 rounded-3xl overflow-hidden bg-slate-950 select-none group shadow-apple-lg ring-1 ring-white/10"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-apple h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 relative overflow-hidden h-full"
          >
            {/* Background image with high quality dark overlay */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 scale-105 group-hover:scale-100 transition duration-1000"
            />
            
            {/* Gradients to blend smoothly into website theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

            {/* Slide Content */}
            <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                
                {/* Badge / Tag */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.08em] uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {slide.tag}
                  </span>
                  <span className="text-xs text-slate-300 font-medium px-2.5 py-0.5 rounded bg-slate-800/80 backdrop-blur">
                    {slide.badge}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-[2rem] sm:text-5xl md:text-6xl font-semibold text-white tracking-[-0.03em] leading-[1.05]">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
                  <button
                    onClick={onExploreClick}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={openGeneralTelegram}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-sky-500 hover:text-white border border-slate-750 hover:border-sky-400 text-slate-200 font-semibold text-sm transition group/btn backdrop-blur-sm"
                  >
                    <Send className="w-4 h-4 text-sky-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition" />
                    <span>Telegram @eangsambath</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-emerald-500 text-white hover:text-slate-950 border border-slate-700 hover:border-emerald-400 flex items-center justify-center backdrop-blur-md transition shadow-lg opacity-80 hover:opacity-100 z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-emerald-500 text-white hover:text-slate-950 border border-slate-700 hover:border-emerald-400 flex items-center justify-center backdrop-blur-md transition shadow-lg opacity-80 hover:opacity-100 z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Controls Bar: Dots & Play/Pause */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
          className="text-slate-400 hover:text-white transition p-1 rounded-md bg-slate-950/60 backdrop-blur-sm"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Dots Indicators */}
        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? 'w-8 h-2 bg-emerald-400'
                  : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

