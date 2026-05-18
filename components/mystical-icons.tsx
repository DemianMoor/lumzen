// Stylized Custom SVG Icons for LumZen Categories
// Each icon is a unique mystical symbol crafted for the cosmic spiritual aesthetic

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
}

// ============ SPIRITUAL GUIDES ICONS ============

// Sacred book with eye of wisdom
export function IconSacredBook({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="book-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Book spine */}
      <path d="M10 8C10 6 12 4 14 4H36C38 4 40 6 40 8V40C40 42 38 44 36 44H14C12 44 10 42 10 40V8Z" stroke="url(#book-grad)" strokeWidth="1.5" fill="none" />
      {/* Book pages */}
      <path d="M14 8H36V40H14V8Z" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
      {/* Central eye of wisdom */}
      <ellipse cx="25" cy="24" rx="8" ry="5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="25" cy="24" r="2.5" fill={color} />
      {/* Light rays from eye */}
      <path d="M25 16V13M25 35V32M17 24H14M36 24H33" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Decorative corners */}
      <path d="M12 10L16 10M12 10L12 14" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M38 10L34 10M38 10L38 14" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M12 38L16 38M12 38L12 34" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M38 38L34 38M38 38L38 34" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// Chakra spiral with nodes
export function IconChakraSpiral({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Central column */}
      <path d="M24 6V42" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      {/* Chakra nodes - 7 circles */}
      <circle cx="24" cy="40" r="2.5" fill={color} fillOpacity="0.9" />
      <circle cx="24" cy="35" r="2" fill={color} fillOpacity="0.8" />
      <circle cx="24" cy="30" r="2" fill={color} fillOpacity="0.7" />
      <circle cx="24" cy="24" r="2.5" fill={color} />
      <circle cx="24" cy="18" r="2" fill={color} fillOpacity="0.7" />
      <circle cx="24" cy="13" r="2" fill={color} fillOpacity="0.8" />
      <circle cx="24" cy="8" r="2.5" fill={color} fillOpacity="0.9" />
      {/* Energy spirals */}
      <path d="M20 40C16 38 14 34 16 30C18 26 22 26 24 30" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
      <path d="M28 40C32 38 34 34 32 30C30 26 26 26 24 30" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
      <path d="M20 18C16 16 14 12 16 8" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
      <path d="M28 18C32 16 34 12 32 8" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
      {/* Crown lotus petals */}
      <path d="M24 4L22 7L24 6L26 7L24 4Z" fill={color} fillOpacity="0.6" />
    </svg>
  );
}

// Moon phases arc
export function IconMoonPhases({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Crescent moon - main */}
      <path d="M30 24C30 30.627 24.627 36 18 36C16.5 36 15 35.7 13.7 35.2C17.5 33.5 20 29.5 20 25C20 20.5 17.5 16.5 13.7 14.8C15 14.3 16.5 14 18 14C24.627 14 30 19.373 30 26" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Inner crescent shadow */}
      <path d="M27 24C27 28.5 23.5 32 19 32C17.8 32 16.7 31.8 15.7 31.4C18.4 30.1 20.2 27.3 20.2 24C20.2 20.7 18.4 17.9 15.7 16.6C16.7 16.2 17.8 16 19 16C23.5 16 27 19.5 27 24Z" fill={color} fillOpacity="0.15" />
      {/* Stars around */}
      <circle cx="36" cy="12" r="1.5" fill={color} />
      <circle cx="40" cy="20" r="1" fill={color} fillOpacity="0.6" />
      <circle cx="38" cy="32" r="1.2" fill={color} fillOpacity="0.8" />
      <circle cx="10" cy="10" r="0.8" fill={color} fillOpacity="0.5" />
      <circle cx="8" cy="28" r="1" fill={color} fillOpacity="0.4" />
      {/* Sparkle */}
      <path d="M35 28L36 26L37 28L36 30L35 28Z" fill={color} fillOpacity="0.7" />
    </svg>
  );
}

// Sacred geometry - Flower of Life simplified
export function IconFlowerOfLife({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Central circle */}
      <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="1" fill="none" />
      {/* Surrounding petals */}
      <circle cx="24" cy="18" r="6" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
      <circle cx="24" cy="30" r="6" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
      <circle cx="18.8" cy="21" r="6" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
      <circle cx="29.2" cy="21" r="6" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
      <circle cx="18.8" cy="27" r="6" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
      <circle cx="29.2" cy="27" r="6" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="1.5" fill={color} />
    </svg>
  );
}

