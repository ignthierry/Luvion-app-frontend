"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface TimelineContentProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  children?: React.ReactNode;
}

export function TimelineContent({
  as: Component = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps) {
  const defaultVariants: Variants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
    hidden: {
      y: 20,
      opacity: 0,
    },
  };

  const variantsToUse = customVariants || defaultVariants;
  const MotionComponent = typeof Component === "string" ? (motion as any)[Component] || motion.div : motion.div;

  return (
    <MotionComponent
      custom={animationNum}
      variants={variantsToUse}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
