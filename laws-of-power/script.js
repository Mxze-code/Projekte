/**
 * THE 48 LAWS OF POWER - Main JavaScript
 *
 * localStorage keys (prefixed to avoid conflicts):
 * - laws48Explored: array of law IDs viewed
 * - laws48Learnings: object { lawId: { learned, inOthers, inMyself, apply, watch, completed, updated } }
 * - laws48LastOpened: array of law IDs (most recent first), max 5
 */

const SEARCH_SUGGESTIONS = ['reputation', 'conceal', 'master', 'enemy', 'timing', 'courtier', 'attention', 'credit', 'absence'];

function lawPageUrl(lawId) {
    const n = String(lawId).padStart(2, '0');
    return 'laws/law-' + n + '.html';
}

// ========== LOCAL STORAGE ==========
function getExploredLaws() {
    try {
        const data = localStorage.getItem('laws48Explored');
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
}

function addExploredLaw(id) {
    const explored = getExploredLaws();
    if (!explored.includes(id)) {
        explored.push(id);
        localStorage.setItem('laws48Explored', JSON.stringify(explored));
    }
}

function addLastOpened(id) {
    let last = [];
    try {
        const data = localStorage.getItem('laws48LastOpened');
        if (data) last = JSON.parse(data);
    } catch (e) {}
    last = last.filter(x => x !== id);
    last.unshift(id);
    last = last.slice(0, 5);
    localStorage.setItem('laws48LastOpened', JSON.stringify(last));
}

function getLastOpened() {
    try {
        const data = localStorage.getItem('laws48LastOpened');
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
}

function getLearnings() {
    try {
        const data = localStorage.getItem('laws48Learnings');
        return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
}

function saveLearning(lawId, field, value) {
    const learnings = getLearnings();
    if (!learnings[lawId]) learnings[lawId] = {};
    learnings[lawId][field] = value;
    learnings[lawId].updated = new Date().toISOString();
    localStorage.setItem('laws48Learnings', JSON.stringify(learnings));
}

function setLearningCompleted(lawId, completed) {
    const learnings = getLearnings();
    if (!learnings[lawId]) learnings[lawId] = {};
    learnings[lawId].completed = completed;
    learnings[lawId].updated = new Date().toISOString();
    localStorage.setItem('laws48Learnings', JSON.stringify(learnings));
}

function resetAllLearnings() {
    if (confirm('Are you sure you want to delete all your notes? This cannot be undone.')) {
        localStorage.removeItem('laws48Learnings');
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

// ========== FEATURED LAWS (Home) ==========
function loadFeaturedLaws() {
    const container = document.getElementById('featuredLaws');
    if (!container || typeof LAWS_DATA === 'undefined') return;
    const featured = LAWS_DATA.slice(0, 6);
    container.innerHTML = featured.map(law => `
        <article class="law-card">
            <a href="${lawPageUrl(law.id)}" class="law-card-link">
                <span class="law-card-number">Law ${law.id}</span>
                <h3 class="law-card-title">${law.title}</h3>
                <p class="law-card-summary">${law.overview || ''}</p>
            </a>
        </article>
    `).join('');
}

// ========== PROGRESS DISPLAY ==========
function updateProgressDisplay() {
    const countEl = document.getElementById('exploredCount');
    const fillEl = document.getElementById('progressFill');
    if (countEl) countEl.textContent = getExploredLaws().length;
    if (fillEl) fillEl.style.width = (getExploredLaws().length / 48) * 100 + '%';
}

// ========== LAWS PAGE ==========
const CATEGORIES = [
    'Reputation & Perception', 'Strategy & Timing', 'Court Politics',
    'Self-Presentation', 'Influence & Social Control', 'Risk Conflict & Adaptation'
];

function renderLawsPage() {
    if (typeof LAWS_DATA === 'undefined') return;

    const grid = document.getElementById('lawsGrid');
    const searchInput = document.getElementById('lawSearch');
    const noResults = document.getElementById('noResults');
    const searchHints = document.getElementById('searchHints');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const randomBtn = document.getElementById('randomLawBtn');
    const continueSection = document.getElementById('continueSection');
    const continueCards = document.getElementById('continueCards');
    const categoryFilter = document.getElementById('categoryFilter');

    // Category filter
    if (categoryFilter) {
        categoryFilter.innerHTML = '<button class="filter-btn active" data-category="">All</button>' +
            CATEGORIES.map(c => `<button class="filter-btn" data-category="${c}">${c}</button>`).join('');
    }

    // Continue section
    const lastOpened = getLastOpened().filter(id => LAWS_DATA.some(l => l.id === id));
    if (continueSection && continueCards && lastOpened.length > 0) {
        continueSection.style.display = 'block';
        continueCards.innerHTML = lastOpened.slice(0, 3).map(id => {
            const law = LAWS_DATA.find(l => l.id === id);
            return law ? `
                <a href="${lawPageUrl(law.id)}" class="continue-card">
                    <span class="law-card-number">Law ${law.id}</span>
                    <h4>${law.title}</h4>
                </a>
            ` : '';
        }).join('');
    }

    function renderLaws(search, category) {
        const s = (search || '').toLowerCase().trim();
        let laws = LAWS_DATA;

        if (s) {
            var searchNum = s.replace(/^law\s*/i, '').trim();
            var numMatch = searchNum.match(/^\d+$/);
            laws = laws.filter(law =>
                (numMatch && law.id === parseInt(numMatch[0], 10)) ||
                (numMatch && String(law.id) === searchNum) ||
                (!numMatch && (
                    (law.title && law.title.toLowerCase().includes(s)) ||
                    (law.overview && law.overview.toLowerCase().includes(s)) ||
                    (law.explanation && law.explanation.toLowerCase().includes(s)) ||
                    (law.category && law.category.toLowerCase().includes(s)) ||
                    (Array.isArray(law.examples) && law.examples.some(ex => ex && ex.toLowerCase().includes(s)))
                ))
            );
        }
        if (category) {
            laws = laws.filter(law => law.category === category);
        }

        if (noResults) noResults.style.display = laws.length === 0 ? 'block' : 'none';
        if (searchHints && laws.length === 0) searchHints.textContent = SEARCH_SUGGESTIONS.slice(0, 3).join(', ');
        if (searchSuggestions && s && laws.length === 0) {
            searchSuggestions.textContent = 'Try: ' + SEARCH_SUGGESTIONS.join(', ');
        } else if (searchSuggestions) searchSuggestions.textContent = '';

        grid.innerHTML = laws.map(law => `
            <article class="law-card">
                <a href="${lawPageUrl(law.id)}" class="law-card-link">
                    <span class="law-card-number">Law ${law.id} of 48</span>
                    <h3 class="law-card-title">${law.title}</h3>
                    ${law.category ? `<span class="law-card-category">${law.category}</span>` : ''}
                    <p class="law-card-summary">${law.overview || ''}</p>
                    <span class="law-card-read-more">Read full law →</span>
                </a>
            </article>
        `).join('');
    }

    renderLaws('', '');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const cat = document.querySelector('.filter-btn.active');
            renderLaws(this.value, cat ? cat.dataset.category : '');
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('click', function(e) {
            if (!e.target.classList.contains('filter-btn')) return;
            categoryFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLaws(searchInput ? searchInput.value : '', e.target.dataset.category);
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', function() {
            if (!LAWS_DATA || !LAWS_DATA.length) return;
            const randomLaw = LAWS_DATA[Math.floor(Math.random() * LAWS_DATA.length)];
            const outputEl = document.getElementById('randomLawOutput');
            const titleEl = document.getElementById('randomLawTitle');
            const readBtn = document.getElementById('randomLawReadBtn');
            if (outputEl && titleEl && readBtn) {
                outputEl.style.display = 'block';
                titleEl.textContent = 'Law ' + randomLaw.id + ': ' + randomLaw.title;
                readBtn.href = lawPageUrl(randomLaw.id);
                readBtn.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = lawPageUrl(randomLaw.id);
                };
                outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                window.location.href = lawPageUrl(randomLaw.id);
            }
        });
    }
}

// ========== LEARNINGS PAGE ==========
const LEARNING_FIELDS = [
    { key: 'learned', label: 'What does this law really mean?' },
    { key: 'inOthers', label: 'Where do I see this dynamic in real life?' },
    { key: 'inMyself', label: 'What should I be cautious about here?' },
    { key: 'apply', label: 'How does this relate to reputation, timing, or perception?' },
    { key: 'watch', label: 'Which law feels most relevant to me right now?' }
];

function renderLearningsPage() {
    if (typeof LAWS_DATA === 'undefined') return;

    const container = document.getElementById('learningsList');
    const resetBtn = document.getElementById('resetNotes');
    const exportBtn = document.getElementById('exportNotes');
    const progressSummary = document.getElementById('learningsProgressSummary');
    const continueSection = document.getElementById('continueReflectionSection');
    const continueCards = document.getElementById('continueReflectionCards');
    const learnings = getLearnings();

    let completed = 0;
    let unfinished = [];
    LAWS_DATA.forEach(law => {
        const l = learnings[law.id];
        if (l && l.completed) completed++;
        else if (l && LEARNING_FIELDS.some(f => (l[f.key] || '').trim())) unfinished.push(law);
    });
    if (progressSummary) {
        progressSummary.innerHTML = `${completed} of 48 reflections completed. ${unfinished.length} in progress.`;
    }

    if (continueSection && continueCards && unfinished.length > 0) {
        continueSection.style.display = 'block';
        continueCards.innerHTML = unfinished.slice(0, 5).map(law => `
            <div class="continue-reflection-card">
                <a href="#law-${law.id}">Law ${law.id}: ${law.title}</a>
            </div>
        `).join('');
    }

    container.innerHTML = LAWS_DATA.map(law => {
        const l = learnings[law.id] || {};
        const isCompleted = l.completed;
        return `
            <div class="learning-item ${isCompleted ? 'learning-item-completed' : ''}" data-law-id="${law.id}" id="law-${law.id}">
                <div class="learning-item-header">
                    <h3 class="learning-item-title">Law ${law.id}: ${law.title}</h3>
                    <p class="learning-item-summary">${law.overview || ''}</p>
                </div>
                <div class="learning-reflection-fields">
                    ${LEARNING_FIELDS.map(f => `
                        <div class="learning-field">
                            <label>${f.label}</label>
                            <textarea data-law-id="${law.id}" data-field="${f.key}" placeholder="Your thoughts...">${l[f.key] || ''}</textarea>
                        </div>
                    `).join('')}
                </div>
                <div class="learning-item-actions">
                    <span class="learning-updated">${l.updated ? 'Updated: ' + new Date(l.updated).toLocaleDateString() : ''}</span>
                    <label><input type="checkbox" data-law-id="${law.id}" ${l.completed ? 'checked' : ''}> Mark completed</label>
                </div>
            </div>
        `;
    }).join('');

    let saveTimeout;
    container.querySelectorAll('textarea').forEach(ta => {
        ta.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveLearning(this.dataset.lawId, this.dataset.field, this.value);
            }, 500);
        });
    });

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            setLearningCompleted(this.dataset.lawId, this.checked);
            if (typeof renderLearningsPage === 'function') renderLearningsPage();
        });
    });

    if (resetBtn) resetBtn.addEventListener('click', resetAllLearnings);

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            let text = 'THE 48 LAWS OF POWER - My Learnings\n';
            text += 'Exported: ' + new Date().toLocaleString() + '\n\n';
            LAWS_DATA.forEach(law => {
                const l = learnings[law.id];
                if (!l || !LEARNING_FIELDS.some(f => (l[f.key] || '').trim())) return;
                text += '--- Law ' + law.id + ': ' + law.title + ' ---\n';
                LEARNING_FIELDS.forEach(f => {
                    if (l[f.key]) text += f.label + '\n' + l[f.key] + '\n\n';
                });
                text += '\n';
            });
            const blob = new Blob([text], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = '48-laws-of-power-notes.txt';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }
}
