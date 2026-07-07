import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useAnime';

const HeroSection = ({
    badge,
    title,
    subtitle,
    primaryBtnText,
    primaryBtnLink,
    secondaryBtnText,
    secondaryBtnLink,
    children,
}) => {
    // Stagger the hero's direct children (badge, heading, subtitle, buttons) in.
    const heroRef = useReveal({ stagger: 90, y: 28, duration: 700 });

    return (
        <section className="hero">
            <div className="container" ref={heroRef}>
                {badge && (
                    <div className="hero-badge">{badge}</div>
                )}
                <h1>{title}</h1>
                {subtitle && <p className="hero-sub">{subtitle}</p>}
                {(primaryBtnText || secondaryBtnText) && (
                    <div className="hero-btns">
                        {primaryBtnText && primaryBtnLink && (
                            <Link to={primaryBtnLink} className="btn">
                                {primaryBtnText}
                            </Link>
                        )}
                        {secondaryBtnText && secondaryBtnLink && (
                            <Link to={secondaryBtnLink} className="btn btn-outline">
                                {secondaryBtnText}
                            </Link>
                        )}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
};

export default HeroSection;
