import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-sm font-medium text-secondary/70 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Loading...
        </p>
      </motion.div>
    </div>
  );
};

export default Loading;