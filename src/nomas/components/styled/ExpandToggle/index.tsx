import { motion } from "framer-motion"
import { CaretDownIcon } from "@phosphor-icons/react"
import { NomasLink } from "../../extends"

export interface ExpandToggleProps {
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}

export const ExpandToggle = ({ isExpanded, setIsExpanded }: ExpandToggleProps) => {
    return (
        <NomasLink onClick={() => setIsExpanded(!isExpanded)}>
            <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <CaretDownIcon className="w-4 h-4" />
            </motion.div>
        </NomasLink>
    )
}