/**
 * THE ART OF SEDUCTION - Main JavaScript
 *
 * localStorage keys (prefixed):
 * - seductionTypesExplored: array of type IDs viewed
 * - seductionLearnings: object { section: { notes } }
 * - seductionLastOpened: array (types/process IDs), max 5
 */

function typePageUrl(slug) {
    return 'types/' + slug + '.html';
}

function processPageUrl(slug) {
    return 'process/' + slug + '.html';
}

// ========== LOCAL STORAGE ==========
function getExploredTypes() {
    try {
        const data = localStorage.getItem('seductionTypesExplored');
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
}

function addExploredType(id) {
    const explored = getExploredTypes();
    if (!explored.includes(id)) {
        explored.push(id);
        localStorage.setItem('seductionTypesExplored', JSON.stringify(explored));
    }
}

function getLearnings() {
    try {
        const data = localStorage.getItem('seductionLearnings');
        return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
}

function saveLearning(section, field, value) {
    const learnings = getLearnings();
    if (!learnings[section]) learnings[section] = {};
    learnings[section][field] = value;
    learnings[section].updated = new Date().toISOString();
    localStorage.setItem('seductionLearnings', JSON.stringify(learnings));
}

// ========== PROCESS PAGE ==========
function renderProcessPage() {
    if (typeof SEDUCTION_PROCESS_DATA === 'undefined') return;

    const grid = document.getElementById('processGrid');
    const searchInput = document.getElementById('processSearch');
    const noResults = document.getElementById('noResults');
    const randomBtn = document.getElementById('randomProcessBtn');
    const outputEl = document.getElementById('randomProcessOutput');
    const titleEl = document.getElementById('randomProcessTitle');
    const readBtn = document.getElementById('randomProcessReadBtn');

    function renderPhases(search) {
        const q = (search || '').toLowerCase().trim();
        let phases = SEDUCTION_PROCESS_DATA;

        if (q) {
            phases = phases.filter(p =>
                (p.title && p.title.toLowerCase().includes(q)) ||
                (p.summary && p.summary.toLowerCase().includes(q)) ||
                (p.dynamic && p.dynamic.toLowerCase().includes(q))
            );
        }

        if (noResults) noResults.style.display = phases.length === 0 ? 'block' : 'none';

        grid.innerHTML = phases.map(p => `
            <article class="law-card">
                <a href="${processPageUrl(p.slug)}" class="law-card-link">
                    <span class="law-card-number">Phase ${p.id}</span>
                    <h3 class="law-card-title">${p.title}</h3>
                    <p class="law-card-summary">${p.summary}</p>
                    <span class="law-card-read-more">Read more →</span>
                </a>
            </article>
        `).join('');
    }

    renderPhases('');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderPhases(this.value);
        });
    }

    if (randomBtn && outputEl && titleEl && readBtn) {
        randomBtn.addEventListener('click', function() {
            const random = SEDUCTION_PROCESS_DATA[Math.floor(Math.random() * SEDUCTION_PROCESS_DATA.length)];
            outputEl.style.display = 'block';
            titleEl.textContent = random.title;
            readBtn.href = processPageUrl(random.slug);
            readBtn.onclick = function(e) {
                e.preventDefault();
                window.location.href = processPageUrl(random.slug);
            };
            outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
}

function resetAllLearnings() {
    if (confirm('Are you sure you want to delete all your notes? This cannot be undone.')) {
        localStorage.removeItem('seductionLearnings');
        if (typeof renderLearningsPage === 'function') renderLearningsPage();
        alert('All notes have been reset.');
    }
}

// ========== NAVIGATION ==========
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});

// ========== FEATURED TYPES (Home) ==========
function loadFeaturedTypes() {
    const container = document.getElementById('featuredTypes');
    if (!container || typeof SEDUCTIVE_TYPES_DATA === 'undefined') return;
    const featured = SEDUCTIVE_TYPES_DATA.slice(0, 6);
    container.innerHTML = featured.map(t => `
        <article class="law-card">
            <a href="${typePageUrl(t.slug)}" class="law-card-link">
                <span class="law-card-number">Type ${t.id}</span>
                <h3 class="law-card-title">${t.title}</h3>
                <p class="law-card-summary">${t.summary}</p>
            </a>
        </article>
    `).join('');
}

