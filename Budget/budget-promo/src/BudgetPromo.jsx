import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, Audio, staticFile} from 'remotion';

const C = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  dark: '#0F0B1E',
  darkCard: '#1A1530',
  cardBorder: 'rgba(99,102,241,.18)',
  white: '#FFFFFF',
  textMuted: '#9B99AE',
  gold: '#FFD700',
  accent: '#A78BFA',
};

const font = "'Heebo', 'Arial', sans-serif";

// ===== SHARED PRIMITIVES =====
const Bg = ({children, colors}) => (
  <AbsoluteFill style={{background: `linear-gradient(160deg, ${colors[0]}, ${colors[1]})`, fontFamily: font, direction: 'rtl'}}>
    {children}
  </AbsoluteFill>
);

const Fade = ({children, frame, delay = 0, dur = 12, y = 30}) => {
  const o = interpolate(frame - delay, [0, dur], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const ty = interpolate(frame - delay, [0, dur], [y, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return <div style={{opacity: o, transform: `translateY(${ty}px)`}}>{children}</div>;
};

const Pop = ({children, frame, delay = 0, fps = 30}) => {
  const s = spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 180}});
  return <div style={{transform: `scale(${s})`, opacity: s}}>{children}</div>;
};

// Narration bar at bottom of scene
const Narration = ({text, frame, delay = 0}) => {
  const o = interpolate(frame - delay, [0, 10], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'linear-gradient(0deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.6) 60%, transparent 100%)',
      padding: '60px 60px 50px', textAlign: 'center', opacity: o,
    }}>
      <div style={{
        fontSize: 42, fontWeight: 800, color: C.white, lineHeight: 1.5,
        textShadow: '0 2px 12px rgba(0,0,0,.5)',
        letterSpacing: '-0.5px',
      }}>{text}</div>
    </div>
  );
};

// Decorative glow circle
const Glow = ({x, y, size, color, opacity = 0.12}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: size, height: size,
    borderRadius: '50%', background: color, opacity, filter: 'blur(60px)',
  }} />
);

