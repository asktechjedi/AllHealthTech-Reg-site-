import { useScrollAnimation } from '../../hooks/useScrollAnimation'

/**
 * AnimatedSection - Wrapper component for scroll-triggered animations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.animation - Animation type: 'fadeUp', 'fadeIn', 'slideLeft', 'slideRight', 'scale'
 * @param {number} props.delay - Animation delay in milliseconds
 * @param {number} props.duration - Animation duration in milliseconds
 * @param {string} props.className - Additional CSS classes
 */
export default function AnimatedSection({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce })

  const animations = {
    fadeUp: {
      initial: 'opacity-0 translate-y-8',
      animate: 'opacity-100 translate-y-0',
    },
    fadeIn: {
      initial: 'opacity-0',
      animate: 'opacity-100',
    },
    slideLeft: {
      initial: 'opacity-0 translate-x-8',
      animate: 'opacity-100 translate-x-0',
    },
    slideRight: {
      initial: 'opacity-0 -translate-x-8',
      animate: 'opacity-100 translate-x-0',
    },
    scale: {
      initial: 'opacity-0 scale-95',
      animate: 'opacity-100 scale-100',
    },
    zoomIn: {
      initial: 'opacity-0 scale-50',
      animate: 'opacity-100 scale-100',
    },
  }

  const selectedAnimation = animations[animation] || animations.fadeUp

  return (
    <div
      ref={ref}
      className={`
        transition-all gpu-accelerated
        ${isVisible ? selectedAnimation.animate : selectedAnimation.initial}
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}
