/* Casebook shell: reading progress, chapter rail, home interactions. No dependencies. */
(function(){
  var bar=document.querySelector('.progress i');
  function prog(){if(!bar)return;var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;bar.style.width=(max>0?Math.min(100,h.scrollTop/max*100):0)+'%';}
  addEventListener('scroll',prog,{passive:true});prog();

  /* chapter rail: highlight the chapter in view */
  var links=[].slice.call(document.querySelectorAll('.rail a[href^="#ch-"]'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;links.forEach(function(l){l.removeAttribute('aria-current');});var a=map[e.target.id];if(a){a.setAttribute('aria-current','true');var ol=a.closest('ol');if(ol&&ol.scrollWidth>ol.clientWidth){ol.scrollTo({left:a.parentElement.offsetLeft-16,behavior:'smooth'});}}});},{rootMargin:'-30% 0px -60% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s);});
  }

  /* generic tabs: [data-tabs] > [role=tab][data-t] controls [data-p] panes */
  [].forEach.call(document.querySelectorAll('[data-tabs]'),function(box){
    var tabs=[].slice.call(box.querySelectorAll('[role=tab]'));
    var panes=[].slice.call(box.querySelectorAll('[data-p]'));
    function show(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;});panes.forEach(function(p){p.hidden=p.dataset.p!==t.dataset.t;});}
    tabs.forEach(function(t,i){t.addEventListener('click',function(){show(t);});t.addEventListener('keydown',function(e){var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!k)return;e.preventDefault();var n=tabs[(i+k+tabs.length)%tabs.length];n.focus();show(n);});});
  });

  /* FAQ: search + topic filter */
  var faq=document.querySelector('.faq');
  if(faq){
    var q=faq.querySelector('.faq-q'),items=[].slice.call(faq.querySelectorAll('.faq-i')),btns=[].slice.call(faq.querySelectorAll('.faq-f button')),cnt=faq.querySelector('.faq-n'),empty=faq.querySelector('.faq-empty'),topic='all';
    function run(){var t=(q.value||'').trim().toLowerCase(),n=0;items.forEach(function(it){var ok=(topic==='all'||it.dataset.topic===topic)&&(!t||it.textContent.toLowerCase().indexOf(t)>-1);it.hidden=!ok;if(ok)n++;});cnt.textContent=n;empty.hidden=n>0;}
    q.addEventListener('input',run);
    btns.forEach(function(b){b.addEventListener('click',function(){topic=b.dataset.f;btns.forEach(function(x){x.setAttribute('aria-pressed',x===b);});run();});});
    run();
  }
})();
(function(){
  /* before/after board filter */
  var bb=document.querySelector('.ba-board');
  if(bb){var bs=[].slice.call(bb.querySelectorAll('.ba-f button')),rs=[].slice.call(bb.querySelectorAll('.ba-row'));
    function f(k){bs.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===k);});rs.forEach(function(r){r.hidden=!(k==='all'||r.dataset.cat===k);});}
    bs.forEach(function(b){b.addEventListener('click',function(){f(b.dataset.f);});});f('paid');}
  /* customer-view tabs on the home page */
  [].forEach.call(document.querySelectorAll('.cv-home'),function(cv){var bs=[].slice.call(cv.querySelectorAll('.cv-tabs button'));
    function show(b){bs.forEach(function(x){x.setAttribute('aria-selected',x===b);});[].forEach.call(cv.querySelectorAll('.cv-pane,.cv-more'),function(p){p.hidden=p.dataset.i!==b.dataset.i;});}
    bs.forEach(function(b){b.addEventListener('click',function(){show(b);});});if(bs[0])show(bs[0]);});
})();
