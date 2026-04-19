import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen transition-opacity duration-300"
      animate={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.05), transparent 80%)`,
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
    />
  );
}
