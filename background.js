// Dynamic 4K Macro Blue Plexus Canvas Background
const canvas = document.createElement("canvas");
canvas.id = "bg-canvas";
const container = document.querySelector(".video-background-container");
if (container) {
  container.appendChild(canvas);
}

const ctx = canvas.getContext("2d");
let particlesArray = [];
const numberOfParticles = 95;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.radius = Math.random() * 2.2 + 0.8;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
  }
  draw() {
    ctx.fillStyle = "#60a5fa";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#3b82f6";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}
initParticles();

function animatePlexus() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Cinematic Radial Background Gradient
  const bgGrad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 50,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
  );
  bgGrad.addColorStop(0, "#0b192e");
  bgGrad.addColorStop(0.6, "#030814");
  bgGrad.addColorStop(1, "#01030a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const alpha = (1 - distance / 150) * 0.5;
        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animatePlexus);
}
animatePlexus();
