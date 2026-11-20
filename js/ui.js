/* UI v4: navigasi menu, tema warna, pengaturan, widget beranda, dompet & e-wallet (saldo manual), aktivitas */
const TH=[['light','Krem'],['mint','Mint'],['lavender','Lavender'],['ocean','Samudra'],['sunset','Senja'],['dark','Hutan Malam'],['midnight','Midnight']],
 sd=$('#sd'),ICON={gaji:'💼',usaha:'🛠️',bonus:'🎁',masuk_lain:'➕',kebutuhan:'🛒',kewajiban:'🧾',keinginan:'🎬',tabungan:'🐷',investasi:'📈',lainnya:'📦'},
 PRE=[['Tunai','tunai','#2F6B4F'],['DANA','ewallet','#118EEA'],['GoPay','ewallet','#00AA13'],['OVO','ewallet','#4C3494'],['ShopeePay','ewallet','#EE4D2D'],['LinkAja','ewallet','#E82529'],['BCA','bank','#0066AE'],['Mandiri','bank','#E5A100'],['BRI','bank','#00529C'],['BNI','bank','#F37021'],['Jago','bank','#F5A800'],['SeaBank','bank','#FF6A13']],
 KIND={bank:'Bank',ewallet:'E-Wallet',tunai:'Tunai'},fm=v=>v>=1e6?+(v/1e6).toFixed(1)+' jt':v>=1e3?Math.round(v/1e3)+' rb':Math.round(v),
 today=()=>new Date().toISOString().slice(0,10),dt=d=>new Date(d+'T00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short'}),
 wsum=()=>(S.wal||[]).reduce((t,w)=>t+w.b,0);

