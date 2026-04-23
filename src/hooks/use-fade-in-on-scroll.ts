import { useEffect, useRef, useState } from 'react'

export function useFadeInOnScroll<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    io.unobserve(el)
                }
            },
            { threshold: 0.08 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return { ref, visible }
}
