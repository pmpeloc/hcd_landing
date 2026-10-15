// Client behavior of the landing: language switch, menu, consent demo, counters and motion.
// Ported as-is from the approved Astra build; it works on the server-rendered markup.
import { dictionary } from './landing-dictionary';

let started = false;

export function initLanding() {
  if (started) return;
  started = true;
    const $ = (s, root=document) => root.querySelector(s);
   const $$ = (s, root=document) => [...root.querySelectorAll(s)];
   const reduce = matchMedia('(prefers-reduced-motion: reduce)');
   const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
   const mobile = matchMedia('(max-width: 760px)');
   const menuButton = $('.menu-toggle'), menu = $('#mobile-menu');
   let language='en', consentState='', consentDuration='24', disputed=false;
   let storedLanguage; try { storedLanguage=localStorage.getItem('salua-language'); } catch {}
   language = ['en','es'].includes(storedLanguage) ? storedLanguage : 'en';
   const text = (key, vars={}) => Object.entries(vars).reduce((s,[k,v]) => s.replaceAll('{'+k+'}',v),dictionary[language][key] ?? key);
   const durationText = value => text(value==='168'?'week':value==='1'?'hour':'day');
   function formatCounter(el,value) {
     return new Intl.NumberFormat(language==='es'?'es-AR':'en-US',el.dataset.cost ? {minimumFractionDigits:6,maximumFractionDigits:6} : {maximumFractionDigits:0}).format(value)+(el.dataset.cost?' SOL':'');
   }
   function updateConsent() {
     const value=$('input[name="duration"]:checked').value;
     $('#approve-label').textContent=text('approve',{duration:durationText(value)});
     $('#consent-status').textContent=consentState ? text(consentState,{duration:durationText(consentDuration)}) : '';
     $('#reset-consent').hidden=!consentState;
     $('#dispute-status').textContent=disputed?text('disputed'):'';
   }
   function applyLanguage(next, persist=true) {
     if(!dictionary[next]) return;
     language=next;document.documentElement.lang=next;
     $$('[data-i18n]').forEach(el=>{el.textContent=text(el.dataset.i18n);el.removeAttribute('aria-label');});
     $$('[data-i18n-alt]').forEach(el=>el.alt=text(el.dataset.i18nAlt));
     $$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',text(el.dataset.i18nAria)));
     $$('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===next)));
     document.title=text('pageTitle');$('meta[name="description"]').content=text('pageDescription');
     $$('.counter').forEach(el=>el.textContent=formatCounter(el,Number(el.dataset.target)));
     menuButton.setAttribute('aria-label',text(menu.hidden?'menu':'menuClose'));
     updateConsent();
     if(persist) try{localStorage.setItem('salua-language',next);}catch {}
   }
   $$('[data-lang]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.lang)));
   $$('input[name="duration"]').forEach(input=>input.addEventListener('change',()=>{consentState='';updateConsent();}));
   $('#approve').addEventListener('click',()=>{consentState='approved';consentDuration=$('input[name="duration"]:checked').value;updateConsent();});
   $('#decline').addEventListener('click',()=>{consentState='declined';updateConsent();});
   $('#reset-consent').addEventListener('click',()=>{consentState='';updateConsent();$('#approve').focus();});
   $('#dispute').addEventListener('click',()=>{disputed=true;updateConsent();});
   function setMenu(open, returnFocus=false){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',text(open?'menuClose':'menu'));if(returnFocus)menuButton.focus();}
   menuButton.addEventListener('click',()=>setMenu(menu.hidden));
   $$('a',menu).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)setMenu(false,true);});
   document.addEventListener('click',e=>{if(!menu.hidden&&!$('.header').contains(e.target))setMenu(false);});
   mobile.addEventListener('change',()=>{if(!mobile.matches)setMenu(false);resizeCanvas();queueScroll();});
   applyLanguage(language,false);
   // Split into words so letter reveals never create accidental mid-word line breaks.
   function revealHeadline(){
     if(reduce.matches)return;
     let i=0;const letterCount=$$('.headline-reveal').reduce((n,el)=>n+el.textContent.replace(/\s/g,'').length,0);
     $$('.headline-reveal').forEach(el=>{
       const content=el.textContent;el.setAttribute('aria-label',content);el.textContent='';
       content.split(/(\s+)/).forEach(word=>{
         if(/^\s+$/.test(word)){el.append(document.createTextNode(word));return;}
         const wrapper=document.createElement('span');wrapper.className='word';wrapper.setAttribute('aria-hidden','true');
         [...word].forEach(char=>{const span=document.createElement('span');span.className='letter';span.style.setProperty('--delay',String(i++*850/Math.max(1,letterCount-1))+'ms');span.textContent=char;wrapper.append(span);});el.append(wrapper);
       });
     });
   }
   revealHeadline();
   const hasIO='IntersectionObserver' in window;
   if(hasIO&&!reduce.matches)document.documentElement.classList.add('js-motion');
   const revealObserver=hasIO?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08}):null;
   $$('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%3)*.1+'s';if(revealObserver)revealObserver.observe(el);else el.classList.add('is-visible');});
   const motionObserver=hasIO?new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting)),{rootMargin:'40px'}):null;
   $$('[data-motion]').forEach(el=>motionObserver?motionObserver.observe(el):el.classList.add('in-view'));
   let countersStarted=false,counterFrame=0;
   function animateCounters(){
     if(countersStarted)return;countersStarted=true;
     if(reduce.matches)return;
     const start=performance.now(), duration=mobile.matches?1000:1600;
     function tick(now){
       const p=Math.min(1,(now-start)/duration), eased=1-Math.pow(1-p,3);
       $$('.counter').forEach(el=>el.textContent=formatCounter(el,Number(el.dataset.target)*(reduce.matches?1:eased)));
       if(p<1&&!reduce.matches)counterFrame=requestAnimationFrame(tick);
     }
     counterFrame=requestAnimationFrame(tick);
   }
   if(hasIO){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){animateCounters();observer.disconnect();}},{threshold:.2});observer.observe($('.stats'));}else animateCounters();
   // Motion uses transforms only; no scroll interception or pinned mobile sections.
   let scrollQueued=false;
   function updateScroll(){
     scrollQueued=false;
     const max=document.documentElement.scrollHeight-innerHeight;
     $('#scroll-progress').style.transform='scaleX('+(reduce.matches?0:Math.max(0,Math.min(1,scrollY/(max||1))))+')';
     const problem=$('.problem').getBoundingClientRect();
     const p=Math.max(0,Math.min(1,(innerHeight-problem.top)/(innerHeight+problem.height)));
     $$('.capsule').forEach(el=>el.style.setProperty('--drift',(reduce.matches?0:Number(el.dataset.drift)*p*(mobile.matches?12:24))+'px'));
     const g=$('.guarantees').getBoundingClientRect();
     const arc=reduce.matches?1:Math.max(0,Math.min(1,(innerHeight-g.top)/(innerHeight*.7)));
     $('.horizon').style.setProperty('--arc-progress',String(1-arc));
   }
   function queueScroll(){if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}}
   addEventListener('scroll',queueScroll,{passive:true});addEventListener('resize',queueScroll,{passive:true});addEventListener('load',queueScroll);queueScroll();
   // Desktop-only pointer tilt with time-based exponential smoothing.
   const tilt=$('#hero-tilt'), hero=$('.hero-art');
   let tx=0,ty=0,cx=0,cy=0,tiltFrame=0,tiltLast=0;
   function pointerAllowed(){return finePointer.matches&&!mobile.matches&&!reduce.matches;}
   function runTilt(now){
     tiltFrame=0;if(!pointerAllowed()){tilt.style.transform='';return;}
     const dt=Math.min(64,now-(tiltLast||now-16));tiltLast=now;const ease=1-Math.exp(-dt/160);
     cx+=(tx-cx)*ease;cy+=(ty-cy)*ease;
     tilt.style.transform=`perspective(1000px) rotateX(${cx.toFixed(3)}deg) rotateY(${cy.toFixed(3)}deg)`;
     if(Math.abs(cx-tx)+Math.abs(cy-ty)>.025)tiltFrame=requestAnimationFrame(runTilt);
   }
   function startTilt(){if(!tiltFrame){tiltLast=0;tiltFrame=requestAnimationFrame(runTilt);}}
   hero.addEventListener('pointermove',e=>{if(!pointerAllowed()||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();tx=-((e.clientY-r.top)/r.height-.5)*8;ty=((e.clientX-r.left)/r.width-.5)*12;startTilt();});
   hero.addEventListener('pointerleave',()=>{tx=ty=0;startTilt();});
   finePointer.addEventListener('change',()=>{if(!pointerAllowed())tilt.style.transform='';});
   // Canvas is decorative data visualization; accessible description and visible sample log accompany it.
   const canvas=$('#access-matrix'), ctx=canvas.getContext('2d');
   let canvasWidth=600,canvasHeight=290,canvasVisible=!hasIO,canvasFrame=0,lastPaint=0;
   function resizeCanvas(){
     const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
     canvasWidth=r.width||600;canvasHeight=r.height||290;
     canvas.width=Math.round(canvasWidth*dpr);canvas.height=Math.round(canvasHeight*dpr);
     if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);drawMatrix(0);
   }
   function drawMatrix(time){
     if(!ctx)return;
     ctx.clearRect(0,0,canvasWidth,canvasHeight);
     const cols=mobile.matches?24:29,rows=mobile.matches?8:13,pad=7;
     const dx=(canvasWidth-2*pad)/(cols-1),dy=(canvasHeight-2*pad)/(rows-1);
     const phase=reduce.matches?0:time/(mobile.matches?5000:4000)*Math.PI*2;
     for(let x=0;x<cols;x++)for(let y=0;y<rows;y++){
       const wave=(Math.sin(x*.47+phase)+Math.cos(y*.55-phase*.7)+2)/4;
       const bright=wave>.62;ctx.fillStyle=bright?'rgba(1,98,215,'+(.35+wave*.65)+')':'rgba(156,194,247,'+(.22+wave*.52)+')';
       ctx.beginPath();ctx.arc(pad+x*dx,pad+y*dy,Math.max(1.4,Math.min(dx,dy)*(.13+wave*.1)),0,Math.PI*2);ctx.fill();
     }
   }
   function loopMatrix(now){canvasFrame=0;if(!canvasVisible||reduce.matches||document.hidden)return;if(now-lastPaint>=(mobile.matches?50:33)){drawMatrix(now);lastPaint=now;}canvasFrame=requestAnimationFrame(loopMatrix);}
   function syncMatrix(){if(canvasFrame)cancelAnimationFrame(canvasFrame);canvasFrame=0;if(!reduce.matches&&canvasVisible&&!document.hidden&&ctx)canvasFrame=requestAnimationFrame(loopMatrix);else drawMatrix(0);}
   if('ResizeObserver' in window)new ResizeObserver(resizeCanvas).observe(canvas);else addEventListener('resize',resizeCanvas);
   if(hasIO)new IntersectionObserver(entries=>{canvasVisible=entries[0].isIntersecting;syncMatrix();},{threshold:.05}).observe(canvas);
   resizeCanvas();syncMatrix();
   document.addEventListener('visibilitychange',()=>{document.documentElement.classList.toggle('page-hidden',document.hidden);syncMatrix();});
   reduce.addEventListener('change',()=>{
     document.documentElement.classList.toggle('js-motion',!reduce.matches&&hasIO);
     if(reduce.matches){cancelAnimationFrame(counterFrame);cancelAnimationFrame(tiltFrame);tiltFrame=0;tilt.style.transform='';$$('.counter').forEach(el=>el.textContent=formatCounter(el,Number(el.dataset.target)));$$('.reveal').forEach(el=>el.classList.add('is-visible'));}
     syncMatrix();queueScroll();
   });
}
