/* eslint-disable indent */
import { motion } from "framer-motion"

export const LoadingSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      {/* Animated spinner */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-card-dark-5"
          style={{ borderTopColor: "var(--accent-purple)" }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-card-dark-5"
          style={{ borderTopColor: "var(--accent-cyan)" }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Loading text with dots animation */}
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold text">Loading</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-lg font-semibold text-accent-purple"
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            .
          </motion.span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-card-dark-5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <p className="text-sm text-muted">Preparing your game experience...</p>
    </div>
  )
}
