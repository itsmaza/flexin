"use client";
import { motion } from "framer-motion";
import TopInfo from "../__global_components/TopInfo";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Verified Buyer",
    image: "https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2024/05/marquee-customer-service-seo.webp?w=1024",
    text: "Flexin has completely changed how I shop online. The quality and service are unmatched!",
    rating: 5,
  },
  {
    name: "Michael Lee",
    role: "Frequent Customer",
    image: "https://digital4africa.com/wp-content/uploads/2022/03/benefits-of-a-customer-service-charter-1024x664.jpg",
    text: "Fast delivery and amazing product quality. I always find what I'm looking for here!",
    rating: 5,
  },
  {
    name: "Amina Rahman",
    role: "Fashion Enthusiast",
    image: "https://www.mazaharul.site/_next/image?url=https%3A%2F%2Famimazaharul.vercel.app%2F_next%2Fimage%3Furl%3D%252Fmaza-original_processed1.jpg%26w%3D640%26q%3D75&w=256&q=75",
    text: "The user experience is so smooth and modern. Love how clean everything looks!",
    rating: 4,
  },
];

function MarqueeRow({
  items,
  direction = "left",
  duration = 40,
}: {
  items: typeof testimonials;
  direction?: "left" | "right";
  duration?: number;
}) {
  return (
    <motion.div
      className="flex gap-6 w-max"
      animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
    >
      {[...items, ...items].map((t, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative min-w-[300px] sm:min-w-[380px] bg-white border border-gray-200/70 rounded-2xl p-6 pt-10 flex flex-col shadow-2xl shadow-gray-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300"
        >
          <Quote className="absolute top-4 right-5 w-8 h-8 text-violet-100 fill-violet-100" />

          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-4 h-4 ${
                  idx < t.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-5 flex-1">
            {t.text}
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 p-[2px] shrink-0">
              <Image
                width={40}
                height={40}
                src={t.image}
                alt={t.name}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
              <span className="text-xs text-gray-500">{t.role}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-20 overflow-hidden bg-gray-50">
      <TopInfo
        title="What Our Customers Say"
        desc="Real experiences from happy shoppers"
      />

      <div className="relative mt-12 flex flex-col gap-6">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        {/* Row 1 - moves left */}
        <MarqueeRow items={testimonials} direction="left" duration={45} />

        {/* Row 2 - moves right, offset content for variety */}
        <MarqueeRow items={[...testimonials].reverse()} direction="right" duration={55} />
      </div>
    </section>
  );
}