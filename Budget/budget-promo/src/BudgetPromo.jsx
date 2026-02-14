import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, Audio, staticFile} from 'remotion';

const COLORS = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  success: '#16A34A',
  danger: '#EF4444',
  warning: '#F59E0B',
  dark: '#1E1B2E',
  darkCard: '#2A2740',
  white: '#FFFFFF',
  textLight: '#A5A3B5',
  gold: '#FFD700',
};

const fontFamily = 'Arial, Helvetica, sans-serif';

// ===== SHARED COMPONENTS =====
const GradientBg = ({children, colors}) => (
  <AbsoluteFill style={{
    background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
    fontFamily, direction: 'rtl',
  }}>
    {children}
  </AbsoluteFill>
);

const FadeIn = ({children, frame, delay = 0, duration = 15}) => {
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const translateY = interpolate(frame - delay, [0, duration], [40, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return <div style={{opacity, transform: `translateY(${translateY}px)`}}>{children}</div>;
};

const ScaleIn = ({children, frame, delay = 0, fps = 30}) => {
  const scale = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 200}});
  return <div style={{transform: `scale(${scale})`, opacity: scale}}>{children}</div>;
};

const FloatingEmoji = ({emoji, x, y, frame, delay = 0, size = 56}) => {
  const progress = interpolate(frame - delay, [0, 60], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const yOffset = Math.sin((frame - delay) * 0.05) * 15;
  return (
    <div style={{
      position: 'absolute', left: x, top: y + yOffset,
      fontSize: size, opacity: progress,
      transform: `scale(${progress})`,
    }}>{emoji}</div>
  );
};

// ===== SCENE 1: INTRO (0-90 frames = 3s) =====
const SceneIntro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoScale = spring({frame, fps, config: {damping: 10, stiffness: 150}});
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const shimmer = interpolate(frame, [50, 80], [-100, 200], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});

  return (
    <GradientBg colors={[COLORS.dark, '#2D1B69']}>
      {/* Decorative circles */}
      <div style={{position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,.15)'}} />
      <div style={{position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,.1)'}} />

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 60}}>
        {/* Logo */}
        <div style={{
          transform: `scale(${logoScale})`,
          fontSize: 140, marginBottom: 30,
          filter: 'drop-shadow(0 8px 20px rgba(99,102,241,.4))',
        }}>💰</div>

        {/* Title */}
        <div style={{
          opacity: titleOpacity,
          fontSize: 88, fontWeight: 900, color: COLORS.white,
          textAlign: 'center', lineHeight: 1.2, marginBottom: 24,
          textShadow: '0 4px 20px rgba(0,0,0,.3)',
        }}>
          תקציב משפחתי
        </div>

        {/* Subtitle with shimmer */}
        <div style={{
          opacity: subtitleOpacity,
          fontSize: 46, color: COLORS.primaryLight,
          textAlign: 'center', fontWeight: 600,
          position: 'relative', overflow: 'hidden',
        }}>
          ניהול פיננסי חכם
          <div style={{
            position: 'absolute', top: 0, left: shimmer + '%',
            width: 60, height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent)',
          }} />
        </div>

        {/* Tagline */}
        <FadeIn frame={frame} delay={55} duration={20}>
          <div style={{
            fontSize: 36, color: COLORS.textLight,
            textAlign: 'center', marginTop: 30,
            maxWidth: 800, lineHeight: 1.6,
          }}>
            הכלי שיעזור לכם לנהל את הכסף בצורה חכמה ופשוטה
          </div>
        </FadeIn>
      </div>
    </GradientBg>
  );
};

