import {forwardRef, useEffect, useImperativeHandle, useState} from "react";

const Modal = forwardRef(
    (
        {
            children,
        }: {
            children: React.ReactNode;
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false);

        useImperativeHandle(ref, () => ({
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
        }));

        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    setIsOpen(false);
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }, []);

        if (!isOpen) return null;
        return (
            <button
                type="button"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
                onKeyDown={e => e.key === "Escape" && setIsOpen(false)}>
                <div
                    className="bg-white rounded-xl shadow-2xl w-[90%] max-w-4xl h-[90vh] flex flex-col overflow-hidden"
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true">
                    {children}
                </div>
            </button>
        );
    },
);

export default Modal;