/* Navigasi (menu atas di desktop, menu bawah di HP) */
function go(v){localStorage.setItem('bk_view',v);document.querySelectorAll('[data-view]').forEach(e=>e.hidden=!e.dataset.view.split(' ').includes(v));
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go==v));$('#vt').textContent={home:'Beranda',tx:'Transaksi',wallet:'Dompet',stat:'Analitik',plan:'Rencana'}[v];scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});
addEventListener('keydown',e=>{if(gd.open||sd.open||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea'))return;const v=['home','tx','wallet','stat','plan'][e.key-1];if(v)go(v)});

/* Tema warna + pengaturan */
function setTheme(v){if(!TH.some(t=>t[0]==v))v='light';HTML.dataset.theme=v;localStorage.setItem('bk_theme',v);document.querySelectorAll('.sw').forEach(b=>b.classList.toggle('on',b.dataset.theme==v))}
$('#sw').innerHTML=TH.map(([k,n])=>`<button class="sw" data-theme="${k}"><span><i></i><i></i><i></i></span>${n}</button>`).join('');
$('#sw').onclick=e=>{const b=e.target.closest('.sw');if(b){setTheme(b.dataset.theme);toast('Tema '+b.textContent)}};
$('#theme').onclick=()=>{const n=TH[(TH.findIndex(t=>t[0]==HTML.dataset.theme)+1)%TH.length];setTheme(n[0]);toast('Tema '+n[1])};
$('#cfg').onclick=()=>sd.showModal();sd.addEventListener('click',e=>e.target===sd&&sd.close());$('#g2').onclick=()=>{sd.close();gd.showModal()};
$('#nm').value=localStorage.getItem('bk_name')||'';$('#nm').oninput=e=>{localStorage.setItem('bk_name',e.target.value.trim());greet()};

/* Sapaan & aksi cepat */
$('#qa').onclick=e=>{const b=e.target.closest('button');if(!b)return;({tx:()=>{go('tx');setTimeout(()=>$('#nx').focus(),60)},wal:()=>go('wallet'),goal:()=>go('plan'),xl:()=>$('#xlsx').click()})[b.dataset.q]?.()};

/* Grafik ikhtisar harian (garis kumulatif) + tooltip */
let OV;
function overview(){const all=mtx(),[y,m]=ym.split('-').map(Number),n=new Date(y,m,0).getDate(),I=Array(n+1).fill(0),O=Array(n+1).fill(0);
  all.forEach(x=>(cat(x.c).t=='in'?I:O)[+x.d.slice(8,10)]+=x.a);for(let d=1;d<=n;d++){I[d]+=I[d-1];O[d]+=O[d-1]}
  const W=600,Hh=230,L=44,B=26,top=Math.max(1,I[n],O[n]),mx=top*1.1,X=d=>L+(d-1)/Math.max(1,n-1)*(W-L-10),Y=v=>Hh-B-v/mx*(Hh-B-14);
  const line=A=>{let s='';for(let i=1;i<=n;i++){const x=X(i).toFixed(1),y=Y(A[i]).toFixed(1);if(i==1)s+='M'+x+' '+y;else{const c=((X(i)+X(i-1))/2).toFixed(1);s+=`C${c} ${Y(A[i-1]).toFixed(1)} ${c} ${y} ${x} ${y}`}}return s},area=A=>line(A)+`L${X(n)} ${Hh-B}L${X(1)} ${Hh-B}Z`;
  OV={I,O,n,X,Y,W};
  const g=[0,.25,.5,.75,1].map(f=>`<line x1="${L}" x2="${W-10}" y1="${Y(top*f)}" y2="${Y(top*f)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L-6}" y="${Y(top*f)+4}" text-anchor="end" font-size="11" fill="var(--mute)">${fm(top*f)}</text>`).join('');
  const xl=[1,Math.ceil(n/4),Math.ceil(n/2),Math.ceil(n*3/4),n].map(d=>`<text x="${X(d)}" y="${Hh-6}" text-anchor="middle" font-size="11" fill="var(--mute)">${d}</text>`).join('');
  const gr=[['gi','--in'],['go','--out']].map(([i,c])=>`<linearGradient id="${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(${c});stop-opacity:.35"/><stop offset="1" style="stop-color:var(${c});stop-opacity:0"/></linearGradient>`).join('');
  $('#ov').innerHTML=`<svg viewBox="0 0 ${W} ${Hh}"><defs>${gr}</defs>${g}${xl}<path d="${area(I)}" fill="url(#gi)"/><path d="${area(O)}" fill="url(#go)"/><path d="${line(I)}" fill="none" stroke="var(--in)" stroke-width="2.5" stroke-linejoin="round"/><path d="${line(O)}" fill="none" stroke="var(--out)" stroke-width="2.5" stroke-linejoin="round"/><g id="cur" hidden><line id="cl" y1="10" y2="${Hh-B}" stroke="var(--mute)"/><circle id="ci" r="5" fill="var(--in)" stroke="var(--card)" stroke-width="2"/><circle id="co" r="5" fill="var(--out)" stroke="var(--card)" stroke-width="2"/></g></svg><div class="tt" hidden></div>`;
  $('#pills').innerHTML=`<div class="pl"><small><i style="background:var(--in)"></i>Pemasukan</small><b>${rp(I[n])}</b>${dl(I[n],mt(pk()).i,0)}</div><div class="pl"><small><i style="background:var(--out)"></i>Pengeluaran</small><b>${rp(O[n])}</b>${dl(O[n],mt(pk()).o,1)}</div>`;$('#pm').textContent=$('#mlabel').textContent}
$('#ov').addEventListener('pointermove',e=>{const s=$('#ov svg');if(!OV||!s)return;const r=s.getBoundingClientRect(),{I,O,n,X,Y,W}=OV,fx=(e.clientX-r.left)/r.width*W,
  d=Math.max(1,Math.min(n,Math.round((fx-44)/(W-54)*Math.max(1,n-1))+1)),t=$('#ov .tt'),set=(i,a,v)=>$(i).setAttribute(a,v);
  $('#cur').hidden=false;set('#cl','x1',X(d));set('#cl','x2',X(d));set('#ci','cx',X(d));set('#ci','cy',Y(I[d]));set('#co','cx',X(d));set('#co','cy',Y(O[d]));
  t.hidden=false;t.style.left=Math.min(86,Math.max(14,X(d)/W*100))+'%';t.innerHTML=`<b>${d} ${MN[+ym.slice(5)-1]}</b><br>Masuk ${rp(I[d])}<br>Keluar ${rp(O[d])}`});
$('#ov').addEventListener('pointerleave',()=>{const c=$('#cur'),t=$('#ov .tt');if(c)c.hidden=true;if(t)t.hidden=true});

/* Widget beranda */
function recent(){const a=mtx().slice(0,5);
  $('#recent').innerHTML=a.length?a.map(x=>{const c=cat(x.c),i=c.t=='in';return`<li><i class="ic" style="background:${c.c}26">${ICON[x.c]||'📦'}</i><div><b>${esc(x.x)}</b><small>${dt(x.d)} · ${c.n}</small></div><b class="v ${i?'in':'out'}">${i?'+':'−'}${rp(x.a)}</b></li>`}).join(''):'<li class="empty-s">Belum ada transaksi bulan ini. Mulai dari tombol <b>Catat</b>.</li>'}
function gauge(){const all=mtx(),inc=sum(all,x=>cat(x.c).t=='in'),sv=sum(all,x=>x.c=='tabungan'||x.c=='investasi'),r=inc?sv/inc*100:0;
  $('#gauge').innerHTML=`<div class="gauge" style="--p:${Math.min(100,r/20*100)}"><div class="gt"><b>${Math.round(r)}%</b><small>dari pemasukan</small></div></div><p class="hint" style="text-align:center"><b>${rp(sv)}</b> tabungan & investasi<br>${r>=20?'🌱 Target 20% tercapai!':'Target ideal: 20% untuk tabungan & investasi'}</p>`}
function rings(){const all=mtx(),L=OUT.filter(c=>S.bud[c.id]).map(c=>{const v=sum(all,x=>x.c===c.id);return{...c,v,pc:v/S.bud[c.id]*100}}).sort((a,b)=>b.pc-a.pc).slice(0,4);
  $('#rings').innerHTML=L.length?L.map(c=>`<div class="rg"><div class="ring" style="--p:${Math.min(100,c.pc)};--c:${c.pc>100?'var(--out)':c.c}"><b>${Math.round(c.pc)}%</b></div><div><b>${c.n}</b><small>${rp(c.v)}</small></div></div>`).join(''):'<p class="empty-s" style="grid-column:1/-1">Belum ada anggaran. Atur di menu Rencana.</p>'}
const _toast=toast;toast=function(t){if(/✓|🎉/.test(t)){S.log=S.log||[];S.log.unshift({t:Date.now(),m:t.replace(/ ?✓$/,'')});S.log.length=Math.min(S.log.length,15);save()}_toast(t)};

/* Dompet & e-wallet (saldo diisi manual) */
function wallet(){const W=S.wal,t=wsum(),by=k=>W.filter(w=>w.k==k).reduce((s,w)=>s+w.b,0);
  $('#wtot').innerHTML=`<small>Total semua dompet</small><div class="big">${rp(t)}</div><div class="kinds">${Object.entries(KIND).map(([k,n])=>`<div><small>${n}</small><b>${rp(by(k))}</b></div>`).join('')}</div><p class="wsub">Saldo diisi manual — aplikasi ini sengaja tidak terhubung ke bank/e-wallet, jadi datamu tetap privat.</p>`;
  $('#wchips').innerHTML=PRE.map(([n,k,c])=>`<button data-p="${n}" style="--c:${c}" ${W.some(w=>w.n==n)?'disabled':''}><i></i>${n}</button>`).join('')+'<button data-p="*">+ Lainnya</button>';
  $('#wlist').innerHTML=W.length?W.map(w=>`<div class="wr" data-w="${w.id}"><div class="bd" style="background:${w.c}">${esc(w.n.slice(0,2).toUpperCase())}</div><div><b>${esc(w.n)}</b><br><small class="mut">${KIND[w.k]||w.k} · diperbarui ${dt(w.u)}</small></div><button class="del" title="Hapus">×</button><input type="number" class="r wb" value="${w.b}" aria-label="Saldo ${esc(w.n)}"></div>`).join(''):'<p class="empty-s">Belum ada dompet. Pilih salah satu di atas, lalu isi saldonya.</p>'}
$('#wchips').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;let n=b.dataset.p,k,c;
  if(n=='*'){n=(prompt('Nama dompet / rekening:')||'').trim();if(!n)return;k=(prompt('Jenis? ketik: bank, ewallet, atau tunai','ewallet')||'ewallet').toLowerCase();k=KIND[k]?k:'ewallet';c='#6B5B95'}
  else{const p=PRE.find(p=>p[0]==n);k=p[1];c=p[2]}
  const r=prompt(`Saldo ${n} saat ini? (Rp)`,'0');if(r===null||isNaN(+r))return;S.wal.push({id:Date.now(),n,k,c,b:+r,u:today()});save();render();toast(`Dompet ${n} ditambahkan ✓`)};
$('#wlist').addEventListener('change',e=>{if(!e.target.classList.contains('wb'))return;const w=S.wal.find(x=>x.id==e.target.closest('.wr').dataset.w);w.b=+e.target.value||0;w.u=today();save();render();toast(`Saldo ${w.n} diperbarui: ${rp(w.b)} ✓`)});
$('#wlist').addEventListener('click',e=>{if(!e.target.classList.contains('del'))return;const id=e.target.closest('.wr').dataset.w,w=S.wal.find(x=>x.id==id);if(confirm(`Hapus dompet ${w.n}?`)){S.wal=S.wal.filter(x=>x.id!=id);save();render()}});

/* Tampilan tablet: saldo total, kartu dompet, daftar akun, dock bawah, mode privasi */
const pk=()=>{const[y,m]=ym.split('-').map(Number),d=new Date(y,m-2,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')},
 mt=k=>{const a=S.tx.filter(t=>t.d.startsWith(k));return{i:sum(a,t=>cat(t.c).t=='in'),o:sum(a,t=>cat(t.c).t=='out')}},
 dl=(c,p,bad)=>{if(!p)return'';const r=Math.round((c-p)/Math.abs(p)*1000)/10,up=r>=0;return`<em class="dl ${up!=!!bad?'pos':'neg'}">${up?'↑':'↓'} ${Math.abs(r)}%</em>`};
function greet(){const n=localStorage.getItem('bk_name');$('#av').textContent=(n||'B')[0].toUpperCase();$('#av').title=n?'Halo, '+n:'Pengaturan'}
function tb(){const c=mt(ym),p=mt(pk()),bal=c.i-c.o,pb=p.i-p.o,r=pb?Math.round((bal-pb)/Math.abs(pb)*1000)/10:null;
  $('#tb').innerHTML=`<div><div class="tbl">Saldo bulan ini <button class="eye" id="eye" aria-label="Sembunyikan angka">${HTML.classList.contains('priv')?'🙈':'👁'}</button></div><div class="big amt">${rp(bal)}</div><small class="${r==null?'':r>=0?'pos':'neg'}">${r==null?'Belum ada data bulan lalu':(r>=0?'↑ ':'↓ ')+Math.abs(r)+'% dari bulan lalu'}</small></div><div class="tbi">💰</div>`}
function wcard(){const W=S.wal,u=W.map(w=>w.u).sort().pop();
  $('#wcard').innerHTML=`<div class="wch"><span>Total saldo dompet</span><span class="mc"><i></i><i></i></span></div><div class="mask">•••• •••• •••• ${String(W.length).padStart(4,'0')}</div><div class="big amt">${rp(wsum())}</div><div class="wcf"><small>${W.length?'Diperbarui '+dt(u):'Belum ada dompet'}</small><button class="ghost sm" data-go="wallet">${W.length?'Lihat dompet →':'Tambah dompet →'}</button></div>`}
function acc(){const W=S.wal.slice().sort((a,b)=>b.b-a.b).slice(0,4);
  $('#acc').innerHTML=W.length?W.map(w=>`<li><div class="bd sm" style="background:${w.c}">${esc(w.n.slice(0,2).toUpperCase())}</div><div><b>${esc(w.n)}</b><small>•••• ${KIND[w.k]||w.k}</small></div><b class="v">${rp(w.b)}</b></li>`).join(''):'<li class="empty-s">Belum ada dompet. Klik “+ Tambah”.</li>'}
function act(){const L=S.log||[];$('#act').innerHTML=L.length?L.slice(0,5).map(l=>`<li><i class="ic">✓</i><div><b>${esc(l.m)}</b><small>${new Date(l.t).toLocaleString('id-ID',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small></div><em class="ok">Berhasil</em></li>`).join(''):'<li class="empty-s">Aktivitasmu akan muncul di sini.</li>'}
function dock(){$('#dock').innerHTML=`<button data-go="tx"><i>🧾</i><div><b>${mtx().length} transaksi</b><small>tercatat bulan ini</small></div><span>→</span></button><button class="mid" data-go="wallet"><i>🏦</i><div><b class="amt">${rp(wsum())}</b><small>Total saldo semua dompet</small></div><span>→</span></button><button id="dsec"><i>🛡️</i><div><b>100% privat</b><small>Data hanya di perangkatmu</small></div><span>→</span></button>`}
if(localStorage.getItem('bk_priv')=='1')HTML.classList.add('priv');
document.addEventListener('click',e=>{if(e.target.id=='eye'){HTML.classList.toggle('priv');localStorage.setItem('bk_priv',+HTML.classList.contains('priv'));tb()}if(e.target.closest('#dsec'))sd.showModal()});
$('#srch').onclick=()=>{go('tx');setTimeout(()=>$('#q').focus(),60)};$('#av').onclick=()=>sd.showModal();

/* Sambungkan ke render() */
const _r2=render;render=function(){S.wal=S.wal||[];S.log=S.log||[];_r2();greet();overview();recent();wcard();gauge();rings();act();wallet();tb();acc();dock()};
setTheme(HTML.dataset.theme);go(localStorage.getItem('bk_view')||'home');render();
