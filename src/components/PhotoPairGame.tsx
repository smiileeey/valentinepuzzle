"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

// 18 images
const images = [
  "/game-photos/1.avif",
  "/game-photos/2.avif",
  "/game-photos/3.avif",
  "/game-photos/4.avif",
  "/game-photos/5.avif",
  "/game-photos/6.avif",
  "/game-photos/7.avif",
  "/game-photos/8.avif",
  "/game-photos/9.avif",
  "/game-photos/10.avif",
  "/game-photos/11.avif",
  "/game-photos/12.avif",
  "/game-photos/13.avif",
  "/game-photos/14.avif",
  "/game-photos/15.avif",
  "/game-photos/16.avif",
  "/game-photos/17.avif",
  "/game-photos/18.avif",
];

// Create 18 pairs of images (36 images in total)
const imagePairs = images.flatMap((image) => [image, image]);

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

type ValentinesProposalProps = {
  handleShowProposal: () => void;
};

export default function PhotoPairGame({
  handleShowProposal,
}: ValentinesProposalProps) {
  const [imagesState, setImagesState] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [incorrect, setIncorrect] = useState<number[]>([]);

  useEffect(() => {
    setImagesState(shuffleArray([...imagePairs]));
  }, []);

  const handleClick = async (index: number) => {
    if (selected.length === 2 || matched.includes(index)) return;

    setSelected((prev) => [...prev, index]);

    if (selected.length === 1) {
      const firstIndex = selected[0];
      if (imagesState[firstIndex] === imagesState[index]) {
        setMatched((prev) => [...prev, firstIndex, index]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIncorrect([firstIndex, index]);
        setTimeout(() => setIncorrect([]), 1000);
      }
      setTimeout(() => setSelected([]), 1000);
    }
  };

  useEffect(() => {
    if (matched.length === imagePairs.length) {
      handleShowProposal();
    }
  }, [matched, handleShowProposal]);

  return (
    <div className="flex justify-center w-full">
      {/* Container width is responsive: up to 720px or 90vw on small screens */}
      <div
        className="origin-center"
        style={{ width: "min(720px, 90vw)" }}
      >
        {/* 9 equal columns; cell size determined by container width */}
        <div className="grid grid-cols-9 gap-1 sm:gap-2">
          {/* preload images hidden */}
          <div className="hidden">
            {imagesState.map((img, i) => (
              <Image key={i} src={img} alt={`preload ${i}`} width={40} height={40} priority />
            ))}
          </div>

          {heartLayout.flat().map((index, i) =>
            index !== null ? (
              <motion.div
                key={i}
                className="relative cursor-pointer aspect-square"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleClick(index)}
                style={{ perspective: "1000px" }}
              >
                {/* Back of the card */}
                {!selected.includes(index) && !matched.includes(index) && (
                  <motion.div
                    className="absolute inset-0 rounded-md bg-gray-300"
                    initial={{ rotateY: 0 }}
                    animate={{
                      rotateY:
                        selected.includes(index) || matched.includes(index)
                          ? 180
                          : 0,
                    }}
                    transition={{ duration: 0.45 }}
                    style={{ backfaceVisibility: "hidden" }}
                  />
                )}

                {/* Front of the card (image) */}
                {(selected.includes(index) || matched.includes(index)) && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ rotateY: -180 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.45 }}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <Image
                      src={imagesState[index]}
                      alt={`Image ${index + 1}`}
                      fill
                      className="rounded-md object-cover"
                    />
                  </motion.div>
                )}

                {/* Incorrect animation */}
                {incorrect.includes(index) && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1, 1.06, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 0.45 }}
                  >
                    <div className="w-full h-full bg-red-500 rounded-md" />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div key={i} className="aspect-square" />
            )
          )}
        </div>
      </div>
    </div>
  );
}