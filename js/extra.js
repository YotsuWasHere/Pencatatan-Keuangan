/* Fitur tambahan: tema, panduan, target tabungan, tren, wawasan, tebak kategori, pintasan, export Excel */
const HTML=document.documentElement,gd=$('#gd');
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}

/* Tema terang / gelap */
$('#theme').onclick=()=>{const v=HTML.dataset.theme=='dark'?'light':'dark';HTML.dataset.theme=v;localStorage.setItem('bk_theme',v);toast(v=='dark'?'Tema gelap ☾':'Tema terang ☀')};

/* Panduan & panel mulai cepat */
$('#guide').onclick=()=>gd.showModal();
gd.addEventListener('click',e=>e.target===gd&&gd.close());
if(localStorage.getItem('bk_quick'))$('#quick').classList.add('gone');
$('#qx').onclick=()=>{$('#quick').classList.add('gone');localStorage.setItem('bk_quick',1)};

/* Pintasan keyboard */
addEventListener('keydown',e=>{if(gd.open||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,select,textarea'))return;
  const f={'/':()=>$('#q').focus(),'?':()=>gd.showModal(),t:()=>$('#theme').click(),ArrowLeft:()=>$('#prev').click(),ArrowRight:()=>$('#next').click()}[e.key];
  if(f){e.preventDefault();f()}});

/* Tebak kategori dari keterangan + petunjuk langsung */
const GUESS=[[/gaji|salary/,'gaji'],[/freelance|proyek|jual|usaha|omzet/,'usaha'],[/bonus|thr|hadiah/,'bonus'],
 [/kost|sewa|listrik|internet|wifi|pulsa|cicil|pajak|bpjs|asuransi|utang|hutang|pdam/,'kewajiban'],
 [/makan|belanja|sembako|bensin|ojek|grab|gojek|transport|angkot|obat|sabun|galon|laundry/,'kebutuhan'],
 [/nonton|kopi|jajan|game|hobi|netflix|spotify|liburan|bioskop|baju|nongkrong/,'keinginan'],
 [/tabung|darurat/,'tabungan'],[/saham|reksa|emas|crypto|kripto|invest|obligasi/,'investasi']];
function hint(){const a=+$('#na').value,c=cat($('#nc').value);
  $('#hint').innerHTML=a?`<b>${rp(a)}</b> dicatat sebagai <b>${c.n}</b> (${c.t=='in'?'pemasukan':'pengeluaran'}). Tekan <kbd>Enter</kbd> untuk menyimpan.`:'Isi baris berwarna di atas, lalu tekan <kbd>Enter</kbd>. Kategori ditebak otomatis dari keterangan.'}
$('#nx').addEventListener('input',()=>{const t=$('#nx').value.toLowerCase(),g=GUESS.find(([r])=>r.test(t));if(g)$('#nc').value=g[1];hint()});
$('#na').addEventListener('input',hint);$('#nc').addEventListener('change',hint);

/* Tren 6 bulan */
function trendData(){const[y,m]=ym.split('-').map(Number),R=[];
  for(let i=-5;i<=0;i++){const d=new Date(y,m-1+i,1),k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'),a=S.tx.filter(t=>t.d.startsWith(k));
    R.push({l:MN[d.getMonth()].slice(0,3),n:MN[d.getMonth()]+' '+d.getFullYear(),i:sum(a,t=>cat(t.c).t=='in'),o:sum(a,t=>cat(t.c).t=='out'),now:!i})}
  return R}
function trend(){const R=trendData(),mx=Math.max(1,...R.flatMap(r=>[r.i,r.o]));
  $('#trend').innerHTML=`<div class="trend">${R.map(r=>`<div class="tcol${r.now?' now':''}" title="${r.n}: masuk ${rp(r.i)} · keluar ${rp(r.o)}"><div class="tbars"><i style="height:${r.i/mx*100}%;background:var(--in)"></i><i style="height:${r.o/mx*100}%;background:var(--out)"></i></div>${r.l}</div>`).join('')}</div><div class="tl"><span><i style="background:var(--in)"></i>Pemasukan</span><span><i style="background:var(--out)"></i>Pengeluaran</span></div>`}

/* Wawasan otomatis */
function tips(){const all=mtx(),inc=sum(all,x=>cat(x.c).t=='in'),exp=sum(all,x=>cat(x.c).t=='out'),T=[];
  if(!all.length){$('#tips').innerHTML='<li class="empty-s">Tambahkan transaksi untuk melihat wawasan otomatis.</li>';return}
  const top=OUT.map(c=>({...c,v:sum(all,x=>x.c===c.id)})).sort((a,b)=>b.v-a.v)[0],now=new Date(),
   days=ym==now.toISOString().slice(0,7)?now.getDate():new Date(+ym.slice(0,4),+ym.slice(5),0).getDate();
  if(top.v)T.push(['🏷️',`Pengeluaran terbesar: <b>${top.n}</b> (${rp(top.v)}).`]);
  if(exp)T.push(['📅',`Rata-rata belanja <b>${rp(exp/days)}</b> per hari.`]);
  if(inc){const r=Math.round((inc-exp)/inc*100);T.push(r>=20?['🌱',`Hebat! Kamu menyisakan <b>${r}%</b> dari pemasukan.`]:r>=0?['⚖️',`Sisa uang <b>${r}%</b> dari pemasukan. Targetkan minimal 20%.`]:['⚠️',`Pengeluaran melebihi pemasukan sebesar <b>${rp(exp-inc)}</b>.`])}
  const over=OUT.filter(c=>S.bud[c.id]&&sum(all,x=>x.c===c.id)>S.bud[c.id]);if(over.length)T.push(['🚨',`Anggaran terlampaui: <b>${over.map(c=>c.n).join(', ')}</b>.`]);
  $('#tips').innerHTML=T.map(([i,t])=>`<li data-i="${i}">${t}</li>`).join('')}

/* Target tabungan */
function goals(){const G=S.goals;
  $('#goals').innerHTML=G.length?G.map((g,i)=>{const p=Math.min(100,g.s/g.t*100);
    return`<div class="goal"><div class="goal-h"><b>${esc(g.n)}</b><span>${Math.round(p)}%</span></div><div class="track"><div class="fill" style="width:${p}%;background:${p>=100?'var(--in)':'#3A6EA5'}"></div></div><small>${rp(g.s)} dari ${rp(g.t)}${p>=100?' · 🎉 Tercapai!':''}</small><div class="acts"><button data-g="${i}" data-a="dep">+ Setor</button><button data-g="${i}" data-a="del">Hapus</button></div></div>`}).join('')
   :'<p class="empty-s">Belum ada target. Klik “+ Target”, mis. “Laptop baru”.</p>'}
$('#gadd').onclick=()=>{const n=prompt('Nama target (mis. Laptop baru):');if(!n)return;const t=+prompt('Target dana berapa? (Rp)','10000000');
  if(!(t>0))return toast('Jumlah target tidak valid');S.goals.push({n:n.trim(),t,s:0});save();render();toast('Target dibuat ✓')};
$('#goals').onclick=e=>{const b=e.target.closest('button');if(!b)return;const i=b.dataset.g,g=S.goals[i];
  if(b.dataset.a=='del'){if(confirm(`Hapus target “${g.n}”?`)){S.goals.splice(i,1);save();render()}}
  else{const v=+prompt(`Setor berapa ke “${g.n}”? (Rp)`,'500000');if(v>0){g.s+=v;save();render();toast(g.s>=g.t?'🎉 Target tercapai!':`Setor ${rp(v)} ke ${g.n} ✓`)}}};

/* Sambungkan ke render() milik app.js */
const _render=render;render=function(){S.goals=S.goals||[];_render();trend();tips();goals();hint()};

/* Export Excel (3 sheet + grafik asli) */
$('#xlsx').onclick=()=>{
  try{const blob=report(XL,{all:mtx().reverse(),cat,OUT,MN,ym,R:trendData(),bud:S.bud,wal:S.wal||[],goals:S.goals||[]}),a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=`Buku-Kas-${ym}.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Excel berhasil dibuat ✓')}
  catch(err){console.error(err);alert('Gagal membuat Excel: '+err.message)}};
