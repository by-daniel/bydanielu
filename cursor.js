document.addEventListener('DOMContentLoaded', function() {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    
    // Test if the image loads
    const img = new Image();
    img.src = 'assets/axe-cursor.gif';
    
    // Particle system
    const particles = [];
    const particleCount = 20; // Increased number of particles
    const glyphs = ['⌀', '⌁', '⌂', '⌃', '⍜', '⍝', '⍞', '⎈', '⎉', '⎊', '⎋', '⏃', '⏄', '⏅'];
    
    // Track current cursor position
    let currentCursorX = window.innerWidth / 2;
    let currentCursorY = window.innerHeight / 2;
    
    // Add styles for particles
    const style = document.createElement('style');
    style.textContent = `
        .enchant-particle {
            position: fixed;
            font-family: monospace;
            font-size: 14px;
            color: rgba(220, 220, 220, 0.8);
            pointer-events: none;
            z-index: 999998;
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        }
    `;
    document.head.appendChild(style);
    
    function createParticle() {
        const particle = document.createElement('div');
        const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        particle.textContent = randomGlyph;
        particle.className = 'enchant-particle';
        
        // Random starting position around the screen edges
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: // top
                x = Math.random() * window.innerWidth;
                y = -20;
                break;
            case 1: // right
                x = window.innerWidth + 20;
                y = Math.random() * window.innerHeight;
                break;
            case 2: // bottom
                x = Math.random() * window.innerWidth;
                y = window.innerHeight + 20;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * window.innerHeight;
                break;
        }
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);
        
        return {
            element: particle,
            x: x,
            y: y,
            speed: 1 + Math.random() * 2, // Slightly increased base speed
            createdAt: Date.now()
        };
    }
    
    function updateParticles() {
        const now = Date.now();
        
        // Add new particles more frequently
        while (particles.length < particleCount) {
            particles.push(createParticle());
        }
        
        // Update particle positions
        particles.forEach((p, index) => {
            const age = now - p.createdAt;
            
            // Calculate direction to cursor
            const dx = currentCursorX - p.x;
            const dy = currentCursorY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5 || age > 4000) { // Reduced lifetime for faster respawn
                if (p.element.parentNode) {
                    p.element.parentNode.removeChild(p.element);
                }
                particles.splice(index, 1);
                return;
            }
            
            // Move towards cursor with increased speed when closer
            const speed = p.speed * (1 + (500 - Math.min(distance, 500)) / 500);
            p.x += (dx / distance) * speed;
            p.y += (dy / distance) * speed;
            
            // Update position and opacity
            p.element.style.left = p.x + 'px';
            p.element.style.top = p.y + 'px';
            p.element.style.opacity = Math.max(0, 1 - age / 4000);
        });
        
        requestAnimationFrame(updateParticles);
    }
    
    img.onload = function() {
        console.log('Cursor image loaded successfully');
        cursor.style.cssText = `
            width: 32px;
            height: 32px;
            background: url('assets/axe-cursor.gif') no-repeat;
            position: fixed;
            pointer-events: none;
            z-index: 999999;
            background-size: contain;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';
        
        // Start particle system
        updateParticles();
    };
    
    img.onerror = function() {
        console.error('Failed to load cursor image');
        document.documentElement.style.cursor = 'auto';
        document.body.style.cursor = 'auto';
    };

    // Update cursor position
    document.addEventListener('mousemove', function(e) {
        if (cursor.parentNode) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            // Update current cursor position for particles to follow
            currentCursorX = e.clientX;
            currentCursorY = e.clientY;
        }
    });
}); 