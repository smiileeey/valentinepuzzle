"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import TextFooter from "@/components/TextFooter";
import PhotoPairGame from "../components/PhotoPairGame";
import ValentinesProposal from "@/components/ValentinesProposal";
import BackgroundMusic from "@/components/BackgroundMusic";

const ANIM_DURATION = 2;

export default function Home() {
  const [showValentinesProposal, setShowValentinesProposal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleShowProposal = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowValentinesProposal(true);
    }, ANIM_DURATION * 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative px-4 md:px-10">
      <BackgroundMusic />
      {/* Dev Skip Button */}
      {!showValentinesProposal && (
        <button
          onClick={handleShowProposal}
          className="absolute top-4 right-4 px-3 py-1 text-xs bg-gray-300 text-black rounded hover:bg-gray-400 transition"
        >
          Skip Game
        </button>
      )}
      {!showValentinesProposal ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: ANIM_DURATION }}
          className="w-full"
        >
          {/* MOBILE LAYOUT - Text atas, Hati, Text bawah */}
          <div className="md:hidden flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-black text-center mb-8">
              Pasangkan <span className="text-gray-400">Fotonya</span>
            </h1>
            <PhotoPairGame handleShowProposal={handleShowProposal} />
            <h1 className="text-3xl font-bold text-black text-center mt-8">
              dan HADIAH <span className="text-gray-400">akan diberikan</span>
            </h1>
          </div>

          {/* DESKTOP LAYOUT - Original (text kiri-kanan) */}
          <div className="hidden md:flex items-center justify-center min-h-screen relative">
            <PhotoPairGame handleShowProposal={handleShowProposal} />
            <TextFooter />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIM_DURATION }}
        >
          <ValentinesProposal />
        </motion.div>
      )}
    </div>
  );
}