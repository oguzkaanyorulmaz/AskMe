import React from 'react';

interface BlurTextProps {
    text: string;
    delay?: number;
    duration?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
}

export const BlurText: React.FC<BlurTextProps> = ({
    text,
    delay = 40,
    duration = 600,
    className = '',
    animateBy = 'letters'
}) => {
    const words = text.split(' ');

    if (animateBy === 'words') {
        return (
            <span className="inline-flex flex-wrap gap-x-2">
                {words.map((word, index) => (
                    <span
                        key={index}
                        className={className}
                        style={{
                            animation: `blur-in ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                            animationDelay: `${index * delay * 3}ms`,
                            opacity: 0,
                            filter: 'blur(10px)',
                            transform: 'translateY(15px)',
                            display: 'inline-block'
                        }}
                    >
                        {word}
                    </span>
                ))}
            </span>
        );
    }

    return (
        <span className="inline-flex flex-wrap">
            {words.map((word, wIdx) => {
                const letters = word.split('');
                const precedingCount = words.slice(0, wIdx).join('').length;

                return (
                    <span key={wIdx} className="inline-flex whitespace-nowrap mr-2 last:mr-0">
                        {letters.map((char, cIdx) => {
                            const index = precedingCount + cIdx;
                            return (
                                <span
                                    key={cIdx}
                                    className={className}
                                    style={{
                                        animation: `blur-in ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                                        animationDelay: `${index * delay}ms`,
                                        opacity: 0,
                                        filter: 'blur(12px)',
                                        transform: 'translateY(20px)',
                                        display: 'inline-block'
                                    }}
                                >
                                    {char}
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </span>
    );
};
