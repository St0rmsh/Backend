import React from 'react';

// shadcn-style skeleton primitive — a pulsing placeholder box.
// isDark is passed through since this project uses a manual isDark flag
// rather than Tailwind's dark: variant driven by a class on <html>.
const Skeleton = ({ className = '', isDark }) => (
    <div
        className={`animate-pulse rounded-md ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#e5e5e0]'} ${className}`}
    />
);

export default Skeleton;