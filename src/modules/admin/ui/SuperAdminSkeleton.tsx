import React from 'react';

export const SuperAdminSkeleton: React.FC = () => (
  <div className="w-full h-full flex-1 min-h-0 flex flex-col space-y-2.5 pt-0.5 animate-pulse">
    <div className="flex items-center justify-between gap-3 h-8 bg-stone-200/50 rounded-xl" />
    <div className="flex-1 min-h-0 flex flex-col lg:flex-row items-stretch gap-4">
      <div className="w-full lg:w-1/2 flex flex-col space-y-2.5 h-full">
        <div className="h-20 bg-stone-200/50 rounded-2xl" />
        <div className="h-10 bg-stone-200/50 rounded-xl" />
        <div className="flex-1 bg-stone-200/40 rounded-2xl" />
      </div>
      <div className="w-full lg:w-1/2 h-full bg-stone-200/40 rounded-3xl" />
    </div>
  </div>
);
