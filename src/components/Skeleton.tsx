import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export default function Skeleton({
    className = "",
    variant = 'text',
    width,
    height
}: SkeletonProps) {
    const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse";

    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg"
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1">
                    <Skeleton width="60%" className="mb-2" />
                    <Skeleton width="40%" />
                </div>
            </div>
            <Skeleton width="100%" className="mb-2" />
            <Skeleton width="80%" className="mb-4" />
            <div className="flex gap-2">
                <Skeleton width={100} height={36} variant="rectangular" />
                <Skeleton width={100} height={36} variant="rectangular" />
            </div>
        </div>
    );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </>
    );
}
