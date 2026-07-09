package com.portfolio.controller;

import com.portfolio.dto.*;
import com.portfolio.service.ProfileService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ExportController – generates a fully self-contained static HTML file for a portfolio.
 * The downloaded file requires NO backend; it can be uploaded to Netlify, Vercel,
 * GitHub Pages, or any static hosting service as-is.
 */
@RestController
@RequestMapping("/api/public/portfolio")
public class ExportController {

    @org.springframework.beans.factory.annotation.Value("${app.backend.url:https://folio-backend-k6qf.onrender.com}")
    private String backendUrl;

    private String getFileBase() {
        return (backendUrl != null ? backendUrl : "https://folio-backend-k6qf.onrender.com") + "/api/files/download/";
    }

    private final ProfileService profileService;

    public ExportController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{slug}/export")
    public ResponseEntity<byte[]> exportPortfolio(@PathVariable String slug) {
        ProfileDTO p = profileService.getPortfolioBySlug(slug);
        String html = buildHtml(p);
        byte[] bytes = html.getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_HTML);
        headers.setContentDispositionFormData("attachment", slug + "-portfolio.html");
        headers.setContentLength(bytes.length);
        return ResponseEntity.ok().headers(headers).body(bytes);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // HTML Generator
    // ──────────────────────────────────────────────────────────────────────────
    private String buildHtml(ProfileDTO p) {
        String bg      = p.backgroundColor() != null ? p.backgroundColor() : "#020617";
        String name    = esc(p.name());
        String title   = esc(p.title());
        String bio     = esc(p.bio() != null ? p.bio() : "");
        String email   = esc(p.email() != null ? p.email() : "");
        String phone   = esc(p.phone() != null ? p.phone() : "");
        String github  = esc(p.githubLink() != null ? p.githubLink() : "");
        String linkedin= esc(p.linkedinLink() != null ? p.linkedinLink() : "");
        String imgUrl  = p.profileImageUrl() != null ? getFileBase() + p.profileImageUrl() : "";
        String roles   = esc(p.roles() != null ? p.roles() : title);

        String skillsHtml   = buildSkills(p.skills());
        String projectsHtml = buildProjects(p.projects());
        String expHtml      = buildExperiences(p.experiences());
        String eduHtml      = buildEducations(p.educations());
        String certHtml     = buildCertificates(p.certificates());
        String achHtml      = buildAchievements(p.achievements());

        return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>%s — Portfolio</title>
  <meta name="description" content="%s" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --accent: #6366f1; --green: #10b981; --cyan: #22d3ee; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: %s;
      color: #e2e8f0;
      min-height: 100vh;
      overflow-x: hidden;
    }
    a { color: inherit; text-decoration: none; }
    /* ── Particles canvas ── */
    #bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
    /* ── Nav ── */
    nav {
      position: sticky; top: 0; z-index: 50;
      backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      background: rgba(2,6,23,.88);
      padding: 0 2rem; height: 64px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .nav-brand {
      font-size: 1rem; font-weight: 800;
      background: linear-gradient(to right, #818cf8, #22d3ee);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .nav-links { display: flex; gap: 1.25rem; }
    .nav-links a { font-size: .75rem; font-weight: 600; color: #94a3b8; transition: color .2s; }
    .nav-links a:hover { color: #fff; }
    /* ── Layout ── */
    main { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 4rem 1.5rem; display: flex; flex-direction: column; gap: 7rem; }
    /* ── Section heading ── */
    .sec-heading { font-size: 1.2rem; font-weight: 800; color: #fff; border-left: 3px solid #6366f1; padding-left: .75rem; margin-bottom: 1.5rem; }
    .sec-tag { font-size: .65rem; text-transform: uppercase; letter-spacing: .15em; color: var(--green); font-family: monospace; display: block; margin-bottom: .25rem; }
    .sec-h2 { font-size: 1.75rem; font-weight: 900; color: #fff; }
    /* ── Glass card ── */
    .glass { background: rgba(0,0,0,.35); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,.1); border-radius: 1rem; }
    /* ── Hero ── */
    .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; min-height: 70vh; }
    @media(max-width:720px){ .hero { grid-template-columns: 1fr; } }
    .hero-greeting { font-size: .75rem; text-transform: uppercase; letter-spacing: .18em; color: #475569; font-family: monospace; display: block; margin-bottom: .5rem; }
    .hero-name { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; background: linear-gradient(to right,#818cf8,#c084fc,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height: 1.1; }
    .hero-role { font-size: 1rem; color: #94a3b8; font-family: monospace; margin-top: .75rem; }
    .hero-role span { color: var(--cyan); font-weight: 700; border-right: 2px solid var(--cyan); padding-right: 2px; animation: blink 1s step-start infinite; }
    @keyframes blink { 0%%,100%%{opacity:1} 50%%{opacity:0} }
    .hero-bio { font-size: .85rem; color: #94a3b8; line-height: 1.7; margin-top: 1rem; max-width: 440px; }
    .hero-btns { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
    .btn-green { background: var(--green); color: #fff; font-weight: 700; font-size: .875rem; padding: .75rem 1.75rem; border-radius: .5rem; border: none; cursor: pointer; transition: background .2s; }
    .btn-green:hover { background: #059669; }
    .btn-ghost { background: rgba(0,0,0,.25); border: 1px solid rgba(255,255,255,.12); color: #cbd5e1; font-weight: 600; font-size: .875rem; padding: .75rem 1.5rem; border-radius: .5rem; cursor: pointer; transition: all .2s; }
    .btn-ghost:hover { color: #fff; background: rgba(0,0,0,.4); }
    /* Hero image */
    .hero-img-wrap { display:flex; justify-content:flex-end; }
    @keyframes float { 0%%,100%%{transform:translateY(0)} 50%%{transform:translateY(-12px)} }
    .hero-img-circle {
      width: clamp(200px,30vw,300px); height: clamp(200px,30vw,300px);
      border-radius: 50%%; overflow: hidden;
      border: 4px solid rgba(255,255,255,.1);
      box-shadow: 0 25px 60px rgba(0,0,0,.5);
      animation: float 6s ease-in-out infinite;
      background: linear-gradient(135deg,#1e293b,#0f172a);
      display: flex; align-items: center; justify-content: center;
    }
    .hero-img-circle img { width:100%%; height:100%%; object-fit:cover; border-radius:50%%; }
    .hero-initials { font-size: 3rem; font-weight: 900; color: #475569; }
    /* ── Skills ── */
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap: 1rem; }
    .skill-card { background:rgba(0,0,0,.28); border:1px solid rgba(255,255,255,.08); border-radius: .75rem; padding: 1rem; text-align:center; font-size:.8rem; font-weight:600; color:#e2e8f0; transition: all .25s; cursor:default; }
    .skill-card:hover { border-color: rgba(99,102,241,.4); transform: translateY(-3px); }
    /* ── Projects ── */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1.5rem; }
    .project-card { background:rgba(0,0,0,.28); border:1px solid rgba(255,255,255,.08); border-radius:1rem; padding:1.5rem; display:flex; flex-direction:column; gap:1rem; transition:all .25s; }
    .project-card:hover { border-color: rgba(99,102,241,.35); transform: translateY(-3px); }
    .project-title { font-size: 1rem; font-weight: 700; color: #fff; }
    .project-desc { font-size: .8rem; color: #94a3b8; line-height: 1.6; }
    .tech-tags { display:flex; flex-wrap:wrap; gap:.4rem; }
    .tech-tag { background:rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.45); font-size:.65rem; font-family:monospace; padding:.2rem .5rem; border-radius:.25rem; }
    .project-links { display:flex; gap:1rem; }
    .project-links a { font-size:.75rem; font-weight:700; color:#818cf8; transition:color .2s; }
    .project-links a:hover { color:#a5b4fc; }
    /* ── Timeline ── */
    .timeline-tabs { display:flex; gap:.75rem; margin-bottom:1.5rem; }
    .tab-btn { padding:.4rem 1rem; border-radius:999px; font-size:.75rem; font-weight:700; border:1px solid rgba(255,255,255,.1); background:rgba(0,0,0,.25); color:rgba(255,255,255,.5); cursor:pointer; transition:all .2s; }
    .tab-btn.active { background:#4f46e5; color:#fff; border-color:#6366f1; }
    .timeline-panel { display:none; }
    .timeline-panel.active { display:block; }
    .timeline-line { border-left: 1px dashed rgba(99,102,241,.4); padding-left: 1.5rem; margin-left: .75rem; display:flex; flex-direction:column; gap:2rem; }
    .timeline-item { position:relative; }
    .timeline-dot { position:absolute; left:-1.75rem; top:.2rem; width:.75rem; height:.75rem; border-radius:50%%; background:#6366f1; border: 2px solid rgba(255,255,255,.2); }
    .timeline-dot.cyan { background: var(--cyan); }
    .timeline-badge { display:inline-block; font-size:.65rem; font-family:monospace; background:rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.1); padding:.15rem .6rem; border-radius:.25rem; color: #818cf8; margin-bottom:.4rem; }
    .timeline-badge.cyan { color: var(--cyan); }
    .timeline-role { font-size:.9rem; font-weight:700; color:#fff; }
    .timeline-company { font-size:.75rem; color: rgba(255,255,255,.55); font-weight:600; }
    .timeline-desc { font-size:.75rem; color: rgba(255,255,255,.4); line-height:1.6; margin-top:.25rem; white-space:pre-line; }
    .grade-badge { display:inline-block; font-size:.65rem; font-family:monospace; background:rgba(0,0,0,.35); border:1px solid rgba(34,211,238,.25); color: var(--cyan); padding:.15rem .5rem; border-radius:.25rem; margin-top:.3rem; }
    /* ── Certificates ── */
    .cert-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap:1rem; }
    .cert-card { background:rgba(0,0,0,.28); border:1px solid rgba(255,255,255,.08); border-radius:1rem; padding:1.25rem; display:flex; gap:1rem; align-items:flex-start; transition:all .2s; }
    .cert-card:hover { border-color:rgba(16,185,129,.3); transform:translateY(-2px); }
    .cert-icon { width:2.5rem; height:2.5rem; border-radius:.6rem; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .cert-name { font-size:.8rem; font-weight:700; color:#fff; }
    .cert-issuer { font-size:.65rem; text-transform:uppercase; letter-spacing:.08em; color:rgba(255,255,255,.35); font-family:monospace; }
    .cert-link { font-size:.65rem; font-weight:700; color:var(--green); margin-top:.4rem; display:block; }
    /* ── Achievements ── */
    .ach-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap:1.5rem; }
    .ach-card { background:rgba(0,0,0,.28); border:1px solid rgba(255,255,255,.08); border-radius:1rem; padding:1.5rem; position:relative; overflow:hidden; transition:all .25s; }
    .ach-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(to right,transparent,rgba(34,211,238,.35),transparent); }
    .ach-card:hover { border-color:rgba(34,211,238,.3); transform:translateY(-2px); }
    .ach-tag { display:inline-block; font-size:.65rem; text-transform:uppercase; letter-spacing:.1em; font-weight:700; padding:.3rem .7rem; border-radius:999px; border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.45); margin-bottom:.75rem; }
    .ach-title { font-size:1.15rem; font-weight:800; color:#fff; line-height:1.3; }
    .ach-desc { font-size:.78rem; color:rgba(255,255,255,.45); line-height:1.65; margin-top:.5rem; }
    .ach-date { font-size:.65rem; font-family:monospace; text-transform:uppercase; letter-spacing:.1em; color:rgba(255,255,255,.35); background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.08); padding:.3rem .6rem; border-radius:.5rem; display:inline-block; margin-top:1rem; }
    .ach-img { width:100%%; height:7rem; object-fit:cover; border-radius:.6rem; border:1px solid rgba(255,255,255,.08); margin-top:1rem; }
    /* ── Contact ── */
    .contact-grid { display:grid; grid-template-columns:7fr 5fr; gap:3rem; align-items:start; }
    @media(max-width:720px){ .contact-grid { grid-template-columns:1fr; } }
    .contact-headline { font-size: clamp(1.5rem,3vw,2.2rem); font-weight:900; color:#fff; line-height:1.2; }
    .contact-accent { background:linear-gradient(to right,var(--green),var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .contact-sub { font-size:.85rem; color:rgba(255,255,255,.5); line-height:1.7; margin-top:1rem; max-width:30rem; }
    .contact-btns { display:flex; gap:1rem; margin-top:1.5rem; flex-wrap:wrap; }
    .contact-card { background:rgba(0,0,0,.28); border:1px solid rgba(255,255,255,.1); border-radius:1rem; padding:1.5rem; display:flex; flex-direction:column; gap:.75rem; }
    .contact-card-label { font-size:.65rem; text-transform:uppercase; letter-spacing:.18em; color:rgba(255,255,255,.35); font-family:monospace; margin-bottom:.25rem; }
    .social-row { background:rgba(0,0,0,.22); border:1px solid rgba(255,255,255,.08); border-radius:.75rem; padding:1rem 1.25rem; display:flex; align-items:center; justify-content:space-between; color:rgba(255,255,255,.75); font-weight:600; font-size:.875rem; transition:all .2s; }
    .social-row:hover { border-color:rgba(255,255,255,.18); color:#fff; }
    .social-row .icon-wrap { display:flex; align-items:center; gap:.75rem; }
    /* ── Footer ── */
    footer { text-align:center; font-size:.75rem; color:rgba(255,255,255,.3); padding:2rem; border-top:1px solid rgba(255,255,255,.06); }
  </style>
</head>
<body>
<canvas id="bg-canvas"></canvas>

<nav>
  <span class="nav-brand">%s</span>
  <div class="nav-links">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#skills">Skills</a>
    <a href="#projects">Projects</a>
    <a href="#timeline">Timeline</a>
    %s
    %s
    <a href="#contact">Contact</a>
  </div>
</nav>

<main>
  <!-- HERO -->
  <section id="home" class="hero">
    <div>
      <h1>
        <span class="hero-greeting">Hello, I'm</span>
        <span class="hero-name">%s</span>
      </h1>
      <p class="hero-role">I am a <span id="typed-role"></span></p>
      %s
      <div class="hero-btns">
        <a href="#contact" class="btn-green">Let's get started &rarr;</a>
        <a href="#projects" class="btn-ghost">Explore Projects</a>
      </div>
    </div>
    <div class="hero-img-wrap">
      <div class="hero-img-circle">
        %s
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about">
    <h2 class="sec-heading">About Me</h2>
    <div class="glass" style="padding:2rem; display:flex; flex-direction:column; gap:1rem;">
      <h3 style="font-size:1rem; font-weight:700; color:#818cf8;">%s</h3>
      <p style="font-size:.85rem; color:rgba(255,255,255,.55); line-height:1.75; white-space:pre-line;">%s</p>
      <div style="display:flex; gap:1.5rem; flex-wrap:wrap; padding-top:.75rem; border-top:1px solid rgba(255,255,255,.06); font-size:.75rem; font-weight:700;">
        %s
        %s
      </div>
    </div>
  </section>

  <!-- SKILLS -->
  %s

  <!-- PROJECTS -->
  %s

  <!-- TIMELINE -->
  <section id="timeline">
    <h2 class="sec-heading">Timeline History</h2>
    <div class="timeline-tabs">
      <button class="tab-btn active" onclick="switchTab('experience')">Work Experience</button>
      <button class="tab-btn" onclick="switchTab('education')">Education</button>
    </div>
    <div class="glass" style="padding:2rem; min-height:200px;">
      <div id="tab-experience" class="timeline-panel active">
        <p style="font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#818cf8; font-family:monospace; margin-bottom:1.5rem;">Professional History</p>
        %s
      </div>
      <div id="tab-education" class="timeline-panel">
        <p style="font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--cyan); font-family:monospace; margin-bottom:1.5rem;">Academic Timeline</p>
        %s
      </div>
    </div>
  </section>

  <!-- CERTIFICATES -->
  %s

  <!-- ACHIEVEMENTS -->
  %s

  <!-- CONTACT -->
  <section id="contact">
    <div class="contact-grid">
      <div>
        <p class="sec-tag">/ Let's Connect</p>
        <h2 class="contact-headline">Let's build something<br><span class="contact-accent">useful.</span></h2>
        <p class="contact-sub">%s</p>
        <div class="contact-btns">
          %s
        </div>
      </div>
      <div class="contact-card">
        <p class="contact-card-label">Direct Contact</p>
        %s
        <div style="display:flex; flex-direction:column; gap:.6rem; margin-top:.5rem;">
          %s
          %s
        </div>
      </div>
    </div>
  </section>
</main>

<footer>
  <p>&copy; %d %s &mdash; Powered by Folio</p>
</footer>

<script>
  // Particle Network
  (function(){
    const c = document.getElementById('bg-canvas');
    const ctx = c.getContext('2d');
    let pts=[], W, H;
    function resize(){ W=c.width=innerWidth; H=c.height=innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for(let i=0;i<70;i++) pts.push({x:Math.random()*1e4,y:Math.random()*1e4,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4});
    function frame(){
      c.width=W; // clear
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,1.2,0,Math.PI*2); ctx.fillStyle='rgba(129,140,248,.4)'; ctx.fill(); });
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<120){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(129,140,248,${(1-d/120)*.1})`; ctx.lineWidth=.5; ctx.stroke(); }
      }));
      requestAnimationFrame(frame);
    }
    frame();
  })();

  // Typewriter
  (function(){
    const roles = %s.split(',').map(s=>s.trim()).filter(Boolean);
    const el = document.getElementById('typed-role');
    if(!el||!roles.length) return;
    let ri=0, ci=0, del=false;
    function tick(){
      const word = roles[ri]||'';
      if(!del){ el.textContent=word.slice(0,++ci); if(ci>=word.length){del=true; setTimeout(tick,2400); return;} }
      else { el.textContent=word.slice(0,--ci); if(ci<=0){del=false; ri=(ri+1)%%roles.length;} }
      setTimeout(tick, del?50:100);
    }
    tick();
  })();

  // Timeline tab switcher
  function switchTab(tab){
    document.querySelectorAll('.timeline-panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('tab-'+tab).classList.add('active');
    event.target.classList.add('active');
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{ e.preventDefault(); document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'}); });
  });
</script>
</body>
</html>
""".formatted(
            name, bio,         // <title> & meta desc
            bg,                // body bg
            name,              // nav brand
            p.certificates()!=null&&!p.certificates().isEmpty() ? "<a href=\"#certificates\">Certificates</a>" : "",
            p.achievements()!=null&&!p.achievements().isEmpty() ? "<a href=\"#achievements\">Achievements</a>" : "",
            name,              // hero h1
            bio.isEmpty() ? "" : "<p class=\"hero-bio\">" + bio.split("\\.")[0] + ".</p>",
            imgUrl.isEmpty() ? "<span class=\"hero-initials\">" + (name.length()>=2?name.substring(0,2).toUpperCase():"GT") + "</span>"
                             : "<img src=\"" + imgUrl + "\" alt=\"" + name + "\" />",
            title, bio,        // about section
            github.isEmpty() ? "" : "<a href=\"" + github + "\" target=\"_blank\" style=\"color:#818cf8;\">GitHub Profile</a>",
            linkedin.isEmpty()? "" : "<a href=\"" + linkedin + "\" target=\"_blank\" style=\"color:#818cf8;\">LinkedIn Profile</a>",
            skillsHtml,
            projectsHtml,
            expHtml, eduHtml,
            certHtml,
            achHtml,
            bio.isEmpty()?"I engineer performant, scalable full-stack systems — open for roles, contracts and collaborations.":bio,
            email.isEmpty() ? "" : "<a href=\"mailto:" + email + "\" class=\"btn-green\">&#9993; Email me</a>",
            email.isEmpty() ? "" : "<a href=\"mailto:" + email + "\" style=\"display:flex;align-items:center;gap:.75rem;color:#fff;font-weight:700;font-size:1rem;\">&#9993; " + email + "</a>",
            phone.isEmpty() ? "" : "<a href=\"tel:" + phone + "\" class=\"social-row\"><span class=\"icon-wrap\">&#128222; " + phone + "</span> &#8599;</a>",
            linkedin.isEmpty()? "" : "<a href=\"" + linkedin + "\" target=\"_blank\" class=\"social-row\"><span class=\"icon-wrap\">&#128279; LinkedIn</span> &#8599;</a>",
            java.time.Year.now().getValue(), name,
            roles // for JS typewriter
        );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Section builders
    // ──────────────────────────────────────────────────────────────────────────
    private String buildSkills(List<SkillDTO> skills) {
        if (skills == null || skills.isEmpty()) return "";
        String cards = skills.stream()
            .map(s -> "<div class=\"skill-card\">" + esc(s.name()) + "</div>")
            .collect(Collectors.joining("\n"));
        return """
<section id="skills">
  <h2 class="sec-heading">Technical Toolkit</h2>
  <div class="skills-grid">
    %s
  </div>
</section>""".formatted(cards);
    }

    private String buildProjects(List<ProjectDTO> projects) {
        if (projects == null || projects.isEmpty()) return "";
        String cards = projects.stream().map(pr -> {
            String techTags = pr.techStack() != null
                ? java.util.Arrays.stream(pr.techStack().split(","))
                    .map(t -> "<span class=\"tech-tag\">" + esc(t.trim()) + "</span>")
                    .collect(Collectors.joining(""))
                : "";
            String links = (pr.githubLink()!=null&&!pr.githubLink().isEmpty()
                ? "<a href=\"" + esc(pr.githubLink()) + "\" target=\"_blank\">Source Code &rarr;</a>" : "")
              + (pr.liveLink()!=null&&!pr.liveLink().isEmpty()
                ? "<a href=\"" + esc(pr.liveLink()) + "\" target=\"_blank\" style=\"color:#22d3ee;\">Live Demo &rarr;</a>" : "");
            return """
<div class="project-card">
  <div>
    <p class="project-title">%s</p>
    <p class="project-desc">%s</p>
  </div>
  <div>
    <div class="tech-tags">%s</div>
    <div class="project-links" style="margin-top:.75rem;">%s</div>
  </div>
</div>""".formatted(esc(pr.title()), esc(pr.description()!=null?pr.description():""), techTags, links);
        }).collect(Collectors.joining("\n"));
        return """
<section id="projects">
  <h2 class="sec-heading">Featured Projects</h2>
  <div class="projects-grid">
    %s
  </div>
</section>""".formatted(cards);
    }

    private String buildExperiences(List<ExperienceDTO> experiences) {
        if (experiences == null || experiences.isEmpty())
            return "<p style=\"font-size:.75rem;color:rgba(255,255,255,.35);font-style:italic;\">No professional history added.</p>";
        return "<div class=\"timeline-line\">" + experiences.stream().map(e -> """
<div class="timeline-item">
  <span class="timeline-dot"></span>
  <span class="timeline-badge">%s – %s</span>
  <p class="timeline-role">%s</p>
  <p class="timeline-company">%s</p>
  %s
</div>""".formatted(
                esc(e.startDate()!=null?e.startDate():""),
                esc(e.endDate()!=null?e.endDate():"Present"),
                esc(e.role()),
                esc(e.company()),
                e.description()!=null&&!e.description().isEmpty()
                    ? "<p class=\"timeline-desc\">" + esc(e.description()) + "</p>" : ""
            )).collect(Collectors.joining("\n")) + "</div>";
    }

    private String buildEducations(List<EducationDTO> educations) {
        if (educations == null || educations.isEmpty())
            return "<p style=\"font-size:.75rem;color:rgba(255,255,255,.35);font-style:italic;\">No academic timeline added.</p>";
        return "<div class=\"timeline-line\">" + educations.stream().map(e -> """
<div class="timeline-item">
  <span class="timeline-dot cyan"></span>
  <span class="timeline-badge cyan">%s</span>
  <p class="timeline-role">%s</p>
  <p class="timeline-company">%s</p>
  %s
</div>""".formatted(
                esc(e.timeline()!=null?e.timeline():""),
                esc(e.degreeName()),
                esc(e.institution()),
                e.gradeOrCgpa()!=null&&!e.gradeOrCgpa().isEmpty()
                    ? "<span class=\"grade-badge\">" + esc(e.gradeOrCgpa()) + "</span>" : ""
            )).collect(Collectors.joining("\n")) + "</div>";
    }

    private String buildCertificates(List<CertificateDTO> certs) {
        if (certs == null || certs.isEmpty()) return "";
        String cards = certs.stream().map(c -> {
            String link = c.credentialUrl()!=null&&!c.credentialUrl().isEmpty()
                ? "<a href=\"" + esc(c.credentialUrl()) + "\" target=\"_blank\" class=\"cert-link\">Verify &#8599;</a>" : "";
            return """
<div class="cert-card">
  <div class="cert-icon">
    <svg width="22" height="22" fill="none" stroke="#10b981" stroke-width="1.8" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
    </svg>
  </div>
  <div>
    <p class="cert-name">%s</p>
    <p class="cert-issuer">%s</p>
    %s
  </div>
</div>""".formatted(esc(c.name()), esc(c.issuingOrganization()!=null?c.issuingOrganization():""), link);
        }).collect(Collectors.joining("\n"));
        return """
<section id="certificates">
  <p class="sec-tag">/ Credentials</p>
  <h2 class="sec-h2" style="margin-bottom:1.5rem;">Certifications</h2>
  <div class="cert-grid">%s</div>
</section>""".formatted(cards);
    }

    private String buildAchievements(List<AchievementDTO> achs) {
        if (achs == null || achs.isEmpty()) return "";
        String cards = achs.stream().map(a -> {
            String img = a.mediaUrl()!=null&&!a.mediaUrl().isEmpty()
                ? "<img class=\"ach-img\" src=\"" + getFileBase() + esc(a.mediaUrl()) + "\" alt=\"proof\" />" : "";
            String date = a.associatedDate()!=null&&!a.associatedDate().isEmpty()
                ? "<span class=\"ach-date\">" + esc(a.associatedDate()) + "</span>" : "";
            return """
<div class="ach-card">
  <span class="ach-tag">Achievement</span>
  <p class="ach-title">%s</p>
  %s
  %s
  %s
</div>""".formatted(esc(a.title()),
                a.description()!=null&&!a.description().isEmpty()
                    ? "<p class=\"ach-desc\">" + esc(a.description()) + "</p>" : "",
                date, img);
        }).collect(Collectors.joining("\n"));
        return """
<section id="achievements">
  <p class="sec-tag">/ Recognition</p>
  <h2 class="sec-h2" style="margin-bottom:1.5rem;">Achievements</h2>
  <div class="ach-grid">%s</div>
</section>""".formatted(cards);
    }

    /** HTML-escape helper */
    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
                .replace("\"","&quot;").replace("'","&#39;");
    }
}
