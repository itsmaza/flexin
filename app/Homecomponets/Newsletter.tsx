"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import TopInfo from "../__global_components/TopInfo";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async () => {
    if (!email.trim()) return toast.error("Please enter your email!");
    if (!isValidEmail(email)) return toast.error("Invalid email format!");
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500)); // simulate API
      toast.success("You're now subscribed 🎉");
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 2500);
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubscribe();
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <TopInfo
        title="Stay in the Loop"
        desc="Subscribe to get exclusive offers, style updates, and 10% off your first order."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-xl mx-auto mt-10 px-4"
      >
        <div className="relative flex flex-col sm:flex-row items-center gap-2 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-100 p-2 sm:p-2 transition-shadow hover:shadow-2xl">
          <div className="flex items-center gap-2 w-full px-3 py-2">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              placeholder="Enter your email address"
              className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm sm:text-base font-medium px-6 py-3 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : subscribed ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Subscribe
              </>
            )}
          </motion.button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          No spam, ever. Unsubscribe anytime.
        </p>
      </motion.div>

      {/* Gradient background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-200 via-blue-200 to-purple-200 blur-[120px] rounded-full -z-10 opacity-60" />
    </section>
  );
}