// Akashic Records - Infinite library
export function IconAkashicRecords({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Infinity symbol */}
      <path d="M14 24C14 20.5 16.5 18 20 18C23.5 18 24 22 24 24C24 26 24.5 30 28 30C31.5 30 34 27.5 34 24C34 20.5 31.5 18 28 18C24.5 18 24 22 24 24C24 26 23.5 30 20 30C16.5 30 14 27.5 14 24Z" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Central eye */}
      <circle cx="24" cy="24" r="2" fill={color} />
      {/* Vertical axis - cosmic pillar */}
      <path d="M24 10V14M24 34V38" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Light beams */}
      <path d="M24 6L22 10H26L24 6Z" fill={color} fillOpacity="0.4" />
      <path d="M24 42L22 38H26L24 42Z" fill={color} fillOpacity="0.4" />
      {/* Corner stars */}
      <circle cx="10" cy="10" r="1" fill={color} fillOpacity="0.3" />
      <circle cx="38" cy="10" r="1" fill={color} fillOpacity="0.3" />
      <circle cx="10" cy="38" r="1" fill={color} fillOpacity="0.3" />
      <circle cx="38" cy="38" r="1" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

// ============ AUDIOBOOK ICONS ============

// Prophet - Figure with rays
export function IconProphet({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Hooded figure silhouette */}
      <path d="M24 12C20 12 17 15 16 18C15 21 15 26 16 30L14 42H34L32 30C33 26 33 21 32 18C31 15 28 12 24 12Z" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Face area - void */}
      <ellipse cx="24" cy="20" rx="4" ry="5" fill={color} fillOpacity="0.1" />
      {/* Light rays from above */}
      <path d="M24 4V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 6L20 9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M30 6L28 9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M14 10L17 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M34 10L31 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Third eye */}
      <circle cx="24" cy="18" r="1" fill={color} />
    </svg>
  );
}

// Ancient scroll
export function IconAncientScroll({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Top roll */}
      <ellipse cx="24" cy="10" rx="14" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Bottom roll */}
      <ellipse cx="24" cy="38" rx="14" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Scroll body */}
      <path d="M10 10V38" stroke={color} strokeWidth="1.5" />
      <path d="M38 10V38" stroke={color} strokeWidth="1.5" />
      {/* Text lines */}
      <path d="M16 18H32" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M16 22H28" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M16 26H30" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M16 30H26" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Seal */}
      <circle cx="32" cy="34" r="2" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

// Hermetic symbol
export function IconHermetic({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Outer circle */}
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
      {/* Triangle pointing up - fire/spirit */}
      <path d="M24 10L34 32H14L24 10Z" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Triangle pointing down - water/matter */}
      <path d="M24 38L14 16H34L24 38Z" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
      {/* Central hexagram intersection glow */}
      <circle cx="24" cy="24" r="3" fill={color} fillOpacity="0.2" />
      <circle cx="24" cy="24" r="1.5" fill={color} />
    </svg>
  );
}

// Yin Yang with detail
export function IconYinYang({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Outer circle */}
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Yin side (dark) */}
      <path d="M24 8C32.837 8 40 15.163 40 24C40 32.837 32.837 40 24 40C24 31.163 19.582 24 24 24C28.418 24 24 16.837 24 8Z" fill={color} fillOpacity="0.2" />
      {/* S-curve */}
      <path d="M24 8C24 16.837 28.418 24 24 24C19.582 24 24 31.163 24 40" stroke={color} strokeWidth="1" />
      {/* Yang dot */}
      <circle cx="24" cy="16" r="2" fill={color} />
      {/* Yin dot - hollow */}
      <circle cx="24" cy="32" r="2" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  );
}

// Infinite wisdom - Open book with light
export function IconInfiniteWisdom({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Open book - left page */}
      <path d="M6 14C6 12 8 10 10 10H22C23 10 24 11 24 12V40C24 40 22 38 18 38H10C8 38 6 36 6 34V14Z" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Open book - right page */}
      <path d="M42 14C42 12 40 10 38 10H26C25 10 24 11 24 12V40C24 40 26 38 30 38H38C40 38 42 36 42 34V14Z" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Light rising from book */}
      <path d="M24 8V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 6L22 9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M28 6L26 9" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      {/* Central glow */}
      <circle cx="24" cy="10" r="2" fill={color} fillOpacity="0.3" />
      {/* Page lines */}
      <path d="M10 18H20M10 22H18M10 26H19" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M28 18H38M30 22H38M29 26H38" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  );
}

