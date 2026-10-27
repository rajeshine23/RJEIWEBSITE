import React from "react";

interface AnnouncementBarProps {
  message?: string;
}

export function AnnouncementBar({ message }: AnnouncementBarProps) {
  if (!message) return null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-brand-maroon text-brand-ivory px-4 py-2 text-center text-xs tracking-wider uppercase font-medium border-b border-brand-maroon-dark/30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-light inline-block animate-pulse" />
        <span>{message}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-light inline-block animate-pulse" />
      </div>
    </aside>
  );
}
