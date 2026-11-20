const $=s=>document.querySelector(s);
const CATS=[
{id:'gaji',n:'Gaji',t:'in',c:'#2F6B4F'},{id:'usaha',n:'Usaha',t:'in',c:'#3E8E7E'},{id:'bonus',n:'Bonus',t:'in',c:'#8AA84B'},{id:'masuk_lain',n:'Pemasukan lain',t:'in',c:'#6B8F71'},
{id:'kebutuhan',n:'Kebutuhan',t:'out',c:'#C8553D'},{id:'kewajiban',n:'Kewajiban',t:'out',c:'#8E3B46'},{id:'keinginan',n:'Keinginan',t:'out',c:'#E09F3E'},
{id:'tabungan',n:'Tabungan',t:'out',c:'#3A6EA5'},{id:'investasi',n:'Investasi',t:'out',c:'#5B4B8A'},{id:'lainnya',n:'Lainnya',t:'out',c:'#8A8578'}];
const OUT=CATS.filter(c=>c.t==='out'),cat=id=>CATS.find(c=>c.id===id)||CATS[9];
const MN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const KEY='bukukas_v2';
let S=JSON.parse(localStorage.getItem(KEY)||'null')||{tx:[],bud:{}};
let ym=new Date().toISOString().slice(0,7),term='';
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const rp=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const sum=(a,f)=>a.reduce((s,x)=>s+(f(x)?x.a:0),0);
const o=sel=>c=>`<option value="${c.id}"${c.id===sel?' selected':''}>${c.n}</option>`;
const opts=sel=>`<optgroup label="Pemasukan">${CATS.filter(c=>c.t=='in').map(o(sel)).join('')}</optgroup><optgroup label="Pengeluaran">${OUT.map(o(sel)).join('')}</optgroup>`;
const mtx=()=>S.tx.filter(x=>x.d.startsWith(ym)).sort((a,b)=>b.d.localeCompare(a.d)||b.id-a.id);

function render(){
  const [y,m]=ym.split('-');$('#mlabel').textContent=MN[m-1]+' '+y;
  const all=mtx(),inc=sum(all,x=>cat(x.c).t=='in'),exp=sum(all,x=>cat(x.c).t=='out');
  const sv=sum(all,x=>x.c=='tabungan'||x.c=='investasi');
  $('#stats').innerHTML=`
   <div class="stat hero"><small>Saldo bulan ini</small><div class="num">${rp(inc-exp)}</div><div class="sub">${all.length} transaksi tercatat</div></div>
   <div class="stat"><small>Pemasukan</small><div class="num" style="color:var(--in)">${rp(inc)}</div></div>
   <div class="stat"><small>Pengeluaran</small><div class="num" style="color:var(--out)">${rp(exp)}</div></div>
   <div class="stat"><small>Tabungan & investasi</small><div class="num">${rp(sv)}</div><div class="sub">${inc?Math.round(sv/inc*100):0}% dari pemasukan</div></div>`;

  const list=all.filter(x=>(x.x+cat(x.c).n).toLowerCase().includes(term));
  $('#rows').innerHTML=list.length?list.map(x=>{const c=cat(x.c);return`<tr data-id="${x.id}">
    <td><input type="date" data-f="d" value="${x.d}"></td>
    <td><input data-f="x" value="${esc(x.x)}"></td>
    <td><input type="number" data-f="a" value="${x.a}" class="r amt ${c.t}"></td>
    <td><select data-f="c" style="--c:${c.c}">${opts(x.c)}</select></td>
    <td><button class="del" title="Hapus">×</button></td></tr>`}).join('')
   :`<tr><td colspan="5" class="empty">Belum ada transaksi di bulan ini.<br><button id="demo">Isi data contoh</button></td></tr>`;
  $('#count').textContent=list.length?`${list.length} baris · klik sel mana pun untuk mengedit langsung`:'';

  const by=OUT.map(c=>({...c,v:sum(all,x=>x.c===c.id)})).filter(c=>c.v>0);
  let p=0;$('#donut').style.background=by.length?`conic-gradient(${by.map(c=>{const s=p;p+=c.v/exp*100;return`${c.c} ${s}% ${p}%`}).join(',')})`:'var(--bg)';
  $('#dtot').innerHTML=exp?rp(exp).replace('Rp','Rp<br>'):'Kosong';
  $('#legend').innerHTML=by.map(c=>`<li><i style="background:${c.c}"></i>${c.n}<b>${Math.round(c.v/exp*100)}%</b></li>`).join('')||'<li style="color:var(--mute)">Belum ada pengeluaran</li>';

  const need=sum(all,x=>x.c=='kebutuhan'||x.c=='kewajiban'),want=sum(all,x=>x.c=='keinginan');
  const rule=(n,v,t,col)=>{const pc=inc?v/inc*100:0;return`<div class="bar"><div class="bar-h"><span>${n}</span><b>${Math.round(pc)}%</b></div><div class="track"><div class="fill" style="width:${Math.min(pc,100)}%;background:${col}"></div><div class="tick" style="left:${t}%"></div></div><small>Target ${t}% · ${rp(v)}</small></div>`};
  $('#rule').innerHTML=rule('Kebutuhan + Kewajiban',need,50,'var(--out)')+rule('Keinginan',want,30,'#E09F3E')+rule('Tabungan + Investasi',sv,20,'var(--in)');

  $('#budgets').innerHTML=OUT.map(c=>{const b=S.bud[c.id]||0,v=sum(all,x=>x.c===c.id),pc=b?v/b*100:0;
   return`<div class="bud"><div><b>${c.n}</b><br><small style="color:${pc>100?'var(--out)':'var(--mute)'}">${rp(v)} terpakai${pc>100?' · melebihi!':''}</small></div>
   <input type="number" min="0" data-b="${c.id}" value="${b||''}" placeholder="Anggaran"><div class="track"><div class="fill" style="width:${Math.min(pc,100)}%;background:${pc>100?'var(--out)':c.c}"></div></div></div>`}).join('');
}