// ============ AFFIRMATION ICONS ============

// Rising sun with hands
export function IconMorningRise({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Horizon line */}
      <path d="M4 32H44" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      {/* Sun arc */}
      <path d="M12 32C12 25.373 17.373 20 24 20C30.627 20 36 25.373 36 32" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Sun rays */}
      <path d="M24 14V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 18L11 15" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M34 18L37 15" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M8 26L5 24" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M40 26L43 24" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Hands reaching up */}
      <path d="M20 42C20 38 21 36 22 34" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M28 42C28 38 27 36 26 34" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      {/* Center glow */}
      <circle cx="24" cy="26" r="3" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

// Transformation spiral
export function IconTransformation({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Spiral from center outward */}
      <path d="M24 24C24 22 26 20 28 20C32 20 34 24 34 28C34 34 28 38 22 38C14 38 10 30 10 22C10 12 20 6 30 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Inner dot */}
      <circle cx="24" cy="24" r="2" fill={color} />
      {/* Transformation arrows/sparks */}
      <path d="M38 10L40 8M40 8L42 10M40 8V12" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      {/* Radiating points */}
      <circle cx="34" cy="10" r="1" fill={color} fillOpacity="0.4" />
      <circle cx="40" cy="16" r="0.8" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

// Mirror reflection
export function IconMirrorSelf({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Mirror frame */}
      <ellipse cx="24" cy="24" rx="14" ry="18" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Inner mirror surface */}
      <ellipse cx="24" cy="24" rx="11" ry="15" stroke={color} strokeWidth="0.5" fill={color} fillOpacity="0.05" />
      {/* Reflection - abstract face */}
      <circle cx="24" cy="20" r="4" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.6" />
      {/* Third eye */}
      <circle cx="24" cy="20" r="1" fill={color} fillOpacity="0.5" />
      {/* Reflection lines suggesting figure */}
      <path d="M24 26V32" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
      <path d="M20 28L24 26L28 28" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Sparkles on mirror */}
      <circle cx="32" cy="14" r="1" fill={color} fillOpacity="0.5" />
      <circle cx="16" cy="32" r="0.8" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

// Lotus chakra
export function IconLotusChakra({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Center */}
      <circle cx="24" cy="24" r="3" fill={color} fillOpacity="0.3" />
      <circle cx="24" cy="24" r="1.5" fill={color} />
      {/* Lotus petals - 8 directions */}
      <path d="M24 10C22 14 22 18 24 20C26 18 26 14 24 10Z" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.1" />
      <path d="M24 38C22 34 22 30 24 28C26 30 26 34 24 38Z" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.1" />
      <path d="M10 24C14 22 18 22 20 24C18 26 14 26 10 24Z" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.1" />
      <path d="M38 24C34 22 30 22 28 24C30 26 34 26 38 24Z" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.1" />
      {/* Diagonal petals */}
      <path d="M14 14C16 16 18 18 20 20C18 20 16 18 14 14Z" stroke={color} strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
      <path d="M34 14C32 16 30 18 28 20C30 20 32 18 34 14Z" stroke={color} strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
      <path d="M14 34C16 32 18 30 20 28C18 28 16 30 14 34Z" stroke={color} strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
      <path d="M34 34C32 32 30 30 28 28C30 28 32 30 34 34Z" stroke={color} strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
    </svg>
  );
}

// Breath waves
export function IconBreathWaves({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Breath waves - inhale/exhale pattern */}
      <path d="M6 24C10 20 14 20 18 24C22 28 26 28 30 24C34 20 38 20 42 24" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M6 18C10 14 14 14 18 18C22 22 26 22 30 18C34 14 38 14 42 18" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M6 30C10 26 14 26 18 30C22 34 26 34 30 30C34 26 38 26 42 30" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Central point - present moment */}
      <circle cx="24" cy="24" r="2" fill={color} />
      {/* Breath direction arrows */}
      <path d="M4 24L2 22M4 24L2 26" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M44 24L46 22M44 24L46 26" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// ============ SOUND/MEDITATION ICONS ============

