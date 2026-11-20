/* Penulis .xlsx mandiri (tanpa library & tanpa internet): gaya sel, rumus, grafik Excel asli. */
const XL=(()=>{
const enc=new TextEncoder(),x=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=b=>{let c=-1;for(const v of b)c=CT[(c^v)&255]^(c>>>8);return(c^-1)>>>0};
const w=(a,...v)=>{for(let i=0;i<v.length;i+=2){let n=v[i],b=v[i+1];while(b--){a.push(n&255);n>>>=8}}};
function zip(files){const P=[],C=[];let off=0,n=0;
  for(const[k,d]of Object.entries(files)){const nb=enc.encode(k),db=enc.encode(d),cr=crc(db),h=[],c=[];
    w(h,0x04034b50,4,20,2,0x800,2,0,2,0,2,0x21,2,cr,4,db.length,4,db.length,4,nb.length,2,0,2);
    w(c,0x02014b50,4,20,2,20,2,0x800,2,0,2,0,2,0x21,2,cr,4,db.length,4,db.length,4,nb.length,2,0,12,off,4);
    P.push(new Uint8Array(h),nb,db);C.push(new Uint8Array(c),nb);off+=h.length+nb.length+db.length;n++}
  const cs=C.reduce((s,a)=>s+a.length,0),e=[];w(e,0x06054b50,4,0,4,n,2,n,2,cs,4,off,4,0,2);
  return new Blob([...P,...C,new Uint8Array(e)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
const col=n=>{let s='';for(n++;n;n=(n-1)/26|0)s=String.fromCharCode(65+(n-1)%26)+s;return s};
const serial=d=>Date.UTC(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8,10))/864e5+25569;
const NS='xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

function chartXml(k){
  const bar=k.type!=='d',cl=(c)=>`<a:solidFill><a:srgbClr val="${c}"/></a:solidFill>`;
  const ser=k.series.map((s,i)=>`<c:ser><c:idx val="${i}"/><c:order val="${i}"/><c:tx><c:strRef><c:f>${s.name}</c:f></c:strRef></c:tx>`+
   (bar?`<c:spPr>${cl(s.color)}</c:spPr><c:invertIfNegative val="0"/>`+(k.labels?`<c:dLbls><c:numFmt formatCode="#,##0" sourceLinked="0"/><c:spPr><a:noFill/></c:spPr><c:txPr><a:bodyPr/><a:p><a:pPr><a:defRPr sz="800"/></a:pPr><a:endParaRPr lang="id-ID"/></a:p></c:txPr><c:showLegendKey val="0"/><c:showVal val="1"/><c:showCatName val="0"/><c:showSerName val="0"/><c:showPercent val="0"/><c:showBubbleSize val="0"/></c:dLbls>`:''):
   k.colors.map((p,j)=>`<c:dPt><c:idx val="${j}"/><c:bubble3D val="0"/><c:spPr>${cl(p)}<a:ln w="19050"><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></a:ln></c:spPr></c:dPt>`).join('')+
   `<c:dLbls><c:numFmt formatCode="0%" sourceLinked="0"/><c:spPr><a:noFill/></c:spPr><c:txPr><a:bodyPr/><a:p><a:pPr><a:defRPr sz="900" b="1"><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></a:defRPr></a:pPr><a:endParaRPr lang="id-ID"/></a:p></c:txPr><c:showLegendKey val="0"/><c:showVal val="0"/><c:showCatName val="0"/><c:showSerName val="0"/><c:showPercent val="1"/><c:showBubbleSize val="0"/></c:dLbls>`)+
   `<c:cat><c:strRef><c:f>${k.cat}</c:f></c:strRef></c:cat><c:val><c:numRef><c:f>${s.val}</c:f></c:numRef></c:val></c:ser>`).join('');
  const ax=`<c:catAx><c:axId val="1"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:numFmt formatCode="General" sourceLinked="0"/><c:tickLblPos val="nextTo"/><c:crossAx val="2"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/></c:catAx><c:valAx><c:axId val="2"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:majorGridlines><c:spPr><a:ln><a:solidFill><a:srgbClr val="E5E0D2"/></a:solidFill></a:ln></c:spPr></c:majorGridlines><c:numFmt formatCode="#,##0" sourceLinked="0"/><c:tickLblPos val="nextTo"/><c:crossAx val="1"/><c:crosses val="autoZero"/></c:valAx>`;
  const plot=bar?`<c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:varyColors val="0"/>${ser}<c:gapWidth val="70"/><c:axId val="1"/><c:axId val="2"/></c:barChart>${ax}`
   :`<c:doughnutChart><c:varyColors val="1"/>${ser}<c:firstSliceAng val="0"/><c:holeSize val="55"/></c:doughnutChart>`;
  return H+`<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><c:roundedCorners val="0"/><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:p><a:pPr><a:defRPr sz="1300" b="1"/></a:pPr><a:r><a:rPr lang="id-ID" sz="1300" b="1"><a:solidFill><a:srgbClr val="1F4D3A"/></a:solidFill></a:rPr><a:t>${x(k.title)}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title><c:autoTitleDeleted val="0"/><c:plotArea><c:layout/>${plot}</c:plotArea><c:legend><c:legendPos val="b"/><c:overlay val="0"/></c:legend><c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart><c:spPr>${cl('FFFFFF')}<a:ln><a:solidFill><a:srgbClr val="DDD5C3"/></a:solidFill></a:ln></c:spPr></c:chartSpace>`}

function book(){
  const fonts=['<font><sz val="10"/><name val="Calibri"/></font>'],fills=['<fill><patternFill patternType="none"/></fill>','<fill><patternFill patternType="gray125"/></fill>'],
   borders=['<border><left/><right/><top/><bottom/><diagonal/></border>'],fmts=[],xfs=['<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'],memo={},sheets=[];
  const idx=(a,s)=>{let i=a.indexOf(s);return i<0?a.push(s)-1:i};
  /* st({b,i,sz,fc,bg,bd,nf,h,wrap}) -> nomor gaya sel */
  const st=(o={})=>{const k=JSON.stringify(o);if(k in memo)return memo[k];
    const f=idx(fonts,`<font>${o.b?'<b/>':''}${o.i?'<i/>':''}<sz val="${o.sz||10}"/><color rgb="FF${o.fc||'1D2B24'}"/><name val="Calibri"/></font>`),
     fl=o.bg?idx(fills,`<fill><patternFill patternType="solid"><fgColor rgb="FF${o.bg}"/></patternFill></fill>`):0,
     bd=o.bd?idx(borders,`<border><left/><right/><top/><bottom style="thin"><color rgb="FF${o.bd}"/></bottom><diagonal/></border>`):0,
     nf=o.nf?idx(fmts,o.nf)+164:0;
    return memo[k]=xfs.push(`<xf numFmtId="${nf}" fontId="${f}" fillId="${fl}" borderId="${bd}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="${o.h||'general'}" vertical="center"${o.wrap?' wrapText="1"':''}/></xf>`)-1};
  const cell=(cl,r,c)=>{if(cl==null)return'';const a=typeof cl=='object'?cl:{v:cl},ref=col(c)+r,s=a.s?` s="${a.s}"`:'';
    if(a.f!=null)return`<c r="${ref}"${s}${typeof a.v=='string'?' t="str"':''}><f>${x(a.f)}</f><v>${x(a.v??0)}</v></c>`;
    if(typeof a.v=='number')return`<c r="${ref}"${s}><v>${a.v}</v></c>`;
    if(a.v===''||a.v==null)return`<c r="${ref}"${s}/>`;
    return`<c r="${ref}"${s} t="inlineStr"><is><t>${x(a.v)}</t></is></c>`};
  /* sheet({name,tab,rows,cols,heights,merges,freeze,filter,bars,charts:[{type:'d'|'b',title,cat,series,colors,from:[kol,baris],to:[kol,baris]}]}) */
  return{st,date:serial,sheet:o=>sheets.push(o),
  blob(){
    const files={},ctype=[],wbRel=[];let nChart=0,nDraw=0;
    sheets.forEach((o,i)=>{const n=i+1,pane=o.freeze?`<pane ySplit="${o.freeze}" topLeftCell="A${o.freeze+1}" activePane="bottomLeft" state="frozen"/>`:'';
      let dr='';
      if(o.charts?.length){nDraw++;const rel=[],anc=o.charts.map((k,j)=>{nChart++;files[`xl/charts/chart${nChart}.xml`]=chartXml(k);ctype.push(`<Override PartName="/xl/charts/chart${nChart}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`);
        rel.push(`<Relationship Id="rId${j+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${nChart}.xml"/>`);
        return`<xdr:twoCellAnchor><xdr:from><xdr:col>${k.from[0]}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${k.from[1]}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${k.to[0]}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${k.to[1]}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${j+2}" name="Grafik ${j+1}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" r:id="rId${j+1}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`}).join('');
        files[`xl/drawings/drawing${nDraw}.xml`]=H+`<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${anc}</xdr:wsDr>`;
        files[`xl/drawings/_rels/drawing${nDraw}.xml.rels`]=H+`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rel.join('')}</Relationships>`;
        files[`xl/worksheets/_rels/sheet${n}.xml.rels`]=H+`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${nDraw}.xml"/></Relationships>`;
        ctype.push(`<Override PartName="/xl/drawings/drawing${nDraw}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`);dr='<drawing r:id="rId1"/>'}
      const rows=o.rows.map((r,ri)=>`<row r="${ri+1}"${o.heights?.[ri]?` ht="${o.heights[ri]}" customHeight="1"`:''}>${r.map((c,ci)=>cell(c,ri+1,ci)).join('')}</row>`).join('');
      files[`xl/worksheets/sheet${n}.xml`]=H+`<worksheet ${NS}><sheetPr><tabColor rgb="FF${o.tab||'1F4D3A'}"/><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView showGridLines="0" ${i?'':'tabSelected="1" '}workbookViewId="0">${pane}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="18"/><cols>${o.cols.map((c,j)=>`<col min="${j+1}" max="${j+1}" width="${c}" customWidth="1"/>`).join('')}</cols><sheetData>${rows}</sheetData>${o.filter?`<autoFilter ref="${o.filter}"/>`:''}${o.merges?.length?`<mergeCells count="${o.merges.length}">${o.merges.map(m=>`<mergeCell ref="${m}"/>`).join('')}</mergeCells>`:''}${(o.bars||[]).map((b,j)=>`<conditionalFormatting sqref="${b}"><cfRule type="dataBar" priority="${j+1}"><dataBar><cfvo type="num" val="0"/><cfvo type="num" val="1"/><color rgb="FF3E8E7E"/></dataBar></cfRule></conditionalFormatting>`).join('')}<pageMargins left=".5" right=".5" top=".6" bottom=".6" header=".3" footer=".3"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>${dr}</worksheet>`;
      ctype.push(`<Override PartName="/xl/worksheets/sheet${n}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`);
      wbRel.push(`<Relationship Id="rId${n}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${n}.xml"/>`)});
    const ns=sheets.length;
    files['xl/styles.xml']=H+`<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${fmts.length?`<numFmts count="${fmts.length}">${fmts.map((f,i)=>`<numFmt numFmtId="${164+i}" formatCode="${x(f)}"/>`).join('')}</numFmts>`:''}<fonts count="${fonts.length}">${fonts.join('')}</fonts><fills count="${fills.length}">${fills.join('')}</fills><borders count="${borders.length}">${borders.join('')}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
    files['xl/workbook.xml']=H+`<workbook ${NS}><bookViews><workbookView activeTab="0"/></bookViews><sheets>${sheets.map((o,i)=>`<sheet name="${x(o.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`;
    files['xl/_rels/workbook.xml.rels']=H+`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${wbRel.join('')}<Relationship Id="rId${ns+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
    files['_rels/.rels']=H+`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
    files['[Content_Types].xml']=H+`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${ctype.join('')}</Types>`;
    const ord=['[Content_Types].xml','_rels/.rels',...Object.keys(files).filter(k=>k[0]!=='['&&k!=='_rels/.rels')];
    return zip(Object.fromEntries(ord.map(k=>[k,files[k]])))}}}
return{book}})();
if(typeof module!=='undefined')module.exports=XL;
