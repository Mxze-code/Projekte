/**
 * THE 33 STRATEGIES OF WAR - Main JavaScript
 *
 * localStorage keys (prefixed to avoid conflicts):
 * - strat33Explored: array of strategy IDs viewed
 * - strat33Learnings: object { strategyId: { learned, inHistory, inOrgs, danger, critical, takeaway, completed, updated } }
 * - strat33LastOpened: array of strategy IDs (most recent first), max 5
 */

const SEARCH_SUGGESTIONS = ['polarity', 'morale', 'economy', 'intelligence', 'timing', 'alliance', 'perception', 'exit'];

function strategyPageUrl(strategyId) {
    const n = String(strategyId).padStart(2, '0');
    return 'strategies/strategy-' + n + '.html';
}

// ========== LOCAL STORAGE ==========
function getExploredStrategies() {
    try {
        const data = localStorage.getItem('strat33Explored');
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
}

function addExploredStrategy(id) {
    const explored = getExploredStrategies();
    if (!explored.includes(id)) {
        explored.push(id);
        localStorage.setItem('strat33Explored', JSON.stringify(explored));
    }
}

function addLastOpened(id) {
    let last = [];
    try {
        const data = localStorage.getItem('strat33LastOpened');
        if (data) last = JSON.parse(data);
    } catch (e) {}
    last = last.filter(x => x !== id);
    last.unshift(id);
    last = last.slice(0, 5);
    localStorage.setItem('strat33LastOpened', JSON.stringify(last));
}

function getLastOpened() {
    try {
        const data = localStorage.getItem('strat33LastOpened');
        return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
}

function getLearnings() {
    try {
        const data = localStorage.getItem('strat33Learnings');
        return data ? JSON.parse(data) : {};
    } catch (e) { return {}; }
}

function saveLearning(strategyId, field, value) {
    const learnings = getLearnings();
    if (!learnings[strategyId]) learnings[strategyId] = {};
    learnings[strategyId][field] = value;
    learnings[strategyId].updated = new Date().toISOString();
    localStorage.setItem('strat33Learnings', JSON.stringify(learnings));
}

function setLearningCompleted(strategyId, completed) {
    const learnings = getLearnings();
    if (!learnings[strategyId]) learnings[strategyId] = {};
    learnings[strategyId].completed = completed;
    learnings[strategyId].updated = new Date().toISOString();
    localStorage.setItem('strat33Learnings', JSON.stringify(learnings));
}

function resetAllLearnings() {
    if (confirm('Are you sure you want to delete all your notes? This cannot be undone.')) {
        localStorage.removeItem('strat33Learnings');
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

// ========== FEATURED STRATEGIES (Home) ==========
function loadFeaturedStrategies() {
    const container = document.getElementById('featuredStrategies');
    if (!container || typeof STRATEGIES_DATA === 'undefined') return;
    const featured = STRATEGIES_DATA.slice(0, 6);
    container.innerHTML = featured.map(s => `
        <article class="law-card">
            <a href="${strategyPageUrl(s.id)}" class="law-card-link">
                <span class="law-card-number">Strategy ${s.id}</span>
                <h3 class="law-card-title">${s.title}</h3>
                <p class="law-card-summary">${s.overview || ''}</p>
            </a>
        </article>
    `).join('');
}

// ========== PROGRESS DISPLAY ==========
function updateProgressDisplay() {
    const countEl = document.getElementById('exploredCount');
    const fillEl = document.getElementById('progressFill');
    if (countEl) countEl.textContent = getExploredStrategies().length;
    if (fillEl) fillEl.style.width = (getExploredStrategies().length / 33) * 100 + '%';
}

// ========== STRATEGIES PAGE ==========
const CATEGORIES = [
    'Self-Directed Warfare', 'Organizational Warfare', 'Defensive Warfare',
    'Offensive Warfare', 'Unconventional Warfare'
];

function renderStrategiesPage() {
    if (typeof STRATEGIES_DATA === 'undefined') return;

    const grid = document.getElementById('strategiesGrid');
    const searchInput = document.getElementById('strategySearch');
    const noResults = document.getElementById('noResults');
    const searchHints = document.getElementById('searchHints');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const randomBtn = document.getElementById('randomStrategyBtn');
    const continueSection = document.getElementById('continueSection');
    const continueCards = document.getElementById('continueCards');
    const categoryFilter = document.getElementById('categoryFilter');

    if (categoryFilter) {
        categoryFilter.innerHTML = '<button class="filter-btn active" data-category="">All</button>' +
            CATEGORIES.map(c => `<button class="filter-btn" data-category="${c}">${c}</button>`).join('');
    }

    const lastOpened = getLastOpened().filter(id => STRATEGIES_DATA.some(s => s.id === id));
    if (continueSection && continueCards && lastOpened.length > 0) {
        continueSection.style.display = 'block';
        continueCards.innerHTML = lastOpened.slice(0, 3).map(id => {
            const s = STRATEGIES_DATA.find(x => x.id === id);
            return s ? `
                <a href="${strategyPageUrl(s.id)}" class="continue-card">
                    <span class="law-card-number">Strategy ${s.id}</span>
                    <h4>${s.title}</h4>
                </a>
            ` : '';
        }).join('');
    }

    function renderStrategies(search, category) {
        const q = (search || '').toLowerCase().trim();
        let strategies = STRATEGIES_DATA;

        if (q) {
            const searchNum = q.replace(/^strategy\s*/i, '').trim();
            const numMatch = searchNum.match(/^\d+$/);
            strategies = strategies.filter(s =>
                (numMatch && s.id === parseInt(numMatch[0], 10)) ||
                (!numMatch && (
                    (s.title && s.title.toLowerCase().includes(q)) ||
                    (s.overview && s.overview.toLowerCase().includes(q)) ||
                    (s.explanation && s.explanation.toLowerCase().includes(q)) ||
                    (s.part && s.part.toLowerCase().includes(q)) ||
                    (s.keyPhrase && s.keyPhrase.toLowerCase().includes(q)) ||
                    (Array.isArray(s.examples) && s.examples.some(ex => ex && ex.toLowerCase().includes(q)))
                ))
            );
        }
        if (category) {
            strategies = strategies.filter(s => s.part === category);
        }

        if (noResults) noResults.style.display = strategies.length === 0 ? 'block' : 'none';
        if (searchHints && strategies.length === 0) searchHints.textContent = SEARCH_SUGGESTIONS.slice(0, 3).join(', ');
        if (searchSuggestions && q && strategies.length === 0) {
            searchSuggestions.textContent = 'Try: ' + SEARCH_SUGGESTIONS.join(', ');
        } else if (searchSuggestions) searchSuggestions.textContent = '';

        grid.innerHTML = strategies.map(s => `
            <article class="law-card">
                <a href="${strategyPageUrl(s.id)}" class="law-card-link">
                    <span class="law-card-number">Strategy ${s.id} of 33</span>
                    <h3 class="law-card-title">${s.title}</h3>
                    ${s.part ? `<span class="law-card-category">${s.part}</span>` : ''}
                    <p class="law-card-summary">${s.overview || ''}</p>
                    <span class="law-card-read-more">Read full strategy →</span>
                </a>
            </article>
        `).join('');
    }

    renderStrategies('', '');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const cat = document.querySelector('.filter-btn.active');
            renderStrategies(this.value, cat ? cat.dataset.category : '');
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('click', function(e) {
            if (!e.target.classList.contains('filter-btn')) return;
            categoryFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderStrategies(searchInput ? searchInput.value : '', e.target.dataset.category);
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', function() {
            if (!STRATEGIES_DATA || !STRATEGIES_DATA.length) return;
            const random = STRATEGIES_DATA[Math.floor(Math.random() * STRATEGIES_DATA.length)];
            const outputEl = document.getElementById('randomStrategyOutput');
            const titleEl = document.getElementById('randomStrategyTitle');
            const readBtn = document.getElementById('randomStrategyReadBtn');
            if (outputEl && titleEl && readBtn) {
                outputEl.style.display = 'block';
                titleEl.textContent = 'Strategy ' + random.id + ': ' + random.title;
                readBtn.href = strategyPageUrl(random.id);
                readBtn.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = strategyPageUrl(random.id);
                };
                outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                window.location.href = strategyPageUrl(random.id);
            }
        });
    }
}

// ========== LEARNINGS PAGE ==========
const LEARNING_FIELDS = [
    { key: 'learned', label: 'What is the deeper human dynamic here?' },
    { key: 'inHistory', label: 'Where do I see this as a pattern in history, organizations, or relationships?' },
    { key: 'inOrgs', label: 'How does this relate to discipline, conflict, or leadership?' },
    { key: 'danger', label: 'What is the danger of misunderstanding this strategy?' },
    { key: 'critical', label: 'What would a critical reader question here?' },
    { key: 'takeaway', label: 'What is the reflective takeaway here?' }
];

function renderLearningsPage() {
    if (typeof STRATEGIES_DATA === 'undefined') return;

    const container = document.getElementById('learningsList');
    const resetBtn = document.getElementById('resetNotes');
    const exportBtn = document.getElementById('exportNotes');
    const progressSummary = document.getElementById('learningsProgressSummary');
    const continueSection = document.getElementById('continueReflectionSection');
    const continueCards = document.getElementById('continueReflectionCards');
    const learnings = getLearnings();

    let completed = 0;
    let unfinished = [];
    STRATEGIES_DATA.forEach(s => {
        const l = learnings[s.id];
        if (l && l.completed) completed++;
        else if (l && LEARNING_FIELDS.some(f => (l[f.key] || '').trim())) unfinished.push(s);
    });
    if (progressSummary) {
        progressSummary.innerHTML = completed + ' of 33 reflections completed. ' + unfinished.length + ' in progress.';
    }

    if (continueSection && continueCards && unfinished.length > 0) {
        continueSection.style.display = 'block';
        continueCards.innerHTML = unfinished.slice(0, 5).map(s => `
            <div class="continue-reflection-card">
                <a href="#strategy-${s.id}">Strategy ${s.id}: ${s.title}</a>
            </div>
        `).join('');
    }

    container.innerHTML = STRATEGIES_DATA.map(s => {
        const l = learnings[s.id] || {};
        const isCompleted = l.completed;
        return `
            <div class="learning-item ${isCompleted ? 'learning-item-completed' : ''}" data-strategy-id="${s.id}" id="strategy-${s.id}">
                <div class="learning-item-header">
                    <h3 class="learning-item-title">Strategy ${s.id}: ${s.title}</h3>
                    <p class="learning-item-summary">${s.overview || ''}</p>
                </div>
                <div class="learning-reflection-fields">
                    ${LEARNING_FIELDS.map(f => `
                        <div class="learning-field">
                            <label>${f.label}</label>
                            <textarea data-strategy-id="${s.id}" data-field="${f.key}" placeholder="Your thoughts...">${l[f.key] || ''}</textarea>
                        </div>
                    `).join('')}
                </div>
                <div class="learning-item-actions">
                    <span class="learning-updated">${l.updated ? 'Updated: ' + new Date(l.updated).toLocaleDateString() : ''}</span>
                    <label><input type="checkbox" data-strategy-id="${s.id}" ${l.completed ? 'checked' : ''}> Mark completed</label>
                </div>
            </div>
        `;
    }).join('');

    let saveTimeout;
    container.querySelectorAll('textarea').forEach(ta => {
        ta.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveLearning(this.dataset.strategyId, this.dataset.field, this.value);
            }, 500);
        });
    });

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            setLearningCompleted(this.dataset.strategyId, this.checked);
            if (typeof renderLearningsPage === 'function') renderLearningsPage();
        });
    });

    if (resetBtn) resetBtn.addEventListener('click', resetAllLearnings);

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            let text = 'THE 33 STRATEGIES OF WAR - My Learnings\n';
            text += 'Exported: ' + new Date().toLocaleString() + '\n\n';
            STRATEGIES_DATA.forEach(s => {
                const l = learnings[s.id];
                if (!l || !LEARNING_FIELDS.some(f => (l[f.key] || '').trim())) return;
                text += '--- Strategy ' + s.id + ': ' + s.title + ' ---\n';
                LEARNING_FIELDS.forEach(f => {
                    if (l[f.key]) text += f.label + '\n' + l[f.key] + '\n\n';
                });
                text += '\n';
            });
            const blob = new Blob([text], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = '33-strategies-of-war-notes.txt';
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }
}
