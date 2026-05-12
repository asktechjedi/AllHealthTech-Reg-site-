export default function Card({ 
  children, 
  className = '', 
  hover = true, 
  variant = 'default',
  interactive = false 
}) {
  const baseClasses = [
    // Dark navy background from Eventor color system
    'bg-[#1A1F2E]',
    // 16px border radius for modern appearance
    'rounded-2xl',
    // Subtle border with dark navy color
    'border border-[#2A2F3E]',
    // Layered shadow system for visual depth
    'shadow-lg',
    // Responsive padding: 24px desktop, 16px mobile
    'p-6 md:p-6 sm:p-4',
    // Smooth transitions for all properties
    'transition-all duration-300 ease-out'
  ];

  const hoverClasses = hover ? [
    // Hover effects with bright blue accent glow
    'hover:shadow-[0_10px_25px_0_rgba(0,102,255,0.2)]',
    // Subtle lift animation on hover
    'hover:-translate-y-1',
    // Blue accent border on hover
    'hover:border-[#4D9FFF]'
  ] : [];

  const interactiveClasses = interactive ? [
    'cursor-pointer',
    'hover:scale-[1.02]'
  ] : [];

  // Variant-specific styling for different card types
  const variantClasses = {
    default: [],
    speaker: [
      'overflow-hidden',
      'hover:shadow-[0_20px_40px_0_rgba(0,102,255,0.15)]'
    ],
    agenda: [
      'border-l-4 border-l-[#0066FF]',
      'hover:border-l-[#4D9FFF]'
    ],
    sponsor: [
      'text-center',
      'hover:bg-[#2A2F3E]'
    ],
    feature: [
      'relative',
      'overflow-hidden',
      'hover:shadow-[0_25px_50px_0_rgba(0,102,255,0.25)]'
    ]
  };

  const allClasses = [
    ...baseClasses,
    ...hoverClasses,
    ...interactiveClasses,
    ...(variantClasses[variant] || []),
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={allClasses}>
      {children}
    </div>
  );
}
