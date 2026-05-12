import { cn } from "@/lib/utils"

export function AppLogo({ className, textClassName }: { className?: string; textClassName?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <svg
                viewBox="-177 0 1410 1410"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-7 shrink-0"
            >
                <path d="M415.293 428.327L416 429.034L232 613.034L231.293 612.327L231.585 612.034L415.293 428.327Z" fill="#FFB300"/>
                <path d="M711 264.034V265.034L710.586 265.034L349.5 265.034V264.034H711Z" fill="#FFB300"/>
                <path d="M548 428.034V429.034L416 429.034L416 428.034H547.586H548Z" fill="#FFB300"/>
                <path d="M711.293 264.327L712 265.034L548 429.034L547.293 428.327L547.586 428.034L710.586 265.034L711.293 264.327Z" fill="#FFB300"/>
                <path d="M349.5 265.034V264.034L62.5 544.12L57 549.034V952.085L57.6465 952.388L145.646 1040.39L145.866 1040.53L0 1409.03L408.293 1049.74L231 872.534V872.249V612.034H231.585L415.293 428.327L416 428.034H547.586L710.586 265.034L349.5 265.034Z" fill="#FFB300"/>
                <path d="M619.5 746.149L619.449 746.253L519.488 951.072L973.681 551.534H800V550.729L799.651 550.568L799.861 550.114L800 549.813V549.534H800.129L1049.42 10.0566L405.24 744.534H619.5V746.149Z" fill="black"/>
                <path d="M619.5 746.149L619.449 746.253L519.488 951.072L973.681 551.534H800V550.729L799.651 550.568L799.861 550.114L800 549.813V549.534H800.129L1049.42 10.0566L405.24 744.534H619.5V746.149Z" fill="#FFB300"/>
                <path d="M548.5 1048.57L660 1048.03L757 951.034L760 954.034L878.5 1074.53L877.441 1075.78L755 1229.03H343L548.5 1048.57Z" fill="#FFB300" stroke="#FFB300" strokeWidth="4"/>
            </svg>
            <span className={cn("font-bold text-lg tracking-tight text-nowrap", textClassName)}>
                <span className="text-foreground">Creator</span>
                <span style={{ color: "#FFB300" }}>Modo</span>
            </span>
        </div>
    )
}
