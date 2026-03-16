/**
 * Process phase detail page loader - populates from process-data.js
 * Call: showProcessDetailPage('stirring-interest')
 */
function showProcessDetailPage(slug) {
    const phase = typeof SEDUCTION_PROCESS_DATA !== 'undefined'
        ? SEDUCTION_PROCESS_DATA.find(p => p.slug === slug)
        : null;

    const content = document.getElementById('processDetailContent');
    const nav = document.getElementById('processDetailNav');
    const suggested = document.getElementById('processDetailSuggested');

    if (!phase) {
        if (content) content.innerHTML = '<p>Phase not found. <a href="../process.html">Back to process</a></p>';
        document.title = 'Phase Not Found | The Art of Seduction';
        return;
    }

    document.title = phase.title + ' | The Art of Seduction';

    if (content) {
        content.innerHTML = `
            <span class="law-detail-number">Phase ${phase.id} of 8</span>
            <h1 class="law-detail-action-title">${phase.title}</h1>
            <p class="law-detail-overview">${phase.summary || ''}</p>
            <div class="law-detail-block">
                <h3>The Dynamic</h3>
                <p>${phase.dynamic || '—'}</p>
            </div>
            <div class="law-detail-block">
                <h3>Emotional Pattern</h3>
                <p>${phase.emotionalPattern || '—'}</p>
            </div>
            <div class="law-detail-block">
                <h3>Why It Works</h3>
                <p>${phase.whyItWorks || '—'}</p>
            </div>
            <div class="law-detail-block law-detail-takeaway">
                <h3>Caution</h3>
                <p>${phase.caution || '—'}</p>
            </div>
        `;
    }

    const idx = SEDUCTION_PROCESS_DATA.findIndex(p => p.slug === slug);
    const prevPhase = idx > 0 ? SEDUCTION_PROCESS_DATA[idx - 1] : null;
    const nextPhase = idx >= 0 && idx < SEDUCTION_PROCESS_DATA.length - 1 ? SEDUCTION_PROCESS_DATA[idx + 1] : null;

    if (nav) {
        nav.innerHTML = `
            <div class="law-detail-nav-inner">
                ${prevPhase ? `<a href="${prevPhase.slug}.html" class="law-detail-nav-prev">← ${prevPhase.title}</a>` : '<span class="law-detail-nav-prev law-detail-nav-disabled"></span>'}
                <a href="../process.html" class="law-detail-nav-all">All Phases</a>
                ${nextPhase ? `<a href="${nextPhase.slug}.html" class="law-detail-nav-next">${nextPhase.title} →</a>` : '<span class="law-detail-nav-next law-detail-nav-disabled"></span>'}
            </div>
        `;
    }

    if (suggested && typeof SEDUCTION_PROCESS_DATA !== 'undefined') {
        const others = SEDUCTION_PROCESS_DATA.filter(p => p.id !== phase.id);
        const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
        suggested.innerHTML = `
            <h3>Explore other phases</h3>
            <ul class="law-detail-suggested-list">
                ${shuffled.map(p => `<li><a href="${p.slug}.html">${p.title}</a></li>`).join('')}
            </ul>
        `;
    }
}
