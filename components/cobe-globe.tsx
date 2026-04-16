"use client";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function CobeGlobe({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;
        let width = 0; // Initialize width

        if (!canvasRef.current) {
            return;
        }

        // It's safer to get the actual width of the canvas element
        width = canvasRef.current.offsetWidth;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // Add your markers back here!
            ],
            // Explicitly define 'state' to satisfy strict mode
            onRender: (state: Record<string, any>) => { 
                state.phi = phi;
                phi += 0.005;
            }
        } as any);

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            className={className}
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
        />
    );
}