/**
 * Type detail page loader - populates type detail from types-data.js
 * Call: showTypeDetailPage('siren')
 */
function showTypeDetailPage(slug) {
    const type = typeof SEDUCTIVE_TYPES_DATA !== 'undefined'
        ? SEDUCTIVE_TYPES_DATA.find(t => t.slug === slug)
        : null;

    const content = document.getElementById('typeDetailContent');
    const nav = document.getElementById('typeDetailNav');
    const suggested = document.getElementById('typeDetailSuggested');

    if (!type) {
        if (content) content.innerHTML = '<p>Type not found. <a href="../seduction-types.html">Back to all types</a></p>';
        document.title = 'Type Not Found | The Art of Seduction';
        return;
    }

    document.title = type.title + ' | The Art of Seduction';

    const traitsHtml = Array.isArray(type.traits) && type.traits.length
        ? `<ul class="law-detail-list">${type.traits.map(t => `<li>${t}</li>`).join('')}</ul>`
        : '';

    if (content) {
        content.innerHTML = `
            <span class="law-detail-number">Type ${type.id} of 9</span>
            <h1 class="law-detail-action-title">${type.title}</h1>
            <p class="law-detail-overview">${type.summary || ''}</p>
            <div class="law-detail-block">
                <h3>Traits</h3>
                ${traitsHtml || '<p>—</p>'}
            </div>
            <div class="law-detail-block">
                <h3>Emotional Effect</h3>
                <p>${type.emotionalEffect || '—'}</p>
            </div>
            <div class="law-detail-block">
                <h3>Why It Attracts</h3>
                <p>${type.whyAttracts || '—'}</p>
            </div>
            <div class="law-detail-block">
                <h3>Strengths</h3>
                <p>${type.strengths || '—'}</p>
            </div>
            <div class="law-detail-block">
                <h3>Risks & Shadow</h3>
                <p>${type.risks || '—'}</p>
            </div>
            <div class="law-detail-block">
                <h3>Cultural Interpretation</h3>
                <p>${type.culturalInterpretation || '—'}</p>
            </div>
            <div class="law-detail-block law-detail-reflection">
                <h3>Reflection Prompt</h3>
                <p><em>${type.reflectionPrompt || '—'}</em></p>
            </div>
        `;
    }

    const idx = SEDUCTIVE_TYPES_DATA.findIndex(t => t.slug === slug);
    const prevType = idx > 0 ? SEDUCTIVE_TYPES_DATA[idx - 1] : null;
    const nextType = idx >= 0 && idx < SEDUCTIVE_TYPES_DATA.length - 1 ? SEDUCTIVE_TYPES_DATA[idx + 1] : null;

    if (nav) {
        nav.innerHTML = `
            <div class="law-detail-nav-inner">
                ${prevType ? `<a href="${prevType.slug}.html" class="law-detail-nav-prev">← ${prevType.title}</a>` : '<span class="law-detail-nav-prev law-detail-nav-disabled"></span>'}
                <a href="../seduction-types.html" class="law-detail-nav-all">All Types</a>
                ${nextType ? `<a href="${nextType.slug}.html" class="law-detail-nav-next">${nextType.title} →</a>` : '<span class="law-detail-nav-next law-detail-nav-disabled"></span>'}
            </div>
        `;
    }

    if (suggested && typeof SEDUCTIVE_TYPES_DATA !== 'undefined') {
        const others = SEDUCTIVE_TYPES_DATA.filter(t => t.id !== type.id);
        const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
        suggested.innerHTML = `
            <h3>Explore other types</h3>
            <ul class="law-detail-suggested-list">
                ${shuffled.map(t => `<li><a href="${t.slug}.html">${t.title}</a></li>`).join('')}
            </ul>
        `;
    }

    if (typeof addExploredType === 'function') addExploredType(type.id);
}
