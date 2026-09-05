export default function SectionWrapper({ children, id, label, className = '' }) {
  return (
    <section
      id={id}
      data-section={id}
      aria-label={label}
      className={`section-padding section-container ${className}`}
    >
      {children}
    </section>
  );
}
