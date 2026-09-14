const WHATSAPP_NUMBER = '972552956401'; // מספר וואטסאפ בפורמט בינלאומי, בלי + או מקפים.
const products = [
  {id:'classic',name:'אשכנזי קלאסי',description:'החולצה הראשונה. לבנה, נקייה, בלתי נשכחת.',art:'',base:70,old:80}
];
const letterSizes = ['XS','S','M','L','XL','XXXL'];
const numberSizes = Array.from({length:47}, (_,i)=>String(i+1));
let cart = JSON.parse(localStorage.getItem('ashkenazi-cart') || '[]');
let reviews = JSON.parse(localStorage.getItem('ashkenazi-reviews') || '[]');
let coupon = {active:false, value:0};
let pendingOrder = JSON.parse(localStorage.getItem('ashkenazi-last-order') || 'null');

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const money = value => `${value.toFixed(0)} ש״ח`;
function productById(id){ return products.find(product => product.id === id); }
function unitPrice(item){ return item.backPrint ? 90 : 70; }
function cartQuantity(){ return cart.reduce((sum,item)=>sum + item.quantity,0); }
function pricing(){
  const quantity = cartQuantity();
  const promo = quantity >= 3;
  const subtotal = cart.reduce((sum,item)=>sum + unitPrice(item) * item.quantity, 0);
  const promoDiscount = promo ? subtotal - (60 * quantity) : 0;
  const couponDiscount = !promo && coupon.active ? 10 : 0;
  const delivery = cart.length && $('#delivery-method')?.value === 'delivery' ? 5 : 0;
  return {quantity,subtotal,promoDiscount,couponDiscount,delivery,total:subtotal-promoDiscount-couponDiscount+delivery,promo};
}
function teeMarkup(art=''){ return `<div class="tee-shape ${art}"></div>`; }
function renderProducts(){
  const productCards = products.map((product,index)=>`<article class="product-card"><div class="product-visual">${teeMarkup(product.art)}<span class="product-index">0${index+1} / 01</span><span class="product-color">WHITE ONLY</span></div><div class="product-info"><div class="product-title-row"><div><div class="product-title">${product.name}</div><div class="product-description">${product.description}</div></div></div><div class="price-row"><div class="price"><span class="old-price">${money(product.old)}</span>${money(product.base)}</div><button class="add-button" data-product="${product.id}" type="button">בחירה +</button></div></div></article>`).join('');
  $('#product-grid').innerHTML = `${productCards}<article class="product-card coming-product"><div class="product-visual"><div class="construction-site" aria-label="אתר בנייה מאויר עם שני מנופים"><div class="skyline"><i class="building building-a"><b></b><b></b><b></b></i><i class="building building-b"><b></b><b></b><b></b><b></b></i><i class="building building-c"><b></b><b></b></i></div><div class="crane crane-one"><span class="crane-mast"></span><span class="crane-cabin"></span><span class="crane-arm"></span><span class="crane-counterweight"></span><span class="crane-cable"></span><span class="crane-hook">⌄</span><span class="crane-load"><i></i><i></i><i></i></span></div><div class="crane crane-two"><span class="crane-mast"></span><span class="crane-cabin"></span><span class="crane-arm"></span><span class="crane-counterweight"></span><span class="crane-cable"></span><span class="crane-hook">⌄</span><span class="crane-load"><i></i><i></i><i></i></span></div><div class="construction-ground"></div></div><div class="coming-copy"><strong>בקרוב תצא<br>חולצה חדשה</strong><small>האתר בבנייה</small></div><span class="product-index">02 / 02</span><span class="product-color">COMING SOON</span></div><div class="product-info"><div class="product-title">חולצה נוספת</div><div class="product-description">אנחנו עובדים עליה. היא תגיע בקרוב.</div><div class="price-row"><span class="coming-label">בקרוב</span><span class="coming-dash">—</span></div></div></article>`;
  $$('.add-button').forEach(button=>button.addEventListener('click',()=>openProduct(productById(button.dataset.product))));
}
function openProduct(product){
  const sizes = [...letterSizes,...numberSizes];
  $('#product-modal-content').innerHTML = `<div class="product-modal-layout"><div class="modal-visual">${teeMarkup(product.art)}</div><div><p class="eyebrow">CUSTOMIZE YOUR TEE</p><h2>${product.name}</h2><p class="muted">${product.description}</p><label class="choice-label">מידה</label><div class="choice-group" id="size-choice">${sizes.map(size=>`<button class="choice" data-size="${size}" type="button">${size}</button>`).join('')}</div><label class="print-option"><input type="checkbox" id="back-print"> הדפסה על הגב <strong>+20 ש״ח</strong></label><div class="modal-price" id="modal-price"><span class="old-price">80 ש״ח</span> 70 ש״ח <small>מחיר ליחידה</small></div><button class="button button-dark" id="add-to-cart" type="button">הוספה לסל <span>←</span></button></div></div>`;
  $('#product-modal').classList.add('is-open'); $('#product-modal').setAttribute('aria-hidden','false');
  let selectedSize = null;
  $$('#size-choice .choice').forEach(btn=>btn.addEventListener('click',()=>{$$('#size-choice .choice').forEach(other=>other.classList.remove('is-selected'));btn.classList.add('is-selected');selectedSize=btn.dataset.size;}));
  $('#back-print').addEventListener('change',event=>{$('#modal-price').innerHTML = event.target.checked ? '<span class="old-price">100 ש״ח</span> 90 ש״ח <small>עם הדפסה בגב</small>' : '<span class="old-price">80 ש״ח</span> 70 ש״ח <small>מחיר ליחידה</small>';});
  $('#add-to-cart').addEventListener('click',()=>{if(!selectedSize){alert('בחרו מידה כדי להמשיך.');return;} addToCart({productId:product.id,size:selectedSize,backPrint:$('#back-print').checked,quantity:1}); closeModal('#product-modal'); openCart();});
}
function addToCart(newItem){
  const existing = cart.find(item=>item.productId===newItem.productId&&item.size===newItem.size&&item.backPrint===newItem.backPrint);
  if(existing) existing.quantity += newItem.quantity; else cart.push(newItem);
  saveCart(); renderCart();
}
function saveCart(){localStorage.setItem('ashkenazi-cart',JSON.stringify(cart));}
function renderCart(){
  $('#cart-count').textContent = cartQuantity();
  if(!cart.length){$('#cart-items').innerHTML='<div class="empty-cart">הסל מחכה לחולצה הראשונה שלך.</div>';$('#order-summary').innerHTML='';return;}
  $('#cart-items').innerHTML = cart.map((item,index)=>{const product=productById(item.productId);return `<div class="cart-line"><div class="cart-thumb">${teeMarkup(product.art)}</div><div class="cart-line-info"><div class="cart-line-title">${product.name}</div><div class="cart-line-meta">מידה ${item.size} · ${item.backPrint?'הדפסה בגב':'הדפסה קדמית'}</div><div class="cart-line-controls"><div class="quantity-controls"><button data-qty="minus" data-index="${index}" type="button">−</button><b>${item.quantity}</b><button data-qty="plus" data-index="${index}" type="button">+</button></div><span>${money(unitPrice(item)*item.quantity)}</span></div><button class="remove-line" data-remove="${index}" type="button">הסרה</button></div></div>`}).join('');
  $$('.quantity-controls button').forEach(button=>button.addEventListener('click',()=>{const item=cart[Number(button.dataset.index)];item.quantity += button.dataset.qty==='plus'?1:-1;if(item.quantity<=0) cart.splice(Number(button.dataset.index),1);saveCart();renderCart();}));
  $$('.remove-line').forEach(button=>button.addEventListener('click',()=>{cart.splice(Number(button.dataset.remove),1);saveCart();renderCart();}));
  $('#order-summary').innerHTML = `<div class="summary-row"><span>סכום ביניים</span><b>${money(pricing().subtotal)}</b></div><div class="summary-row"><span>הנחת מבצע</span><b>${pricing().promoDiscount?'-'+money(pricing().promoDiscount):'—'}</b></div><div class="summary-row"><span>קופון</span><b>${pricing().couponDiscount?'-'+money(pricing().couponDiscount):'—'}</b></div><div class="summary-row"><label for="delivery-method">קבלת הזמנה</label><select id="delivery-method"><option value="pickup">איסוף עצמי — ללא תוספת</option><option value="delivery">משלוח — +5 ש״ח</option></select></div><div class="summary-row total"><span>סה״כ</span><b id="total-price">${money(pricing().total)}</b></div>`;
  $('#delivery-method').addEventListener('change',()=>{ $('#total-price').textContent=money(pricing().total); });
}
function openCart(){ $('#cart-drawer').classList.add('is-open');$('#cart-drawer').setAttribute('aria-hidden','false');renderCart(); }
function closeCart(){ $('#cart-drawer').classList.remove('is-open');$('#cart-drawer').setAttribute('aria-hidden','true'); }
function closeModal(selector){const modal=$(selector);modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');}
function applyCoupon(){
  const code=$('#coupon').value.trim(); const message=$('#coupon-message');
  if(pricing().promo){coupon={active:false,value:0};message.textContent='הקופון לא מצטבר עם מבצע 3 חולצות ומעלה.';message.style.color='#a33';renderCart();return;}
  if(code==='2323'){coupon={active:true,value:10};document.body.classList.add('gold-mode','shake');message.textContent='הקוד הסודי הופעל — 10 ש״ח הנחה. הזהב נפתח ✦';message.style.color='#8a6111';makeConfetti();setTimeout(()=>document.body.classList.remove('shake'),650);renderCart();}
  else{coupon={active:false,value:0};message.textContent='הקוד הזה לא עובד כאן.';message.style.color='#a33';renderCart();}
}
function makeConfetti(){const layer=$('#confetti-layer');const colors=['#e8ff3b','#e9b83f','#11110f','#fffefa'];for(let i=0;i<55;i++){const piece=document.createElement('i');piece.className='confetti-piece';piece.style.left=`${Math.random()*100}%`;piece.style.background=colors[i%colors.length];piece.style.setProperty('--drift',`${(Math.random()-.5)*260}px`);piece.style.animationDelay=`${Math.random()*.6}s`;layer.appendChild(piece);setTimeout(()=>piece.remove(),3500);}}
function orderMessage(){const summary=pricing();const lines=cart.map(item=>{const p=productById(item.productId);return `• ${p.name} | מידה ${item.size} | ${item.backPrint?'הדפסה בגב':'ללא הדפסה בגב'} | כמות: ${item.quantity}`;}).join('%0A');const delivery=$('#delivery-method')?.value==='delivery'?'משלוח (+5 ש״ח)':'איסוף עצמי';const discountLine=summary.couponDiscount?'%0Aקוד הנחה הופעל':' ';const customerName=encodeURIComponent($('#customer-name').value.trim());return `היי אשכנזי! אני רוצה להזמין:%0A${lines}%0A%0Aשם מלא: ${customerName}%0Aקבלת הזמנה: ${delivery}${discountLine}%0Aסה״כ: ${money(summary.total)}%0A%0Aטלפון:%0Aכתובת / זמן איסוף:`;}
function checkout(){if(!cart.length){alert('הסל ריק — הוסיפו חולצה כדי לשלוח הזמנה.');return;}const customerName=$('#customer-name').value.trim();if(!customerName){$('#customer-message').textContent='נא למלא שם מלא לפני שליחת ההזמנה.';$('#customer-name').focus();return;}pendingOrder={items:cart,customerName,createdAt:new Date().toISOString()};localStorage.setItem('ashkenazi-last-order',JSON.stringify(pendingOrder));const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${orderMessage()}`;if(WHATSAPP_NUMBER.includes('X')){alert('האתר מוכן לוואטסאפ. החלף את WHATSAPP_NUMBER בראש script.js למספר העסק לפני פרסום.');}else window.open(url,'_blank','noopener');cart=[];coupon={active:false,value:0};saveCart();closeCart();renderCart();$('#success-modal').classList.add('is-open');$('#success-modal').setAttribute('aria-hidden','false');}
function renderReviews(){const starter=[{name:'הכדור המקורי',text:'נקייה, יושבת טוב, וכולם שואלים מה זה אשכנזי.',rating:5}];const all=[...starter,...reviews];$('#reviews-grid').innerHTML=all.map(review=>`<article class="review-card-item"><div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div><blockquote>“${review.text}”</blockquote><div class="review-author">${review.name} · לקוח/ה של אשכנזי</div></article>`).join('');$('#review-status').textContent=pendingOrder?'קניתם? עכשיו אפשר להשאיר חותם משלכם.':'הביקורות של לקוחות אמיתיים נפתחות אחרי שליחת הזמנה.';$('#open-review').style.opacity=pendingOrder?'1':'.45';}
function openReview(){if(!pendingOrder){alert('אפשר להוסיף ביקורת אחרי שליחת הזמנה.');return;}$('#review-modal').classList.add('is-open');$('#review-modal').setAttribute('aria-hidden','false');}
$('#open-cart').addEventListener('click',openCart);$$('[data-close-cart]').forEach(element=>element.addEventListener('click',closeCart));$$('[data-close-modal]').forEach(element=>element.addEventListener('click',()=>closeModal('#product-modal')));$('#apply-coupon').addEventListener('click',applyCoupon);$('#checkout-button').addEventListener('click',checkout);$('#open-review').addEventListener('click',openReview);$('#success-review').addEventListener('click',()=>{closeModal('#success-modal');openReview();});$('#success-home').addEventListener('click',()=>closeModal('#success-modal'));$$('[data-close-review]').forEach(element=>element.addEventListener('click',()=>closeModal('#review-modal')));
$('#review-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);reviews.unshift({name:data.get('name'),text:data.get('text'),rating:Number(data.get('rating'))});localStorage.setItem('ashkenazi-reviews',JSON.stringify(reviews));event.currentTarget.reset();closeModal('#review-modal');renderReviews();const toast=$('#review-toast');toast.classList.add('is-visible');setTimeout(()=>toast.classList.remove('is-visible'),2600);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();closeModal('#product-modal');closeModal('#success-modal');closeModal('#review-modal');}});
renderProducts();renderCart();renderReviews();
