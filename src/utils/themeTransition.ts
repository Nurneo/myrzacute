import React from 'react';

/**
 * Toggles theme with a Telegram-style Circular Ripple Reveal animation.
 * Expands/shrinks radially from the click target coordinates (x, y).
 */
export function toggleThemeWithRipple(
  event: React.MouseEvent<HTMLElement> | MouseEvent,
  setTheme: (theme: string) => void,
  isDark: boolean
) {
  const x = event.clientX;
  const y = event.clientY;

  // Calculate radius from click point to furthest viewport corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // Fallback for browsers that don't support View Transitions API
  if (!(document as any).startViewTransition) {
    setTheme(isDark ? 'light' : 'dark');
    return;
  }

  const transition = (document as any).startViewTransition(() => {
    setTheme(isDark ? 'light' : 'dark');
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    // Animate new root view expanding outwards from touch origin
    document.documentElement.animate(
      {
        clipPath: isDark ? clipPath.reverse() : clipPath,
      },
      {
        duration: 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: isDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      }
    );
  });
}
