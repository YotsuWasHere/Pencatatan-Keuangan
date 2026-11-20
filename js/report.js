/* Laporan Excel: 4 sheet (Ringkasan, Transaksi, Anggaran, Dompet), rumus hidup, 3 grafik asli. */
function report(XL,{all,cat,OUT,MN,ym,R,bud,wal,goals}){
  const b=XL.book(),s=b.st,N=all.length,e=4+Math.max(N,1),tot=e+1,[y,m]=ym.split('-'),label=MN[m-1]+' '+y;
  const G='1F4D3A',Z='F6F3EA',LN='DDD5C3',GR='2F6B4F',RD='C8553D',MUTE='6B7A70',RP='"Rp" #,##0;[Red]-"Rp" #,##0;"–"';
  const made='Dibuat '+new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
  const ttl=s({b:1,sz:18,fc:'FFFFFF',bg:G}),sub=s({i:1,fc:MUTE}),th=s({b:1,fc:'FFFFFF',bg:G,h:'center'}),thl=s({b:1,fc:'FFFFFF',bg:G});
  const sec=s({b:1,sz:12,fc:G,bd:G}),klab=s({b:1,sz:9,fc:MUTE,bg:'E9F0EA',h:'center'});
  const bs=(i,o={})=>s({bd:LN,bg:i%2?Z:undefined,...o}),band=(t,st,n)=>[{v:t,s:st},...Array(n-1).fill({v:'',s:st})];
  const kv=(c,f,v)=>[{v,f,s:s({b:1,sz:16,fc:c,bg:'E9F0EA',h:'center',nf:RP})},{v:'',s:klab}];
  const sum=f=>all.reduce((t,x)=>t+(f(x)?x.a:0),0),inc=sum(x=>cat(x.c).t=='in'),exp=sum(x=>cat(x.c).t=='out'),sv=sum(x=>x.c=='tabungan'||x.c=='investasi');
  const T=`Transaksi!$C$5:$C$${e}`,TE=`Transaksi!$E$5:$E$${e}`,TF=`Transaksi!$F$5:$F$${e}`;

  /* --- Sheet 1: Ringkasan --- */
  const hd=(a,l)=>a.map((t,i)=>({v:t,s:i||!l?th:thl}));
  const rows=[band('BUKU KAS — Laporan Keuangan',ttl,8),band('Periode: '+label+'  ·  '+made,sub,8),[],
   [{v:'PEMASUKAN',s:klab},{v:'',s:klab},{v:'PENGELUARAN',s:klab},{v:'',s:klab},{v:'SALDO',s:klab},{v:'',s:klab},{v:'TABUNGAN & INVESTASI',s:klab},{v:'',s:klab}],
   [...kv(GR,`SUM(${TE})`,inc),...kv(RD,`SUM(${TF})`,exp),...kv(inc>=exp?G:RD,'A5-C5',inc-exp),...kv('3A6EA5',`SUMIF(${T},"Tabungan",${TF})+SUMIF(${T},"Investasi",${TF})`,sv)],[],
   [{v:'Pengeluaran per kategori',s:sec},{v:'',s:sec},{v:'',s:sec},null,{v:'Tren 6 bulan terakhir',s:sec},{v:'',s:sec},{v:'',s:sec},{v:'',s:sec}],
   [...hd(['Kategori','Jumlah','Porsi'],1),null,...hd(['Bulan','Pemasukan','Pengeluaran','Selisih'],1)]];
  OUT.forEach((c,i)=>{const r=9+i,v=sum(x=>x.c===c.id),t=R[i];
    rows.push([{v:c.n,s:bs(i,{b:1,fc:c.c.slice(1)})},{v,f:`SUMIF(${T},A${r},${TF})`,s:bs(i,{nf:RP})},{v:exp?v/exp:0,f:`IFERROR(B${r}/SUM($B$9:$B$14),0)`,s:bs(i,{nf:'0%',h:'center'})},null,
      {v:t.n,s:bs(i)},{v:t.i,s:bs(i,{nf:RP,fc:GR})},{v:t.o,s:bs(i,{nf:RP,fc:RD})},{v:t.i-t.o,f:`F${r}-G${r}`,s:bs(i,{nf:RP,b:1})}])});
  const tt=s({b:1,bg:'E9F0EA',bd:G,nf:RP});rows.push([{v:'Total',s:s({b:1,bg:'E9F0EA',bd:G})},{v:exp,f:'SUM(B9:B14)',s:tt},{v:exp?1:0,f:'SUM(C9:C14)',s:s({b:1,bg:'E9F0EA',bd:G,nf:'0%',h:'center'})}]);
  b.sheet({name:'Ringkasan',tab:G,rows,cols:[24,17,12,12,16,17,17,17],heights:[36,18,10,20,34,10,22,22],
    merges:['A1:H1','A2:H2','A4:B4','C4:D4','E4:F4','G4:H4','A5:B5','C5:D5','E5:F5','G5:H5','A7:C7','E7:H7'],
    charts:[{type:'d',title:'Ke mana uangmu pergi?',cat:'Ringkasan!$A$9:$A$14',series:[{name:'Ringkasan!$B$8',val:'Ringkasan!$B$9:$B$14'}],colors:OUT.map(c=>c.c.slice(1)),from:[0,16],to:[4,35]},
      {type:'b',title:'Pemasukan vs Pengeluaran',cat:'Ringkasan!$E$9:$E$14',series:[{name:'Ringkasan!$F$8',val:'Ringkasan!$F$9:$F$14',color:GR},{name:'Ringkasan!$G$8',val:'Ringkasan!$G$9:$G$14',color:RD}],from:[4,16],to:[8,35]}]});

  /* --- Sheet 2: Transaksi --- */
  const tr=[band('Daftar Transaksi — '+label,ttl,6),band(N+' transaksi  ·  klik panah di judul kolom untuk menyaring / mengurutkan',sub,6),[],
    hd(['Tanggal','Keterangan','Kategori','Jenis','Pemasukan','Pengeluaran']).map((c,i)=>i==1||i==2?{...c,s:thl}:c)];
  all.forEach((x,i)=>{const c=cat(x.c),inn=c.t=='in';
    tr.push([{v:b.date(x.d),s:bs(i,{nf:'dd mmm yyyy',h:'center'})},{v:x.x,s:bs(i)},{v:c.n,s:bs(i,{b:1,fc:c.c.slice(1)})},{v:inn?'Masuk':'Keluar',s:bs(i,{h:'center',b:1,fc:inn?GR:RD})},
      {v:inn?x.a:0,s:bs(i,{nf:RP,fc:GR})},{v:inn?0:x.a,s:bs(i,{nf:RP,fc:RD})}])});
  if(!N)tr.push([{v:'Belum ada transaksi di bulan ini.',s:s({i:1,fc:MUTE})}]);
  const tb=s({b:1,bg:'E9F0EA',bd:G});
  tr.push([{v:'',s:tb},{v:'',s:tb},{v:'',s:tb},{v:'TOTAL',s:s({b:1,bg:'E9F0EA',bd:G,h:'center'})},{v:inc,f:`SUM(E5:E${e})`,s:tt},{v:exp,f:`SUM(F5:F${e})`,s:tt}],
    [null,null,null,{v:'SALDO',s:s({b:1,sz:12,h:'center'})},{v:inc-exp,f:`E${tot}-F${tot}`,s:s({b:1,sz:12,nf:RP,fc:inc>=exp?GR:RD})}]);
  b.sheet({name:'Transaksi',tab:'3E8E7E',rows:tr,cols:[14,36,18,11,18,18],heights:[34],merges:['A1:F1','A2:F2'],freeze:4,filter:`A4:F${e}`});

  /* --- Sheet 3: Anggaran --- */
  const ar=[band('Anggaran vs Realisasi — '+label,ttl,6),band('Isi kolom Anggaran di aplikasi atau langsung di sini; kolom lain dihitung otomatis.',sub,6),[],
    hd(['Kategori','Anggaran','Realisasi','Sisa','% Terpakai','Status'],1)];
  OUT.forEach((c,i)=>{const r=5+i,bg=bud[c.id]||0,v=sum(x=>x.c===c.id);
    ar.push([{v:c.n,s:bs(i,{b:1,fc:c.c.slice(1)})},{v:bg,s:bs(i,{nf:RP,fc:'1F4DB0'})},{v:v,f:`SUMIF(${T},A${r},${TF})`,s:bs(i,{nf:RP})},{v:bg?bg-v:0,f:`IF(B${r}=0,0,B${r}-C${r})`,s:bs(i,{nf:RP,b:1})},
      {v:bg?v/bg:0,f:`IFERROR(C${r}/B${r},0)`,s:bs(i,{nf:'0%',h:'center'})},{v:!bg?'Belum diatur':v>bg?'Melebihi':'Aman',f:`IF(B${r}=0,"Belum diatur",IF(C${r}>B${r},"Melebihi","Aman"))`,s:bs(i,{h:'center',b:1})}])});
  const at=s({b:1,bg:'E9F0EA',bd:G,nf:RP}),bt=OUT.reduce((t,c)=>t+(bud[c.id]||0),0);
  ar.push([{v:'Total',s:s({b:1,bg:'E9F0EA',bd:G})},{v:bt,f:'SUM(B5:B10)',s:at},{v:exp,f:'SUM(C5:C10)',s:at},{v:bt-exp,f:'B11-C11',s:at},{v:'',s:at},{v:'',s:at}]);
  b.sheet({name:'Anggaran',tab:'E09F3E',rows:ar,cols:[22,17,17,17,14,16],heights:[34],merges:['A1:F1','A2:F2'],bars:['E5:E10'],
    charts:[{type:'b',title:'Anggaran vs Realisasi per kategori',labels:1,cat:'Anggaran!$A$5:$A$10',series:[{name:'Anggaran!$B$4',val:'Anggaran!$B$5:$B$10',color:'3A6EA5'},{name:'Anggaran!$C$4',val:'Anggaran!$C$5:$C$10',color:'E09F3E'}],from:[0,12],to:[6,31]}]});
  /* --- Sheet 4: Dompet & target tabungan --- */
  const W=wal||[],gl=goals||[],wt=W.reduce((t,w)=>t+w.b,0),KN={bank:'Bank',ewallet:'E-Wallet',tunai:'Tunai'},wc=w=>(w.c||'#2F6B4F').slice(1),we=4+Math.max(W.length,1),g0=we+5;
  const wr=[band('Saldo Dompet & Target Tabungan',ttl,5),band('Saldo dompet diisi manual di aplikasi.  ·  '+made,sub,5),[],hd(['Dompet / Rekening','Jenis','Saldo','Porsi','Diperbarui'],1)];
  W.forEach((w,i)=>{const r=5+i;wr.push([{v:w.n,s:bs(i,{b:1,fc:wc(w)})},{v:KN[w.k]||w.k,s:bs(i,{h:'center'})},{v:w.b,s:bs(i,{nf:RP})},{v:wt?w.b/wt:0,f:`IFERROR(C${r}/SUM($C$5:$C$${we}),0)`,s:bs(i,{nf:'0%',h:'center'})},{v:w.u?b.date(w.u):'',s:bs(i,{nf:'dd mmm yyyy',h:'center'})}])});
  if(!W.length)wr.push([{v:'Belum ada dompet. Tambahkan di menu Dompet.',s:s({i:1,fc:MUTE})}]);
  wr.push([{v:'Total saldo',s:s({b:1,bg:'E9F0EA',bd:G})},{v:'',s:tb},{v:wt,f:`SUM(C5:C${we})`,s:tt},{v:'',s:tb},{v:'',s:tb}],[],
    [{v:'Target tabungan',s:sec},{v:'',s:sec},{v:'',s:sec},{v:'',s:sec},{v:'',s:sec}],hd(['Target','Terkumpul','Dana target','Progres','Sisa'],1));
  gl.forEach((g,i)=>{const r=g0+i;wr.push([{v:g.n,s:bs(i,{b:1})},{v:g.s,s:bs(i,{nf:RP})},{v:g.t,s:bs(i,{nf:RP})},{v:Math.min(1,g.s/g.t),f:`IFERROR(MIN(1,B${r}/C${r}),0)`,s:bs(i,{nf:'0%',h:'center'})},{v:Math.max(0,g.t-g.s),f:`MAX(0,C${r}-B${r})`,s:bs(i,{nf:RP})}])});
  if(!gl.length)wr.push([{v:'Belum ada target. Buat di menu Rencana.',s:s({i:1,fc:MUTE})}]);
  b.sheet({name:'Dompet',tab:'5B4B8A',rows:wr,cols:[24,17,18,12,16],heights:[34],merges:['A1:E1','A2:E2',`A${we+3}:E${we+3}`],bars:gl.length?[`D${g0}:D${g0+gl.length-1}`]:[],
    charts:W.length?[{type:'d',title:'Komposisi saldo dompet',cat:`Dompet!$A$5:$A$${we}`,series:[{name:'Dompet!$C$4',val:`Dompet!$C$5:$C$${we}`}],colors:W.map(wc),from:[6,3],to:[13,22]}]:[]});
  return b.blob();
}
if(typeof module!=='undefined')module.exports=report;