// ===== SCENE 1: INTRO (0-120 frames = 4s) =====
const SceneIntro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoScale = spring({frame, fps, config: {damping: 8, stiffness: 120}});
  const titleO = interpolate(frame, [15, 35], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const titleY = interpolate(frame, [15, 35], [50, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const subO = interpolate(frame, [35, 55], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const shimmer = interpolate(frame, [45, 90], [-120, 250], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const tagO = interpolate(frame, [55, 75], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});

  return (
    <Bg colors={[C.dark, '#1E1145']}>
      <Glow x={-120} y={-80} size={500} color={C.primary} opacity={0.15} />
      <Glow x={700} y={1400} size={400} color="#A78BFA" opacity={0.1} />

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 60px'}}>
        {/* Logo */}
        <div style={{
          transform: `scale(${logoScale})`,
          fontSize: 160, marginBottom: 20,
          filter: 'drop-shadow(0 10px 30px rgba(99,102,241,.5))',
        }}>💰</div>

        {/* Title */}
        <div style={{
          opacity: titleO, transform: `translateY(${titleY}px)`,
          fontSize: 110, fontWeight: 900, color: C.white,
          textAlign: 'center', lineHeight: 1.15, marginBottom: 20,
          letterSpacing: '-2px',
        }}>
          תקציב
          <br/>
          משפחתי
        </div>

        {/* Subtitle with shimmer */}
        <div style={{
          opacity: subO, position: 'relative', overflow: 'hidden',
          fontSize: 52, color: C.accent, textAlign: 'center', fontWeight: 700,
        }}>
          ניהול פיננסי חכם
          <div style={{
            position: 'absolute', top: 0, left: `${shimmer}%`,
            width: 80, height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)',
          }} />
        </div>

        {/* Badge */}
        <div style={{opacity: tagO, marginTop: 36}}>
          <div style={{
            background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.35)',
            borderRadius: 50, padding: '14px 44px',
            fontSize: 34, fontWeight: 700, color: C.primaryLight,
            textAlign: 'center',
          }}>
            חינם לחלוטין  •  ללא הרשמה
          </div>
        </div>
      </div>

      <Narration text="הכירו את הכלי שישנה את הדרך שבה אתם מנהלים כסף" frame={frame} delay={20} />
    </Bg>
  );
};

// ===== SCENE 2: FEATURES (120-240 frames = 4s) =====
const SceneFeatures = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const features = [
    {emoji: '📋', title: 'מעקב הוצאות', desc: 'קטגוריות חכמות עם תקציב'},
    {emoji: '💵', title: 'ניהול הכנסות', desc: 'מעקב ותזרים חודשי'},
    {emoji: '📊', title: 'דשבורד מתקדם', desc: 'גרפים, ניתוחים ותובנות'},
    {emoji: '💰', title: 'יעדי חיסכון', desc: 'קרן חירום ויעדים אישיים'},
    {emoji: '👫', title: 'תקציב משותף', desc: 'שותפים בזמן אמת'},
    {emoji: '🧠', title: 'יועץ פיננסי', desc: 'תובנות והמלצות חכמות'},
  ];

  return (
    <Bg colors={[C.dark, '#151030']}>
      <Glow x={800} y={-100} size={400} color={C.primary} opacity={0.1} />
      <div style={{padding: '70px 50px', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Fade frame={frame} delay={0}>
          <div style={{fontSize: 72, fontWeight: 900, color: C.white, textAlign: 'center', marginBottom: 16, letterSpacing: '-1px'}}>
            הכל במקום אחד
          </div>
          <div style={{fontSize: 36, fontWeight: 600, color: C.textMuted, textAlign: 'center', marginBottom: 44}}>
            כל מה שצריך לניהול פיננסי מושלם
          </div>
        </Fade>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, alignContent: 'center'}}>
          {features.map((f, i) => (
            <Pop key={i} frame={frame} delay={12 + i * 7} fps={fps}>
              <div style={{
                background: C.darkCard,
                borderRadius: 24, padding: '32px 24px',
                textAlign: 'center',
                border: `1px solid ${C.cardBorder}`,
                boxShadow: '0 8px 32px rgba(0,0,0,.25)',
              }}>
                <div style={{fontSize: 56, marginBottom: 12}}>{f.emoji}</div>
                <div style={{fontSize: 34, fontWeight: 800, color: C.white, marginBottom: 8}}>{f.title}</div>
                <div style={{fontSize: 24, color: C.textMuted, lineHeight: 1.5, fontWeight: 500}}>{f.desc}</div>
              </div>
            </Pop>
          ))}
        </div>
      </div>

      <Narration text={'6 כלים מתקדמים — באפליקציה אחת, בחינם'} frame={frame} delay={15} />
    </Bg>
  );
};

