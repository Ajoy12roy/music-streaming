"use client";
import { motion } from "framer-motion";

type Props = {
  icon: string;
  size?: number;
  initialX?: number;
  initialY?: number;
  delay?: number;
  duration?: number;
};

export default function FloatingIcon({
  icon,
  size = 24,
  initialX = 0,
  initialY = 0,
  delay = 0,
  duration = 10,
}: Props) {
  return (
    <motion.span
      className="absolute text-white/30 select-none"
      style={{ fontSize: size }}
      initial={{ x: initialX, y: initialY, opacity: 0 }}
      animate={{ x: [initialX, initialX + 50, initialX - 50, initialX], y: [initialY, initialY + 30, initialY - 30, initialY], opacity: [0, 0.5, 0.7, 0.5] }}
      transition={{ repeat: Infinity, duration: duration, delay: delay, ease: "easeInOut" }}
    >
      {icon}
    </motion.span>
  );
}