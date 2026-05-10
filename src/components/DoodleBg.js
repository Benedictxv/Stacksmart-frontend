export default function DoodleBg() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {/* gradient orbs */}
            <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,16,42,0.06) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -200, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,0,180,0.04) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', top: '40%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,16,42,0.03) 0%, transparent 70%)' }} />

            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.06 }} viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice">

                {/* coin stack 1 - top left */}
                <g transform="translate(60, 80)">
                    <ellipse cx="45" cy="120" rx="40" ry="11" fill="#e8102a"/>
                    <rect x="5" y="95" width="80" height="25" fill="#c00020"/>
                    <ellipse cx="45" cy="95" rx="40" ry="11" fill="#e8102a"/>
                    <ellipse cx="45" cy="85" rx="40" ry="11" fill="#c00020"/>
                    <rect x="5" y="60" width="80" height="25" fill="#c00020"/>
                    <ellipse cx="45" cy="60" rx="40" ry="11" fill="#e8102a"/>
                    <ellipse cx="45" cy="50" rx="40" ry="11" fill="#c00020"/>
                    <rect x="5" y="25" width="80" height="25" fill="#c00020"/>
                    <ellipse cx="45" cy="25" rx="40" ry="11" fill="#e8102a"/>
                    <text x="45" y="29" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Inter">₦</text>
                    <text x="45" y="64" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Inter">₦</text>
                    <text x="45" y="99" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Inter">₦</text>
                </g>

                {/* coin stack 2 - right side */}
                <g transform="translate(1240, 120)">
                    <ellipse cx="40" cy="100" rx="35" ry="10" fill="#e8102a"/>
                    <rect x="5" y="78" width="70" height="22" fill="#c00020"/>
                    <ellipse cx="40" cy="78" rx="35" ry="10" fill="#e8102a"/>
                    <ellipse cx="40" cy="68" rx="35" ry="10" fill="#c00020"/>
                    <rect x="5" y="46" width="70" height="22" fill="#c00020"/>
                    <ellipse cx="40" cy="46" rx="35" ry="10" fill="#e8102a"/>
                    <ellipse cx="40" cy="36" rx="35" ry="10" fill="#c00020"/>
                    <rect x="5" y="14" width="70" height="22" fill="#c00020"/>
                    <ellipse cx="40" cy="14" rx="35" ry="10" fill="#e8102a"/>
                    <text x="40" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter">₦</text>
                    <text x="40" y="50" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter">₦</text>
                    <text x="40" y="82" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter">₦</text>
                </g>

                {/* coin stack 3 - bottom */}
                <g transform="translate(350, 720)">
                    <ellipse cx="35" cy="80" rx="30" ry="8" fill="#e8102a"/>
                    <rect x="5" y="60" width="60" height="20" fill="#c00020"/>
                    <ellipse cx="35" cy="60" rx="30" ry="8" fill="#e8102a"/>
                    <ellipse cx="35" cy="52" rx="30" ry="8" fill="#c00020"/>
                    <rect x="5" y="32" width="60" height="20" fill="#c00020"/>
                    <ellipse cx="35" cy="32" rx="30" ry="8" fill="#e8102a"/>
                    <text x="35" y="36" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Inter">₦</text>
                    <text x="35" y="64" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Inter">₦</text>
                </g>

                {/* coin stack 4 - bottom right */}
                <g transform="translate(1100, 700)">
                    <ellipse cx="38" cy="90" rx="33" ry="9" fill="#e8102a"/>
                    <rect x="5" y="68" width="66" height="22" fill="#c00020"/>
                    <ellipse cx="38" cy="68" rx="33" ry="9" fill="#e8102a"/>
                    <ellipse cx="38" cy="59" rx="33" ry="9" fill="#c00020"/>
                    <rect x="5" y="37" width="66" height="22" fill="#c00020"/>
                    <ellipse cx="38" cy="37" rx="33" ry="9" fill="#e8102a"/>
                    <ellipse cx="38" cy="28" rx="33" ry="9" fill="#c00020"/>
                    <rect x="5" y="6" width="66" height="22" fill="#c00020"/>
                    <ellipse cx="38" cy="6" rx="33" ry="9" fill="#e8102a"/>
                    <text x="38" y="10" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter">₦</text>
                    <text x="38" y="41" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter">₦</text>
                    <text x="38" y="72" textAnchor="middle" fill="white" fontSize="8" fontWeight="800" fontFamily="Inter">₦</text>
                </g>

                {/* upward arrows */}
                <g stroke="#e8102a" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <line x1="280" y1="200" x2="280" y2="120"/>
                    <polyline points="260,145 280,120 300,145"/>

                    <line x1="800" y1="750" x2="800" y2="670"/>
                    <polyline points="780,695 800,670 820,695"/>

                    <line x1="1150" y1="300" x2="1150" y2="220"/>
                    <polyline points="1130,245 1150,220 1170,245"/>

                    <line x1="550" y1="100" x2="550" y2="40"/>
                    <polyline points="530,65 550,40 570,65"/>
                </g>

                {/* bar chart */}
                <g transform="translate(900, 680)" fill="#e8102a">
                    <rect x="0" y="40" width="18" height="50" rx="3"/>
                    <rect x="26" y="20" width="18" height="70" rx="3"/>
                    <rect x="52" y="5" width="18" height="85" rx="3"/>
                    <rect x="78" y="25" width="18" height="65" rx="3"/>
                    <line x1="-5" y1="90" x2="110" y2="90" stroke="#e8102a" strokeWidth="2"/>
                </g>

                {/* piggy bank */}
                <g transform="translate(680, 60)">
                    <ellipse cx="50" cy="55" rx="42" ry="36" fill="#e8102a"/>
                    <ellipse cx="84" cy="44" rx="14" ry="11" fill="#c00020"/>
                    <ellipse cx="22" cy="42" rx="8" ry="6" fill="#c00020"/>
                    <rect x="36" y="34" width="14" height="4" rx="2" fill="#06060f"/>
                    <line x1="32" y1="91" x2="24" y2="108" stroke="#e8102a" strokeWidth="5" strokeLinecap="round"/>
                    <line x1="44" y1="93" x2="42" y2="111" stroke="#e8102a" strokeWidth="5" strokeLinecap="round"/>
                    <line x1="56" y1="93" x2="58" y2="111" stroke="#e8102a" strokeWidth="5" strokeLinecap="round"/>
                    <line x1="68" y1="91" x2="76" y2="108" stroke="#e8102a" strokeWidth="5" strokeLinecap="round"/>
                    <path d="M48 20 L52 8 L56 20" fill="#e8102a"/>
                    <text x="50" y="62" textAnchor="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="Inter">₦</text>
                </g>

                {/* credit card */}
                <g transform="translate(160, 580)">
                    <rect x="0" y="0" width="130" height="82" rx="10" fill="none" stroke="#e8102a" strokeWidth="2.5"/>
                    <rect x="0" y="22" width="130" height="16" fill="#e8102a" opacity="0.4"/>
                    <rect x="12" y="50" width="36" height="22" rx="4" fill="#e8102a" opacity="0.6"/>
                    <line x1="60" y1="58" x2="118" y2="58" stroke="#e8102a" strokeWidth="2" opacity="0.4"/>
                    <line x1="60" y1="66" x2="95" y2="66" stroke="#e8102a" strokeWidth="2" opacity="0.4"/>
                </g>

                {/* money bag */}
                <g transform="translate(1050, 160)">
                    <ellipse cx="45" cy="70" rx="40" ry="36" fill="#e8102a"/>
                    <path d="M25 34 Q45 20 65 34" fill="none" stroke="#e8102a" strokeWidth="3"/>
                    <ellipse cx="45" cy="26" rx="14" ry="9" fill="#c00020"/>
                    <text x="45" y="78" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Inter">₦</text>
                </g>

                {/* percent signs */}
                <text x="450" y="580" fontSize="52" fill="#e8102a" fontWeight="900" fontFamily="Inter" opacity="0.5">%</text>
                <text x="1200" y="500" fontSize="40" fill="#e8102a" fontWeight="900" fontFamily="Inter" opacity="0.5">%</text>
                <text x="750" y="180" fontSize="36" fill="#e8102a" fontWeight="900" fontFamily="Inter" opacity="0.5">%</text>

                {/* sparkles */}
                <g fill="#e8102a" opacity="0.6">
                    <path d="M420 120 L424 132 L436 136 L424 140 L420 152 L416 140 L404 136 L416 132 Z"/>
                    <path d="M1050 650 L1053 659 L1062 662 L1053 665 L1050 674 L1047 665 L1038 662 L1047 659 Z"/>
                    <path d="M200 350 L203 358 L211 361 L203 364 L200 372 L197 364 L189 361 L197 358 Z"/>
                    <path d="M900 80 L903 88 L911 91 L903 94 L900 102 L897 94 L889 91 L897 88 Z"/>
                </g>

                {/* line graph */}
                <g transform="translate(500, 700)" stroke="#e8102a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="0,60 30,45 60,50 90,20 120,30 150,5 180,15"/>
                    <circle cx="150" cy="5" r="4" fill="#e8102a"/>
                </g>
            </svg>
        </div>
    );
}