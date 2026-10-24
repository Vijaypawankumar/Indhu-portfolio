(function () {
'use strict';
var S = window.SITE || {}, ALL = (window.POSTS || []).map(function (p) {
  return Object.assign({ type: 'blog', status: 'published', subtype: 'Article', rstatus: 'unpublished', categories: '', tags: '', keywords: '', excerpt: '', abstract: '', body: '', references: '', cover: '', coverAlt: '', pdf: '', link: '', doi: '', journal: '', coauthors: '', author: S.name }, p);
});
var $ = function (id) { return document.getElementById(id); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
var lines = function (s) { return String(s || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); };
var csv = function (s) { return String(s || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean); };
var safe = function (u) { return /^(https?:\/\/|mailto:)/i.test(u || '') ? u : ''; };
var slugify = function (s) { return String(s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-'); };
var fd = function (d) { return d ? new Date(String(d).slice(0, 10) + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; };
var SV = function (d) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>'; };
var IC = { ar: '<path d="M4 12h15M13 6l6 6-6 6"/>', se: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>', bk: '<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5zM12 6v13"/>', cap: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>', pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>', ml: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/>', ln: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>', mn: '<path d="M4 7h16M4 12h16M4 17h16"/>' };
var AR = SV(IC.ar);
var TL = { research: 'Research paper', article: 'Article', blog: 'Blog' };
var RS = { published: 'Published', working: 'Working paper', preprint: 'Preprint', submitted: 'Submitted manuscript', unpublished: 'Unpublished academic work' };
var AT = ['Article', 'Case comment', 'Opinion', 'Explainer'];
var label = function (p) { return p.type === 'article' ? (p.subtype || 'Article') : TL[p.type]; };
var cats = function (p) { return csv(p.categories); };
var by = function (a, b) { return (b.date || '').localeCompare(a.date || ''); };
var pubs = function () { return ALL.filter(function (p) { return p.status === 'published'; }).sort(by); };
var findPost = function (s) { return ALL.filter(function (p) { return p.slug === s; })[0]; };
var PER = { research: 5, article: 6, blog: 6, search: 6 };
var hasContact = function () { return !!(S.email || (S.links || []).length); };
var split = function (l) { var i = l.indexOf('|'); return i < 0 ? [l.trim(), ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; };

/* safe lightweight markdown: all text is escaped first */
function inl(t) {
  return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em style="color:inherit">$2</em>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/g, function (m, a, u) { return '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + a + '</a>'; });
}
function md(text) {
  var hs = [], out = String(text || '').replace(/\r/g, '').split(/\n\s*\n/).map(function (b) {
    b = b.trim(); if (!b) return ''; var L = b.split('\n');
    if (/^## /.test(b)) { var t = b.slice(3).trim(), id = 'h-' + slugify(t); hs.push([id, t]); return '<h2 id="' + id + '">' + inl(t) + '</h2>'; }
    if (/^### /.test(b)) return '<h3>' + inl(b.slice(4)) + '</h3>';
    if (L.every(function (l) { return /^>\s?/.test(l); })) return '<blockquote>' + L.map(function (l) { return inl(l.replace(/^>\s?/, '')); }).join('<br>') + '</blockquote>';
    if (L.every(function (l) { return /^[-*] /.test(l); })) return '<ul>' + L.map(function (l) { return '<li>' + inl(l.slice(2)) + '</li>'; }).join('') + '</ul>';
    if (L.every(function (l) { return /^\d+[.)] /.test(l); })) return '<ol>' + L.map(function (l) { return '<li>' + inl(l.replace(/^\d+[.)] /, '')) + '</li>'; }).join('') + '</ol>';
    if (L.length > 1 && L.every(function (l) { return l.indexOf('|') > -1; }) && /^[\s|:-]+$/.test(L[1])) {
      var c = function (l) { return l.replace(/^\||\|$/g, '').split('|').map(function (x) { return inl(x.trim()); }); };
      return '<table><thead><tr>' + c(L[0]).map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + L.slice(2).map(function (l) { return '<tr>' + c(l).map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    }
    return '<p>' + L.map(inl).join('<br>') + '</p>';
  }).join('');
  return { html: out, hs: hs };
}
var mins = function (p) { return Math.max(1, Math.round(String(p.body || '').split(/\s+/).length / 200)); };

function cover(p) {
  if (p.cover) return '<div class="cv"><img src="' + esc(p.cover) + '" alt="' + esc(p.coverAlt) + '" loading="lazy" decoding="async" width="836" height="468"></div>';
  return '<div class="cv"><div class="tc" aria-hidden="true"><small>' + esc(label(p)) + '</small><b>' + esc((cats(p)[0] || S.monogram || '§').charAt(0).toUpperCase()) + '</b></div></div>';
}
var dm = function (p) { return p.sample ? '<span class="demo">Sample post</span>' : ''; };

/* routing (hash based, so it works on any free static host) */
var HM = { '': 'home', home: 'home', about: 'about', contact: 'contact', 'research-papers': 'research', articles: 'article', blogs: 'blog', privacy: 'privacy', disclaimer: 'disclaimer', search: 'search' };
function fromHash() { var h = (location.hash || '').slice(1); if (h.indexOf('p-') === 0) return { p: 'post', slug: h.slice(2), pg: 1 }; return { p: HM[h] || 'home', pg: 1 }; }
function toHash(r) { if (r.p === 'post') return 'p-' + r.slug; if (r.p === 'home') return ''; for (var k in HM) if (HM[k] === r.p && k && k !== 'home') return k; return ''; }
var R = fromHash();
function go(r) { R = Object.assign({ pg: 1, q: '' }, r); if (location.hash.slice(1) !== toHash(R)) location.hash = toHash(R); render(); window.scrollTo(0, 0); }
window.addEventListener('hashchange', function () { if (toHash(R) !== location.hash.slice(1)) { R = fromHash(); render(); window.scrollTo(0, 0); } });

function meta(t, d, ld) {
  document.title = t;
  var m = document.querySelector('meta[name=description]'); if (m && d) m.content = d;
  [['og:title', t], ['og:description', d]].forEach(function (x) { var e = document.querySelector('meta[property="' + x[0] + '"]'); if (e && x[1]) e.content = x[1]; });
  var j = $('ld'); if (!j) { j = document.createElement('script'); j.type = 'application/ld+json'; j.id = 'ld'; document.head.appendChild(j); }
  j.textContent = ld ? JSON.stringify(ld).replace(/</g, '\\u003c') : '';
}

function nav() {
  var items = [['home', 'Home'], ['about', 'About'], ['research', 'Research Papers'], ['article', 'Articles'], ['blog', 'Blogs']].concat(hasContact() ? [['contact', 'Contact']] : []);
  var pt = R.p === 'post' ? (findPost(R.slug) || {}).type : null;
  return '<header class="nav"><div class="wrap nv"><a class="brand" href="#" data-a="go" data-p="home" aria-label="' + esc(S.display) + ' — home"><b>' + esc(S.monogram) + '</b><span>' + esc(S.display) + '</span></a>' +
    '<nav class="nl" id="nl" aria-label="Primary">' + items.map(function (x) { var on = x[0] === R.p || (pt && x[0] === pt); return '<a href="#" data-a="go" data-p="' + x[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + x[1] + '</a>'; }).join('') + '</nav>' +
    '<div class="ntl"><button class="ib" data-a="go" data-p="search" aria-label="Search the site">' + SV(IC.se) + '</button><button class="ib mb" data-a="menu" aria-label="Open menu" aria-expanded="false" aria-controls="nl">' + SV(IC.mn) + '</button></div></div></header>';
}
function foot() {
  var ca = []; pubs().forEach(function (p) { cats(p).forEach(function (c) { if (ca.indexOf(c) < 0) ca.push(c); }); });
  var ls = (S.links || []).filter(function (l) { return safe(l.url); });
  return '<footer class="fo"><div class="wrap"><div class="fg"><div><b class="mn">' + esc(S.monogram) + '</b><p>' + esc(S.footer) + '</p></div>' +
    '<div><h4>Explore</h4><a href="#" data-a="go" data-p="home">Home</a><a href="#" data-a="go" data-p="about">About</a><a href="#" data-a="go" data-p="research">Research Papers</a><a href="#" data-a="go" data-p="article">Articles</a><a href="#" data-a="go" data-p="blog">Blogs</a>' + (hasContact() ? '<a href="#" data-a="go" data-p="contact">Contact</a>' : '') + '</div>' +
    '<div><h4>Research areas</h4>' + (ca.slice(0, 6).map(function (c) { return '<a href="#" data-a="cat" data-c="' + esc(c) + '">' + esc(c) + '</a>'; }).join('') || '<span style="font-size:.9rem;color:#CFC8B6">Added as I publish</span>') + '</div>' +
    (hasContact() ? '<div><h4>Contact</h4>' + (S.email ? '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>' : '') + ls.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + '</a>'; }).join('') + '</div>' : '<div></div>') +
    '</div><div class="fb"><span>© ' + new Date().getFullYear() + ' ' + esc(S.display) + '</span><span><a href="#" data-a="go" data-p="privacy" style="display:inline">Privacy</a> · <a href="#" data-a="go" data-p="disclaimer" style="display:inline">Disclaimer</a></span></div></div></footer>';
}

function card(p) {
  return '<article class="cd"><a href="#" data-a="post" data-s="' + esc(p.slug) + '" style="display:flex;flex-direction:column;height:100%" aria-label="' + esc(p.title) + '">' + cover(p) + '<div class="cbd"><div class="mt">' + esc(label(p)) + dm(p) + '</div><h3>' + esc(p.title) + '</h3><div class="ft"><span>' + fd(p.date) + '</span>' + AR + '</div></div></a></article>';
}
function acard(p) {
  return '<article class="cd">' + cover(p) + '<div class="cbd"><div class="dm">' + fd(p.date) + (cats(p)[0] ? ' · <span class="mt" style="letter-spacing:.1em">' + esc(cats(p)[0]) + '</span>' : '') + dm(p) + '</div><h3><a href="#" data-a="post" data-s="' + esc(p.slug) + '">' + esc(p.title) + '</a></h3><p>' + esc(p.excerpt) + '</p><a class="more" href="#" data-a="post" data-s="' + esc(p.slug) + '" style="margin-top:auto">Read more ' + AR + '</a></div></article>';
}
function rcard(p) {
  var rs = p.rstatus || 'unpublished';
  return '<article class="rc">' + cover(p) + '<div><div><span class="pill ' + (rs === 'published' ? '' : 'w') + '">' + RS[rs] + '</span> <span class="dm" style="margin-left:8px">' + fd(p.date) + dm(p) + '</span></div><h3><a href="#" data-a="post" data-s="' + esc(p.slug) + '">' + esc(p.title) + '</a></h3>' + (cats(p)[0] ? '<div class="mt" style="margin-bottom:6px">' + esc(cats(p).join(' · ')) + '</div>' : '') + '<p>' + esc(p.abstract || p.excerpt) + '</p>' + (csv(p.keywords).length ? '<div class="kw" aria-label="Keywords">' + csv(p.keywords).map(function (k) { return '<span>' + esc(k) + '</span>'; }).join('') + '</div>' : '') + '<div style="display:flex;gap:18px;flex-wrap:wrap"><a class="more" href="#" data-a="post" data-s="' + esc(p.slug) + '">Read ' + AR + '</a>' + (p.pdf ? '<a class="more" href="' + esc(p.pdf) + '" target="_blank" rel="noopener">PDF ' + AR + '</a>' : '') + (p.doi ? '<a class="more" href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener">DOI ' + AR + '</a>' : '') + '</div></div></article>';
}

function xrows(list) { return list.map(function (l) { var a = split(l); return '<div class="xr"><b>' + esc(a[0]) + '</b>' + (a[1] ? '<span>' + esc(a[1]) + '</span>' : '') + '</div>'; }).join(''); }
function contactBlock() {
  if (!hasContact()) return '';
  var ls = (S.links || []).filter(function (l) { return safe(l.url); });
  return '<section class="sec" id="contact" style="border-top:1px solid var(--edge)" aria-labelledby="ch"><div class="wrap cg"><div><div class="lb">Contact</div><h2 id="ch" style="margin-top:12px">Let’s talk about the law.</h2><p style="color:var(--mute);max-width:30em">' + esc(S.contactText) + '</p><div class="cl">' + (S.email ? '<a href="mailto:' + esc(S.email) + '">' + SV(IC.ml) + ' ' + esc(S.email) + '</a>' : '') + ls.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + SV(IC.ln) + ' ' + esc(l.label) + '</a>'; }).join('') + '</div></div>' +
    (S.email ? '<form class="fm" id="cf" novalidate><label for="c1">Your name</label><input id="c1" autocomplete="name" aria-describedby="e1"><div class="er" id="e1"></div><label for="c2">Email address</label><input id="c2" type="email" autocomplete="email" aria-describedby="e2"><div class="er" id="e2"></div><label for="c3">Message</label><textarea id="c3" aria-describedby="e3"></textarea><div class="er" id="e3"></div><div class="hp" aria-hidden="true"><label for="c4">Leave this empty</label><input id="c4" tabindex="-1" autocomplete="off"></div><button class="btn" type="submit" style="margin-top:8px">Send message ' + AR + '</button><div id="cs" role="status" aria-live="polite"></div></form>' : '') + '</div></section>';
}

function home() {
  var all = pubs(), feat = all.filter(function (x) { return x.featured; }).slice(0, 4); if (!feat.length) feat = all.slice(0, 4);
  var fid = feat.map(function (x) { return x.slug; }), late = all.filter(function (x) { return fid.indexOf(x.slug) < 0; }).slice(0, 6);
  var ht = String(S.heroTitle || '').split('\n').map(function (l) { return esc(l).replace(/\*(.+?)\*/g, '<em>$1</em>'); }).join('<br>');
  var facts = [['cap', S.role || 'Law student', [S.degree, S.institution].filter(Boolean).join('\n')], ['bk', 'Research interests', (S.interests || []).slice(0, 4).join('\n')], ['pin', 'Based in', S.location]].filter(function (x) { return x[2]; });
  meta(S.display + ' — Law student portfolio', S.heroText);
  return '<main id="main"><section class="hero" aria-labelledby="h1"><div class="wrap hg"><a class="sc" href="#featured" data-a="skipto" data-t="featured" aria-label="Scroll to featured work"><i></i><span>SCROLL</span></a><div class="hc"><div class="ey">' + esc(S.eyebrow) + '</div><h1 id="h1">' + ht + '</h1><p class="lead">' + esc(S.heroText) + '</p><a class="btn" href="#featured" data-a="skipto" data-t="featured">Explore my work ' + AR + '</a></div><div class="ha"><img src="assets/hero-courthouse-collage.webp" alt="Collage of a domed courthouse, a classical column, stacked law books, parchment manuscripts, a brass balance scale and a fountain pen" width="1600" height="640" decoding="async" fetchpriority="high"></div></div></section>' +
    '<section class="ab" aria-labelledby="abh"><div class="wrap abg"><div class="pf"><img src="' + esc(S.photo) + '" alt="' + esc(S.photoAlt) + '" width="960" height="960" loading="lazy"></div><div class="abt"><div class="lb">About me</div><h2 id="abh">Hello, I’m ' + esc(S.name) + '</h2><hr><p>' + esc(String(S.bio || '').split('\n\n')[0]) + '</p><a class="btn" href="#" data-a="go" data-p="about">More about me ' + AR + '</a></div><div class="fs">' + facts.map(function (f) { return '<div class="fc">' + SV(IC[f[0]]).replace('class="i"', 'class="i" style="width:30px;height:30px"') + '<div><b>' + esc(f[1]) + '</b><span>' + esc(f[2]) + '</span></div></div>'; }).join('') + '</div></div></section>' +
    '<section class="sec" id="featured" aria-labelledby="fh"><div class="wrap"><div class="sh"><h2 id="fh">Featured Work</h2><i></i><a class="more" href="#" data-a="go" data-p="search">View all ' + AR + '</a></div>' + (feat.length ? '<div class="g4">' + feat.map(card).join('') + '</div>' : '<div class="em"><h3>First pieces coming soon</h3><p>New writing will appear here.</p></div>') + '</div></section>' +
    ((S.experience || []).length || (S.projects || []).length ? '<section class="sec" style="border-top:1px solid var(--edge)" aria-labelledby="xh"><div class="wrap"><div class="sh"><h2 id="xh">Experience &amp; Projects</h2><i></i><a class="more" href="#" data-a="go" data-p="about">Full profile ' + AR + '</a></div><div class="xg"><div><h3>Legal experience</h3>' + xrows(S.experience || []) + '</div><div><h3>Projects</h3>' + xrows(S.projects || []) + '</div></div></div></section>' : '') +
    '<section class="qt" aria-label="Quotation"><img src="assets/cover-courthouse.webp" alt="" loading="lazy"><div class="wrap qi"><q aria-hidden="true">“</q><blockquote>' + esc(S.quote) + '</blockquote><i></i></div></section>' +
    (late.length > 1 ? '<section class="sec" aria-labelledby="lh"><div class="wrap"><div class="sh"><h2 id="lh">Latest writing</h2><i></i><a class="more" href="#" data-a="go" data-p="search">Browse all ' + AR + '</a></div><div class="ll">' + late.map(function (x) { return '<a class="lr" href="#" data-a="post" data-s="' + esc(x.slug) + '"><div class="mt">' + esc(label(x)) + ' · <span class="dm" style="text-transform:none;letter-spacing:0;font-weight:400">' + fd(x.date) + '</span>' + dm(x) + '</div><h3>' + esc(x.title) + '</h3><p>' + esc(x.excerpt || x.abstract) + '</p></a>'; }).join('') + '</div></div></section>' : '') +
    contactBlock() + '</main>';
}
function about() {
  var sec = function (t, b) { return b ? '<section style="margin-top:36px"><h2 style="font-size:1.6rem;margin-bottom:14px">' + t + '</h2>' + b + '</section>' : ''; };
  var chips = function (a) { return a && a.length ? '<div class="kw">' + a.map(function (i) { return '<span>' + esc(i) + '</span>'; }).join('') + '</div>' : ''; };
  var ps = pubs().filter(function (x) { return x.type !== 'blog'; });
  meta('About — ' + S.display, String(S.bio || '').split('\n\n')[0]);
  return '<main id="main"><div class="ab"><div class="wrap abg" style="padding-bottom:50px"><div class="pf"><img src="' + esc(S.photo) + '" alt="' + esc(S.photoAlt) + '" width="960" height="960"></div><div class="abt" style="grid-column:span 2"><div class="lb">About</div><h1 style="font-size:clamp(2.2rem,4vw,3.4rem);margin:12px 0">' + esc(S.name) + '</h1><hr><p style="white-space:pre-line;max-width:42em">' + esc(S.bio) + '</p></div></div></div>' +
    '<div class="wrap pad" style="max-width:820px;margin:0 auto">' +
    sec('Education', (S.degree || S.institution) ? '<ul class="tg"><li>' + esc(S.degree || '') + '<small>' + esc(S.institution || '') + '</small></li></ul>' : '') +
    sec('Research interests', chips(S.interests)) +
    sec('Experience', (S.experience || []).length ? '<ul class="tg">' + S.experience.map(function (e) { var a = split(e); return '<li>' + esc(a[0]) + '<small>' + esc(a[1]) + '</small></li>'; }).join('') + '</ul>' : '') +
    sec('Projects', (S.projects || []).length ? '<ul class="tg">' + S.projects.map(function (e) { var a = split(e); return '<li>' + esc(a[0]) + '<small>' + esc(a[1]) + '</small></li>'; }).join('') + '</ul>' : '') +
    sec('Awards and achievements', (S.awards || []).length ? '<ul class="tg">' + S.awards.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' : '') +
    sec('Publications', ps.length ? '<ul class="tg">' + ps.slice(0, 8).map(function (x) { return '<li><a href="#" data-a="post" data-s="' + esc(x.slug) + '" style="text-decoration:underline">' + esc(x.title) + '</a>' + dm(x) + '<small>' + esc(label(x)) + ' · ' + fd(x.date) + '</small></li>'; }).join('') + '</ul>' : '') +
    sec('Beyond the law', chips(S.beyond)) + '</div>' + contactBlock() + '</main>';
}
function contact() { meta('Contact — ' + S.display, S.contactText); return hasContact() ? '<main id="main">' + contactBlock() + '</main>' : notFound(); }
function legal(k) { var t = k === 'privacy' ? 'Privacy' : 'Disclaimer'; meta(t + ' — ' + S.display, ''); return '<main id="main" class="wrap pad nar"><h1 style="margin-bottom:20px">' + t + '</h1><div class="prose">' + md(S[k]).html + '</div></main>'; }
function notFound() { meta('Page not found — ' + S.display, ''); return '<main id="main" class="wrap pad nar"><h1>This page could not be found</h1><p style="color:var(--mute)">It may have been unpublished or moved.</p><a class="btn" href="#" data-a="go" data-p="search">Browse all writing ' + AR + '</a></main>'; }

function archive(kind) {
  var T = { blog: ['Blogs', 'Thoughts, opinions and insights on contemporary legal issues.'], article: ['Articles', 'Case comments, commentary and explainers on law and policy.'], research: ['Research Papers', 'Academic work, with its publication status stated plainly.'], search: ['Search', 'Everything published on this site.'] }[kind];
  var base = pubs().filter(function (p) { return kind === 'search' || p.type === kind; }), all = [], yrs = [];
  base.forEach(function (p) { cats(p).forEach(function (c) { if (all.indexOf(c) < 0) all.push(c); }); var y = (p.date || '').slice(0, 4); if (y && yrs.indexOf(y) < 0) yrs.push(y); });
  all.sort(); yrs.sort().reverse(); meta(T[0] + ' — ' + S.display, T[1]);
  var sel = function (k, lbl, opts) { return '<select data-a="sel" data-k="' + k + '" aria-label="' + lbl + '">' + opts + '</select>'; };
  return '<main id="main" class="wrap"><div class="ah"><div><h1>' + T[0] + '</h1><p>' + T[1] + '</p></div><div class="sb"><label class="sr" for="q">Search ' + T[0].toLowerCase() + '</label><input id="q" type="search" placeholder="Search ' + (kind === 'search' ? 'writing' : T[0].toLowerCase()) + '…" value="' + esc(R.q || '') + '" autocomplete="off">' + SV(IC.se) + '</div></div>' +
    '<div class="fl" role="group" aria-label="Filters">' + (all.length ? '<button class="ch" data-a="f" data-k="cat" data-v="" aria-pressed="' + !R.cat + '">All</button>' + all.map(function (c) { return '<button class="ch" data-a="f" data-k="cat" data-v="' + esc(c) + '" aria-pressed="' + (R.cat === c) + '">' + esc(c) + '</button>'; }).join('') : '') +
    (kind === 'article' ? sel('at', 'Article type', '<option value="">All article types</option>' + AT.map(function (t) { return '<option' + (R.at === t ? ' selected' : '') + '>' + t + '</option>'; }).join('')) : '') +
    (kind === 'research' ? sel('st', 'Publication status', '<option value="">Any status</option>' + Object.keys(RS).map(function (k) { return '<option value="' + k + '"' + (R.st === k ? ' selected' : '') + '>' + RS[k] + '</option>'; }).join('')) : '') +
    ((kind === 'article' || kind === 'search') && yrs.length > 1 ? sel('yr', 'Year', '<option value="">Any year</option>' + yrs.map(function (y) { return '<option' + (R.yr === y ? ' selected' : '') + '>' + y + '</option>'; }).join('')) : '') +
    (kind === 'search' ? sel('ty', 'Type', '<option value="">All types</option>' + Object.keys(TL).map(function (k) { return '<option value="' + k + '"' + (R.ty === k ? ' selected' : '') + '>' + TL[k] + 's</option>'; }).join('')) : '') +
    '</div><div id="lst" aria-live="polite">' + listHTML(kind) + '</div></main>';
}
function listHTML(kind) {
  var a = pubs(); if (kind !== 'search') a = a.filter(function (p) { return p.type === kind; });
  var k = (R.q || '').toLowerCase().trim();
  if (k) a = a.filter(function (p) { return [p.title, p.excerpt, p.abstract, p.body, p.tags, p.keywords, p.categories].join(' ').toLowerCase().indexOf(k) > -1; });
  if (R.cat) a = a.filter(function (p) { return cats(p).indexOf(R.cat) > -1; });
  if (R.at) a = a.filter(function (p) { return p.subtype === R.at; });
  if (R.st) a = a.filter(function (p) { return (p.rstatus || 'unpublished') === R.st; });
  if (R.yr) a = a.filter(function (p) { return (p.date || '').slice(0, 4) === R.yr; });
  if (R.ty) a = a.filter(function (p) { return p.type === R.ty; });
  if (!a.length) { var f = k || R.cat || R.at || R.st || R.yr || R.ty; return '<div class="em"><h3>' + (f ? 'No matches' : 'Nothing published here yet') + '</h3><p>' + (f ? 'Try a different search or clear the filters.' : 'New writing will appear here as it is published.') + '</p></div>'; }
  var per = PER[kind] || 6, n = Math.ceil(a.length / per), pg = Math.min(R.pg || 1, n), items = a.slice((pg - 1) * per, pg * per);
  var body = kind === 'research' ? items.map(rcard).join('') : '<div class="g3">' + items.map(acard).join('') + '</div>';
  var pager = '';
  if (n > 1) { pager = '<nav class="pg" aria-label="Pagination">' + (pg > 1 ? '<button data-a="pg" data-n="' + (pg - 1) + '" aria-label="Previous page">←</button>' : ''); for (var i = 1; i <= n; i++) pager += '<button data-a="pg" data-n="' + i + '"' + (i === pg ? ' aria-current="page"' : '') + ' aria-label="Page ' + i + '">' + i + '</button>'; pager += (pg < n ? '<button data-a="pg" data-n="' + (pg + 1) + '" aria-label="Next page">→</button>' : '') + '</nav>'; } else pager = '<div style="height:50px"></div>';
  return '<p class="dm" style="margin:0 0 16px">' + a.length + (a.length === 1 ? ' result' : ' results') + '</p>' + body + pager;
}

function post() {
  var p = findPost(R.slug);
  if (!p || p.status !== 'published') return notFound();
  var m = md(p.body), rel = pubs().filter(function (x) { return x.slug !== p.slug && (x.type === p.type || cats(x).some(function (c) { return cats(p).indexOf(c) > -1; })); }).slice(0, 3);
  var rs = p.rstatus || 'unpublished', refs = lines(p.references), link = safe(p.link), base = String(S.url || '').replace(/\/$/, ''), url = (base || location.href.split('#')[0]) + '#p-' + p.slug;
  var back = p.type === 'research' ? 'Research Papers' : TL[p.type] + 's';
  meta((p.seoTitle || p.title) + ' — ' + S.display, p.seoDesc || p.excerpt || p.abstract, { '@context': 'https://schema.org', '@type': p.type === 'blog' ? 'BlogPosting' : 'Article', headline: p.title, datePublished: p.date, author: { '@type': 'Person', name: p.author || S.name }, description: p.excerpt || p.abstract });
  return '<main id="main" class="wrap"><nav class="cr" aria-label="Breadcrumb"><a href="#" data-a="go" data-p="home">Home</a>›<a href="#" data-a="go" data-p="' + p.type + '">' + back + '</a>›<span aria-current="page">' + esc(p.title) + '</span></nav>' +
    '<article class="art"><div class="mt">' + esc(label(p)) + (cats(p)[0] ? ' · ' + esc(cats(p)[0]) : '') + dm(p) + '</div><h1>' + esc(p.title) + '</h1><div class="by"><span>By ' + esc(p.author || S.name) + '</span><span>' + fd(p.date) + '</span><span>' + mins(p) + ' min read</span></div>' +
    (p.cover ? '<figure class="ac" style="margin-left:0;margin-right:0">' + cover(p) + '</figure>' : '') +
    (p.abstract ? '<div class="bx"><h2>' + (p.type === 'research' ? 'Abstract' : 'Introduction') + '</h2><div>' + esc(p.abstract) + '</div></div>' : '') +
    (p.type === 'research' ? '<dl class="rs"><dt>Status</dt><dd><span class="pill ' + (rs === 'published' ? '' : 'w') + '">' + RS[rs] + '</span></dd>' + (p.journal ? '<dt>Journal or venue</dt><dd>' + esc(p.journal) + '</dd>' : '') + (p.doi ? '<dt>DOI</dt><dd><a href="https://doi.org/' + esc(p.doi) + '" target="_blank" rel="noopener" style="text-decoration:underline">' + esc(p.doi) + '</a></dd>' : '') + (p.coauthors ? '<dt>Co-authors</dt><dd>' + esc(p.coauthors) + '</dd>' : '') + (csv(p.keywords).length ? '<dt>Keywords</dt><dd>' + esc(csv(p.keywords).join(', ')) + '</dd>' : '') + '</dl>' : '') +
    ((p.pdf || link) ? '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:26px">' + (p.pdf ? '<a class="btn g" href="' + esc(p.pdf) + '" target="_blank" rel="noopener">Open PDF</a>' : '') + (link ? '<a class="btn o" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">Original publication ' + AR + '</a>' : '') + '</div>' : '') +
    (m.hs.length >= 3 ? '<nav class="toc" aria-label="Table of contents"><h2>Contents</h2>' + m.hs.map(function (h) { return '<a href="#" data-a="skipto" data-t="' + h[0] + '">' + esc(h[1]) + '</a>'; }).join('') + '</nav>' : '') +
    '<div class="prose">' + (m.html || '<p style="color:var(--mute)">This post has no body text yet.</p>') + '</div>' +
    (refs.length ? '<section class="refs"><h2>References</h2><ol>' + refs.map(function (r) { return '<li>' + inl(r) + '</li>'; }).join('') + '</ol></section>' : '') +
    '<div class="sh2"><b>Share</b><button class="btn o s" data-a="copy" data-u="' + esc(url) + '">Copy link</button><a class="btn o s" href="mailto:?subject=' + encodeURIComponent(p.title) + '&body=' + encodeURIComponent(url) + '">Email</a><a class="btn o s" href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>' +
    '<a class="more" href="#" data-a="go" data-p="' + p.type + '">← Back to ' + back + '</a></article>' +
    (rel.length ? '<section class="sec" style="border-top:1px solid var(--edge)"><div class="sh"><h2>Related reading</h2><i></i></div><div class="g3">' + rel.map(acard).join('') + '</div></section>' : '') + '</main>';
}

function toast(m) { var t = $('toast'); t.textContent = m; t.style.display = 'block'; clearTimeout(toast.t); toast.t = setTimeout(function () { t.style.display = 'none'; }, 3000); }
var kindOf = function () { return R.p === 'search' ? 'search' : R.p; };
function render() {
  var pages = { home: home, about: about, contact: contact, research: function () { return archive('research'); }, article: function () { return archive('article'); }, blog: function () { return archive('blog'); }, search: function () { return archive('search'); }, privacy: function () { return legal('privacy'); }, disclaimer: function () { return legal('disclaimer'); }, post: post };
  $('app').innerHTML = nav() + (pages[R.p] || home)() + foot();
  var q = $('q'); if (q) q.oninput = function (e) { R.q = e.target.value; R.pg = 1; $('lst').innerHTML = listHTML(kindOf()); };
  var cf = $('cf'); if (cf) cf.onsubmit = sendContact;
}
function sendContact(e) {
  e.preventDefault(); var n = $('c1').value.trim(), m = $('c2').value.trim(), b = $('c3').value.trim(), ok = true;
  var er = function (i, t) { $('e' + i).textContent = t; if (t) ok = false; };
  er(1, n ? '' : 'Please enter your name.'); er(2, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m) ? '' : 'Please enter a valid email address.'); er(3, b.length >= 10 ? '' : 'Please write a message of at least 10 characters.');
  if (!ok) { $('cs').innerHTML = ''; return; }
  if ($('c4').value) return; // honeypot
  var done = function (html) { $('cs').innerHTML = '<div class="ok">' + html + '</div>'; };
  if (S.formEndpoint) {
    fetch(S.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name: n, email: m, message: b }) })
      .then(function (r) { if (!r.ok) throw 0; done('Thank you, ' + esc(n) + '. Your message has been sent.'); e.target.reset(); })
      .catch(function () { $('cs').innerHTML = '<div class="er" role="alert" style="margin-top:12px">Sorry, your message could not be sent. Please email <a href="mailto:' + esc(S.email) + '" style="text-decoration:underline">' + esc(S.email) + '</a> instead.</div>'; });
    return;
  }
  var a = document.createElement('a'); a.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Message from ' + n) + '&body=' + encodeURIComponent(b + '\n\n— ' + n + ' (' + m + ')'); a.click();
  done('Thank you, ' + esc(n) + '. Your email app should open with the message ready to send. If nothing opens, write to <a href="mailto:' + esc(S.email) + '" style="text-decoration:underline">' + esc(S.email) + '</a>.');
}
document.addEventListener('click', function (e) {
  var a = e.target.closest('[data-a]'); if (!a) return; var k = a.dataset.a, d = a.dataset;
  if (a.tagName === 'A') e.preventDefault();
  if (k === 'go') go({ p: d.p });
  else if (k === 'post') go({ p: 'post', slug: d.s });
  else if (k === 'skip') { var mm = $('main'); if (mm) { mm.setAttribute('tabindex', '-1'); mm.focus(); } }
  else if (k === 'skipto') { var t = $(d.t); if (t) t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' }); }
  else if (k === 'menu') { var n = $('nl'), o = n.classList.toggle('open'); a.setAttribute('aria-expanded', o); }
  else if (k === 'cat') go({ p: 'search', cat: d.c });
  else if (k === 'f') { R[d.k] = d.v || ''; R.pg = 1; render(); }
  else if (k === 'pg') { R.pg = +d.n; $('lst').innerHTML = listHTML(kindOf()); $('lst').scrollIntoView({ block: 'start' }); }
  else if (k === 'copy') { (navigator.clipboard ? navigator.clipboard.writeText(d.u) : Promise.reject()).then(function () { toast('Link copied'); }, function () { toast(d.u); }); }
});
document.addEventListener('change', function (e) { var t = e.target; if (t.dataset && t.dataset.a === 'sel') { R[t.dataset.k] = t.value; R.pg = 1; render(); } });
render();
})();
