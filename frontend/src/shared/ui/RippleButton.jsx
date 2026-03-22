import { useRef } from 'react';
import styles from './RippleButton.module.css';

export function RippleButton({ children, onClick, href, className = '' }) {
    const buttonRef = useRef(null);
    const spanRef = useRef(null);

    const handleMouseOver = (e) => {
        if (!buttonRef.current || !spanRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        spanRef.current.style.left = `${x}px`;
        spanRef.current.style.top = `${y}px`;
    };

    const handleMouseOut = (e) => {
        if (!buttonRef.current || !spanRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        spanRef.current.style.left = `${x}px`;
        spanRef.current.style.top = `${y}px`;
    };

    if (href) {
        return (
            <a
                ref={buttonRef}
                href={href}
                className={`${styles.rippleButton} ${className}`}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={onClick}
            >
                <span ref={spanRef} className={styles.rippleSpan}></span>
                <span className={styles.buttonText}>{children}</span>
            </a>
        );
    }

    return (
        <button
            ref={buttonRef}
            type="button"
            className={`${styles.rippleButton} ${className}`}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={onClick}
        >
            <span ref={spanRef} className={styles.rippleSpan}></span>
            <span className={styles.buttonText}>{children}</span>
        </button>
    );
}