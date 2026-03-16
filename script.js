/**
 * ROBERT GREENE LIBRARY - Main Landing Page
 *
 * Split text animation, scroll reveal. Matches Laws of Human Nature feel.
 * No frameworks, vanilla JS only.
 */

var ANIMATION_CONFIG = {
    splitText: { staggerMs: 50, durationMs: 1200 }
};

document.addEventListener('DOMContentLoaded', function() {
    initSplitText();
    initScrollReveal();
});

function initSplitText() {
    var el = document.getElementById('libraryHeroTitle');
    if (!el) return;

    var text = el.textContent.trim();
    if (!text) return;

    el.innerHTML = '';
    el.style.opacity = '1';

    var words = text.split(/\s+/);
    var charIndex = 0;
    var stagger = ANIMATION_CONFIG.splitText.staggerMs;
    var duration = ANIMATION_CONFIG.splitText.durationMs;

    words.forEach(function(word, wordIdx) {
        var wordSpan = document.createElement('span');
        wordSpan.className = 'split-word';
        word.split('').forEach(function(char) {
            var span = document.createElement('span');
            span.className = 'split-char';
            span.textContent = char;
            span.style.animationDelay = (charIndex * stagger) + 'ms';
            span.style.animationDuration = duration + 'ms';
            wordSpan.appendChild(span);
            charIndex++;
        });
        el.appendChild(wordSpan);
        if (wordIdx < words.length - 1) {
            el.appendChild(document.createTextNode('\u00A0'));
        }
    });
}

function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
        function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '-20px 0px -20px 0px' }
    );

    elements.forEach(function(el) {
        observer.observe(el);
    });
}
