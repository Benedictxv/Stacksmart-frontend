export default function Logo({ size = 32 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
            100% { transform: translateY(0px); }
          }
          .brand-red { 
            fill: #FF3B30; 
            animation: float 3s ease-in-out infinite;
          }
          /* Offset the timing so they don't all move at the exact same time */
          .layer-2 { animation-delay: 0.5s; }
          .layer-3 { animation-delay: 1s; }
          .layer-4 { animation-delay: 1.5s; }
        `}
      </style>
      
      <g transform="translate(3, 3)">
        <path className="brand-red layer-1" d="M8 0 L16 8 L8 16 L0 8 Z" />
        <path className="brand-red layer-2" d="M18 0 L10 8 L18 16 L26 8 Z" opacity="0.7" />
        <path className="brand-red layer-3" d="M8 10 L16 18 L8 26 L0 18 Z" opacity="0.85" />
        <path className="brand-red layer-4" d="M18 10 L10 18 L18 26 L26 18 Z" />
      </g>
    </svg>
  );
}