import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MobileNavOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function MobileNavOverlay({
    isOpen,
    onClose,
    children,
}: MobileNavOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 lg:hidden ${
                isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onTransitionEnd={handleTransitionEnd}
        >
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-[#161615] ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-[#e3e3e0] p-4 dark:border-[#3E3E3A]">
                        <span className="text-lg font-semibold">Menu</span>
                        <button
                            onClick={onClose}
                            className="rounded-md p-2 hover:bg-[#f5f5f4] dark:hover:bg-[#2C2C2A]"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4">{children}</nav>
                    <div className="border-t border-[#e3e3e0] p-4 dark:border-[#3E3E3A]">
                        <div className="flex flex-col space-y-2">
                            <Link
                                href="/login"
                                className="w-full rounded-md border border-[#19140035] px-4 py-2 text-center text-sm font-medium hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                onClick={onClose}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="w-full rounded-md bg-[#1b1b18] px-4 py-2 text-center text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                onClick={onClose}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
