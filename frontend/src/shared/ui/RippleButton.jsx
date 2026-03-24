import { useRef } from 'react';
import styles from './RippleButton.module.css';

export function RippleButton({
    children,
    onClick,
    href,
    className = '',
    spanClassName = ''
}) {
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

    const content = (
        <>
            <span
                ref={spanRef}
                className={`${styles.rippleSpan} ${spanClassName}`}
            ></span>
            <span className={styles.buttonText}>{children}</span>
        </>
    );

    const commonProps = {
        ref: buttonRef,
        className: `${styles.rippleButton} ${className}`,
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
    };

    if (href) {
        return <a {...commonProps} href={href}>{content}</a>;
    }

    return (
        <button {...commonProps} type="button" onClick={onClick}>
            {content}
        </button>
    );
}