// ===== SCENE 3: BUDGET UI MOCKUP (240-360 frames = 4s) =====
const SceneBudgetUI = () => {
  const frame = useCurrentFrame();

  const categories = [
    {icon: '🏠', name: 'דיור', budget: 5000, spent: 4200, color: '#6366F1'},
    {icon: '🛒', name: 'מזון', budget: 3000, spent: 2800, color: '#F59E0B'},
    {icon: '🚗', name: 'תחבורה', budget: 1500, spent: 900, color: '#22C55E'},
    {icon: '🏥', name: 'בריאות', budget: 800, spent: 650, color: '#EC4899'},
    {icon: '🎉', name: 'בילויים', budget: 1000, spent: 1200, color: '#EF4444'},
  ];

  return (
    <Bg colors={[C.dark, '#0F1E2B']}>
      <div style={{padding: '50px 40px', height: '100%', display: 'flex', flexDirection: 'column'}}>
        {/* App header */}
        <Fade frame={frame} delay={0}>
          <div style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: 22, padding: '26px 32px', marginBottom: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{fontSize: 28, color: 'rgba(255,255,255,.75)', fontWeight: 600}}>פברואר 2026</div>
              <div style={{fontSize: 48, fontWeight: 900, color: C.white}}>תקציב משפחתי</div>
            </div>
            <div style={{fontSize: 52}}>📋</div>
          </div>
        </Fade>

        {/* Summary cards */}
        <Fade frame={frame} delay={8}>
          <div style={{display: 'flex', gap: 12, marginBottom: 20}}>
            {[
              {label: 'הכנסות', value: '₪ 18,000', color: C.success},
              {label: 'הוצאות', value: '₪ 12,350', color: C.warning},
              {label: 'חיסכון', value: '₪ 5,650', color: C.primary},
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, background: C.darkCard, borderRadius: 18, padding: '16px 12px',
                textAlign: 'center', border: `2px solid ${item.color}30`,
              }}>
                <div style={{fontSize: 22, color: C.textMuted, marginBottom: 6, fontWeight: 600}}>{item.label}</div>
                <div style={{fontSize: 32, fontWeight: 800, color: item.color, direction: 'ltr'}}>{item.value}</div>
              </div>
            ))}
          </div>
        </Fade>

        {/* Category rows */}
        {categories.map((cat, i) => {
          const pct = Math.round(cat.spent / cat.budget * 100);
          const isOver = cat.spent > cat.budget;
          const barW = interpolate(frame - 15 - i * 6, [0, 25], [0, Math.min(pct, 100)], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});

          return (
            <Fade key={i} frame={frame} delay={14 + i * 6} y={20}>
              <div style={{
                background: C.darkCard, borderRadius: 20, padding: '20px 24px',
                marginBottom: 12, border: isOver ? `1px solid ${C.danger}50` : `1px solid ${C.cardBorder}`,
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <span style={{fontSize: 40}}>{cat.icon}</span>
                    <span style={{fontSize: 34, fontWeight: 800, color: C.white}}>{cat.name}</span>
                  </div>
                  <div style={{textAlign: 'left', direction: 'ltr'}}>
                    <span style={{fontSize: 32, fontWeight: 800, color: isOver ? C.danger : C.white}}>
                      ₪{cat.spent.toLocaleString()}
                    </span>
                    <span style={{fontSize: 22, color: C.textMuted, fontWeight: 600}}> / ₪{cat.budget.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{background: 'rgba(255,255,255,.08)', borderRadius: 8, height: 14, overflow: 'hidden'}}>
                  <div style={{
                    width: `${barW}%`, height: '100%', borderRadius: 8,
                    background: isOver ? C.danger : pct > 80 ? C.warning : cat.color,
                  }} />
                </div>
              </div>
            </Fade>
          );
        })}
      </div>

      <Narration text="עקבו אחרי כל שקל — בקטגוריות חכמות עם תקציב" frame={frame} delay={10} />
    </Bg>
  );
};

