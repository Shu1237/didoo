"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = theme === "dark"

    return (
        <div
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`theme-toggle ${isDark ? "rotate-dark" : "rotate-light"}`}
        >
            {isDark ? (
                <Sun className="theme-icon w-5 h-5 text-yellow-500" />
            ) : (
                <Moon className="theme-icon w-5 h-5 text-blue-500" />
            )}
        </div>
    )
}
