'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaTiktok, FaYoutube, FaFacebook, FaInstagram } from 'react-icons/fa6';
import { ArrowRight, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { EmailRegex } from '@/utils';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Shop: [
    { label: "Men's Apparel", href: '#' },
    { label: "Women's Apparel", href: '#' },
    { label: 'New Arrivals', href: '#' },
    { label: 'Sale', href: '#' },
  ],
  Support: [
    { label: 'FAQs', href: '#' },
    { label: 'Shipping & Returns', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socials = [
  { icon: FaFacebook, href: '#', label: 'Facebook' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaTiktok, href: '#', label: 'TikTok' },
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please provide your email');
      return;
    }
    if (EmailRegex.test(email.trim()) === false) {
      toast.error('Please provide a valid email');
      return;
    }

    setSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setTimeout(() => {
      toast.success('Thanks for subscribing!', {
        description: `${email} • ${formattedDate}`,
      });
      setEmail('');
      setSubmitting(false);
    }, 600);
  };

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Newsletter CTA band */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h4 className="text-xl font-semibold text-white">Join Our Newsletter</h4>
            <p className="text-sm text-gray-400 mt-1">
              Get the latest updates, offers, and trends delivered straight to your inbox.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-auto flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-1.5 max-w-md focus-within:border-sky-500 transition-colors"
          >
            <div className="flex items-center gap-2 flex-1 px-3 min-w-0">
              <Mail className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="email"
                placeholder="Your email address"
                disabled={submitting}
                className="w-full bg-transparent py-2 text-sm text-white placeholder-gray-500 focus:outline-none disabled:opacity-60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 py-2 px-4 cursor-pointer bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 shrink-0"
            >
              {submitting ? 'Subscribing...' : 'Subscribe'}
              {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-wide">Flexin</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Redefine your style with our premium collection of clothing, footwear, and
              accessories. We are committed to bringing you the best in fashion.
            </p>
            <div className="flex gap-3 pt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-sky-600 transition-colors duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-4">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  {title}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Flexin. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors duration-300">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors duration-300">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors duration-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;