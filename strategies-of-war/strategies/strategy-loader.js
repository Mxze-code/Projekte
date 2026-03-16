/**
 * Strategy detail page loader - extracts strategy ID from URL and renders content
 */
(function() {
    function init() {
        var pathname = window.location.pathname || '';
        var match = pathname.match(/strategy-0*(\d+)\.html/);
        var strategyId = match ? parseInt(match[1], 10) : 1;
        if (strategyId < 1 || strategyId > 33) strategyId = 1;

        if (typeof STRATEGIES_DATA === 'undefined') return;
        var s = STRATEGIES_DATA.find(function(x) { return x.id === strategyId; });
        if (!s) { window.location.href = '../strategies.html'; return; }

        if (typeof addExploredStrategy === 'function') addExploredStrategy(strategyId);
        if (typeof addLastOpened === 'function') addLastOpened(strategyId);

        var prevS = STRATEGIES_DATA.find(function(x) { return x.id === strategyId - 1; });
        var nextS = STRATEGIES_DATA.find(function(x) { return x.id === strategyId + 1; });
        function pad(n) { return String(n).padStart(2, '0'); }

        var content = document.getElementById('strategyDetailContent');
        if (content) {
            var html = '<span class="law-detail-number">Strategy ' + s.id + ' of 33</span>' +
                (s.part ? '<span class="law-detail-category">' + s.part + '</span>' : '') +
                '<h1 class="law-detail-action-title">' + s.title + '</h1>' +
                (s.keyPhrase ? '<p class="law-detail-subtitle">' + s.keyPhrase + '</p>' : '') +
                '<p class="law-detail-overview">' + (s.overview || '') + '</p>' +
                '<div class="law-detail-block"><h3>Explanation</h3><p>' + (s.explanation || '') + '</p></div>' +
                '<div class="law-detail-block"><h3>Conflict Dynamic</h3><p>' + (s.conflictDynamic || '') + '</p></div>' +
                '<div class="law-detail-block"><h3>Why This Strategy Exists</h3><p>' + (s.whyItExists || '') + '</p></div>' +
                '<div class="law-detail-block"><h3>Historical Pattern</h3><p>' + (s.historicalPattern || '') + '</p></div>' +
                (s.examples && s.examples.length ? '<div class="law-detail-block"><h3>Where You See This</h3><ul class="law-detail-list">' + s.examples.map(function(ex) { return '<li>' + ex + '</li>'; }).join('') + '</ul></div>' : '') +
                '<div class="law-detail-block law-detail-takeaway"><h3>Critical Reading / Caution</h3><p>' + (s.caution || '') + '</p></div>' +
                '<div class="law-detail-block law-detail-reflection"><h3>Reflection Prompt</h3><p><em>' + (s.reflectionPrompt || '—') + '</em></p></div>';
            content.innerHTML = html;
        }

        var nav = document.getElementById('strategyDetailNav');
        if (nav) {
            nav.innerHTML = '<div class="law-detail-nav-inner">' +
                (prevS ? '<a href="strategy-' + pad(prevS.id) + '.html" class="law-detail-nav-prev">← Strategy ' + prevS.id + ': ' + prevS.title + '</a>' : '<span class="law-detail-nav-prev law-detail-nav-disabled"></span>') +
                '<a href="../strategies.html" class="law-detail-nav-all">All Strategies</a>' +
                (nextS ? '<a href="strategy-' + pad(nextS.id) + '.html" class="law-detail-nav-next">Strategy ' + nextS.id + ': ' + nextS.title + ' →</a>' : '<span class="law-detail-nav-next law-detail-nav-disabled"></span>') +
                '</div>';
        }

        var suggested = document.getElementById('strategyDetailSuggested');
        if (suggested) {
            var samePart = STRATEGIES_DATA.filter(function(x) { return x.id !== strategyId && x.part === s.part; });
            var others = STRATEGIES_DATA.filter(function(x) { return x.id !== strategyId && x.part !== s.part; });
            var sug = samePart.slice(0, 2).concat(others.slice(0, 1)).filter(Boolean).slice(0, 3);
            if (sug.length === 0) sug = STRATEGIES_DATA.filter(function(x) { return x.id !== strategyId; }).slice(0, 3);
            suggested.innerHTML = '<h3>If you liked this, read next…</h3><ul class="law-detail-suggested-list">' +
                sug.map(function(x) { return '<li><a href="strategy-' + pad(x.id) + '.html">Strategy ' + x.id + ': ' + x.title + '</a></li>'; }).join('') + '</ul>';
        }

        document.title = 'Strategy ' + s.id + ': ' + s.title + ' | The 33 Strategies of War';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
