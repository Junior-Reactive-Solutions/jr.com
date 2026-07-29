import { useRef, useLayoutEffect } from 'react';
import { animate, stagger } from 'animejs';

// Respect the user's OS-level "reduce motion" setting — when set, we never
// animate and never hide content, so everything is immediately visible.
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * useReveal — fade/slide an element (or its direct children, when staggered)
 * into view the first time it enters the viewport.
 *
 * Returns a ref to attach to the target element.
 *
 * @param {object}  opts
 * @param {number}  opts.y          starting Y offset in px (default 24)
 * @param {number}  opts.duration   ms (default 650)
 * @param {number}  opts.delay      ms before the (first) element animates
 * @param {number}  opts.stagger    ms between children; when >0 the element's
 *                                   direct children are animated individually
 * @param {number}  opts.threshold  IntersectionObserver threshold (default 0.15)
 */
export function useReveal(opts = {}) {
  const {
    y = 24,
    duration = 650,
    delay = 0,
    stagger: staggerMs = 0,
    threshold = 0.15,
  } = opts;

  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion (or missing IO support): leave content fully visible.
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const nodes = staggerMs ? Array.from(el.children) : [el];
    if (nodes.length === 0) return;

    // Hide before first paint to avoid a flash of the final state.
    nodes.forEach((n) => { n.style.opacity = '0'; });

    let animation;
    const run = () => {
      animation = animate(staggerMs ? nodes : el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration,
        delay: staggerMs ? stagger(staggerMs, { start: delay }) : delay,
        ease: 'out(3)',
      });
    };

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (animation && typeof animation.pause === 'function') animation.pause();
    };
  }, [y, duration, delay, staggerMs, threshold]);

  return ref;
}

/**
 * useCountUp — animate a number from 0 to `value` when it scrolls into view.
 * Returns a ref to attach to the element whose textContent should count up.
 */
export function useCountUp(value, opts = {}) {
  const { duration = 1400, suffix = '', prefix = '' } = opts;
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = Number(value);
    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }

    const state = { n: 0 };
    let animation;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animation = animate(state, {
            n: target,
            duration,
            ease: 'out(3)',
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(state.n)}${suffix}`;
            },
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (animation && typeof animation.pause === 'function') animation.pause();
    };
  }, [value, duration, suffix, prefix]);

  return ref;
}