// ===== SCENE 2: FEATURES GRID (90-180 frames = 3s) =====
const SceneFeatures = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const features = [
    {emoji: '📋', title: 'מעקב הוצאות', desc: 'קטגוריות חכמות\nתקציב לכל קטגוריה'},
    {emoji: '💵', title: 'הכנסות', desc: 'מעקב הכנסות\nהכנסות קבועות'},
    {emoji: '📊', title: 'דשבורד', desc: 'גרפים וניתוחים\nבריאות פיננסית'},
    {emoji: '💰', title: 'חסכונות', desc: 'יעדי חיסכון\nקרן חירום'},
    {emoji: '👫', title: 'שותפים', desc: 'תקציב משותף\nסנכרון בזמן אמת'},
    {emoji: '🏦', title: 'ייבוא חשבון', desc: 'סיווג אוטומטי\nכרטיסי אשראי'},
  ];

  return (
    <GradientBg colors={[COLORS.dark, '#1B2438']}>
      <div style={{padding: '80px 50px', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <FadeIn frame={frame} delay={0}>
          <div style={{fontSize: 62, fontWeight: 800, color: COLORS.white, textAlign: 'center', marginBottom: 50}}>
            הכל במקום אחד ✨
          </div>
        </FadeIn>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1, alignContent: 'center'}}>
          {features.map((f, i) => (
            <ScaleIn key={i} frame={frame} delay={10 + i * 8} fps={fps}>
              <div style={{
                background: COLORS.darkCard,
                borderRadius: 24, padding: '36px 28px',
                textAlign: 'center',
                border: '1px solid rgba(99,102,241,.2)',
                boxShadow: '0 8px 24px rgba(0,0,0,.2)',
              }}>
                <div style={{fontSize: 60, marginBottom: 14}}>{f.emoji}</div>
                <div style={{fontSize: 32, fontWeight: 700, color: COLORS.white, marginBottom: 10}}>{f.title}</div>
                <div style={{fontSize: 22, color: COLORS.textLight, whiteSpace: 'pre-line', lineHeight: 1.5}}>{f.desc}</div>
              </div>
            </ScaleIn>
          ))}
        </div>
      </div>
    </GradientBg>
  );
};

