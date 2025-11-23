"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export function AuroraHero() {
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                    Your Health, Our Priority
                </div>
                <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 text-center max-w-4xl">
                    Access medical services, find blood donors, and get help when you need it most.
                    Connecting you with healthcare essentials instantly.
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/medic" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                        Find Medicines <ArrowRight size={20} />
                    </Link>
                    <Link href="/blood" className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center gap-2">
                        Donate Blood <Heart size={20} />
                    </Link>
                </div>
            </motion.div>
        </AuroraBackground>
    );
}
