/*
========================================================================
   NOBIR HOSSEN PORTFOLIO - CORE ENGINE
   SaaS Dashboard Dynamics & Floating Interactions
   Inspired by Apple, Linear, Framer, and Vercel.
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // --- STICKY HEADER & MOBILE NAV ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        const isMenuOpen = navMenu.classList.contains('active');
        icon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
        lucide.createIcons();
      }
    });

    // Close menu when clicking nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // --- CUSTOM HARDWARE-ACCELERATED LERP CURSOR ---
  const cursor = document.getElementById('cursor');
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursor && cursorGlow) {
    if (isTouchDevice) {
      // Hide cursor completely on touch screens to ensure default fluid scrolling
      cursor.style.display = 'none';
      cursorGlow.style.display = 'none';
    } else {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let cursorX = mouseX;
      let cursorY = mouseY;
      let glowX = mouseX;
      let glowY = mouseY;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Lerp (Linear Interpolation) loop for ultra-smooth 60fps movement
      const renderCursor = () => {
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;
        
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;

        requestAnimationFrame(renderCursor);
      };
      requestAnimationFrame(renderCursor);

      // Magnetic hover effects
      const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .case-tab-btn, .psych-item, .gallery-card');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hovered');
          cursorGlow.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hovered');
          cursorGlow.classList.remove('hovered');
        });
      });
    }
  }

  // --- APPLE PROXIMITY MAGNETICS ENGINE ---
  const magneticElements = document.querySelectorAll('.magnetic-target');

  if (!isTouchDevice && magneticElements.length > 0) {
    document.addEventListener('mousemove', (e) => {
      magneticElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Calculate center coordinates
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Proximity boundary check (80px radius)
        if (dist < 80) {
          const force = (80 - dist) / 80;
          const pullX = dx * force * 0.4;
          const pullY = dy * force * 0.4;
          
          el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) scale(1.02)`;
          el.style.transition = 'none'; // Instant interactive lock
          
          // Add soft orange glow during magnet pull
          if (el.classList.contains('btn-primary') || el.classList.contains('logo-container')) {
             el.style.boxShadow = `0 12px 35px rgba(255, 107, 0, 0.35)`;
          }
        } else {
          // Release back to center using smooth damping
          el.style.transform = 'translate3d(0, 0, 0)';
          el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
          el.style.boxShadow = '';
        }
      });
    });
  }

  // --- HERO LAYERED DEPTH PARALLAX ---
  const heroDashboard = document.querySelector('.dashboard-wrapper');
  const heroDashboardContainer = document.querySelector('.hero-dashboard-container');
  const parallaxCards = {
    tiktok: document.querySelector('.card-tiktok'),
    facebook: document.querySelector('.card-facebook'),
    reels: document.querySelector('.card-reels'),
    engagement: document.querySelector('.card-engagement')
  };

  if (heroDashboardContainer && heroDashboard && !isTouchDevice) {
    heroDashboardContainer.addEventListener('mousemove', (e) => {
      const rect = heroDashboardContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate tilt angles (max 8 degrees)
      const tiltX = (y / (rect.height / 2)) * -8;
      const tiltY = (x / (rect.width / 2)) * 8;
      
      heroDashboard.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      // Complementary micro-parallax displacement on children nodes (creating true layered depth)
      if (parallaxCards.tiktok) parallaxCards.tiktok.style.transform = `translate3d(${-tiltY * 1.5}px, ${-tiltX * 1.5}px, 20px)`;
      if (parallaxCards.facebook) parallaxCards.facebook.style.transform = `translate3d(${tiltY * 1.2}px, ${tiltX * 1.2}px, 30px)`;
      if (parallaxCards.reels) parallaxCards.reels.style.transform = `translate3d(${-tiltY * 1.0}px, ${-tiltX * 1.0}px, 15px)`;
      if (parallaxCards.engagement) parallaxCards.engagement.style.transform = `translate3d(${tiltY * 1.6}px, ${tiltX * 1.6}px, 25px)`;
    });

    heroDashboardContainer.addEventListener('mouseleave', () => {
      heroDashboard.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      
      // Reset coordinates smoothly
      Object.values(parallaxCards).forEach(card => {
        if (card) {
          card.style.transform = 'translate3d(0, 0, 0)';
          card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      });
    });

    // Fill Reels progress bars
    setTimeout(() => {
      const barFills = document.querySelectorAll('.reels-bar-fill');
      barFills.forEach((bar) => {
        const heightVal = bar.style.height;
        bar.style.height = '0%';
        setTimeout(() => {
          bar.style.height = heightVal;
        }, 300);
      });
    }, 800);
  }

  // --- DYNAMIC HERO PARTICLE CANVAS ENGINE ---
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    particlesContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colorRGB = "255, 107, 0";
    
    const resizeCanvas = () => {
      canvas.width = particlesContainer.offsetWidth;
      canvas.height = particlesContainer.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Premium Floating Elements Structure
    const customMetricLabels = ["+184%", "LEADS", "HOOK", "30.8M", "CPM", "ROI", "RETENTION", "VIRAL"];

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Spread initially
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 0.6 + 0.2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.15;
        this.decay = Math.random() * 0.002 + 0.001;
        this.isText = Math.random() < 0.25; // 25% are premium metric label chips
        this.label = customMetricLabels[Math.floor(Math.random() * customMetricLabels.length)];
        this.fontSize = Math.random() * 3 + 8;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha -= this.decay;

        if (this.alpha <= 0 || this.y < -30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        if (this.isText) {
          ctx.font = `800 ${this.fontSize}px 'Outfit', sans-serif`;
          ctx.fillStyle = `rgba(${colorRGB}, ${this.alpha * 0.8})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(${colorRGB}, 0.5)`;
          ctx.fillText(this.label, this.x, this.y);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorRGB}, ${this.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${colorRGB}, 0.8)`;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Initialize 35 high-fidelity particles
    for (let i = 0; i < 35; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    requestAnimationFrame(animateParticles);
  }

  // --- SCROLL REVEAL (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Trigger numerical counter strips
        if (entry.target.querySelector('.counter')) {
          startCounter(entry.target.querySelector('.counter'));
        }
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- METRICS COUNTER ENGINE ---
  function startCounter(counterEl) {
    if (counterEl.classList.contains('counted')) return;
    counterEl.classList.add('counted');
    
    const target = parseInt(counterEl.getAttribute('data-target'));
    const suffix = counterEl.getAttribute('data-suffix') || '';
    const duration = 2000; 
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing curve (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      if (target >= 1000000) {
        counterEl.textContent = (currentValue / 1000000).toFixed(1) + suffix;
      } else if (target >= 1000) {
        counterEl.textContent = (currentValue / 1000).toFixed(0) + suffix;
      } else {
        counterEl.textContent = currentValue + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Enforce absolute values on load complete
        if (target === 30800000) counterEl.textContent = "30.8M";
        if (target === 353000) counterEl.textContent = "353K";
        if (target === 303000) counterEl.textContent = "303K+";
        if (target === 174000) counterEl.textContent = "174K";
        if (target === 13500) counterEl.textContent = "13.5K";
      }
    }
    
    requestAnimationFrame(updateCounter);
  }

  // --- CASE STUDIES TAB SWITCHES ---
  const tabBtns = document.querySelectorAll('.case-tab-btn');
  const panels = document.querySelectorAll('.case-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(`case-${tabId}`);
      targetPanel.classList.add('active');
      
      // Reset and run animated path draw inside the active SVGs
      const sparklines = targetPanel.querySelectorAll('.sparkline-path');
      sparklines.forEach(path => {
        path.style.animation = 'none';
        path.offsetHeight; /* trigger reflow */
        path.style.animation = 'draw-chart 2.2s ease-out forwards';
      });
      
      // Animate growth comparison blocks
      const baFills = targetPanel.querySelectorAll('.ba-box');
      baFills.forEach(box => {
        box.style.transform = 'scale(0.96)';
        box.style.opacity = '0.6';
        setTimeout(() => {
          box.style.transform = 'scale(1)';
          box.style.opacity = '1';
          box.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        }, 50);
      });
    });
  });

  // --- INTERACTIVE CASE STUDY SVG GRAPH GRAPHIC ENGINE ---
  const campaignDatasets = [
    {
      id: 'fb',
      svgId: 'fb-svg',
      tooltipId: 'fb-chart-tooltip',
      points: [{x:0,y:38},{x:10,y:36},{x:20,y:32},{x:30,y:35},{x:40,y:22},{x:50,y:28},{x:60,y:14},{x:70,y:18},{x:80,y:5},{x:90,y:8},{x:100,y:1}],
      data: [
        { val: "4.2M", action: "Systems Audited", label: "Day 1" },
        { val: "7.8M", action: "Hook Engineering Boot", label: "Day 5" },
        { val: "12.5M", action: "Algorithm Amplification", label: "Day 12" },
        { val: "15.1M", action: "Pacing Frequency Sync", label: "Day 18" },
        { val: "18.4M", action: "Lead Magnets Activated", label: "Day 24" },
        { val: "21.0M", action: "Story Sharing Spread", label: "Day 30" },
        { val: "24.8M", action: "Traffic Qualification", label: "Day 38" },
        { val: "26.5M", action: "Funnel Automations Live", label: "Day 42" },
        { val: "29.0M", action: "Compounding Growth Scale", label: "Day 48" },
        { val: "30.3M", action: "Qualifying B2B Leads", label: "Day 54" },
        { val: "30.8M", action: "Target Blueprint Achieved", label: "Day 60" }
      ]
    },
    {
      id: 'tiktok',
      svgId: 'tiktok-svg',
      tooltipId: 'tiktok-chart-tooltip',
      points: [{x:0,y:35},{x:15,y:10},{x:30,y:22},{x:45,y:6},{x:60,y:18},{x:75,y:3},{x:90,y:14},{x:100,y:2}],
      data: [
        { val: "12K", action: "Behavioral Script Hook", label: "Day 1" },
        { val: "54K", action: "Zoom Cuts Pacing Active", label: "Day 10" },
        { val: "95K", action: "First Micro-Viral Trend", label: "Day 20" },
        { val: "165K", action: "Dopamine Rewards Trigger", label: "Day 30" },
        { val: "220K", action: "Comment CTA Triggering", label: "Day 40" },
        { val: "285K", action: "Profile Visits Funneling", label: "Day 50" },
        { val: "318K", action: "Lead Qualification Pipeline", label: "Day 56" },
        { val: "353K", action: "353K Campaign High", label: "Day 60" }
      ]
    },
    {
      id: 'x',
      svgId: 'x-svg',
      tooltipId: 'x-chart-tooltip',
      points: [{x:0,y:38},{x:20,y:35},{x:40,y:28},{x:60,y:25},{x:80,y:12},{x:100,y:2}],
      data: [
        { val: "12K", action: "High-End B2B Strategy", label: "Day 1" },
        { val: "38K", action: "Executive Authority Hooks", label: "Day 12" },
        { val: "72K", action: "B2B bookmark Spikes", label: "Day 24" },
        { val: "115K", action: "Founder Networking Loop", label: "Day 36" },
        { val: "148K", action: "Pipeline Inbound Scaling", label: "Day 48" },
        { val: "174K", action: "174K Impressions Peak", label: "Day 60" }
      ]
    },
    {
      id: 'ig',
      svgId: 'ig-svg',
      tooltipId: 'ig-chart-tooltip',
      points: [{x:0,y:35},{x:10,y:32},{x:25,y:30},{x:40,y:15},{x:55,y:20},{x:70,y:8},{x:85,y:12},{x:100,y:1}],
      data: [
        { val: "18.5K", action: "Luxury Brand Alignment", label: "Day 1" },
        { val: "45.0K", action: "Cinematic Audio Triggers", label: "Day 6" },
        { val: "110.0K", action: "Audience Retention Tuning", label: "Day 15" },
        { val: "190.2K", action: "Repeat Views Acceleration", label: "Day 24" },
        { val: "260.0K", action: "DM Automations Active", label: "Day 33" },
        { val: "324.5K", action: "Save Rates Scale Peak", label: "Day 42" },
        { val: "410.0K", action: "CEO Authority Compounding", label: "Day 51" },
        { val: "482.0K", action: "482K Reach Optimization", label: "Day 60" }
      ]
    }
  ];

  // Helper linear interpolation function for exact coordinate glide tracking
  function getPathY(points, targetX) {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      if (targetX >= p1.x && targetX <= p2.x) {
        const ratio = (targetX - p1.x) / (p2.x - p1.x);
        return p1.y + ratio * (p2.y - p1.y);
      }
    }
    return points[points.length - 1].y;
  }

  campaignDatasets.forEach(panel => {
    const svg = document.getElementById(panel.svgId);
    const tooltip = document.getElementById(panel.tooltipId);
    
    if (svg && tooltip) {
      // Dynamic creation of SVG coordinate helpers
      let guideLine = svg.querySelector('.chart-guide-line');
      if (!guideLine) {
        guideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        guideLine.setAttribute('class', 'chart-guide-line');
        guideLine.setAttribute('stroke', 'rgba(255, 107, 0, 0.4)');
        guideLine.setAttribute('stroke-width', '1');
        guideLine.setAttribute('stroke-dasharray', '4,4');
        guideLine.setAttribute('y1', '0');
        guideLine.setAttribute('y2', '100%');
        guideLine.setAttribute('style', 'opacity: 0; transition: opacity 0.25s ease;');
        svg.appendChild(guideLine);
      }

      let trackerDot = svg.querySelector('.chart-tracker-dot');
      if (!trackerDot) {
        trackerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        trackerDot.setAttribute('class', 'chart-tracker-dot');
        trackerDot.setAttribute('r', '4');
        trackerDot.setAttribute('fill', '#ff6b00');
        trackerDot.setAttribute('stroke', '#ffffff');
        trackerDot.setAttribute('stroke-width', '2');
        trackerDot.setAttribute('style', 'opacity: 0; filter: drop-shadow(0 0 6px #ff6b00); transition: opacity 0.25s ease;');
        svg.appendChild(trackerDot);
      }

      const overlay = svg.querySelector('.chart-overlay-panel');

      if (overlay) {
        overlay.addEventListener('mousemove', (e) => {
          const rect = svg.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const xPercent = (mouseX / rect.width) * 100; // Map coordinates inside viewBox 0-100%

          // Interpolate the exact height along the SVG path coordinate points
          const yPercent = getPathY(panel.points, xPercent);

          // Render guides inside the active SVG
          guideLine.setAttribute('x1', `${xPercent}`);
          guideLine.setAttribute('x2', `${xPercent}`);
          guideLine.style.opacity = '1';

          trackerDot.setAttribute('cx', `${xPercent}`);
          trackerDot.setAttribute('cy', `${yPercent}`);
          trackerDot.style.opacity = '1';

          // Map coordinates to data nodes
          const totalPoints = panel.points.length;
          const rawIdx = (xPercent / 100) * (totalPoints - 1);
          const idx = Math.min(totalPoints - 1, Math.max(0, Math.round(rawIdx)));
          const activeData = panel.data[idx];

          if (activeData) {
            tooltip.innerHTML = `
              <div style="font-weight: 700; color: #fff; margin-bottom: 2px;">${activeData.label}: <span style="color: var(--color-primary);">${activeData.val}</span></div>
              <div style="font-size: 0.65rem; color: #a3a3a3; text-transform: uppercase; letter-spacing:0.02em;">${activeData.action}</div>
            `;
            tooltip.style.opacity = '1';
          }
        });

        overlay.addEventListener('mouseleave', () => {
          guideLine.style.opacity = '0';
          trackerDot.style.opacity = '0';
          tooltip.style.opacity = '0.85';
          tooltip.textContent = "Hover graph for details";
        });
      }
    }
  });

  // --- HOW I THINK CONTENT: RETENTION SIMULATOR DYNAMICS ---
  const psychItems = document.querySelectorAll('.psych-item');
  const simTitle = document.getElementById('sim-title');
  const simDesc = document.getElementById('sim-desc');
  const simHookGlow = document.getElementById('sim-hook-glow');
  const simPlayBtn = document.getElementById('sim-play-btn');
  const simPlayIcon = document.getElementById('sim-play-icon');
  const simTimeline = document.getElementById('sim-timeline');
  const simLikes = document.getElementById('sim-likes');
  const simRetention = document.getElementById('sim-retention-val');

  const psychData = {
    1: {
      title: "Visualizing Hook Mechanics",
      desc: "Capturing visual attention using high-contrast text layers and instant pattern interruptions in the first frame.",
      hook: "THE 3 AI TOOLS COPS DONT WANT YOU TO KNOW",
      initialRetention: "98%"
    },
    2: {
      title: "Structuring Dopamine Loops",
      desc: "Synchronizing rapid zoom cuts, micro-illustrations, and high-frequency sound markers to lock expectations.",
      hook: "WATCH THIS ONE THING CHANGE YOUR ENTIRE BRAND",
      initialRetention: "85%"
    },
    3: {
      title: "Establishing Trust Architecture",
      desc: "Leveraging custom statistical charts, system graphs, and expert vocabulary to position long-term industry dominance.",
      hook: "WE AUDITED 140 COLD INBOUND FUNNELS. HERE IS THE TRUTH.",
      initialRetention: "72%"
    },
    4: {
      title: "Direct Conversion Optimization",
      desc: "Directing the user to comment a specific key phrase triggers an automation that qualified leads directly in private chats.",
      hook: "COMMENT 'GROWTH' TO INITIATE SYSTEM FREE AUDIT",
      initialRetention: "58%"
    }
  };

  let activeIndex = 1;
  let isSimPlaying = false;
  let simInterval = null;

  psychItems.forEach(item => {
    item.addEventListener('click', () => {
      psychItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      activeIndex = parseInt(item.getAttribute('data-index'));
      const data = psychData[activeIndex];
      
      simTitle.textContent = data.title;
      simDesc.textContent = data.desc;
      simHookGlow.textContent = data.hook;
      simRetention.textContent = data.initialRetention;
      
      resetSimulation();
    });
  });

  function resetSimulation() {
    isSimPlaying = false;
    clearInterval(simInterval);
    if (simPlayIcon) {
      simPlayIcon.setAttribute('data-lucide', 'play');
      lucide.createIcons();
    }
    simTimeline.style.width = '0%';
    simLikes.textContent = '0';
  }

  if (simPlayBtn) {
    simPlayBtn.addEventListener('click', () => {
      isSimPlaying = !isSimPlaying;
      
      if (isSimPlaying) {
        simPlayIcon.setAttribute('data-lucide', 'pause');
        lucide.createIcons();
        runSimulation();
      } else {
        simPlayIcon.setAttribute('data-lucide', 'play');
        lucide.createIcons();
        clearInterval(simInterval);
      }
    });
  }

  function runSimulation() {
    let progress = 0;
    let likes = 0;
    
    simInterval = setInterval(() => {
      progress += 2;
      simTimeline.style.width = `${progress}%`;
      
      // Update simulated likes counts
      likes += Math.floor(Math.random() * 45) + 15;
      simLikes.textContent = likes > 1000 ? `${(likes/1000).toFixed(1)}K` : likes;
      
      // Drop retention to simulate real attention decline
      let baseRet = 98 - (progress * 0.42);
      if (activeIndex === 1) baseRet += 5; // Hook structures holds attention early
      if (activeIndex === 2) baseRet += (progress > 50 ? -8 : 6); // Loops create spike fluctuations
      if (activeIndex === 4) baseRet -= 4; // Conversions have slightly lower view-through but higher intent
      
      simRetention.textContent = `${Math.max(Math.floor(baseRet), 20)}%`;

      if (progress >= 100) {
        clearInterval(simInterval);
        resetSimulation();
      }
    }, 100);
  }

  // --- SECTION 8: PROCESS TIMELINE LASER BAR ---
  const processSection = document.getElementById('process');
  const processLaser = document.getElementById('process-laser');
  const processItems = document.querySelectorAll('.process-step-item');

  if (processSection && processLaser) {
    window.addEventListener('scroll', () => {
      const rect = processSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const totalHeight = rect.height - 350;
        const scrolledDistance = Math.max(0, windowHeight - 200 - rect.top);
        const percent = Math.min(100, (scrolledDistance / totalHeight) * 100);
        
        processLaser.style.height = `${percent}%`;
        
        // Trigger active states along nodes
        processItems.forEach((item) => {
          const itemRect = item.getBoundingClientRect();
          if (itemRect.top < windowHeight * 0.7) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    }, { passive: true });
  }

  // --- SECTION 9: FUTURISTIC NODE CONNECTIONS GRAPH ---
  const stackSvg = document.getElementById('stack-svg');
  const centerNode = document.querySelector('.node-center');
  const outerNodes = document.querySelectorAll('.stack-node:not(.node-center)');
  const cosSvg = document.getElementById('cos-svg-canvas');

  function drawConnections() {
    // Redraw stack canvas nodes
    if (stackSvg && centerNode) {
      const svgRect = stackSvg.getBoundingClientRect();
      const centerRect = centerNode.getBoundingClientRect();
      
      const cx = centerRect.left - svgRect.left + centerRect.width / 2;
      const cy = centerRect.top - svgRect.top + centerRect.height / 2;
      
      outerNodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        const nx = nodeRect.left - svgRect.left + nodeRect.width / 2;
        const ny = nodeRect.top - svgRect.top + nodeRect.height / 2;
        
        const label = node.className.split(' ').find(c => c.startsWith('node-')).split('-')[1];
        
        const pathBg = document.getElementById(`line-bg-${label}`);
        const pathFg = document.getElementById(`line-fg-${label}`);
        
        if (pathBg && pathFg) {
          const dx = cx - nx;
          const dy = cy - ny;
          const controlX = nx + dx * 0.4;
          const controlY = ny + dy * 0.9;
          
          const pathD = `M ${nx} ${ny} Q ${controlX} ${controlY} ${cx} ${cy}`;
          pathBg.setAttribute('d', pathD);
          pathFg.setAttribute('d', pathD);
        }
      });
    }

    // Redraw Creator OS pipeline canvas nodes
    if (cosSvg) {
      const svgRect = cosSvg.getBoundingClientRect();
      const brain = document.getElementById('node-brain');
      const creative = document.getElementById('node-creative');
      const distribution = document.getElementById('node-distribution');
      const automation = document.getElementById('node-automation');
      
      if (brain && creative && distribution && automation) {
        const getCardCenter = (el) => {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left - svgRect.left + rect.width / 2,
            y: rect.top - svgRect.top + rect.height / 2
          };
        };
        
        const cBrain = getCardCenter(brain);
        const cCreative = getCardCenter(creative);
        const cDist = getCardCenter(distribution);
        const cAuto = getCardCenter(automation);
        
        const drawPath = (bgId, fgId, p1, p2, curveOffset = 0) => {
          const pathBg = document.getElementById(bgId);
          const pathFg = document.getElementById(fgId);
          if (pathBg && pathFg) {
            let pathD = "";
            if (curveOffset === 0) {
              pathD = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
            } else {
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const controlX = p1.x + dx * 0.5 + curveOffset;
              const controlY = p1.y + dy * 0.5;
              pathD = `M ${p1.x} ${p1.y} Q ${controlX} ${controlY} ${p2.x} ${p2.y}`;
            }
            pathBg.setAttribute('d', pathD);
            pathFg.setAttribute('d', pathD);
          }
        };
        
        // Draw flows
        drawPath('flow-bg-1-2', 'flow-fg-1-2', cBrain, cCreative);
        drawPath('flow-bg-2-3', 'flow-fg-2-3', cCreative, cDist);
        
        // Automation feedback loop
        const pathBgAll = document.getElementById('flow-bg-4-all');
        const pathFgAll = document.getElementById('flow-fg-4-all');
        if (pathBgAll && pathFgAll) {
          const pathD = `M ${cAuto.x} ${cAuto.y} Q ${cAuto.x + 40} ${(cAuto.y + cDist.y)/2} ${cDist.x} ${cDist.y} M ${cAuto.x} ${cAuto.y} Q ${(cAuto.x + cBrain.x)/2} ${cBrain.y - 30} ${cBrain.x} ${cBrain.y}`;
          pathBgAll.setAttribute('d', pathD);
          pathFgAll.setAttribute('d', pathD);
        }
      }
    }
  }

  // Bind connection redraw on load and viewport size updates
  setTimeout(drawConnections, 600);
  window.addEventListener('resize', drawConnections, { passive: true });

  // --- FORMSPREE INTEGRATION WITH AJAX FETCH ---
  const form = document.getElementById('portfolio-form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Strictly prevent native page submissions and redirects
      
      const submitBtn = form.querySelector('.submit-btn');
      const containerParent = form.parentElement;
      
      // Button loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i data-lucide="loader" class="animate-spin" style="width: 18px; margin-right: 8px;"></i>
        <span>OPTIMIZING SYSTEM PIPELINE...</span>
      `;
      lucide.createIcons();

      // Submit via standard FormData which is 100% simple-CORS compliant (avoids preflight OPTIONS requests)
      const formData = new FormData(form);
      
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Success Response State
          submitBtn.innerHTML = `
            <i data-lucide="check" style="width: 18px; color: #10b981; margin-right: 8px;"></i>
            <span>PORTAL SESSION SUCCESSFUL</span>
          `;
          lucide.createIcons();
          submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          submitBtn.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';

          // Smooth container overlay animation transition
          setTimeout(() => {
            containerParent.style.opacity = '0';
            containerParent.style.transform = 'scale(0.96)';
            
            setTimeout(() => {
              containerParent.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                  <div style="width: 76px; height: 76px; border-radius: 50%; background: rgba(16,185,129,0.06); border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px auto; box-shadow: 0 0 25px rgba(16,185,129,0.2);">
                    <i data-lucide="shield-check" style="width: 36px; height: 36px; color: #10b981;"></i>
                  </div>
                  <h3 style="font-family: var(--font-display); font-weight: 800; font-size: 2.2rem; margin-bottom: 12px; color: white;">Strategic Intake Sent!</h3>
                  <p style="color: var(--color-text-gray); font-size: 1.05rem; line-height: 1.65; max-width: 460px; margin: 0 auto 24px auto;">
                    Thank you! Nobir has received your strategic brand metrics outline. We are analyzing your growth parameters and will get back to you with a comprehensive growth blueprint soon.
                  </p>
                  
                  <div style="margin-top: 10px; margin-bottom: 32px;">
                    <span style="display: block; font-size: 0.85rem; color: var(--color-text-dark); margin-bottom: 14px;">Need an instant reply? Connect directly:</span>
                    <a href="https://wa.me/8801913337280" target="_blank" class="btn-primary" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; font-size: 0.88rem; font-weight: 700; color: white; background: #25d366; border: 1px solid #25d366; border-radius: 12px; text-decoration: none; box-shadow: 0 8px 20px rgba(37,211,102,0.25); transition: all 0.3s ease;">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                      <span>Instant Reply on WhatsApp</span>
                    </a>
                  </div>
                  
                  <a href="#hero" class="btn-secondary" style="padding: 10px 28px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: var(--color-text-gray) !important; text-decoration: none;" onclick="location.reload()">Return Home</a>
                </div>
              `;
              lucide.createIcons();
              containerParent.style.opacity = '1';
              containerParent.style.transform = 'scale(1)';
              containerParent.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            }, 400);
          }, 1000);
        } else {
          throw new Error('Formspree network error occurred.');
        }
      })
      .catch(() => {
        submitBtn.disabled = false;
        
        // Fallback Error Handling with Direct Email Fallback
        submitBtn.innerHTML = `
          <i data-lucide="alert-triangle" style="width: 18px; margin-right: 8px;"></i>
          <span>PIPELINE TIMEOUT. TRY DIRECT EMAIL</span>
        `;
        submitBtn.style.background = '#ef4444';
        lucide.createIcons();
        
        setTimeout(() => {
          submitBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'; // Elegant premium blue
          submitBtn.style.boxShadow = '0 4px 15px rgba(37,99,235,0.2)';
          submitBtn.innerHTML = `
            <span>Email: nobir.contact@gmail.com</span>
            <i data-lucide="mail" style="width: 18px; margin-left: 8px;"></i>
          `;
          lucide.createIcons();
          
          // Re-route click directly to client's email client
          submitBtn.onclick = (e) => {
            e.preventDefault();
            window.location.href = "mailto:nobir.contact@gmail.com?subject=Strategic Intake Inquiry&body=Hi Nobir,%0A%0AI'm reaching out directly regarding my brand scaling inquiry.%0A%0AFull Name: " + encodeURIComponent(form.elements['name'].value || '') + "%0AEmail: " + encodeURIComponent(form.elements['email'].value || '') + "%0ABrand: " + encodeURIComponent(form.elements['brand'].value || '') + "%0APlatform: " + encodeURIComponent(form.elements['platform'].value || '') + "%0AGoal: " + encodeURIComponent(form.elements['goal'].value || '') + "%0ABudget: " + encodeURIComponent(form.elements['budget'].value || '') + "%0AOutline: " + encodeURIComponent(form.elements['message'].value || '');
          };
        }, 3500);
      });
    });
  }

  // --- REAL-TIME MOUSE SPOTLIGHT ENGINE ---
  const glowingCards = document.querySelectorAll('.ecosystem-badge-card, .cos-node-card, .results-card, .cred-card, .primary-portrait-layer, .secondary-border-glass, .psych-editorial-card, .contact-strategist-card');
  glowingCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${percentX}%`);
      card.style.setProperty('--mouse-y', `${percentY}%`);
    });
  });

  // --- PREMIUM LIGHTBOX PREVIEW ENGINE ---
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  if (lightboxOverlay && lightboxImg && lightboxCaption && lightboxClose) {
    lightboxTriggers.forEach(trigger => {
      trigger.style.cursor = 'zoom-in';
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        const src = trigger.getAttribute('src');
        const caption = trigger.getAttribute('data-caption') || trigger.getAttribute('alt') || '';
        
        // Load image source and caption
        lightboxImg.setAttribute('src', src);
        lightboxCaption.innerHTML = caption;
        
        // Show lightbox with anim transition
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop document scrolling
      });
    });

    // Close on Close button click
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on overlay click (outer area)
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        closeLightbox();
      }
    });

    // Handle Escape key close binding
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightboxOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Restore document scrolling
    }
  }

  // --- CREATOR OS TERMINAL LOG EMULATOR ---
  const consoleBody = document.getElementById('cos-console-body');
  if (consoleBody) {
    const logs = [
      { type: "info", text: "Initializing Systems Orchestration Core..." },
      { type: "success", text: "[System] Connected to Make.com API Gateway." },
      { type: "success", text: "[System] n8n automation webhook listener established." },
      { type: "info", text: "[Agent] Relevance AI research agent spinning up..." },
      { type: "success", text: "[Agent] OpenClaw task execution node online." },
      { type: "success", text: "[ChatGPT] System prompt loaded successfully." },
      { type: "success", text: "[Claude] High-intent hook analysis prompt active." },
      { type: "info", text: "[Zapier] Hook qualified lead -> auto CRM sync pipeline active." },
      { type: "info", text: "[n8n] Triggered: Content psychology auditing pipeline..." },
      { type: "success", text: "[Claude] Strategic hook text generated: 98% retention match." },
      { type: "info", text: "[Make.com] Forwarding variables -> Adobe Firefly dynamic generator..." },
      { type: "success", text: "[Firefly] Specular backdrop asset generated." },
      { type: "info", text: "[CapCut] Automatic video timeline cuts generated." },
      { type: "success", text: "[Meta Suite] Content ready. Queue scheduled for peak traffic." },
      { type: "success", text: "[Metricool] Live attention pipeline metrics synchronized." },
      { type: "success", text: "[OpenClaw] Autonomous optimization routine completed." },
      { type: "success", text: "[System] All loops completed. Performance standard: OPTIMAL." }
    ];

    let logIndex = 0;

    function addConsoleLog() {
      const log = logs[logIndex];
      const p = document.createElement('p');
      p.className = `t-log-line t-log-${log.type}`;
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 't-log-time';
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      timeSpan.textContent = `[${timeStr}] `;
      
      const textSpan = document.createElement('span');
      textSpan.textContent = log.text;
      
      p.appendChild(timeSpan);
      p.appendChild(textSpan);
      
      consoleBody.appendChild(p);
      consoleBody.scrollTop = consoleBody.scrollHeight;
      
      logIndex = (logIndex + 1) % logs.length;
      
      // Schedule next log in 2-4 seconds
      setTimeout(addConsoleLog, Math.random() * 2000 + 1500);
    }

    // Start logs with a small delay
    setTimeout(addConsoleLog, 1500);
  }

  // --- PREMIUM DIGITAL PRODUCTS VAULT 3D TILT ENGINE ---
  const vaultCards = document.querySelectorAll('.vault-card');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (!isTouch && vaultCards.length > 0) {
    vaultCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tilt rotation bounds: max 8 degrees for clean professional motion
        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
        
        // Specular mouse glow tracking properties
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  // ========================================================================
  // PREMIUM AI CHAT ASSISTANT (STRATEGY OS) ENGINE
  // ========================================================================
  const aiChatBtn = document.getElementById('ai-chat-btn');
  const aiChatPanel = document.getElementById('ai-chat-panel');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatInputForm = document.getElementById('chat-input-form');
  const chatInputField = document.getElementById('chat-input-field');
  const typingIndicator = document.getElementById('typing-indicator');
  const suggestionChips = document.getElementById('suggestion-chips');

  if (aiChatBtn && aiChatPanel) {
    // Open/Close chat panel
    aiChatBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      aiChatPanel.classList.toggle('active');
      if (aiChatPanel.classList.contains('active')) {
        setTimeout(() => chatInputField.focus(), 300);
      }
    });

    chatCloseBtn.addEventListener('click', () => {
      aiChatPanel.classList.remove('active');
    });

    // Close chat if clicked outside on desktop
    document.addEventListener('click', (e) => {
      if (!aiChatPanel.contains(e.target) && !aiChatBtn.contains(e.target)) {
        aiChatPanel.classList.remove('active');
      }
    });

    // Format text helpers (simple bolding and linebreaks)
    function formatMessageText(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }

    // Append message bubble
    function addMessage(content, sender) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message message-${sender}`;
      
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      bubble.innerHTML = formatMessageText(content);
      
      msgDiv.appendChild(bubble);
      chatMessages.appendChild(msgDiv);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Intent-based Semantic Response Matrix
    const strategyKnowledgeBase = [
      {
        keys: ['service', 'offer', 'work', 'hire', 'package', 'pricing', 'price', 'consulting'],
        response: "Nobir and our team specialize in designing custom social media client acquisition pipelines, creative vertical video strategy, and automated content operations. \n\nInstead of basic video editing, we build actual marketing assets:\n\n- <strong>Pattern-Interrupt Hooks</strong>: Capturing viewer attention in under 1.8 seconds using cognitive pattern interrupts to bypass scrolling reflexes.\n- <strong>Retention Engineering</strong>: Structuring pacing and editing rhythm to keep viewers hooked.\n- <strong>Authority Anchoring</strong>: Converting viral views into high-intent inbound pipeline leads.\n\nIf you want to review services in detail, you can jump directly to the <a href='#process'>Execution Blueprint section</a>. Or, we can discuss your specific project scope right now—what are you looking to scale?"
      },
      {
        keys: ['growth', 'scale', 'approach', 'strategy', 'philosophy', 'think', 'viewers', 'organic'],
        response: "Our core growth philosophy is simple: attention is an asset class, and growth is about human psychology rather than algorithm tricks. \n\nWe focus on building compounding trust loops. By combining hook psychology, visual retention spacing, and authoritative personal brand positioning, we help startup founders and executive creators build a premium industry voice. This translates raw views into high-value customer relationships.\n\nYou can read about Nobir's full growth mindset in the <a href='#psychology'>Growth Philosophy section</a> above, or let us know what your current channels are."
      },
      {
        keys: ['ai', 'system', 'automation', 'n8n', 'make', 'zapier', 'bot', 'workflow'],
        response: "We run a fully automated content system called the NOBIR ENGINE. It integrates advanced research tools (Claude, GPT, Gemini) with robust API automations (Make.com, n8n, Zapier) and analytical distribution planners. \n\nThis allows founders and creators to maintain high editorial quality while scaling creative scriptwriting and pipeline tracking 10x. \n\nWe mapped our active node workflow visually in the <a href='#stack'>Modern Growth Stack section</a> on this page—feel free to explore it!"
      },
      {
        keys: ['book', 'call', 'consultation', 'audit', 'meeting', 'zoom', 'schedule', 'form', 'contact', 'reach', 'email', 'phone', 'whatsapp'],
        response: "Connecting with Nobir is straightforward. We recommend two simple routes depending on your timeline:\n\n- <strong>Real-Time Assessment</strong>: Chat with Nobir directly on <a href='https://wa.me/8801913337280' target='_blank'>WhatsApp</a> for an instant strategy and project discussion.\n- <strong>Growth Audit Intake</strong>: Scroll down to the <a href='#contact'>Contact Form</a> at the very bottom of the page, fill out your parameters, and we will analyze your bottlenecks.\n\nYou can also shoot a direct line to our email at <a href='mailto:nobir.contact@gmail.com'>nobir.contact@gmail.com</a>. Which route do you prefer?"
      },
      {
        keys: ['who is', 'about', 'nobir', 'hossen', 'background', 'nmm', 'smm', 'strategist', 'creators'],
        response: "Nobir Hossen is a premium Social Media Growth Strategist and Personal Growth Architect. He holds certified professional credentials offered by Meta Business Academy and HubSpot Academy.\n\nHe partners with SaaS executives, startup founders, venture capitalists, and premium content creators to design high-converting visual assets and organic sales pipelines. \n\nYou can read his personal journey and credentials in the <a href='#about'>Acquisition Portal section</a> above. What kind of business are you scaling?"
      },
      {
        keys: ['client', 'work with', 'creator', 'founder', 'ceo', 'brand', 'startup', 'saas'],
        response: "We partner primarily with B2B SaaS executives, startup founders, high-ticket consultants, VC partners, and high-value content creators who value authority positioning and premium branding. \n\nWe focus on long-term authority and systems rather than simple video clips or generic templates. If you are looking to build a premium personal brand, we can definitely help. What niche is your business in?"
      },
      {
        keys: ['tool', 'software', 'photoshop', 'photoshop', 'edit', 'capcut', 'metricool'],
        response: "We leverage a world-class technology stack to design, optimize, and distribute premium brand assets:\n\n- <strong>AI Cognitive Tools</strong>: Advanced custom models powered by GPT-4o, Claude 3.5 Sonnet, and Perplexity Pro.\n- <strong>Creative Execution</strong>: Adobe Suite (Premiere Pro, Photoshop) and CapCut Pro optimized for high-retention vertical styling.\n- <strong>Distribution & Data</strong>: Metricool, Meta Suite, and custom SEO metadata indexing layers.\n- <strong>API Middlewares</strong>: n8n, Make.com, and Zapier for zero-friction client onboarding and lead sync.\n\nWould you like to explore how these automation frameworks can be integrated into your own business workflow?"
      },
      {
        keys: ['ebook', 'book', 'product', 'vault', 'download', 'free', 'gumroad', 'beacon'],
        response: "Yes! Nobir has compiled several digital resources and strategic books. They are located inside our <a href='#vault'>Digital Products Vault</a> section on this page.\n\nYou can explore and download them directly:\n- <strong>500+ AI Prompts Pack</strong>: Gumroad download for highly optimized prompts.\n- <strong>The AI Habit System</strong>: Habits guide for systemized creators.\n- <strong>AI Social Media Strategy</strong>: Direct Drive download for strategic scale handbook.\n- <strong>500+ Viral Reels Scripts</strong> and <strong>Digital Products Strategy</strong>: High-value free downloads.\n\nFeel free to scroll up to our vault section, or I can answer questions about any specific book topic here!"
      },
      {
        keys: ['portfolio', 'result', 'metrics', 'view', 'stat', 'proof', 'screenshot', 'case'],
        response: "We have verified case studies showing extreme, organic growth milestones—including a +15,007% growth sprint that generated over 233,000 views within 7 days. \n\nYou can review these screenshots, metrics, and visual proof folders inside the <a href='#results'>Acquisition Portal Gallery</a> on this page. Would you like us to help you engineer a similar growth sprint?"
      }
    ];

    // Generate response using semantic intent matching
    function generateAssistantResponse(userText) {
      const text = userText.toLowerCase().trim();
      
      // Look for key matches
      for (const item of strategyKnowledgeBase) {
        for (const key of item.keys) {
          if (text.includes(key)) {
            return item.response;
          }
        }
      }
      
      // Strategic founder-character fallback
      return "That is a great question. While I'm a helper on Nobir's team, some deep brand-specific bottlenecks are best diagnosed on a 1-on-1 strategy call.\n\nNobir's growth approach primarily focuses on capturing visual attention, building trust, and driving lead conversions using cognitive pacing and automated systems.\n\nBased on your goals, Nobir would probably recommend a strategy-first approach. You can <a href='https://wa.me/8801913337280' target='_blank'>connect directly through WhatsApp</a> for a faster discussion, or fill out the intake form below to get a dedicated growth audit.";
    }

    // Main user message submission handler
    function handleUserMessageSubmit(text) {
      if (!text.trim()) return;

      // Add user message
      addMessage(text, 'user');
      chatInputField.value = '';

      // Hide suggestion chips if present
      if (suggestionChips) {
        suggestionChips.style.display = 'none';
      }

      // Show typing indicator
      typingIndicator.style.display = 'flex';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulate a natural organic thinking delay (1.2 to 1.8 seconds)
      const delay = Math.random() * 600 + 1200;
      setTimeout(() => {
        typingIndicator.style.display = 'none';
        
        // Generate and add AI response
        const aiResponse = generateAssistantResponse(text);
        addMessage(aiResponse, 'assistant');
        
        // Re-inject updated suggestion chips at the bottom to continue user journey
        setTimeout(() => {
          if (suggestionChips) {
            // Reposition chips at the very bottom
            chatMessages.appendChild(suggestionChips);
            suggestionChips.style.display = 'flex';
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        }, 100);
      }, delay);
    }

    // Input form submission
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInputField.value;
      handleUserMessageSubmit(text);
    });

    // Handle quick quick-suggestion chip clicks
    chatMessages.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (chip) {
        const question = chip.getAttribute('data-question');
        handleUserMessageSubmit(question);
      }
    });

    // ========================================================================
    // AI WELCOME POPUP LOGIC
    // ========================================================================
    const aiWelcomePopup = document.getElementById('ai-welcome-popup');
    const aiPopupCloseBtn = document.getElementById('ai-popup-close-btn');
    const aiPopupTriggerArea = document.getElementById('ai-popup-trigger-area');

    if (aiWelcomePopup && aiPopupCloseBtn && aiPopupTriggerArea) {
      // 1. Show popup with 2.5-second delay
      setTimeout(() => {
        const isDismissed = localStorage.getItem('ai_popup_dismissed') === 'true';
        const isChatActive = aiChatPanel.classList.contains('active');
        
        if (!isDismissed && !isChatActive) {
          aiWelcomePopup.classList.add('show');
        }
      }, 2500);

      // 2. Click popup trigger area -> Open Chat & Focus Input
      aiPopupTriggerArea.addEventListener('click', (e) => {
        e.stopPropagation();
        aiWelcomePopup.classList.remove('show');
        localStorage.setItem('ai_popup_dismissed', 'true');
        
        // Open Chat Panel
        aiChatPanel.classList.add('active');
        setTimeout(() => chatInputField.focus(), 300);
      });

      // 3. Click Close -> Dismiss & Save to LocalStorage
      aiPopupCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        aiWelcomePopup.classList.remove('show');
        localStorage.setItem('ai_popup_dismissed', 'true');
      });

      // 4. Auto-hide popup after 12 seconds
      setTimeout(() => {
        aiWelcomePopup.classList.remove('show');
      }, 14500); // 2.5s delay + 12s visible duration
    }
  }
});
