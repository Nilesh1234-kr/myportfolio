/* ==========================================================================
   NILESH KUMAR - PORTFOLIO INTERACTIVE SCRIPT
   Interactive Canvas Background, Typing Animation, Mobile Nav, Scroll Reveals
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // 1. MOBILE NAVBAR HAMBURGER MENU TOGGLE
    // ----------------------------------------------------------------------
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. DARK / LIGHT THEME TOGGLE
    // ----------------------------------------------------------------------
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;

    // Load theme setting
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeIcon) {
            themeIcon.classList.replace("fa-moon", "fa-sun");
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");

            if (themeIcon) {
                if (isDark) {
                    themeIcon.classList.replace("fa-moon", "fa-sun");
                } else {
                    themeIcon.classList.replace("fa-sun", "fa-moon");
                }
            }

            localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
        });
    }

    // ----------------------------------------------------------------------
    // 3. DYNAMIC TYPING EFFECT FOR HERO ROLE
    // ----------------------------------------------------------------------
    const typingElement = document.getElementById("typing-text");
    const roles = [
        "Web Developer",
        "AI & ML Enthusiast",
        "Frontend Developer",
        "Problem Solver"
    ];

    if (typingElement) {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000; // Pause at full word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(typeEffect, typingSpeed);
        }

        typeEffect();
    }

    // ----------------------------------------------------------------------
    // 4. INTERACTIVE HERO CANVAS PARTICLES SYSTEM
    // ----------------------------------------------------------------------
    const canvas = document.getElementById("hero-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width, height;
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 70;

        const mouse = {
            x: null,
            y: null,
            radius: 120
        };

        function resizeCanvas() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        window.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Touch support for mobile
        window.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.touches[0].clientX - rect.left;
                mouse.y = e.touches[0].clientY - rect.top;
            }
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.5 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        this.x -= Math.cos(angle) * force * 3;
                        this.y -= Math.sin(angle) * force * 3;
                    }
                }
            }

            draw() {
                const isDark = document.body.classList.contains("dark");
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.7)" : "rgba(37, 99, 235, 0.6)";
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            const isDark = document.body.classList.contains("dark");
            const maxDist = 110;

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const opacity = 1 - (dist / maxDist);
                        ctx.beginPath();
                        ctx.strokeStyle = isDark
                            ? `rgba(56, 189, 248, ${opacity * 0.25})`
                            : `rgba(37, 99, 235, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // ----------------------------------------------------------------------
    // 5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------------------------
    // 6. ANIMATED SKILL PROGRESS BARS
    // ----------------------------------------------------------------------
    const skillBars = document.querySelectorAll(".progress");

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute("data-width");
                if (width) {
                    bar.style.width = width;
                }
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ----------------------------------------------------------------------
    // 7. BACK TO TOP BUTTON
    // ----------------------------------------------------------------------
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ----------------------------------------------------------------------
    // 8. CONTACT FORM INTERACTION
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = `<i class="fas fa-check-circle"></i> Message Sent!`;
            submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = "";
            }, 3000);
        });
    }
});
