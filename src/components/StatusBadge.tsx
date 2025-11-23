import { motion } from "framer-motion";

interface StatusBadgeProps {
    status: 'pending' | 'responded' | 'fulfilled' | 'closed';
    className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
    const statusConfig = {
        pending: {
            label: "Pending",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-600",
            borderColor: "border-yellow-200"
        },
        responded: {
            label: "Responded",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            borderColor: "border-blue-200"
        },
        fulfilled: {
            label: "Fulfilled",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            borderColor: "border-green-200"
        },
        closed: {
            label: "Closed",
            bgColor: "bg-gray-50",
            textColor: "text-gray-600",
            borderColor: "border-gray-200"
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
        >
            {config.label}
        </motion.span>
    );
}
