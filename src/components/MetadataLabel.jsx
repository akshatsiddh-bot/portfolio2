export default function MetadataLabel({ children, className = '' }) {
  return <span className={`text-meta ${className}`}>{children}</span>;
}
