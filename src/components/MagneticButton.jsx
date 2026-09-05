import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../systems/useMagnetic';

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  as = 'button',
}) {
  const ref = useRef(null);
  const { x, y } = useMagnetic(ref, { strength: 0.25, radius: 80 });

  const Component = href ? 'a' : as;
  const linkProps = href
    ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined }
    : {};

  return (
    <motion.div
      ref={ref}
      style={{ display: 'inline-block' }}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Component
        onClick={onClick}
        className={`
          inline-flex items-center gap-2
          text-sm font-medium tracking-wide
          transition-all duration-300 ease-out
          hover:tracking-wider
          focus-visible:outline-2 focus-visible:outline-offset-3
          ${className}
        `}
        {...linkProps}
        style={{
          color: 'var(--text-primary)',
          borderBottom: '1px solid transparent',
          paddingBottom: '2px',
          transition: 'border-color 0.3s, letter-spacing 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-current)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        {children}
      </Component>
    </motion.div>
  );
}
