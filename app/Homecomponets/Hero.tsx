"use client"
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Style That Defines You",
    subtitle: "Discover premium fashion & lifestyle essentials.",
    img: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Exclusive Deals This Season",
    subtitle: "Get up to 50% off on selected collections.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    cta: "Explore Deals",
  },
  {
    id: 3,
    title: "Fresh New Arrivals",
    subtitle: "Be the first to grab the latest trends.",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
    cta: "View Collection",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) =>
          index === current ? (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

              <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-10 lg:px-24 text-white">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-violet-300 mb-3"
                >
                  New Collection
                </motion.span>

                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl leading-tight"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.8 }}
                  className="text-base sm:text-lg mb-6 max-w-xl text-gray-200"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Button size="lg" className="bg-white text-black font-semibold hover:bg-gray-200 cursor-pointer">
                    {slide.cta}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 pointer-events-none">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="pointer-events-auto p-2 cursor-pointer rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="pointer-events-auto p-2 cursor-pointer rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === current ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}