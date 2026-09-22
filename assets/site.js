window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
gtag('config','G-S6RZV417H1');
const analyticsScript=document.createElement('script');
analyticsScript.async=true;
analyticsScript.src='https://www.googletagmanager.com/gtag/js?id=G-S6RZV417H1';
document.head.appendChild(analyticsScript);

document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link)return;
  const href=link.getAttribute('href');
  let eventName='link_click';
  if(href.startsWith('tel:'))eventName='phone_call_click';
  else if(href.startsWith('sms:'))eventName='text_message_click';
  else if(href.includes('g.page')||href.includes('share.google'))eventName='google_business_click';
  gtag('event',eventName,{link_url:link.href,link_text:link.textContent.trim()});
});

const menu=document.querySelector('.menu');const nav=document.querySelector('#nav');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));document.querySelector('#year').textContent=new Date().getFullYear();

const tierButtons=document.querySelectorAll('.size-picker button');
const selectedTier=document.querySelector('#selectedTier');
const selectedPrice=document.querySelector('#selectedPrice');
const selectedDetail=document.querySelector('#selectedDetail');
const loadFill=document.querySelector('#loadFill');
const priceText=document.querySelector('#priceText');
const itemExamples=document.querySelector('#itemExamples');
const topTier=document.querySelector('#topTier');
const topPrice=document.querySelector('#topPrice');
const topDetail=document.querySelector('#topDetail');
tierButtons.forEach(button=>button.addEventListener('click',()=>{
  tierButtons.forEach(item=>{
    item.classList.remove('active');
    item.setAttribute('aria-pressed','false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed','true');
  const tier=button.dataset.tier;
  const price=button.dataset.price;
  selectedTier.textContent=tier;
  selectedPrice.textContent=`$${price}`;
  selectedDetail.textContent=button.dataset.detail;
  topTier.textContent=tier.toUpperCase();
  topPrice.textContent=`$${price}`;
  topDetail.textContent=button.dataset.detail.toUpperCase();
  loadFill.style.width=`${button.dataset.fill}%`;
  itemExamples.replaceChildren(...button.dataset.items.split('|').map(item=>{
    const [icon,...words]=item.split(' ');
    const example=document.createElement('span');
    example.append(icon+' ');
    const label=document.createElement('small');
    label.textContent=words.join(' ');
    example.append(label);
    return example;
  }));
  const message=`Hi Jay, I'm interested in the ${tier} option starting at $${price}. I'll send photos for a quote.`;
  priceText.href=`sms:+15708467988?body=${encodeURIComponent(message)}`;
}));

document.querySelectorAll('[data-service-card]').forEach(card=>{
  const front=card.querySelector('.service-front');
  const back=card.querySelector('.service-back');
  const close=card.querySelector('.service-close');
  const slides=[...card.querySelectorAll('.job-slides img')];
  const count=card.querySelector('.job-count');
  const stage=card.querySelector('.job-stage');
  let current=0;
  const showSlide=index=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
    count.textContent=`${current+1} / ${slides.length}`;
    stage.textContent=slides[current].dataset.stage;
  };
  const setFlipped=flipped=>{
    card.classList.toggle('is-flipped',flipped);
    front.setAttribute('aria-expanded',String(flipped));
    back.setAttribute('aria-hidden',String(!flipped));
    if(flipped)setTimeout(()=>close.focus(),350);
    else front.focus();
  };
  front.addEventListener('click',()=>setFlipped(true));
  close.addEventListener('click',()=>setFlipped(false));
  card.querySelector('.job-prev').addEventListener('click',()=>showSlide(current-1));
  card.querySelector('.job-next').addEventListener('click',()=>showSlide(current+1));
  card.addEventListener('keydown',event=>{if(event.key==='Escape'&&card.classList.contains('is-flipped'))setFlipped(false)});
});
