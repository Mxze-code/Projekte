/**
 * Law detail page loader - extracts law ID from URL and renders content
 */
(function() {
    function init() {
        var pathname = window.location.pathname || '';
        var match = pathname.match(/law-0*(\d+)\.html/);
        var lawId = match ? parseInt(match[1], 10) : 1;
        if (lawId < 1 || lawId > 48) lawId = 1;

        if (typeof LAWS_DATA === 'undefined') return;
        var law = LAWS_DATA.find(function(l) { return l.id === lawId; });
        if (!law) { window.location.href = '../laws.html'; return; }

        if (typeof addExploredLaw === 'function') addExploredLaw(lawId);
        if (typeof addLastOpened === 'function') addLastOpened(lawId);

        var prevLaw = LAWS_DATA.find(function(l) { return l.id === lawId - 1; });
        var nextLaw = LAWS_DATA.find(function(l) { return l.id === lawId + 1; });
        function pad(n) { return String(n).padStart(2, '0'); }

        var content = document.getElementById('lawDetailContent');
        if (content) {
            var html = '<span class="law-detail-number">Law ' + law.id + ' of 48</span>' +
                (law.category ? '<span class="law-detail-category">' + law.category + '</span>' : '') +
                '<h1 class="law-detail-action-title">' + law.title + '</h1>' +
                '<p class="law-detail-overview">' + (law.overview || '') + '</p>' +
                '<div class="law-detail-block"><h3>Deeper Explanation</h3><p>' + (law.explanation || '') + '</p></div>' +
                '<div class="law-detail-block"><h3>Why This Law Matters</h3><p>' + (law.whyItMatters || '') + '</p></div>' +
                (law.examples && law.examples.length ? '<div class="law-detail-block"><h3>Where You See This in Real Life</h3><ul class="law-detail-list">' + law.examples.map(function(ex) { return '<li>' + ex + '</li>'; }).join('') + '</ul></div>' : '') +
                '<div class="law-detail-block law-detail-takeaway"><h3>Practical Takeaway</h3><p>' + (law.takeaway || '') + '</p></div>' +
                '<div class="law-detail-block law-detail-reflection"><h3>Reflection Prompt</h3><p><em>' + (law.reflectionPrompt || '—') + '</em></p></div>';
            content.innerHTML = html;
        }

        var nav = document.getElementById('lawDetailNav');
        if (nav) {
            nav.innerHTML = '<div class="law-detail-nav-inner">' +
                (prevLaw ? '<a href="law-' + pad(prevLaw.id) + '.html" class="law-detail-nav-prev">← Law ' + prevLaw.id + ': ' + prevLaw.title + '</a>' : '<span class="law-detail-nav-prev law-detail-nav-disabled"></span>') +
                '<a href="../laws.html" class="law-detail-nav-all">All Laws</a>' +
                (nextLaw ? '<a href="law-' + pad(nextLaw.id) + '.html" class="law-detail-nav-next">Law ' + nextLaw.id + ': ' + nextLaw.title + ' →</a>' : '<span class="law-detail-nav-next law-detail-nav-disabled"></span>') +
                '</div>';
        }

        var suggested = document.getElementById('lawDetailSuggested');
        if (suggested) {
            var sameCategory = LAWS_DATA.filter(function(l) { return l.id !== lawId && l.category === law.category; });
            var others = LAWS_DATA.filter(function(l) { return l.id !== lawId && l.category !== law.category; });
            var sug = sameCategory.slice(0, 2).concat(others.slice(0, 1)).filter(Boolean).slice(0, 3);
            if (sug.length === 0) sug = LAWS_DATA.filter(function(l) { return l.id !== lawId; }).slice(0, 3);
            suggested.innerHTML = '<h3>If you liked this, read next…</h3><ul class="law-detail-suggested-list">' +
                sug.map(function(l) { return '<li><a href="law-' + pad(l.id) + '.html">Law ' + l.id + ': ' + l.title + '</a></li>'; }).join('') + '</ul>';
        }

        document.title = 'Law ' + law.id + ': ' + law.title + ' | The 48 Laws of Power';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
