"use client";
import React from "react";

interface SectionHeaderProps {
  step: number;
  title: string;
  description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  step,
  title,
  description,
}) => {
  return (
    <div className="flex items-center mb-6">
      <div className="bg-blue-600 rounded-full text-white font-bold text-lg px-3 py-2 mr-4">
        {step}
      </div>
      <div>
        <h2 className="text-gray-700 font-bold text-lg">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
