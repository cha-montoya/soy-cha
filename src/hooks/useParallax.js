// src/hooks/useParallax.js
import { useEffect } from "react";

export const useParallax = (ref, speed = 0.3) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let frame;

        const handleScroll = () => {
        const offset = window.scrollY * speed;
        frame = requestAnimationFrame(() => {
            element.style.transform = `translateY(${offset}px)`;
        });
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
        window.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(frame);
        };
    }, [ref, speed]);
    };