import React from 'react';

/**
 * Toggles theme with a Telegram-style Circular Ripple Reveal animation.
 * Expands/shrinks radially from the click target coordinates (x, y).
 */
export function toggleThemeWithRipple(
  event?: React.MouseEvent<HTMLElement> | MouseEvent | null,
  setTheme?: (theme: string) => void,
  isDark?: boolean
) {
  if (!setTheme) return;

  const x = event?.clientX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const y = event?.clientY ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const targetTheme = isDark ? 'light' : 'dark';

  // Fallback for environment or browsers without View Transitions API
  if (typeof document === 'undefined' || !(document as any).startViewTransition) {
    setTheme(targetTheme);
    return;
  }

  try {
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(targetTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDark ? clipPath.reverse() : clipPath,
        },
        {
          duration: 420,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    }).catch(() => {
      setTheme(targetTheme);
    });
  } catch (err) {
    console.error('Error in theme transition:', err);
    setTheme(targetTheme);
  }
}
