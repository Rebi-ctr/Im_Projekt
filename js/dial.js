// js/dial.js (ES Module)
// Eine Umdrehung = 24h, Snap auf 15 Minuten. Gibt bei Bewegung die Uhrzeit zurück,
// und nach kurzem Stillstand (300ms) den fixen Timestamp via onIdle.
export function initDial({
  wrap,
  dial,
  baseDate,         // Date: Mitternacht des Bezugstags
  startMinutes = 0, // Startposition in Minuten seit 00:00
  snapMinutes = 15,
  onChange,         // (dateWithinDay, turns) => void
  onIdle            // (dateWithinDay, turns) => void
}) {
  const norm360 = v => ((v % 360) + 360) % 360;
  const angleToMinutes = a => norm360(a) / 360 * 1440;
  const minutesToAngle = m => (m / 1440) * 360;
  
  let dragging = false;
  let lastAngle = 0;
  let accAngle = minutesToAngle(startMinutes); // akkumulierte Grad
  let idleTimer = null;

  function minutesToDateLocal(m) {
    const d = new Date(baseDate);
    d.setMinutes(m);
    return d;
  }
  function snap(m) {
    const snapped = Math.round(m / snapMinutes) * snapMinutes;
    return ((snapped % 1440) + 1440) % 1440;
  }
  function ptr(e){ return e.touches ? e.touches[0] : e; }
  function center(node){
    const r = node.getBoundingClientRect();
    return { cx: r.left + r.width/2, cy: r.top + r.height/2 };
  }
  function angleFromEvent(e){
    const p = ptr(e);
    const { cx, cy } = center(dial);
    const dx = p.clientX - cx, dy = p.clientY - cy;
    return Math.atan2(dy, dx) * 180 / Math.PI; // [-180,180]
  }
  function normalizeDelta(d){ if (d>180) d-=360; if (d<-180) d+=360; return d; }

  function emit(changeAndIdle = false) {
    dial.style.transform = `rotate(${accAngle}deg)`;
    const minutes   = snap(angleToMinutes(accAngle));
    const dateLocal = minutesToDateLocal(minutes);
    const turns     = Math.trunc(accAngle / 360); // ganze Umdrehungen
    
      console.log("Dial Drehen:", minutes, "Minuten →", dateLocal.toLocaleTimeString());
      
    onChange?.(dateLocal, turns);
    if (changeAndIdle) {
      onIdle?.(dateLocal, turns);
    } else {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => onIdle?.(dateLocal, turns), 300);
    }
  }

  function onDown(e){ e.preventDefault(); dragging = true; lastAngle = angleFromEvent(e); }
  function onMove(e){
    if (!dragging) return;
    const a = angleFromEvent(e);
    accAngle += normalizeDelta(a - lastAngle);
    lastAngle = a;
    emit(false);
  }
  function onUp(){ dragging = false; emit(true); }

  wrap.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  wrap.addEventListener('touchstart', onDown, { passive:false });
  window.addEventListener('touchmove', onMove, { passive:false });
  window.addEventListener('touchend', onUp);

  wrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    accAngle += -e.deltaY * 0.3; // Feingefühl
    emit(false);
  }, { passive:false });

  wrap.addEventListener('keydown', (e) => {
    const stepDeg = e.shiftKey ? 15 : 3; // ~1h bzw. ~12min
    if (['ArrowRight','ArrowUp'].includes(e.key)) { accAngle += stepDeg; emit(false); }
    if (['ArrowLeft','ArrowDown'].includes(e.key)) { accAngle -= stepDeg; emit(false); }
    if (e.key.toLowerCase()==='r' || e.key==='Home') { accAngle = minutesToAngle(startMinutes); emit(true); }
  });

  // Initial anzeigen
  emit(false);

  return {
    setMinutes(min){ accAngle = minutesToAngle(min); emit(true); },
    getMinutes(){ return snap(angleToMinutes(accAngle)); }
  };
}
