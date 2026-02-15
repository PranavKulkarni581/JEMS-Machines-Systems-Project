import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="w-full py-6 text-center text-white shadow-lg"
      style={{
        backgroundColor: '#0F2A44',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
      }}
    >
      {/* Company Name */}
      <p className="text-xl font-semibold tracking-wide uppercase">
        JEMS Machines & Systems
      </p>

      {/* Copyright */}
      <p className="text-sm mt-1 opacity-80">
        © {new Date().getFullYear()} · All Rights Reserved
      </p>

      {/* Developed By */}
      <p className="mt-3 flex items-center justify-center gap-2 text-sm">
        Developed with
        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
        by
        <a
          href="https://www.linkedin.com/in/pranav-kulkarni1/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline hover:text-slate-200 transition"
        >
          Pranav
        </a>
         <a
          href="https://www.linkedin.com/in/haripriya-yele-38a5a5289/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline hover:text-slate-200 transition"
        >
          Haripriya
        </a>
        &
        <a
          href="https://www.linkedin.com/in/tanvi-diwan-6398b6292/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline hover:text-slate-200 transition"
        >
          Tanvi
        </a>
      </p>
    </footer>
  );
}
