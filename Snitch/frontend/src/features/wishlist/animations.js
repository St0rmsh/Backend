import { cubicBezier } from "framer-motion";

export const ease = cubicBezier(0.22, 1, 0.36, 1);

export const pageVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

export const heroVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

export const summaryContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const summaryCard = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease,
    },
  },
};

export const gridContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease,
    },
  },
};

export const imageVariants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.08,
    rotate: 1.2,
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

export const overlayVariants = {
  rest: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.35,
    },
  },
};

export const floatingActions = {
  rest: {
    opacity: 0,
    x: 20,
  },
  hover: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const actionItem = {
  rest: {
    opacity: 0,
    x: 15,
  },
  hover: {
    opacity: 1,
    x: 0,
  },
};

export const buttonTap = {
  whileTap: {
    scale: 0.96,
  },
};

export const buttonHover = {
  whileHover: {
    scale: 1.03,
  },
};