// ========== SEDUCTION TYPES PAGE ==========
function renderSeductionTypesPage() {
    if (typeof SEDUCTIVE_TYPES_DATA === 'undefined') return;

    const grid = document.getElementById('typesGrid');
    const searchInput = document.getElementById('typeSearch');
    const noResults = document.getElementById('noResults');
    const randomBtn = document.getElementById('randomTypeBtn');
    const outputEl = document.getElementById('randomTypeOutput');
    const titleEl = document.getElementById('randomTypeTitle');
    const readBtn = document.getElementById('randomTypeReadBtn');

    function renderTypes(search) {
        const q = (search || '').toLowerCase().trim();
        let types = SEDUCTIVE_TYPES_DATA;

        if (q) {
            types = types.filter(t =>
                (t.title && t.title.toLowerCase().includes(q)) ||
                (t.summary && t.summary.toLowerCase().includes(q)) ||
                (t.traits && t.traits.some(tr => tr && tr.toLowerCase().includes(q)))
            );
        }

        if (noResults) noResults.style.display = types.length === 0 ? 'block' : 'none';

        grid.innerHTML = types.map(t => `
            <article class="law-card">
                <a href="${typePageUrl(t.slug)}" class="law-card-link">
                    <span class="law-card-number">Type ${t.id}</span>
                    <h3 class="law-card-title">${t.title}</h3>
                    <p class="law-card-summary">${t.summary}</p>
                    <span class="law-card-read-more">Read more →</span>
                </a>
            </article>
        `).join('');
    }

    renderTypes('');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderTypes(this.value);
        });
    }

    if (randomBtn && outputEl && titleEl && readBtn) {
        randomBtn.addEventListener('click', function() {
            const random = SEDUCTIVE_TYPES_DATA[Math.floor(Math.random() * SEDUCTIVE_TYPES_DATA.length)];
            outputEl.style.display = 'block';
            titleEl.textContent = random.title;
            readBtn.href = typePageUrl(random.slug);
            readBtn.onclick = function(e) {
                e.preventDefault();
                window.location.href = typePageUrl(random.slug);
            };
            outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
}

// ========== LEARNINGS PAGE ==========
const LEARNING_SECTIONS = [
    { id: 'types', label: 'The Seductive Types', prompt: 'What emotional needs do these archetypes activate? Which type feels most culturally powerful?' },
    { id: 'anti', label: 'The Anti-Seducer', prompt: 'What breaks attraction? What makes someone socially heavy or repellant?' },
    { id: 'process', label: 'The Process', prompt: 'Where do you see theatricality in attraction? What role do projection and fantasy play in desire?' },
    { id: 'critical', label: 'Critical Reading', prompt: 'Which patterns seem psychologically true, and which seem exaggerated? What part of the book should be read critically?' }
];

function renderLearningsPage() {
    const container = document.getElementById('learningsList');
    const resetBtn = document.getElementById('resetNotes');
    const exportBtn = document.getElementById('exportNotes');
    const learnings = getLearnings();

    container.innerHTML = LEARNING_SECTIONS.map(s => {
        const l = learnings[s.id] || {};
        return `
            <div class="learning-item" data-section="${s.id}">
                <div class="learning-item-header">
                    <h3 class="learning-item-title">${s.label}</h3>
                    <p class="learning-item-summary">${s.prompt}</p>
                </div>
                <div class="learning-field">
                    <textarea class="learning-textarea" data-section="${s.id}" data-field="notes" placeholder="Your thoughts...">${l.notes || ''}</textarea>
                </div>
                <span class="learning-updated">${l.updated ? 'Updated: ' + new Date(l.updated).toLocaleDateString() : ''}</span>
            </div>
        `;
    }).join('');

    let saveTimeout;
    container.querySelectorAll('textarea').forEach(ta => {
        ta.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveLearning(this.dataset.section, this.dataset.field, this.value);
            }, 500);
        });
    });

    if (resetBtn) resetBtn.addEventListener('click', resetAllLearnings);

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            let text = 'THE ART OF SEDUCTION - My Learnings\n';
            text += 'Exported: ' + new Date().toLocaleString() + '\n\n';
            LEARNING_SECTIONS.forEach(s => {
                const l = learnings[s.id];
                if (l && l.notes) {
                    text += '--- ' + s.label + ' ---\n' + l.notes + '\n\n';
                }
            });
            const blob = new Blob([text], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'art-of-seduction-notes.txt';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }
}