function add(){
  const a=+$('#na').value,x=$('#nx').value.trim(),d=$('#nd').value;
  if(!a||!d){$('#na').focus();return}
  S.tx.push({id:Date.now(),d,x:x||cat($('#nc').value).n,a,c:$('#nc').value});
  save();toast((x||cat($('#nc').value).n)+' · '+rp(a)+' ✓');$('#nx').value='';$('#na').value='';ym=d.slice(0,7);render();$('#nx').focus();
}
$('#nc').innerHTML=opts('kebutuhan');$('#nd').value=new Date().toISOString().slice(0,10);
$('#add').onclick=add;
['#nx','#na'].forEach(s=>$(s).addEventListener('keydown',e=>e.key==='Enter'&&add()));
$('#rows').addEventListener('change',e=>{const f=e.target.dataset.f;if(!f)return;const t=S.tx.find(x=>x.id==e.target.closest('tr').dataset.id);t[f]=f==='a'?+e.target.value:e.target.value;save();render()});
$('#rows').addEventListener('click',e=>{
  if(e.target.id==='demo'){const d=ym+'-';S.tx.push(...[['01','Gaji bulanan',8500000,'gaji'],['02','Sewa kost',1500000,'kewajiban'],['03','Belanja bulanan',1200000,'kebutuhan'],['05','Nonton & kopi',350000,'keinginan'],['06','Tabungan darurat',1000000,'tabungan'],['08','Reksa dana',500000,'investasi'],['10','Proyek freelance',1200000,'usaha'],['12','Listrik & internet',450000,'kewajiban']].map(([a,x,n,c],i)=>({id:Date.now()+i,d:d+a,x,a:n,c})));save();render()}
  if(e.target.classList.contains('del')&&confirm('Hapus baris ini?')){S.tx=S.tx.filter(x=>x.id!=e.target.closest('tr').dataset.id);save();render()}});
$('#budgets').addEventListener('change',e=>{if(e.target.dataset.b){S.bud[e.target.dataset.b]=+e.target.value;save();render()}});
$('#q').oninput=e=>{term=e.target.value.toLowerCase();render()};
const mv=n=>{const[y,m]=ym.split('-').map(Number),d=new Date(y,m-1+n,1);ym=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');render()};
$('#prev').onclick=()=>mv(-1);$('#next').onclick=()=>mv(1);

$('#backup').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));a.download='buku-kas-backup.json';a.click();toast('Backup diunduh ✓')};
$('#restore').onchange=e=>{const r=new FileReader();r.onload=()=>{try{S=JSON.parse(r.result);save();render();toast('Data berhasil dipulihkan ✓')}catch{alert('File backup tidak valid')}};r.readAsText(e.target.files[0])};

render();