// Sound frequency waves
export function IconFrequencyWaves({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Central core */}
      <circle cx="24" cy="24" r="3" fill={color} />
      {/* Emanating frequency rings */}
      <circle cx="24" cy="24" r="7" stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.8" />
      <circle cx="24" cy="24" r="11" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
      <circle cx="24" cy="24" r="15" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.3" />
      <circle cx="24" cy="24" r="19" stroke={color} strokeWidth="0.5" fill="none" strokeOpacity="0.15" />
      {/* Frequency number suggestion */}
      <path d="M24 4V8" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M24 40V44" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// Tibetan singing bowl
export function IconSingingBowl({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Bowl shape */}
      <ellipse cx="24" cy="36" rx="16" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M8 36C8 28 14 22 24 22C34 22 40 28 40 36" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Bowl rim highlight */}
      <ellipse cx="24" cy="22" rx="10" ry="2.5" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
      {/* Sound vibration lines */}
      <path d="M24 18V14" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M18 16L16 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M30 16L32 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M14 20L10 18" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeOpacity="0.3" />
      <path d="M34 20L38 18" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeOpacity="0.3" />
      {/* Mallet */}
      <path d="M36 28L42 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Theta brain wave
export function IconThetaWave({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Brain outline suggestion */}
      <path d="M14 20C10 20 8 24 8 28C8 34 14 38 20 38C22 38 24 37 24 36C24 37 26 38 28 38C34 38 40 34 40 28C40 24 38 20 34 20" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.3" />
      {/* Theta wave pattern through center */}
      <path d="M6 24C10 20 12 28 16 24C20 20 22 28 26 24C30 20 32 28 36 24C40 20 42 28 42 24" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Glow points at peaks */}
      <circle cx="16" cy="24" r="1.5" fill={color} fillOpacity="0.5" />
      <circle cx="26" cy="24" r="1.5" fill={color} fillOpacity="0.5" />
      <circle cx="36" cy="24" r="1.5" fill={color} fillOpacity="0.5" />
      {/* Central consciousness point */}
      <circle cx="24" cy="14" r="2" fill={color} />
      <path d="M24 16V20" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}

// Moon and stars (sleep)
export function IconLunarSleep({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Crescent moon */}
      <path d="M32 24C32 32.284 25.284 39 17 39C14.5 39 12.1 38.4 10 37.4C15.5 34.8 19 29 19 22.5C19 16 15.5 10.2 10 7.6C12.1 6.6 14.5 6 17 6C25.284 6 32 12.716 32 21" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Moon surface detail */}
      <circle cx="22" cy="20" r="1" fill={color} fillOpacity="0.2" />
      <circle cx="18" cy="28" r="1.5" fill={color} fillOpacity="0.15" />
      {/* Stars */}
      <path d="M38 12L39 10L40 12L39 14L38 12Z" fill={color} />
      <path d="M42 22L42.5 21L43 22L42.5 23L42 22Z" fill={color} fillOpacity="0.7" />
      <path d="M36 32L36.5 31L37 32L36.5 33L36 32Z" fill={color} fillOpacity="0.5" />
      <circle cx="40" cy="28" r="0.8" fill={color} fillOpacity="0.4" />
      <circle cx="44" cy="16" r="0.6" fill={color} fillOpacity="0.3" />
      {/* Z's for sleep */}
      <path d="M42 36L44 36L42 38L44 38" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// Om symbol stylized
export function IconOmSymbol({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Om symbol - stylized curves */}
      <path d="M12 28C12 32 16 36 20 36C24 36 26 32 26 28C26 24 24 22 20 22" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M26 28C26 32 28 34 32 34C36 34 38 30 38 26C38 22 34 20 30 22" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M20 22C20 18 22 14 28 14C32 14 34 16 34 18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Bindu (dot) */}
      <circle cx="34" cy="10" r="2" fill={color} />
      {/* Chandrabindu (crescent) */}
      <path d="M30 12C32 10 36 10 38 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Decorative glow */}
      <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="0.5" fill="none" strokeOpacity="0.2" />
    </svg>
  );
}

// ============ CELESTIAL TOOLS ICONS ============

// Tarot card with eye
export function IconTarotCard({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Card outline */}
      <rect x="12" y="6" width="24" height="36" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Inner border */}
      <rect x="15" y="9" width="18" height="30" rx="1" stroke={color} strokeWidth="0.5" fill="none" strokeOpacity="0.4" />
      {/* All-seeing eye */}
      <ellipse cx="24" cy="22" rx="6" ry="4" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="24" cy="22" r="2" fill={color} />
      {/* Eye rays */}
      <path d="M24 16V14" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M18 18L16 16" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M30 18L32 16" stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeOpacity="0.4" />
      {/* Card number/symbol at bottom */}
      <path d="M24 32L22 35L24 34L26 35L24 32Z" fill={color} fillOpacity="0.6" />
      {/* Corner decorations */}
      <circle cx="16" cy="11" r="1" fill={color} fillOpacity="0.3" />
      <circle cx="32" cy="37" r="1" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

