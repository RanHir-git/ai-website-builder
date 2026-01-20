import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with conditional logic
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts
 * 
 * @param {...any} inputs - Class names (strings, objects, arrays, or conditionals)
 * @returns {string} Merged class string
 * 
 * @example
 * cn("flex items-center", isActive && "bg-blue-500", "px-4")
 * cn("px-2", "px-4") // Results in "px-4" (conflict resolved)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
