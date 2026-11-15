(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const container = document.querySelector(".video-background-container") || document.body;

  let canvas = document.getElementById("bg-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "bg-canvas";
    container.prepend(canvas);
  }

  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "0",
    pointerEvents: "none",
    display: "block"
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let streaks = [];
  let rafId = null;

  const pointer = {
    x: null,
    y: null,
    targetOffsetX: 0,
    targetOffsetY: 0,
    offsetX: 0,
    offsetY: 0
  };

  function getParticleCount() {
    if (prefersReducedMotion) return 20;
    if (window.innerWidth < 640) return 32;
    if (window.innerWidth < 1024) return 58;
    return 85;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const speed = prefersReducedMotion ? 0.12 : 0.55;
    particles = Array.from({ length: getParticleCount() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2.1 + 0.7,
      depth: Math.random() * 0.8 + 0.4,
      phase: Math.random() * Math.PI * 2
    }));

    streaks = Array.from({ length: 5 }, (_, idx) => ({
      y: ((idx + 1) / 6) * height,
      length: Math.max(140, width * (0.18 + Math.random() * 0.16)),
      speed: (prefersReducedMotion ? 0.15 : 0.45 + Math.random() * 0.35) * (idx % 2 === 0 ? 1 : -1),
      x: Math.random() * width,
      alpha: 0.045 + Math.random() * 0.045
    }));
  }

  function drawAmbientOrbs(time) {
    const orb1X = width * 0.25 + Math.cos(time * 0.00035) * (width * 0.12) + pointer.offsetX * 35;
    const orb1Y = height * 0.3 + Math.sin(time * 0.00028) * (height * 0.1) + pointer.offsetY * 35;

    const orb2X = width * 0.78 + Math.sin(time * 0.0003) * (width * 0.1) - pointer.offsetX * 25;
    const orb2Y = height * 0.68 + Math.cos(time * 0.00025) * (height * 0.12) - pointer.offsetY * 25;

    const r1 = Math.max(width, height) * 0.42;
    const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, r1);
    grad1.addColorStop(0, "rgba(37, 99, 235, 0.24)");
    grad1.addColorStop(0.5, "rgba(29, 78, 216, 0.08)");
    grad1.addColorStop(1, "rgba(2, 6, 23, 0)");
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    const r2 = Math.max(width, height) * 0.36;
    const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, r2);
    grad2.addColorStop(0, "rgba(56, 189, 248, 0.14)");
    grad2.addColorStop(0.6, "rgba(30, 64, 175, 0.05)");
    grad2.addColorStop(1, "rgba(2, 6, 23, 0)");
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);
  }

  function drawStreaks() {
    for (const s of streaks) {
      s.x += s.speed;
      if (s.x > width + s.length) s.x = -s.length;
      if (s.x < -s.length) s.x = width + s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y);
      grad.addColorStop(0, "rgba(96, 165, 250, 0)");
      grad.addColorStop(0.5, `rgba(125, 211, 252, ${s.alpha})`);
      grad.addColorStop(1, "rgba(96, 165, 250, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.length, s.y);
      ctx.stroke();
    }
  }

  function frame(time = 0) {
    pointer.offsetX += (pointer.targetOffsetX - pointer.offsetX) * 0.06;
    pointer.offsetY += (pointer.targetOffsetY - pointer.offsetY) * 0.06;

    ctx.fillStyle = "#020612";
    ctx.fillRect(0, 0, width, height);

    drawAmbientOrbs(time);
    drawStreaks();

    const maxDist = width < 640 ? 115 : 155;
    const maxDistSq = maxDist * maxDist;
    const influenceRadius = 140;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -25) p.x = width + 25;
      if (p.x > width + 25) p.x = -25;
      if (p.y < -25) p.y = height + 25;
      if (p.y > height + 25) p.y = -25;

      let px = p.x + pointer.offsetX * (16 * p.depth);
      let py = p.y + pointer.offsetY * (16 * p.depth);

      if (pointer.x !== null && pointer.y !== null && !prefersReducedMotion) {
        const mdx = pointer.x - px;
        const mdy = pointer.y - py;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist > 1 && mDist < influenceRadius) {
          const pull = (1 - mDist / influenceRadius) * 10;
          px += (mdx / mDist) * pull;
          py += (mdy / mDist) * pull;
        }
      }

      const pulse = 0.72 + 0.28 * Math.sin(time * 0.0022 + p.phase);

      ctx.fillStyle = `rgba(59, 130, 246, ${0.15 * pulse})`;
      ctx.beginPath();
      ctx.arc(px, py, p.radius * 3.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(186, 230, 253, ${0.92 * pulse})`;
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const qx = q.x + pointer.offsetX * (16 * q.depth);
        const qy = q.y + pointer.offsetY * (16 * q.depth);
        const dx = px - qx;
        const dy = py - qy;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const alpha = Math.pow(1 - dist / maxDist, 1.35) * 0.42;
          ctx.strokeStyle = `rgba(96, 165, 250, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(qx, qy);
          ctx.stroke();
        }
      }
    }

    if (!document.hidden) {
      rafId = requestAnimationFrame(frame);
    }
  }

  window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.targetOffsetX = (e.clientX / Math.max(width, 1) - 0.5) * 2;
    pointer.targetOffsetY = (e.clientY / Math.max(height, 1) - 0.5) * 2;
  });

  window.addEventListener("mouseleave", () => {
    pointer.x = null;
    pointer.y = null;
    pointer.targetOffsetX = 0;
    pointer.targetOffsetY = 0;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(frame);
    }
  });

  window.addEventListener("resize", resize);
  resize();
  rafId = requestAnimationFrame(frame);
})();
