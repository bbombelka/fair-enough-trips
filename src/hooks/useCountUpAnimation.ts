import { useEffect, useState } from 'react';

const easeOutQuad = (t: number) => t * (2 - t);
const frameDuration = 1000 / 60;

export const useCountUpAnimation = ({ animatedValue, duration = 2000, delay }: { animatedValue: number, duration?: number, delay?:number }) => {
    const countTo = parseInt(animatedValue.toString(), 10);
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(()=>{
            let frame = 0;
            const totalFrames = Math.round(duration / frameDuration);
            const counter = setInterval(() => {
                frame++;
                const progress = easeOutQuad(frame / totalFrames);
                setCount(countTo * progress);
    
                if (frame === totalFrames) {
                    clearInterval(counter);
                }
            }, frameDuration);
        }, delay ?? 0)
       
    }, []);

    return Math.floor(count);
};