// ===== SCENE 3: BUDGET UI MOCKUP (180-270 frames = 3s) =====
const SceneBudgetUI = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const categories = [
    {icon: '🏠', name: 'דיור', budget: 5000, spent: 4200, color: '#6366F1'},
    {icon: '🛒', name: 'מזון', budget: 3000, spent: 2800, color: '#F59E0B'},
    {icon: '🚗', name: 'תחבורה', budget: 1500, spent: 900, color: '#10B981'},
    {icon: '🏥', name: 'בריאות', budget: 800, spent: 650, color: '#EC4899'},
    {icon: '🎉', name: 'בילויים', budget: 1000, spent: 1200, color: '#EF4444'},
  ];

  return (
    <GradientBg colors={[COLORS.dark, '#1B2E38']}>
      <div style={{padding: '60px 40px', height: '100%', display: 'flex', flexDirection: 'column'}}>
        {/* Header mockup */}
        <FadeIn frame={frame} delay={0}>
          <div style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: 20, padding: '28px 34px', marginBottom: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{fontSize: 26, color: 'rgba(255,255,255,.7)'}}>פברואר 2026</div>
              <div style={{fontSize: 44, fontWeight: 800, color: COLORS.white}}>תקציב משפחתי</div>
            </div>
            <div style={{fontSize: 48}}>📋</div>
          </div>
        </FadeIn>

        {/* Summary bar */}
        <FadeIn frame={frame} delay={8}>
          <div style={{
            display: 'flex', gap: 12, marginBottom: 24,
          }}>
            {[
              {label: 'הכנסות', value: '₪ 18,000', color: COLORS.success},
              {label: 'הוצאות', value: '₪ 12,350', color: COLORS.warning},
              {label: 'חיסכון', value: '₪ 5,650', color: COLORS.primary},
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, background: COLORS.darkCard, borderRadius: 16, padding: '18px 14px',
                textAlign: 'center', border: `2px solid ${item.color}30`,
              }}>
                <div style={{fontSize: 20, color: COLORS.textLight, marginBottom: 6}}>{item.label}</div>
                <div style={{fontSize: 30, fontWeight: 700, color: item.color, direction: 'ltr'}}>{item.value}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Category cards */}
        {categories.map((cat, i) => {
          const pct = Math.round(cat.spent / cat.budget * 100);
          const isOver = cat.spent > cat.budget;
          const barWidth = interpolate(frame - 15 - i * 6, [0, 30], [0, Math.min(pct, 100)], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});

          return (
            <FadeIn key={i} frame={frame} delay={15 + i * 6}>
              <div style={{
                background: COLORS.darkCard, borderRadius: 18, padding: '22px 26px',
                marginBottom: 14, border: isOver ? `1px solid ${COLORS.danger}40` : '1px solid rgba(255,255,255,.05)',
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{fontSize: 38}}>{cat.icon}</span>
                    <span style={{fontSize: 30, fontWeight: 600, color: COLORS.white}}>{cat.name}</span>
                  </div>
                  <div style={{textAlign: 'left', direction: 'ltr'}}>
                    <span style={{fontSize: 28, fontWeight: 700, color: isOver ? COLORS.danger : COLORS.white}}>
                      ₪ {cat.spent.toLocaleString()}
                    </span>
                    <span style={{fontSize: 20, color: COLORS.textLight}}> / ₪ {cat.budget.toLocaleString()}</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{background: 'rgba(255,255,255,.08)', borderRadius: 8, height: 12, overflow: 'hidden'}}>
                  <div style={{
                    width: `${barWidth}%`, height: '100%', borderRadius: 8,
                    background: isOver ? COLORS.danger : pct > 80 ? COLORS.warning : cat.color,
                    transition: 'width .3s',
                  }} />
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </GradientBg>
  );
};

// ===== SCENE 4: DASHBOARD CHARTS (270-360 frames = 3s) =====
const SceneDashboard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Animated doughnut chart
  const doughnutProgress = interpolate(frame, [10, 50], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const segments = [
    {pct: 35, color: '#6366F1', label: 'דיור'},
    {pct: 25, color: '#F59E0B', label: 'מזון'},
    {pct: 15, color: '#10B981', label: 'תחבורה'},
    {pct: 12, color: '#EC4899', label: 'בריאות'},
    {pct: 13, color: '#8B5CF6', label: 'אחר'},
  ];

  // Bar chart data
  const barData = [85, 93, 60, 81, 120, 45];
  const barLabels = ['דיור', 'מזון', 'תחבורה', 'בריאות', 'בילויים', 'מינויים'];

  return (
    <GradientBg colors={[COLORS.dark, '#1B1B38']}>
      <div style={{padding: '60px 40px', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <FadeIn frame={frame} delay={0}>
          <div style={{fontSize: 58, fontWeight: 800, color: COLORS.white, textAlign: 'center', marginBottom: 36}}>
            📊 דשבורד חכם
          </div>
        </FadeIn>

        {/* KPI Row */}
        <FadeIn frame={frame} delay={8}>
          <div style={{display: 'flex', gap: 12, marginBottom: 30}}>
            {[
              {label: 'בריאות פיננסית', value: '82', unit: '/100', color: COLORS.success, emoji: '🏥'},
              {label: 'אחוז חיסכון', value: '31%', color: COLORS.primary, emoji: '💰'},
            ].map((kpi, i) => (
              <div key={i} style={{
                flex: 1, background: COLORS.darkCard, borderRadius: 20, padding: 24,
                textAlign: 'center', borderTop: `4px solid ${kpi.color}`,
              }}>
                <div style={{fontSize: 42, marginBottom: 8}}>{kpi.emoji}</div>
                <div style={{fontSize: 52, fontWeight: 800, color: kpi.color}}>
                  {kpi.value}<span style={{fontSize: 26, color: COLORS.textLight}}>{kpi.unit || ''}</span>
                </div>
                <div style={{fontSize: 22, color: COLORS.textLight, marginTop: 4}}>{kpi.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Doughnut chart */}
        <ScaleIn frame={frame} delay={15} fps={fps}>
          <div style={{
            background: COLORS.darkCard, borderRadius: 24, padding: 30,
            display: 'flex', alignItems: 'center', gap: 30, marginBottom: 24,
          }}>
            <svg width={240} height={240} viewBox="0 0 240 240">
              {(() => {
                let offset = 0;
                return segments.map((seg, i) => {
                  const circumference = 2 * Math.PI * 90;
                  const dash = circumference * (seg.pct / 100) * doughnutProgress;
                  const gap = circumference - dash;
                  const rotation = -90 + offset * 3.6;
                  offset += seg.pct;
                  return (
                    <circle key={i} cx={120} cy={120} r={90}
                      fill="none" stroke={seg.color} strokeWidth={32}
                      strokeDasharray={`${dash} ${gap}`}
                      transform={`rotate(${rotation} 120 120)`}
                    />
                  );
                });
              })()}
              <text x={120} y={112} textAnchor="middle" fill={COLORS.white} fontSize={36} fontWeight={700}>
                ₪ 12,350
              </text>
              <text x={120} y={145} textAnchor="middle" fill={COLORS.textLight} fontSize={20}>
                סה״כ הוצאות
              </text>
            </svg>
            <div style={{flex: 1}}>
              {segments.map((seg, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
                  <div style={{width: 16, height: 16, borderRadius: 4, background: seg.color}} />
                  <span style={{fontSize: 24, color: COLORS.white, flex: 1}}>{seg.label}</span>
                  <span style={{fontSize: 24, color: COLORS.textLight, direction: 'ltr'}}>{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </ScaleIn>

        {/* Bar chart */}
        <FadeIn frame={frame} delay={30}>
          <div style={{
            background: COLORS.darkCard, borderRadius: 24, padding: '24px 30px',
          }}>
            <div style={{fontSize: 28, fontWeight: 600, color: COLORS.white, marginBottom: 16}}>תקציב מול ביצוע</div>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 16, height: 180}}>
              {barData.map((val, i) => {
                const barH = interpolate(frame - 35 - i * 3, [0, 20], [0, Math.min(val, 100) * 1.6], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
                return (
                  <div key={i} style={{flex: 1, textAlign: 'center'}}>
                    <div style={{
                      height: barH, borderRadius: '8px 8px 0 0',
                      background: val > 100 ? COLORS.danger : val > 80 ? COLORS.warning : COLORS.primary,
                      marginBottom: 8, minHeight: 4,
                    }} />
                    <div style={{fontSize: 17, color: COLORS.textLight}}>{barLabels[i]}</div>
                    <div style={{fontSize: 18, color: val > 100 ? COLORS.danger : COLORS.white, fontWeight: 600}}>{val}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </GradientBg>
  );
};

// ===== SCENE 5: CTA / CLOSING (360-450 frames = 3s) =====
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pulse = Math.sin(frame * 0.1) * 5;
  const sparkles = [
    {x: 150, y: 300, delay: 0}, {x: 800, y: 400, delay: 10},
    {x: 300, y: 1200, delay: 20}, {x: 700, y: 1000, delay: 5},
    {x: 500, y: 600, delay: 15}, {x: 200, y: 800, delay: 25},
  ];

  return (
    <GradientBg colors={['#1B0F3B', '#6366F1']}>
      {/* Sparkle particles */}
      {sparkles.map((s, i) => (
        <FloatingEmoji key={i} emoji="✨" x={s.x} y={s.y} frame={frame} delay={s.delay} size={40} />
      ))}

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 60}}>
        <ScaleIn frame={frame} delay={0} fps={fps}>
          <div style={{fontSize: 120, marginBottom: 20, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,.3))'}}>🚀</div>
        </ScaleIn>

        <FadeIn frame={frame} delay={10}>
          <div style={{
            fontSize: 68, fontWeight: 900, color: COLORS.white,
            textAlign: 'center', lineHeight: 1.3, marginBottom: 28,
          }}>
            התחילו לנהל
            <br />
            את הכסף שלכם
            <br />
            <span style={{color: COLORS.gold}}>בחכמה</span>
          </div>
        </FadeIn>

        <FadeIn frame={frame} delay={25}>
          <div style={{
            fontSize: 34, color: 'rgba(255,255,255,.8)',
            textAlign: 'center', lineHeight: 1.6, marginBottom: 40,
            maxWidth: 800,
          }}>
            חינם לחלוטין • ללא הרשמה • עובד מהדפדפן
          </div>
        </FadeIn>

        <ScaleIn frame={frame} delay={35} fps={fps}>
          <div style={{
            background: COLORS.white, borderRadius: 60,
            padding: '28px 70px', transform: `scale(${1 + pulse * 0.005})`,
            boxShadow: '0 12px 40px rgba(99,102,241,.4)',
          }}>
            <div style={{fontSize: 44, fontWeight: 800, color: COLORS.primary, textAlign: 'center'}}>
              💰 התחילו עכשיו
            </div>
          </div>
        </ScaleIn>

        <FadeIn frame={frame} delay={50}>
          <div style={{
            marginTop: 40, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {['📋 מעקב הוצאות', '📊 דשבורד', '💰 חסכונות', '👫 שיתוף'].map((tag, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,.15)', borderRadius: 30,
                padding: '12px 28px', fontSize: 26, color: COLORS.white,
                backdropFilter: 'blur(10px)',
              }}>{tag}</div>
            ))}
          </div>
        </FadeIn>

        <FadeIn frame={frame} delay={60}>
          <div style={{
            marginTop: 50, fontSize: 24, color: 'rgba(255,255,255,.5)',
            textAlign: 'center',
          }}>
            עובד על כל מכשיר • עברית מלאה • מצב כהה
          </div>
        </FadeIn>
      </div>
    </GradientBg>
  );
};

// ===== MAIN COMPOSITION =====
export const BudgetPromo = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('music.wav')} volume={0.6} />
      <Sequence from={0} durationInFrames={90}><SceneIntro /></Sequence>
      <Sequence from={90} durationInFrames={90}><SceneFeatures /></Sequence>
      <Sequence from={180} durationInFrames={90}><SceneBudgetUI /></Sequence>
      <Sequence from={270} durationInFrames={90}><SceneDashboard /></Sequence>
      <Sequence from={360} durationInFrames={90}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
};