// ===== SCENE 4: DASHBOARD (360-480 frames = 4s) =====
const SceneDashboard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const doughnutProg = interpolate(frame, [10, 50], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const segments = [
    {pct: 35, color: '#6366F1', label: 'דיור'},
    {pct: 25, color: '#F59E0B', label: 'מזון'},
    {pct: 15, color: '#22C55E', label: 'תחבורה'},
    {pct: 12, color: '#EC4899', label: 'בריאות'},
    {pct: 13, color: '#8B5CF6', label: 'אחר'},
  ];

  const bars = [
    {label: 'דיור', val: 85}, {label: 'מזון', val: 93},
    {label: 'תחבורה', val: 60}, {label: 'בריאות', val: 81},
    {label: 'בילויים', val: 120}, {label: 'מינויים', val: 45},
  ];

  return (
    <Bg colors={[C.dark, '#0F0F2E']}>
      <Glow x={-80} y={600} size={400} color="#6366F1" opacity={0.08} />
      <div style={{padding: '50px 40px', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Fade frame={frame} delay={0}>
          <div style={{fontSize: 68, fontWeight: 900, color: C.white, textAlign: 'center', marginBottom: 10, letterSpacing: '-1px'}}>
            דשבורד חכם
          </div>
          <div style={{fontSize: 32, fontWeight: 600, color: C.textMuted, textAlign: 'center', marginBottom: 30}}>
            ראו את התמונה המלאה במבט אחד
          </div>
        </Fade>

        {/* KPI cards */}
        <Fade frame={frame} delay={8}>
          <div style={{display: 'flex', gap: 14, marginBottom: 24}}>
            {[
              {emoji: '🏥', label: 'בריאות פיננסית', value: '82', unit: '/100', color: C.success},
              {emoji: '💰', label: 'אחוז חיסכון', value: '31%', color: C.primary},
            ].map((kpi, i) => (
              <div key={i} style={{
                flex: 1, background: C.darkCard, borderRadius: 22, padding: '22px 16px',
                textAlign: 'center', borderTop: `4px solid ${kpi.color}`,
              }}>
                <div style={{fontSize: 44, marginBottom: 6}}>{kpi.emoji}</div>
                <div style={{fontSize: 56, fontWeight: 900, color: kpi.color}}>
                  {kpi.value}<span style={{fontSize: 26, color: C.textMuted, fontWeight: 600}}>{kpi.unit || ''}</span>
                </div>
                <div style={{fontSize: 24, color: C.textMuted, fontWeight: 600, marginTop: 4}}>{kpi.label}</div>
              </div>
            ))}
          </div>
        </Fade>

        {/* Doughnut + legend */}
        <Pop frame={frame} delay={15} fps={fps}>
          <div style={{
            background: C.darkCard, borderRadius: 24, padding: 28,
            display: 'flex', alignItems: 'center', gap: 28, marginBottom: 20,
            border: `1px solid ${C.cardBorder}`,
          }}>
            <svg width={220} height={220} viewBox="0 0 240 240">
              {(() => {
                let offset = 0;
                return segments.map((seg, i) => {
                  const circ = 2 * Math.PI * 90;
                  const dash = circ * (seg.pct / 100) * doughnutProg;
                  const gap = circ - dash;
                  const rot = -90 + offset * 3.6;
                  offset += seg.pct;
                  return <circle key={i} cx={120} cy={120} r={90} fill="none" stroke={seg.color} strokeWidth={30}
                    strokeDasharray={`${dash} ${gap}`} transform={`rotate(${rot} 120 120)`} />;
                });
              })()}
              <text x={120} y={110} textAnchor="middle" fill={C.white} fontSize={34} fontWeight={800} fontFamily={font}>₪ 12,350</text>
              <text x={120} y={142} textAnchor="middle" fill={C.textMuted} fontSize={20} fontWeight={600} fontFamily={font}>סה״כ הוצאות</text>
            </svg>
            <div style={{flex: 1}}>
              {segments.map((seg, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
                  <div style={{width: 18, height: 18, borderRadius: 5, background: seg.color, flexShrink: 0}} />
                  <span style={{fontSize: 26, color: C.white, flex: 1, fontWeight: 700}}>{seg.label}</span>
                  <span style={{fontSize: 26, color: C.textMuted, direction: 'ltr', fontWeight: 700}}>{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Pop>

        {/* Bar chart */}
        <Fade frame={frame} delay={30}>
          <div style={{background: C.darkCard, borderRadius: 24, padding: '22px 28px', border: `1px solid ${C.cardBorder}`}}>
            <div style={{fontSize: 30, fontWeight: 800, color: C.white, marginBottom: 14}}>תקציב מול ביצוע</div>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 170}}>
              {bars.map((b, i) => {
                const barH = interpolate(frame - 35 - i * 3, [0, 18], [0, Math.min(b.val, 100) * 1.5], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
                return (
                  <div key={i} style={{flex: 1, textAlign: 'center'}}>
                    <div style={{
                      height: barH, borderRadius: '8px 8px 0 0', minHeight: 4,
                      background: b.val > 100 ? C.danger : b.val > 80 ? C.warning : C.primary,
                    }} />
                    <div style={{fontSize: 18, color: C.textMuted, marginTop: 8, fontWeight: 600}}>{b.label}</div>
                    <div style={{fontSize: 20, color: b.val > 100 ? C.danger : C.white, fontWeight: 800}}>{b.val}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Fade>
      </div>

      <Narration text="גרפים, ציון בריאות פיננסית, ותובנות חכמות" frame={frame} delay={10} />
    </Bg>
  );
};

// ===== SCENE 5: SAVINGS (480-570 frames = 3s) =====
const SceneSavings = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const goals = [
    {emoji: '🆘', name: 'קרן חירום', current: 25000, target: 50000, color: C.danger},
    {emoji: '✈️', name: 'חופשה', current: 7000, target: 15000, color: C.primary},
    {emoji: '🎓', name: 'לימודים', current: 40000, target: 100000, color: C.success},
  ];

  return (
    <Bg colors={[C.dark, '#0B1A0F']}>
      <Glow x={700} y={200} size={350} color="#22C55E" opacity={0.1} />
      <div style={{padding: '60px 44px', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Fade frame={frame} delay={0}>
          <div style={{fontSize: 68, fontWeight: 900, color: C.white, textAlign: 'center', marginBottom: 10, letterSpacing: '-1px'}}>
            יעדי חיסכון
          </div>
          <div style={{fontSize: 32, fontWeight: 600, color: C.textMuted, textAlign: 'center', marginBottom: 40}}>
            תכננו את העתיד הפיננסי שלכם
          </div>
        </Fade>

        {goals.map((g, i) => {
          const pct = Math.round(g.current / g.target * 100);
          const barW = interpolate(frame - 12 - i * 10, [0, 25], [0, pct], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
          return (
            <Pop key={i} frame={frame} delay={10 + i * 10} fps={fps}>
              <div style={{
                background: C.darkCard, borderRadius: 24, padding: '28px 30px',
                marginBottom: 20, border: `1px solid ${C.cardBorder}`,
                borderRight: `5px solid ${g.color}`,
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                    <span style={{fontSize: 48}}>{g.emoji}</span>
                    <div>
                      <div style={{fontSize: 36, fontWeight: 800, color: C.white}}>{g.name}</div>
                      <div style={{fontSize: 24, color: C.textMuted, fontWeight: 600, direction: 'ltr'}}>
                        ₪{g.current.toLocaleString()} / ₪{g.target.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={{fontSize: 44, fontWeight: 900, color: g.color}}>{pct}%</div>
                </div>
                <div style={{background: 'rgba(255,255,255,.08)', borderRadius: 10, height: 16, overflow: 'hidden'}}>
                  <div style={{
                    width: `${barW}%`, height: '100%', borderRadius: 10,
                    background: `linear-gradient(90deg, ${g.color}, ${g.color}CC)`,
                  }} />
                </div>
              </div>
            </Pop>
          );
        })}

        {/* Insights preview */}
        <Fade frame={frame} delay={45}>
          <div style={{
            background: 'rgba(99,102,241,.12)', border: `1px solid ${C.cardBorder}`,
            borderRadius: 20, padding: '24px 28px', marginTop: 10,
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
              <span style={{fontSize: 36}}>🧠</span>
              <span style={{fontSize: 30, fontWeight: 800, color: C.white}}>תובנה חכמה</span>
            </div>
            <div style={{fontSize: 28, color: C.accent, fontWeight: 700, lineHeight: 1.6}}>
              "העלו הפקדה ב-₪500 כדי להגיע ליעד החופשה בזמן"
            </div>
          </div>
        </Fade>
      </div>

      <Narration text="הגדירו יעדים, עקבו אחרי ההתקדמות, וקבלו המלצות" frame={frame} delay={10} />
    </Bg>
  );
};

// ===== SCENE 6: CTA / CLOSING (570-660 frames = 3s) =====
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = Math.sin(frame * 0.12) * 4;

  return (
    <Bg colors={['#1B0F3B', '#4338CA']}>
      {/* Sparkles */}
      {[{x:150,y:300,d:0},{x:800,y:400,d:8},{x:300,y:1200,d:16},{x:700,y:1000,d:4},{x:500,y:600,d:12},{x:200,y:900,d:20},{x:900,y:700,d:6}].map((s,i) => {
        const p = interpolate(frame-s.d,[0,30],[0,1],{extrapolateRight:'clamp',extrapolateLeft:'clamp'});
        const yOff = Math.sin((frame-s.d)*0.06)*12;
        return <div key={i} style={{position:'absolute',left:s.x,top:s.y+yOff,fontSize:36,opacity:p,transform:`scale(${p})`}}>✨</div>;
      })}

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 60px'}}>
        <Pop frame={frame} delay={0} fps={fps}>
          <div style={{fontSize: 140, marginBottom: 16, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,.4))'}}>🚀</div>
        </Pop>

        <Fade frame={frame} delay={8}>
          <div style={{
            fontSize: 80, fontWeight: 900, color: C.white,
            textAlign: 'center', lineHeight: 1.25, marginBottom: 24,
            letterSpacing: '-2px',
          }}>
            התחילו לנהל
            <br/>
            את הכסף שלכם
            <br/>
            <span style={{color: C.gold}}>בחכמה</span>
          </div>
        </Fade>

        <Fade frame={frame} delay={22}>
          <div style={{
            fontSize: 36, color: 'rgba(255,255,255,.85)',
            textAlign: 'center', lineHeight: 1.7, marginBottom: 36,
            fontWeight: 700, maxWidth: 850,
          }}>
            חינם לחלוטין  •  ללא הרשמה  •  עובד מהדפדפן
          </div>
        </Fade>

        <Pop frame={frame} delay={30} fps={fps}>
          <div style={{
            background: C.white, borderRadius: 60,
            padding: '30px 76px', transform: `scale(${1 + pulse * 0.004})`,
            boxShadow: '0 16px 48px rgba(99,102,241,.5)',
          }}>
            <div style={{fontSize: 48, fontWeight: 900, color: C.primary, textAlign: 'center'}}>
              💰 התחילו עכשיו
            </div>
          </div>
        </Pop>

        <Fade frame={frame} delay={42}>
          <div style={{marginTop: 36, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center'}}>
            {['📋 מעקב הוצאות', '📊 דשבורד', '💰 חסכונות', '🧠 תובנות', '👫 שיתוף'].map((tag, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,.15)', borderRadius: 30,
                padding: '12px 26px', fontSize: 28, fontWeight: 700, color: C.white,
              }}>{tag}</div>
            ))}
          </div>
        </Fade>
      </div>

      <Narration text="הצטרפו עכשיו — בחינם, בלי הרשמה, מכל מכשיר" frame={frame} delay={15} />
    </Bg>
  );
};

// ===== MAIN COMPOSITION =====
export const BudgetPromo = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('music.wav')} volume={0.55} />
      <Sequence from={0} durationInFrames={120}><SceneIntro /></Sequence>
      <Sequence from={120} durationInFrames={120}><SceneFeatures /></Sequence>
      <Sequence from={240} durationInFrames={120}><SceneBudgetUI /></Sequence>
      <Sequence from={360} durationInFrames={120}><SceneDashboard /></Sequence>
      <Sequence from={480} durationInFrames={90}><SceneSavings /></Sequence>
      <Sequence from={570} durationInFrames={90}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
};
