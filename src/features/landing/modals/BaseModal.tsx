import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/components/ui/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
  className,
}: BaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        <DialogHeader className="px-8 pt-8 pb-4 border-b border-gray-100 bg-white relative">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
              {title}
            </DialogTitle>
            {subtitle && (
              <DialogDescription className="text-sm text-gray-400 font-medium">
                {subtitle}
              </DialogDescription>
            )}
          </div>
          <DialogClose className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="max-h-[85vh] overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
