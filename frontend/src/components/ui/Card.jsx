export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={[
      'bg-white rounded-2xl border border-gray-100 shadow-card',
      hover ? 'transition-all duration-200 hover:shadow-elegant hover:-translate-y-1' : '',
      className,
    ].join(' ')}>
      {children}
    </div>
  )
}
