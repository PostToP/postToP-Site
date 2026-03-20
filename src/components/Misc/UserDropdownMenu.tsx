"use client";

import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function UserDropdownMenu() {
    const authContext = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const dropdownElements = [
        {
            label: "Profile",
            icon: null,
            href: `/user/${authContext.user?.handle}`,
        },
        {
            label: "Settings",
            icon: null,
            href: "/settings",
        },
        authContext.user?.role === "Admin"
            ? {
                  label: "Admin Dashboard",
                  icon: null,
                  href: "/admin",
              }
            : null,
        {
            label: "Logout",
            icon: null,
            onClick: () => {
                authContext.logout();
            },
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest("#options-menu")) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            {authContext.user ? (
                <div className="flex items-center gap-0">
                    <div className="relative inline-block text-left">
                        <div>
                            <button
                                type="button"
                                className="inline-flex justify-center w-full items-center"
                                id="options-menu"
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                                onClick={() => setIsOpen(!isOpen)}>
                                <p>{authContext.user.username}</p>
                                <svg
                                    className="-mr-1 ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true">
                                    <title>Toggle dropdown</title>
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {isOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-surface z-10">
                                <div
                                    className="py-1"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="options-menu"
                                    id="options-menu">
                                    {dropdownElements.filter(i=>i !==null).map((element, index) =>
                                        element.href ? (
                                            <Link
                                                key={`link-${index}`}
                                                href={element.href}
                                                className="block px-4 py-2 text-sm hover:bg-surface-secondary"
                                                onClick={() => setIsOpen(false)}
                                                role="menuitem">
                                                {element.icon && <span className="mr-2">{element.icon}</span>}
                                                {element.label}
                                            </Link>
                                        ) : (
                                            <button
                                                key={`button-${index}`}
                                                type="button"
                                                onClick={() => {
                                                    element.onClick?.();
                                                    setIsOpen(false);
                                                }}
                                                className="w-full text-left block px-4 py-2 text-sm hover:bg-surface-secondary"
                                                role="menuitem">
                                                {element.icon && <span className="mr-2">{element.icon}</span>}
                                                {element.label}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <Link className="mr-4" href="/auth">
                        Login
                    </Link>
                </>
            )}
        </div>
    );
}
