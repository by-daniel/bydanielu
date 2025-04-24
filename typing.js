document.addEventListener('DOMContentLoaded', function() {
    const headline = document.querySelector('.headline');
    const paragraphs = document.querySelectorAll('.raleway-normal:not(.footnote)');
    const footnote = document.querySelector('.footnote');
    const emoji = '🍡';
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'minecraft-tooltip';
    tooltip.style.display = 'none';
    tooltip.innerHTML = `
        <div class="title" style="background: linear-gradient(to right, #c0cfb2, #b8b096); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">daniel lu's builder wand</div>
        <div class="text"><span style="color: #555555">artifact of mcevolution.net</span></div>
        <div class="text"><span style="color: #AAAAAA">&nbsp;</span></div>
        <div class="text"><span style="color: #AAAAAA">infamous world edit axe used for numerous</span></div>
        <div class="text"><span style="color: #AAAAAA">minecraft builds and maps from 2017-2024.</span></div>
        <div class="text"><span style="color: #AAAAAA">it's being transformed into something more.</span></div>
        <div class="text"><span style="color: #AAAAAA">&nbsp;</span></div>
        <div class="text"><span style="color: #AAAAAA">Efficiency X</span></div>
        <div class="text"><span style="color: #AAAAAA">Passion VIII</span></div>
        <div class="text"><span style="color: #AAAAAA">Multifacetedness IX</span></div>
        <div class="text"><span style="color: #AAAAAA">&nbsp;</span></div>
        <div class="text"><span style="color: #555555">: ̗̀➛ </span><span style="color: #FFAA00">Click </span><span style="color: #AAAAAA">to increase typing speed</span></div>
    `;
    document.body.appendChild(tooltip);

    // Hide the original footer and create tab instruction
    footnote.style.opacity = '0';
    footnote.style.transform = 'translateY(20px)';
    footnote.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    const tabInstruction = document.createElement('p');
    tabInstruction.className = 'raleway-normal';
    tabInstruction.style.cssText = `
        font-size: 12px;
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease, transform 0.3s ease;
        margin-top: 40px;
        color: #CCCCCC;
    `;
    tabInstruction.textContent = 'press [tab] to auto-complete';
    footnote.parentNode.insertBefore(tabInstruction, footnote);

    // Function to create preview text and typed text container
    function createPlaceholder(element) {
        const originalText = element.textContent;
        element.innerHTML = '';
        
        // Create single container for text
        const container = document.createElement('span');
        container.style.cssText = `
            position: relative;
            display: inline-block;
            width: 100%;
        `;
        
        // Create spans for each character
        const chars = originalText.split('');
        chars.forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.style.cssText = `
                color: #E0E0E0;
                transition: color 0.05s ease;
            `;
            container.appendChild(charSpan);
        });
        
        element.appendChild(container);
        return container;
    }

    // Prepare headline
    const headlineContainers = createPlaceholder(headline);
    
    // Prepare paragraphs
    paragraphs.forEach(p => {
        const originalText = p.innerHTML;
        const containers = createPlaceholder(p);
        p.dataset.originalText = originalText;
    });

    // Function to type next character (modified for per-character spans)
    function typeNextCharacter() {
        if (currentElement === 0) {
            // Handle headline typing (all in pastel green)
            const spans = headline.querySelectorAll('span > span');
            if (charIndex < spans.length) {
                spans[charIndex].style.color = '#c3ceb5'; // All headline text in pastel green
                charIndex++;
            } else {
                currentElement++;
                charIndex = 0;
            }
        } else if (currentElement < elements.length) {
            const paragraph = elements[currentElement];
            const spans = paragraph.querySelectorAll('span > span');
            
            if (charIndex < spans.length) {
                spans[charIndex].style.color = '#000000';
                charIndex++;
            } else {
                currentElement++;
                charIndex = 0;
                
                if (currentElement === elements.length) {
                    completeAnimation();
                    return;
                }
            }
        }
        
        const delay = (Math.random() * 20 + baseDelay) * speedMultiplier;
        window.typingTimeout = setTimeout(typeNextCharacter, delay);
    }

    // Function to complete animation
    function completeAnimation() {
        isAnimationComplete = true;
        const cursor = document.getElementById('custom-cursor');
        if (!cursor) return;

        // Fade out tab instruction and show footer
        tabInstruction.style.opacity = '0';
        tabInstruction.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            tabInstruction.remove();
            footnote.style.opacity = '1';
            footnote.style.transform = 'translateY(0)';
        }, 300);

        // Handle tooltip animation
        const tooltipRect = tooltip.getBoundingClientRect();
        createBreakParticles(tooltipRect.left, tooltipRect.top, tooltipRect.width, tooltipRect.height);
        tooltip.classList.add('hiding');

        // Continue with existing completion code...
        setTimeout(() => {
            tooltip.style.display = 'none';
            tooltip.classList.remove('hiding');
            
            setTimeout(() => {
                floatingText.style.display = 'block';
                startFloatingTextUpdates();
                requestAnimationFrame(() => {
                    floatingText.classList.add('visible');
                });
            }, 500);
        }, 600);
    }

    // Start typing animation after a short delay
    setTimeout(typeNextCharacter, 500);

    // Typing speed control
    let baseDelay = 40;
    let speedMultiplier = 1;
    const minDelay = 2; // Decreased from 5 to allow faster typing
    
    // Track tooltip visibility
    let isTooltipVisible = true;
    
    // Track if cursor should be locked
    let isCursorLocked = false;
    let lockedCursorPosition = { x: 0, y: 0 };
    
    // Create floating text element
    const floatingText = document.createElement('div');
    floatingText.className = 'minecraft-floating-text';
    floatingText.innerHTML = `<span style="color: #AAAAAA">Builder Wand</span>`;
    floatingText.style.display = 'none';
    document.body.appendChild(floatingText);

    // Track floating text animation frame
    let floatingTextAnimFrame = null;

    // Function to position floating text above cursor
    function positionFloatingText() {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor) return;
        
        const rect = cursor.getBoundingClientRect();
        const cursorX = rect.left + rect.width / 2;
        const cursorY = rect.top;
        
        floatingText.style.left = cursorX + 'px';
        floatingText.style.top = (cursorY - 25) + 'px';
    }

    // Function to start floating text updates
    function startFloatingTextUpdates() {
        // Stop any existing animation frame
        if (floatingTextAnimFrame) {
            cancelAnimationFrame(floatingTextAnimFrame);
        }

        // Update position immediately
        positionFloatingText();

        // Set up animation frame loop
        function updateLoop() {
            positionFloatingText();
            floatingTextAnimFrame = requestAnimationFrame(updateLoop);
        }
        floatingTextAnimFrame = requestAnimationFrame(updateLoop);
    }

    // Function to stop floating text updates
    function stopFloatingTextUpdates() {
        if (floatingTextAnimFrame) {
            cancelAnimationFrame(floatingTextAnimFrame);
            floatingTextAnimFrame = null;
        }
    }

    // Function to toggle tooltip visibility
    function toggleTooltip(e) {
        const rect = tooltip.getBoundingClientRect();
        isTooltipVisible = !isTooltipVisible;
        
        if (!isTooltipVisible) {
            // Lock cursor position during hide animation
            isCursorLocked = true;
            lockedCursorPosition = {
                x: e.clientX,
                y: e.clientY
            };
            
            createBreakParticles(rect.left, rect.top, rect.width, rect.height);
            tooltip.classList.add('hiding');
            
            setTimeout(() => {
                tooltip.style.display = 'none';
                tooltip.classList.remove('hiding');
                updateTooltipText();
                
                // Show floating text with delay
                setTimeout(() => {
                    floatingText.style.display = 'block';
                    startFloatingTextUpdates();
                    requestAnimationFrame(() => {
                        floatingText.classList.add('visible');
                    });
                }, 300);
                
                isCursorLocked = false;
            }, 600);
        } else {
            floatingText.classList.remove('visible');
            setTimeout(() => {
                floatingText.style.display = 'none';
                stopFloatingTextUpdates();
            }, 300);
            
            updateTooltipText();
            tooltip.style.display = 'block';
            positionTooltip(e.clientX, e.clientY);
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.classList.remove('hiding');
            }, 10);
        }
    }
    
    // Function to position tooltip relative to point
    function positionTooltip(x, y) {
        const offset = isAnimationComplete ? 25 : 10; // Increased spacing after animation
        tooltip.style.left = (x + offset) + 'px';
        tooltip.style.top = (y - tooltip.offsetHeight / 2) + 'px';
    }
    
    // Function to show tooltip
    function showTooltip() {
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
        tooltip.classList.remove('hiding');
    }
    
    // Function to toggle tooltip with updated text
    function updateTooltipText(isAnimating = false) {
        const lastLine = tooltip.querySelector('.text:last-child');
        if (lastLine) {
            if (isAnimating) {
                lastLine.innerHTML = `<span style="color: #555555">: ̗̀➛ </span><span style="color: #FFAA00">Click </span><span style="color: #AAAAAA">to increase typing speed</span>`;
            } else if (isTooltipVisible) {
                lastLine.innerHTML = `<span style="color: #555555">: ̗̀➛ </span><span style="color: #FFAA00">Click </span><span style="color: #AAAAAA">to hide tooltip!</span>`;
            } else {
                lastLine.innerHTML = `<span style="color: #555555">: ̗̀➛ </span><span style="color: #FFAA00">Click </span><span style="color: #AAAAAA">to show tooltip!</span>`;
            }
        }
    }
    
    // Function to create breaking particles
    function createBreakParticles(x, y, width, height) {
        const particleCount = 35; // Increased from 20 to 35
        const particles = [];
        const colors = ['#553B2F', '#694C3A', '#7C5947', '#8B6853']; // Minecraft wood block colors
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'break-particle';
            
            // Random color from the palette
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Randomize particle size slightly
            const size = 3 + Math.random() * 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Position particle within the tooltip's bounds
            const startX = x + Math.random() * width;
            const startY = y + Math.random() * height;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            // Set random movement direction
            const angle = (Math.random() * Math.PI * 2);
            const distance = 40 + Math.random() * 60; // Increased distance
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            const rotation = -360 + Math.random() * 720;
            
            particle.style.setProperty('--dx', `${dx}px`);
            particle.style.setProperty('--dy', `${dy}px`);
            particle.style.setProperty('--rot', `${rotation}deg`);
            
            particle.style.animation = 'particleFly 1.2s ease-out forwards';
            
            document.body.appendChild(particle);
            particles.push(particle);
        }
        
        setTimeout(() => {
            particles.forEach(particle => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
        }, 1200);
    }
    
    // Track if first completion
    let isFirstCompletion = true;
    
    // Track animation state
    let isAnimationComplete = false;
    
    // Animation sequence
    let currentElement = 0;
    let charIndex = 0;
    let currentText = '';
    let headlinePart = 'before';
    
    const elements = [headline, ...paragraphs];
    
    // Update tooltip positioning function
    function updateTooltipPosition(e) {
        if (isCursorLocked) {
            positionTooltip(lockedCursorPosition.x, lockedCursorPosition.y);
            return;
        }

        if (!isAnimationComplete) {
            const cursor = document.getElementById('custom-cursor');
            if (cursor) {
                const rect = cursor.getBoundingClientRect();
                positionTooltip(rect.right, rect.top + rect.height / 2);
                showTooltip();
                updateTooltipText(true);
            }
        } else {
            if (isTooltipVisible) {
                positionTooltip(e.clientX, e.clientY);
            } else if (floatingText.classList.contains('visible')) {
                positionFloatingText();
            }
        }
    }
    
    // Add mousemove listener for tooltip
    document.addEventListener('mousemove', updateTooltipPosition);
    
    // Add click handler to document
    document.addEventListener('click', function(e) {
        if (isAnimationComplete) {
            toggleTooltip(e);
        } else {
            increaseSpeed();
        }
    });

    // Function to increase typing speed
    function increaseSpeed() {
        speedMultiplier *= 0.4; // More aggressive speed increase (was 0.5)
        if (baseDelay * speedMultiplier < minDelay) {
            speedMultiplier = minDelay / baseDelay;
        }
    }

    // Clean up on page unload
    window.addEventListener('unload', () => {
        stopFloatingTextUpdates();
    });

    // Function to instantly complete all text with rapid typing effect
    function instantComplete() {
        if (window.typingTimeout) {
            clearTimeout(window.typingTimeout);
        }

        // Handle headline (all in pastel green)
        const headlineSpans = headline.querySelectorAll('span > span');
        headlineSpans.forEach(span => {
            span.style.transition = 'none';
            span.style.color = '#c3ceb5'; // All headline text in pastel green
        });

        // Handle paragraphs
        paragraphs.forEach(paragraph => {
            const spans = paragraph.querySelectorAll('span > span');
            spans.forEach(span => {
                span.style.transition = 'none';
                span.style.color = '#000000';
            });
        });

        // Force reflow to ensure instant color change
        document.body.offsetHeight;

        // Restore transitions after colors are set
        setTimeout(() => {
            document.querySelectorAll('span > span').forEach(span => {
                span.style.transition = 'color 0.05s ease';
            });
        }, 0);

        // Complete the animation
        completeAnimation();
    }

    // Add TAB key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (!isAnimationComplete) {
                instantComplete();
            }
        }
    });
}); 