// Oracle crystal ball
export function IconOracleCrystal({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Crystal ball */}
      <circle cx="24" cy="22" r="14" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Inner reflection */}
      <circle cx="24" cy="22" r="11" stroke={color} strokeWidth="0.5" fill={color} fillOpacity="0.05" />
      {/* Light reflection */}
      <ellipse cx="19" cy="17" rx="3" ry="2" fill={color} fillOpacity="0.15" />
      {/* Mystical mist inside */}
      <path d="M16 24C18 22 22 24 24 22C26 20 28 22 32 24" stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.3" />
      <path d="M18 28C20 26 22 28 26 26C28 24 30 26 30 28" stroke={color} strokeWidth="0.5" fill="none" strokeOpacity="0.2" />
      {/* Stand */}
      <path d="M16 36H32" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 36C20 34 22 33 24 33C26 33 28 34 28 36" stroke={color} strokeWidth="1" fill="none" />
      {/* Sparkle */}
      <circle cx="28" cy="16" r="1" fill={color} />
    </svg>
  );
}

// Celtic knot spread
export function IconCelticKnot({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Central knot weave */}
      <path d="M24 8C20 8 16 12 16 16C16 20 20 20 24 20C28 20 32 20 32 16C32 12 28 8 24 8Z" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M24 40C20 40 16 36 16 32C16 28 20 28 24 28C28 28 32 28 32 32C32 36 28 40 24 40Z" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Vertical connection */}
      <path d="M20 20C20 24 20 28 20 28" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      <path d="M28 20C28 24 28 28 28 28" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      {/* Center cross-point */}
      <circle cx="24" cy="24" r="2" fill={color} />
      {/* Outer frame corners */}
      <path d="M8 8L12 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M40 8L36 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M8 40L12 36" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M40 40L36 36" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// Zodiac wheel
export function IconZodiacWheel({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Outer wheel */}
      <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="1" fill="none" />
      {/* Inner wheel */}
      <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" />
      {/* Center point */}
      <circle cx="24" cy="24" r="2" fill={color} />
      {/* 12 division lines (zodiac houses) */}
      <path d="M24 6V12" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M24 36V42" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M6 24H12" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M36 24H42" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <path d="M10.4 10.4L14.2 14.2" stroke={color} strokeWidth="0.6" strokeOpacity="0.3" />
      <path d="M33.8 33.8L37.6 37.6" stroke={color} strokeWidth="0.6" strokeOpacity="0.3" />
      <path d="M37.6 10.4L33.8 14.2" stroke={color} strokeWidth="0.6" strokeOpacity="0.3" />
      <path d="M14.2 33.8L10.4 37.6" stroke={color} strokeWidth="0.6" strokeOpacity="0.3" />
      {/* Zodiac symbol suggestions - small dots on outer ring */}
      <circle cx="24" cy="6.5" r="1" fill={color} fillOpacity="0.5" />
      <circle cx="41.5" cy="24" r="1" fill={color} fillOpacity="0.5" />
      <circle cx="24" cy="41.5" r="1" fill={color} fillOpacity="0.5" />
      <circle cx="6.5" cy="24" r="1" fill={color} fillOpacity="0.5" />
    </svg>
  );
}

// Natal chart constellation
export function IconNatalChart({ className, color = "currentColor", size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Outer circle - chart boundary */}
      <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.4" />
      {/* Planet positions as dots with connections */}
      <circle cx="24" cy="8" r="2" fill={color} /> {/* Sun position */}
      <circle cx="36" cy="14" r="1.5" fill={color} fillOpacity="0.8" />
      <circle cx="40" cy="26" r="1.5" fill={color} fillOpacity="0.7" />
      <circle cx="32" cy="38" r="1.5" fill={color} fillOpacity="0.6" />
      <circle cx="16" cy="38" r="1.5" fill={color} fillOpacity="0.6" />
      <circle cx="8" cy="26" r="1.5" fill={color} fillOpacity="0.7" />
      <circle cx="12" cy="14" r="1.5" fill={color} fillOpacity="0.8" />
      {/* Aspect lines connecting planets */}
      <path d="M24 8L36 14" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M24 8L12 14" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M36 14L40 26" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M12 14L8 26" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M32 38L16 38" stroke={color} strokeWidth="0.5" strokeOpacity="0.25" />
      {/* Center - Earth position */}
      <circle cx="24" cy="24" r="3" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="24" cy="24" r="1" fill={color} />
    </svg>
  );
}
