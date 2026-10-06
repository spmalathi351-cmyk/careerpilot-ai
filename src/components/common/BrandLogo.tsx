import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  /**
   * 'horizontal': Icon mark (28-32px) + 'CareerPilot AI' styled typography (best for top headers)
   * 'full': Stacked official emblem + wordmark + tagline card (best for Auth forms)
   * 'mark': Emblem mark icon only (best for compact spaces / mobile / avatars)
   * 'sidebar': Optimized for dark sidebar header
   */
  variant?: 'horizontal' | 'full' | 'mark' | 'sidebar';
  /**
   * Approximate size control
   * 'sm': 24px icon / compact
   * 'md': 28-32px icon (default standard)
   * 'lg': 40-48px icon
   * 'xl': full hero / auth card badge (up to 120px)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional custom className
   */
  className?: string;
  /**
   * Whether to wrap in a Link to home ('/')
   */
  withLink?: boolean;
  /**
   * Show tagline in horizontal layout if space allows
   */
  showTagline?: boolean;
  /**
   * Invert text for dark backgrounds
   */
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  withLink = true,
  showTagline = false,
  inverted = false,
}) => {
  // Size classes for the icon mark
  const iconSizeMap = {
    sm: 'w-6 h-6', // 24px
    md: 'w-7 h-7 sm:w-8 sm:h-8', // 28-32px vertical height
    lg: 'w-10 h-10', // 40px
    xl: 'w-20 h-20 sm:w-24 sm:h-24', // large card format
  };

  const textClasses = inverted ? 'text-white' : 'text-slate-900';
  const subtextClasses = inverted ? 'text-slate-400' : 'text-slate-500';

  // Render Full Stacked Logo (Used on Auth pages above cards)
  if (variant === 'full') {
    const fullContent = (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Official uploaded logo image with sharp rendering and preserved aspect ratio */}
        <div className="relative group p-2 rounded-2xl bg-white shadow-sm border border-slate-200/80 mb-3 hover:shadow-md transition-shadow">
          <img
            src="/careerpilot-logo-full.png"
            alt="CareerPilot AI"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-xl"
            loading="eager"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
            CareerPilot
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black text-xl sm:text-2xl">
            AI
          </span>
        </div>
        <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-slate-500 mt-1">
          Guide <span className="text-indigo-400 mx-1">|</span> Match <span className="text-indigo-400 mx-1">|</span> Grow
        </p>
      </div>
    );

    if (withLink) {
      return (
        <Link to="/" className="inline-block transition-transform hover:scale-[1.01]" aria-label="CareerPilot AI Home">
          {fullContent}
        </Link>
      );
    }
    return fullContent;
  }

  // Render Sidebar Brand Header (Optimized for dark sidebar)
  if (variant === 'sidebar') {
    const sidebarContent = (
      <div className={`flex items-center gap-3 px-1 py-1 ${className}`}>
        <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
          <img
            src="/careerpilot-mark.png"
            alt="CareerPilot AI Logo"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-base tracking-tight text-white truncate">
              CareerPilot
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              AI
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-1 truncate">
            Guide · Match · Grow
          </span>
        </div>
      </div>
    );

    if (withLink) {
      return (
        <Link to="/" className="block group transition-opacity hover:opacity-95" aria-label="CareerPilot AI Home">
          {sidebarContent}
        </Link>
      );
    }
    return sidebarContent;
  }

  // Render Mark Only (Icon only)
  if (variant === 'mark') {
    const markContent = (
      <div
        className={`${iconSizeMap[size]} rounded-xl bg-white p-0.5 shadow-sm border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
      >
        <img
          src="/careerpilot-mark.png"
          alt="CareerPilot AI Icon"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    );

    if (withLink) {
      return (
        <Link to="/" className="inline-flex transition-transform hover:scale-105" aria-label="CareerPilot AI Home">
          {markContent}
        </Link>
      );
    }
    return markContent;
  }

  // Standard Horizontal Layout (Navbar / Header: approx 24-32px vertical height on desktop, proportionally scaled on mobile)
  const horizontalContent = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Icon mark - exactly 28-32px on desktop, 24px on mobile */}
      <div
        className={`${iconSizeMap[size]} rounded-xl bg-white p-0.5 shadow-xs border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:shadow-sm transition-all group-hover:scale-105`}
      >
        <img
          src="/careerpilot-mark.png"
          alt="CareerPilot AI"
          className="w-full h-full object-contain rounded-lg"
          loading="eager"
        />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold text-base sm:text-lg tracking-tight ${textClasses}`}>
            CareerPilot
          </span>
          <span className="font-black text-sm uppercase px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600">
            AI
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] tracking-wider uppercase font-medium mt-0.5 hidden sm:inline-block ${subtextClasses}`}>
            Guide | Match | Grow
          </span>
        )}
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link to="/" className="inline-flex items-center" aria-label="CareerPilot AI Home">
        {horizontalContent}
      </Link>
    );
  }

  return horizontalContent;
};
