import{J as ot,u as dt,r as m,q as ct,g as k,o as pt,ab as mt,j as e,Q as He,b as se,c as Te,F as xt,S as Q,m as w,ac as ht,e as ut,d as b,ad as be,T as fe,N as bt,A as Y,f as A,w as Ie,X as ge,h as B,O as I,i as ye,k as G,s as W,l as ft,ae as ve,C as gt,n as yt,p as vt,t as Ge,v as Le,af as wt}from"./index-B6wAkoQv.js";import{l as re,L as ie,a as ne}from"./loggingService-FTGYYS5x.js";import{P as jt}from"./pdfService-CvTdGN2R.js";import{Q as Nt}from"./QRScanner-B6i1RZ_T.js";import{D as qe}from"./download-B2FOvCMM.js";import{P as kt}from"./plus-A45PAJgV.js";import{F as Ct}from"./funnel-CtD9p9CL.js";import{S as St}from"./square-pen-DuZ8H94v.js";import{T as Pe}from"./trash-2-gW2MwRvX.js";import{R as zt}from"./rotate-ccw-U8SnGz_t.js";import{C as At}from"./chevron-up-oL7Ec4Xg.js";import"./jspdf.plugin.autotable-BUvgzXEJ.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]],Et=ot("wand-sparkles",Dt),L={GHS01:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/GHS-pictogram-explos.svg/200px-GHS-pictogram-explos.svg.png",GHS02:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/GHS-pictogram-flamme.svg/200px-GHS-pictogram-flamme.svg.png",GHS03:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/GHS-pictogram-rondflam.svg/200px-GHS-pictogram-rondflam.svg.png",GHS04:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/GHS-pictogram-bottle.svg/200px-GHS-pictogram-bottle.svg.png",GHS05:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/GHS-pictogram-acid.svg/200px-GHS-pictogram-acid.svg.png",GHS06:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/GHS-pictogram-skull.svg/200px-GHS-pictogram-skull.svg.png",GHS07:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/GHS-pictogram-exclam.svg/200px-GHS-pictogram-exclam.svg.png",GHS08:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/GHS-pictogram-silhouette.svg/200px-GHS-pictogram-silhouette.svg.png",GHS09:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/GHS-pictogram-pollut.svg/200px-GHS-pictogram-pollut.svg.png"},q={GHS01:"متفجرات",GHS02:"قابل للاشتعال",GHS03:"مؤكسد",GHS04:"غاز تحت الضغط",GHS05:"أكال / مسبب للتآكل",GHS06:"سمية حادة (قاتل)",GHS07:"تهيج / تحسس / خطر",GHS08:"خطر صحي جسيم",GHS09:"خطر بيئي"};function Ft({isNested:le=!1}){var $e;const[oe]=dt(),[u,_e]=m.useState([]),[Ue,Re]=m.useState(!0),[X,de]=m.useState(""),[D,we]=m.useState(oe.get("filter")==="low"),[i,C]=m.useState(null),[Me,E]=m.useState(!1),[P,K]=m.useState(null),J=m.useRef(null),[je,Ne]=m.useState(!1),[_,V]=m.useState(!1),[ke,Ce]=m.useState(!1),[Fe,Z]=m.useState(!1),[Se,ze]=m.useState({current:0,total:0}),[y,U]=m.useState([]),[c,Ae]=m.useState(null),[Oe,R]=m.useState(!1),[f,Qe]=m.useState(null),[Ye,ce]=m.useState(!1),pe=t=>{if(!t)return"غير محدد";if(!t.includes("-"))return t;const[a,s,r]=t.split("-");return!a||!s||!r?t:`${r}/${s}/${a}`},[o,x]=m.useState({nameEn:"",nameAr:"",formula:"",casNumber:"",storageTemp:"",unit:"g",quantity:0,state:"solid",hazardClass:"safe",ghs:[],shelf:"",expiryDate:"",notes:""});m.useEffect(()=>{const t=ct(k("chemicals")),a=pt(t,s=>{const r=s.docs.map(n=>({id:n.id,...n.data()}));_e(r);const l=oe.get("id");if(l){let n=l;l.startsWith("APP_ID_")&&(n=l.split("_").slice(2,-1).join("_")),de(n);const h=r.find(d=>d.id===l||d.id===n);h?C(h):r.length>0&&!i&&C(r[0])}else r.length>0&&!i&&C(r[0]);Re(!1)},s=>{B(s,I.LIST,"chemicals")});return()=>a()},[oe]);const Be=async t=>{t.preventDefault();try{if(P){const{id:a}=P;await ye(G(k("chemicals"),a),{...o,updatedAt:W()}),await re(ie.UPDATE,ne.CHEMICALS,`تعديل بيانات المادة: ${o.nameAr}`,a)}else{const a=await ft(k("chemicals"),{...o,createdAt:W()});await re(ie.CREATE,ne.CHEMICALS,`إضافة مادة جديدة: ${o.nameAr}`,a.id)}E(!1),K(null),x({nameEn:"",nameAr:"",formula:"",casNumber:"",storageTemp:"",unit:"g",quantity:0,state:"solid",hazardClass:"safe",ghs:[],shelf:"",expiryDate:"",notes:""})}catch(a){B(a,P?I.UPDATE:I.CREATE,"chemicals")}},We=async()=>{const t=o.nameEn||o.nameAr;if(!t){alert("يرجى إدخال اسم المادة أولاً (بالعربية أو الإنجليزية)");return}V(!0);try{const a=await ve(t);if(a){let s="";if(a.expiryYears>0){const r=new Date;r.setFullYear(r.getFullYear()+a.expiryYears),s=r.toISOString().split("T")[0]}x(r=>({...r,nameEn:a.nameEn||r.nameEn,nameAr:a.nameAr||r.nameAr,formula:a.formula||r.formula,casNumber:a.casNumber||r.casNumber,storageTemp:a.storageTemp||r.storageTemp,hazardClass:a.hazardClass||r.hazardClass,ghs:a.ghs||r.ghs,expiryDate:s||r.expiryDate,notes:a.notes||r.notes}))}else alert("لم نتمكن من الحصول على معلومات دقيقة لهذه المادة. يرجى إدخالها يدوياً.")}catch(a){console.error("Smart fill error:",a),alert("حدث خطأ أثناء محاولة الحصول على المعلومات الذكية.")}finally{V(!1)}},De=async t=>{const a=t||i;if(a){V(!0);try{const s=await ve(a.nameEn||a.nameAr);s?(Ae(s),t&&C(t),R(!0)):alert("لم نتمكن من الحصول على اقتراحات تحديث لهذه المادة.")}catch(s){console.error("Smart update request error:",s),alert("حدث خطأ أثناء طلب التحديث الذكي.")}finally{V(!1)}}},Xe=async()=>{if(!(!i||!c))try{let t=i.expiryDate;if(c.expiryYears>0){const a=new Date;a.setFullYear(a.getFullYear()+c.expiryYears),t=a.toISOString().split("T")[0]}await ye(G(k("chemicals"),i.id),{nameEn:c.nameEn,nameAr:c.nameAr,formula:c.formula,casNumber:c.casNumber,storageTemp:c.storageTemp,hazardClass:c.hazardClass,ghs:c.ghs,expiryDate:t,notes:c.notes,updatedAt:W()}),R(!1),Ae(null),alert("تم تحديث معلومات المادة بنجاح!")}catch(t){B(t,I.UPDATE,`chemicals/${i.id}`)}},Ke=async()=>{if(Z(!1),!await gt()){alert("يرجى اختيار مفتاح API الخاص بك لاستخدام ميزة التحديث الذكي.");return}Ce(!0),ze({current:0,total:u.length});let a=0,s=0;for(let r=0;r<u.length;r++){const l=u[r];ze({current:r+1,total:u.length});try{const n=await ve(l.nameEn||l.nameAr);if(n){let h=l.expiryDate;if(n.expiryYears>0){const d=new Date;d.setFullYear(d.getFullYear()+n.expiryYears),h=d.toISOString().split("T")[0]}await ye(G(k("chemicals"),l.id),{nameEn:n.nameEn||l.nameEn,nameAr:n.nameAr||l.nameAr,formula:n.formula||l.formula,casNumber:n.casNumber||l.casNumber,storageTemp:n.storageTemp||l.storageTemp,hazardClass:n.hazardClass||l.hazardClass,ghs:n.ghs||l.ghs,expiryDate:h||l.expiryDate,notes:n.notes||l.notes,updatedAt:W()}),a++}else s++}catch(n){console.error(`Error updating chemical ${l.nameEn}:`,n),s++;const h=(n==null?void 0:n.message)||String(n);if(h.includes("quota")||h.includes("RESOURCE_EXHAUSTED")){alert("تم إيقاف التحديث التلقائي بسبب تجاوز حصة الاستخدام المسموح بها (Quota Exceeded). يرجى المحاولة لاحقاً أو التحقق من حساب Gemini API الخاص بك.");break}}await new Promise(n=>setTimeout(n,5e3))}Ce(!1),alert(`اكتمل التحديث الذكي!
تم تحديث: ${a} مادة بنجاح
فشل: ${s} مادة`)},Je=async(t,a)=>{try{await yt(G(k("chemicals"),t)),await re(ie.DELETE,ne.CHEMICALS,`حذف المادة: ${a}`,t),(i==null?void 0:i.id)===t&&C(u.find(s=>s.id!==t)||null)}catch(s){B(s,I.DELETE,`chemicals/${t}`)}},Ve=()=>{const t=window.open("","_blank");if(!t){alert("يرجى السماح بالنوافذ المنبثقة لطباعة القائمة");return}const a=$.filter(n=>n.ghs&&n.ghs.length>0||n.hazardClass==="danger").length,s=new Date,r=`${s.getDate()}/${s.getMonth()+1}/${s.getFullYear()}`,l=$.map((n,h)=>{const d=n.ghs&&n.ghs.length>0||n.hazardClass==="danger",H=(n.ghs||[]).map(j=>`<div style="display: inline-flex; flex-direction: column; align-items: center; margin: 2px; border: 1px solid #ddd; padding: 2px; border-radius: 4px; background: white;">
          <img src="${L[j]}" style="height: 28px; width: 28px;" alt="${j}" />
          <span style="font-size: 7px; font-weight: bold; margin-top: 1px;">${q[j]||j}</span>
        </div>`).join("");return`
        <tr style="${d?"background-color: #fee2e2;":""}">
          <td style="text-align: center;">${h+1}</td>
          <td style="font-weight: 600;">${n.nameEn}</td>
          <td>${n.nameAr}</td>
          <td style="font-family: 'JetBrains Mono', monospace;">${n.formula}</td>
          <td style="text-align: center;">${n.unit}</td>
          <td style="text-align: center; font-weight: 600;">${n.quantity}</td>
          <td style="text-align: center;">${n.state==="solid"?"صلب":n.state==="liquid"?"سائل":"غاز"}</td>
          <td>${n.hazardClass==="danger"?"خطر":"آمن"}</td>
          <td style="text-align: center;">${H}</td>
          <td style="text-align: center;">${n.shelf}</td>
          <td style="font-size: 0.85em;">${n.notes||"-"}</td>
        </tr>
      `}).join("");t.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>سجل المواد الكيميائية للمخبر - ${r}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
          <style>
            @page { size: A4 landscape; margin: 10mm; }
            body { 
              font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif; 
              margin: 0; 
              padding: 10px; 
              color: #1a1a1a;
              line-height: 1.4;
            }
            .page-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              border-bottom: 1px double #000;
              padding-bottom: 10px;
            }
            .header-right, .header-left {
              width: 45%;
              font-size: 12px;
              font-weight: 600;
            }
            .header-center {
              text-align: center;
              width: 100%;
              margin-bottom: 15px;
            }
            .header-center h2 { margin: 5px 0; font-size: 16px; text-decoration: underline; }
            .header-center h3 { margin: 5px 0; font-size: 14px; }
            
            .stats-bar {
              display: flex;
              gap: 20px;
              margin-bottom: 15px;
              font-weight: 700;
              background: #f3f4f6;
              padding: 8px 15px;
              border-radius: 4px;
              border: 1px solid #e5e7eb;
            }

            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 6px 4px; 
              text-align: right; 
            }
            th { 
              background-color: #e5e7eb; 
              font-weight: 700; 
              text-align: center;
              font-size: 10px;
            }
            
            .legend {
              margin-top: 15px;
              font-size: 11px;
              font-weight: 600;
            }

            .footer-signatures {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              padding: 0 50px;
            }
            .signature-box {
              text-align: center;
              width: 200px;
            }
            .signature-box p { margin-bottom: 40px; font-weight: 700; text-decoration: underline; }

            .print-meta {
              position: fixed;
              bottom: 0;
              left: 0;
              font-size: 9px;
              color: #666;
            }

            @media print {
              .no-print { display: none; }
              body { padding: 0; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header-center">
            <h3>الجمهورية الجزائرية الديمقراطية الشعبية</h3>
            <h3>وزارة التربية الوطنية</h3>
          </div>

          <div class="page-header">
            <div class="header-right">
              <div>مديرية التربية لولاية: أم البواقي</div>
              <div>ثانوية: بوحازم عبد المجيد - عين كرشة</div>
            </div>
            <div class="header-left" style="text-align: left;">
              <div>السنة الدراسية: 2025/2026</div>
            </div>
          </div>

          <div class="header-center">
            <h2>سجل المواد الكيميائية للمخبر</h2>
          </div>

          <div class="stats-bar">
            <span>إجمالي المواد: ${$.length}</span>
            <span>المواد الخطرة: ${a}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 30px;">رقم</th>
                <th>PRODUIT CHIMIQUE</th>
                <th>الاسم العربي</th>
                <th>الصيغة</th>
                <th style="width: 40px;">الوحدة</th>
                <th style="width: 50px;">الكمية</th>
                <th style="width: 50px;">الحالة</th>
                <th>الخطورة</th>
                <th style="width: 80px;">GHS</th>
                <th style="width: 40px;">الرف</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${l}
            </tbody>
          </table>

          <div class="legend">
            <span style="display: inline-block; width: 15px; height: 15px; background: #fee2e2; border: 1px solid #000; vertical-align: middle; margin-left: 5px;"></span>
            خلفية حمراء = مادة خطرة
          </div>

          <div class="footer-signatures">
            <div class="signature-box">
              <p>رئيس المصلحة</p>
            </div>
            <div class="signature-box">
              <p>المقتصد</p>
            </div>
            <div class="signature-box">
              <p>المخبري</p>
            </div>
          </div>

          <div class="print-meta no-print">
            طُبع بواسطة نظام الإدارة المخبرية الذكي بتاريخ: ${r}
          </div>
        </body>
      </html>
    `),t.document.close(),t.print()},Ze=async()=>{const t=["#","الاسم العلمي","الاسم العربي","الصيغة","الكمية","الرف","تاريخ الصلاحية"],a=v.map((s,r)=>[r+1,s.nameEn||"",s.nameAr||"",s.formula||"",`${s.quantity} ${s.unit}`,s.shelf||"",pe(s.expiryDate)]);await jt.generateTablePDF("تقرير جرد المواد الكيميائية",t,a,`chemicals_inventory_${new Date().toISOString().split("T")[0]}.pdf`)},et=()=>{const t=A.json_to_sheet(v.map(s=>({"الاسم (EN)":s.nameEn,"الاسم (AR)":s.nameAr,الصيغة:s.formula,"رقم CAS":s.casNumber,الكمية:s.quantity,الوحدة:s.unit,الحالة:s.state,الخطورة:s.hazardClass,الرف:s.shelf,"تاريخ الصلاحية":s.expiryDate,ملاحظات:s.notes}))),a=A.book_new();A.book_append_sheet(a,t,"Inventory"),Ie(a,`chemical_inventory_${new Date().toISOString().split("T")[0]}.xlsx`)},tt=async t=>{var r;const a=(r=t.target.files)==null?void 0:r[0];if(!a)return;Ne(!0);const s=new FileReader;s.onload=async l=>{var n;try{const h=(n=l.target)==null?void 0:n.result,d=vt(h,{type:"binary",cellDates:!0}),H=d.SheetNames[0],j=d.Sheets[H],ee=A.sheet_to_json(j),xe=p=>{if(!p)return"";if(p instanceof Date)return p.toISOString().split("T")[0];const T=new Date(p);return isNaN(T.getTime())?String(p).trim():T.toISOString().split("T")[0]},g=(p,T)=>{const he=Object.keys(p);for(const F of T){const O=he.find(N=>N.toLowerCase().trim()===F.toLowerCase().trim());if(O)return p[O]}},M=Ge(Le);ee.forEach(p=>{const T=g(p,["PRODUIT CHIMIQUE","Name","nameEn","Product","Chemical"])||"Unnamed Chemical",he=g(p,["الاسم العربي","الاسم","Arabic Name","nameAr","Arabic"])||"",F=g(p,["الكمية","Quantity","quantity","Qty","Amount"]),O=typeof F=="number"?F:parseFloat(String(F||"0").replace(/[^0-9.]/g,""));let N=String(g(p,["الحالة","State","state","Status"])||"solid").trim(),te="solid";N==="صلب"||N.toLowerCase()==="solid"?te="solid":N==="سائل"||N.toLowerCase()==="liquid"?te="liquid":(N==="غاز"||N.toLowerCase()==="gas")&&(te="gas");let ae=String(g(p,["الخطورة","Hazard","hazardClass","Danger"])||"safe").trim(),ue="safe";ae==="خطر"||ae.toLowerCase()==="danger"?ue="danger":(ae==="آمن"||ae.toLowerCase()==="safe")&&(ue="safe");const nt=G(k("chemicals"));M.set(nt,{nameEn:String(T).trim(),nameAr:String(he).trim(),formula:g(p,["الصيغة","Formula","formula"])||"",unit:g(p,["الوحدة","Unit","unit"])||"g",quantity:isNaN(O)?0:O,state:te,hazardClass:ue,ghs:Array.isArray(p.GHS)?p.GHS:p.GHS?String(p.GHS).split(",").map(lt=>lt.trim()):[],shelf:g(p,["الرف","Shelf","shelf"])||"",expiryDate:xe(g(p,["الصلاحية","Expiry","تاريخ الانتهاء","expiryDate"])),notes:g(p,["ملاحظات","Notes","notes"])||"",createdAt:W()})}),await M.commit(),alert(`تم استيراد ${ee.length} مادة بنجاح!`)}catch(h){console.error("Error importing XLS:",h),alert("حدث خطأ أثناء استيراد الملف. يرجى التأكد من صيغة الملف.")}finally{Ne(!1),J.current&&(J.current.value="")}},s.readAsBinaryString(a)},me=t=>{const a=window.open("","_blank");if(!a){alert("يرجى السماح بالنوافذ المنبثقة لطباعة البطاقات");return}const s=new Date;`${s.getDate()}`,s.getMonth()+1,`${s.getFullYear()}`;const r="2025/2026",l="بوحازم عبد المجيد - عين كرشة",n="أم البواقي",h=t.map((d,H)=>{var g,M;const j=d.state==="solid"?"صلب":d.state==="liquid"?"سائل":"غاز",ee=d.hazardClass==="danger"?(g=d.ghs)!=null&&g[0]?q[d.ghs[0]]:"خطر":"آمن",xe=(M=d.ghs)!=null&&M[0]?"☠️":"—";return`
        <div class="pcard">
          <div class="ph">
            <div class="ph-r">مديرية التربية لولاية: ${n}<br>ثانوية: ${l}</div>
            <div class="ph-c">الجمهورية الجزائرية الديمقراطية الشعبية<br>وزارة التربية الوطنية</div>
            <div class="ph-l">السنة الدراسية: ${r}</div>
          </div>
          <div class="pcard-title">بطاقة مخزون — مادة كيميائية</div>
          <div class="ic-years">
            <span><b>الرمز:</b> ${H+1}</span>
            <span><b>وحدة القياس:</b> ${d.unit}</span>
          </div>
          <div class="ic-meta" style="grid-template-columns:repeat(3,1fr)">
            <div class="ic-mf"><div class="ml">الاسم بالعربية</div><div class="mv" style="font-weight:700">${d.nameAr}</div></div>
            <div class="ic-mf"><div class="ml">PRODUIT CHIMIQUE</div><div class="mv" style="direction:ltr;font-size:5pt">${d.nameEn}</div></div>
            <div class="ic-mf" style="border-left:none"><div class="ml">ختم المؤسسة</div><div class="mv ic-stamp"></div></div>
          </div>
          <div class="ic-sec"><div class="ist">الصيغة الكيميائية:</div><div class="idl" style="direction:ltr;font-family:monospace;font-size:8pt;font-weight:700">${d.formula}</div></div>
          <div class="ic-row2">
            <div class="ic-col"><div class="ist">الحالة الفيزيائية:</div><div class="idl">${j}</div></div>
            <div class="ic-col"><div class="ist">الرف:</div><div class="idl" style="font-weight:700">${d.shelf}</div></div>
            <div class="ic-col"><div class="ist">رمز GHS:</div><div class="idl" style="font-size:10pt;text-align:center">${xe}</div></div>
          </div>
          <div class="ic-sec">
            <div class="ist">الخطورة / DANGER:</div>
            <div class="idl" style="font-size:5pt">${ee}</div>
          </div>
          <div class="ic-sec">
            <div class="ist">ملاحظات السلامة:</div>
            <div class="idl" style="font-size:5pt">${d.notes||"تجنب التلامس المباشر، تخزين في وعاء مغلق."}</div>
          </div>
          <table class="ic-tbl">
            <thead>
              <tr>
                <th rowspan="2">التاريخ</th><th colspan="2">رقم سند الطلب</th><th rowspan="2">المصدر/الاتجاه</th><th rowspan="2">الثمن</th><th colspan="3">الكمية</th><th rowspan="2">ملاحظات</th>
              </tr>
              <tr><th>دخول</th><th>خروج</th><th>دخول</th><th>خروج</th><th>المخزون</th></tr>
            </thead>
            <tbody>
              <tr><td></td><td></td><td></td><td></td><td></td><td>${d.quantity} ${d.unit}</td><td>..........</td><td>..........</td><td style="font-size:5pt">نقل ←</td></tr>
              ${Array(8).fill("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>").join("")}
              <tr><td></td><td></td><td></td><td></td><td></td><td>..........</td><td>..........</td><td>..........</td><td style="font-size:5pt">ينقل ←</td></tr>
            </tbody>
          </table>
        </div>
        <div class="pcard">
          <div class="back-title">تتمة — ${d.nameAr} (${d.formula}) | رقم: <u>${H+1}</u></div>
          <div class="ic-bsec">
            <div class="ic-btitle">حركة المخزون — تتمة</div>
            <table class="ic-tbl">
              <thead>
                <tr>
                  <th rowspan="2">التاريخ</th><th colspan="2">رقم سند الطلب</th><th rowspan="2">المصدر/الاتجاه</th><th rowspan="2">الثمن</th><th colspan="3">الكمية</th><th rowspan="2">ملاحظات</th>
                </tr>
                <tr><th>دخول</th><th>خروج</th><th>دخول</th><th>خروج</th><th>المخزون</th></tr>
              </thead>
              <tbody>
                <tr><td></td><td></td><td></td><td></td><td></td><td>..........</td><td>..........</td><td>..........</td><td style="font-size:5pt">نقل ←</td></tr>
                ${Array(10).fill("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>").join("")}
                <tr><td></td><td></td><td></td><td></td><td></td><td>..........</td><td>..........</td><td>..........</td><td style="font-size:5pt">ينقل ←</td></tr>
              </tbody>
            </table>
          </div>
          <div class="ic-bsec" style="margin-top:6mm">
            <div class="ic-btitle">شروط السلامة عند التخزين</div>
            <table class="ic-tbl">
              <thead>
                <tr><th width="35%">التاريخ</th><th width="40%">الإجراء / الملاحظة</th><th width="25%">الإمضاء</th></tr>
              </thead>
              <tbody>
                ${Array(5).fill("<tr><td></td><td></td><td></td></tr>").join("")}
              </tbody>
            </table>
          </div>
        </div>
      `}).join("");a.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>بطاقات مخزون المواد الكيميائية — ${t.length} مادة</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; background: #eef2f7; font-size: 7pt; }

            #toolbar {
                position: sticky; top: 0; z-index: 99;
                background: #1a2744; color: white;
                padding: 8px 16px; display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 13px;
            }
            #toolbar h3 { flex: 1; }
            .tb-btn { padding: 7px 16px; border: none; border-radius: 7px; cursor: pointer; font-weight: 700; font-size: 12px; font-family: Cairo, sans-serif; }
            .tb-print { background: #00b894; color: white; }
            .tb-close  { background: #e74c3c; color: white; }
            .tb-info   { background: rgba(255,255,255,0.15); color: white; font-size: 11px; padding: 5px 10px; border-radius: 5px; }

            #body { padding: 12px; }

            .pcard {
                background: white; border: 1px solid #000; padding: 3mm 4mm;
                direction: rtl; width: 138mm; height: 200mm;
                margin: 8px auto; display: flex; flex-direction: column; overflow: hidden;
                box-shadow: 0 2px 6px rgba(0,0,0,0.12); gap: 1.5mm;
            }

            .ph {
                display: grid; grid-template-columns: 1fr 1.5fr 1fr;
                border-bottom: 1px solid #000; padding-bottom: 1.5mm; margin-bottom: 0;
                font-size: 5.5pt; gap: 2px; align-items: start; flex-shrink: 0;
            }
            .ph-r { text-align: right; font-weight: bold; line-height: 1.45; }
            .ph-c { text-align: center; font-weight: bold; line-height: 1.45; }
            .ph-l { text-align: left; font-size: 5pt; line-height: 1.45; }

            .pcard-title {
                text-align: center; font-size: 8pt; font-weight: bold;
                text-decoration: underline; text-underline-offset: 1.5px;
                flex-shrink: 0; padding: 0.5mm 0;
            }

            .ic-years { display: flex; justify-content: space-between; font-size: 5.5pt; flex-shrink: 0; }
            .ic-meta { display: grid; border: 1px solid #000; flex-shrink: 0; }
            .ic-mf { padding: 1mm 2mm; border-left: 1px solid #000; font-size: 5.5pt; }
            .ic-mf:last-child { border-left: none; }
            .ic-ml { font-weight: bold; font-size: 5pt; color: #333; }
            .mv { border-bottom: 1px solid #777; min-height: 8mm; padding: 0.5mm 1mm; font-size: 5.5pt; }
            .ic-stamp { min-height: 10mm !important; }

            .ic-sec { flex-shrink: 0; }
            .ist { font-weight: bold; font-size: 5.5pt; margin-bottom: 0.5mm; }
            .idl { border-bottom: 1px dotted #666; min-height: 5mm; padding: 0.5mm 1mm; font-size: 5.5pt; margin-bottom: 1mm; }

            .ic-row2 { display: flex; gap: 3mm; flex-shrink: 0; }
            .ic-col { flex: 1; }

            .ic-tbl { width: 100%; border-collapse: collapse; font-size: 5.5pt; flex-shrink: 0; table-layout: fixed; }
            .ic-tbl th, .ic-tbl td { border: 1px solid #000; padding: 0.5mm 1mm; text-align: center; }
            .ic-tbl th { background: #dde4ee; font-size: 5pt; white-space: nowrap; }
            .ic-tbl td { height: 5mm; }

            .back-title {
                text-align: center; font-weight: bold; font-size: 6pt;
                border-bottom: 1.5px solid #000; padding-bottom: 1.5mm; margin-bottom: 1.5mm;
                flex-shrink: 0;
            }

            .ic-bsec { flex-shrink: 0; margin-bottom: 2mm; }
            .ic-btitle {
                font-weight: bold; font-size: 5.5pt;
                background: #eef1f7; border: 1px solid #000; border-bottom: none;
                padding: 1mm 3mm; text-align: center;
            }

            @media print {
                #toolbar { display: none !important; }
                body { background: white !important; margin: 0; }
                #body { padding: 0 !important; }
                @page { size: A5 portrait; margin: 5mm; }
                .pcard {
                    width: 100% !important; height: calc(210mm - 10mm) !important;
                    margin: 0 !important; padding: 4mm 5mm !important;
                    border: 1.5px solid #000 !important; box-shadow: none !important;
                    page-break-after: always !important; break-after: page !important;
                    overflow: hidden !important;
                }
                .pcard:last-child { page-break-after: avoid !important; break-after: avoid !important; }
                tr { page-break-inside: avoid !important; break-inside: avoid !important; }
            }
          </style>
        </head>
        <body>
          <div id="toolbar">
              <h3>🖨️ بطاقات مخزون المواد الكيميائية — ${t.length} مادة</h3>
              <span class="tb-info">📄 A5 recto-verso — بطاقة واحدة لكل صفحة</span>
              <button class="tb-btn tb-print" onclick="window.print()">🖨️ طباعة الآن</button>
              <button class="tb-btn tb-close" onclick="window.close()">✕ إغلاق</button>
          </div>
          <div id="body">
            ${h}
          </div>
        </body>
      </html>
    `),a.document.close()},at=t=>{const a=window.open("","_blank");a&&(a.document.write(`
      <html dir="rtl">
        <head>
          <title>بطاقة مادة - ${t.nameEn}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #2b3d22; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #2b3d22; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .label { font-weight: bold; color: #5c6146; }
            .hazard { color: #e11d48; font-weight: bold; }
            .footer { margin-top: 50px; text-align: left; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">بطاقة تعريف مادة كيميائية</div>
            <div>نظام تسيير المخابر المدرسية</div>
          </div>
          <div class="details">
            <div class="item"><span class="label">PRODUIT CHIMIQUE:</span> ${t.nameEn}</div>
            <div class="item"><span class="label">الاسم العربي:</span> ${t.nameAr}</div>
            <div class="item"><span class="label">الصيغة الكيميائية:</span> ${t.formula}</div>
            <div class="item"><span class="label">رقم CAS:</span> ${t.casNumber||"غير متوفر"}</div>
            <div class="item"><span class="label">درجة التخزين:</span> ${t.storageTemp||"غير متوفر"}</div>
            <div class="item"><span class="label">الحالة:</span> ${t.state}</div>
            <div class="item"><span class="label">الكمية الحالية:</span> ${t.quantity} ${t.unit}</div>
            <div class="item"><span class="label">الرف:</span> ${t.shelf}</div>
            <div class="item"><span class="label">الصلاحية:</span> ${t.expiryDate||"غير محدد"}</div>
            <div class="item" style="grid-column: span 2;">
              <span class="label">رموز السلامة GHS:</span>
              <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                ${(t.ghs||[]).map(s=>`
                  <div style="display: flex; flex-direction: column; align-items: center; border: 1px solid #ccc; padding: 5px; border-radius: 8px; width: 70px; background: #fff;">
                    <img src="${L[s]}" style="width: 40px; height: 40px;" />
                    <span style="font-size: 9px; margin-top: 4px; text-align: center; font-weight: bold;">${q[s]||s}</span>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="item"><span class="label">تصنيف الخطورة:</span> <span class="${t.hazardClass==="danger"?"hazard":""}">${t.hazardClass==="danger"?"خطر":"آمن"}</span></div>
            <div class="item" style="grid-column: span 2;"><span class="label">ملاحظات:</span> ${t.notes||"لا توجد"}</div>
          </div>
          <div class="footer">طبع بتاريخ: ${new Date().toLocaleString("ar-DZ")}</div>
          <script>window.print();<\/script>
        </body>
      </html>
    `),a.document.close())},S=t=>{let a="asc";f&&f.key===t&&f.direction==="asc"&&(a="desc"),Qe({key:t,direction:a})},st=t=>{U(a=>a.includes(t)?a.filter(s=>s!==t):[...a,t])},rt=()=>{y.length===v.length?U([]):U(v.map(t=>t.id))},it=async()=>{if(window.confirm(`هل أنت متأكد من حذف ${y.length} مادة؟`))try{const t=Ge(Le);y.forEach(a=>{t.delete(G(k("chemicals"),a))}),await t.commit(),await re(ie.DELETE,ne.CHEMICALS,`حذف جماعي لـ ${y.length} مادة`),U([]),alert("تم الحذف بنجاح!")}catch(t){B(t,I.DELETE,"chemicals/bulk")}},v=u.filter(t=>{var r,l,n;const a=((r=t.nameEn)==null?void 0:r.toLowerCase().includes(X.toLowerCase()))||((l=t.nameAr)==null?void 0:l.toLowerCase().includes(X.toLowerCase()))||((n=t.formula)==null?void 0:n.toLowerCase().includes(X.toLowerCase())),s=!D||t.quantity<10;return a&&s}),$=mt.useMemo(()=>{const t=[...v];return f!==null&&t.sort((a,s)=>{const r=a[f.key],l=s[f.key];return r===void 0||l===void 0?0:r<l?f.direction==="asc"?-1:1:r>l?f.direction==="asc"?1:-1:0}),t},[v,f]),z=t=>(f==null?void 0:f.key)===t?f.direction==="asc"?e.jsx(At,{size:14,className:"mr-1"}):e.jsx(wt,{size:14,className:"mr-1"}):e.jsx("div",{className:"w-[14px] mr-1"}),Ee=u.filter(t=>t.quantity<10).length;return e.jsxs("div",{className:b("space-y-10 max-w-7xl mx-auto pb-20",!le&&"px-4"),children:[!le&&e.jsxs("header",{className:"flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4",children:[e.jsxs("div",{className:"text-right space-y-1",children:[e.jsx("h1",{className:"text-4xl font-black text-primary tracking-tighter",children:"المخزن الكيميائي"}),e.jsx("p",{className:"text-secondary/80 text-base font-medium",children:"إدارة وتتبع المحاليل والكواشف الكيميائية"})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx("input",{type:"file",ref:J,onChange:tt,className:"hidden",accept:".xls,.xlsx"}),e.jsxs("button",{onClick:()=>ce(!0),className:"bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(He,{size:20}),"مسح QR"]}),e.jsxs("button",{onClick:Ve,className:"bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(se,{size:20}),"طباعة القائمة"]}),e.jsxs("button",{onClick:()=>me($),className:"bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(se,{size:20,className:"text-primary"}),"طباعة بطاقات المخزون"]}),e.jsxs("button",{onClick:Ze,className:"bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(Te,{size:20}),"تصدير PDF"]}),e.jsxs("button",{onClick:()=>{var t;return(t=J.current)==null?void 0:t.click()},disabled:je,className:"bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm disabled:opacity-50",children:[je?e.jsx("div",{className:"w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"}):e.jsx(xt,{size:20}),"استيراد XLS"]}),e.jsxs("button",{onClick:et,className:"bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm",children:[e.jsx(qe,{size:20}),"تصدير الجرد"]}),e.jsxs("button",{onClick:()=>Z(!0),disabled:ke||u.length===0,className:"bg-primary text-on-primary px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50",title:"تحديث ذكي لجميع المواد في القائمة",children:[ke?e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"}),e.jsxs("span",{className:"text-xs",children:[Se.current,"/",Se.total]})]}):e.jsx(Q,{size:20}),"تحديث ذكي للكل"]}),e.jsxs("button",{onClick:()=>E(!0),className:"bg-primary text-on-primary px-8 py-3.5 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95",children:[e.jsx(kt,{size:20}),"إضافة مادة"]})]})]}),!le&&e.jsxs("section",{className:"grid grid-cols-1 md:grid-cols-4 gap-6",children:[e.jsxs("div",{className:"bg-surface-container-low p-7 rounded-[32px] border border-outline/5 hover:border-outline/20 transition-all group",children:[e.jsx("p",{className:"text-xs text-secondary/60 font-black uppercase tracking-widest mb-3",children:"إجمالي المواد"}),e.jsx("h3",{className:"text-4xl font-black text-primary group-hover:scale-110 transition-transform origin-right",children:u.length})]}),e.jsxs("div",{className:"bg-error-container/40 p-7 rounded-[32px] border border-error/10 hover:border-error/20 transition-all group",children:[e.jsx("p",{className:"text-xs text-on-error-container/60 font-black uppercase tracking-widest mb-3",children:"مواد خطرة"}),e.jsx("h3",{className:"text-4xl font-black text-error group-hover:scale-110 transition-transform origin-right",children:u.filter(t=>t.ghs&&t.ghs.length>0||t.hazardClass==="danger").length})]}),e.jsxs("div",{className:"bg-tertiary-fixed/40 p-7 rounded-[32px] border border-tertiary/10 hover:border-tertiary/20 transition-all group",children:[e.jsx("p",{className:"text-xs text-on-tertiary-fixed/60 font-black uppercase tracking-widest mb-3",children:"تنتهي قريباً"}),e.jsx("h3",{className:"text-4xl font-black text-tertiary group-hover:scale-110 transition-transform origin-right",children:u.filter(t=>{if(!t.expiryDate)return!1;const a=new Date(t.expiryDate),s=new Date;return s.setMonth(s.getMonth()+3),a<s&&a>new Date}).length.toString().padStart(2,"0")})]}),e.jsxs("div",{className:"bg-primary p-7 rounded-[32px] text-on-primary shadow-xl shadow-primary/20 hover:shadow-2xl transition-all group relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"}),e.jsxs("div",{className:"relative z-10",children:[e.jsx("p",{className:"text-white/60 text-xs font-black uppercase tracking-widest mb-3",children:"سعة التخزين"}),e.jsx("h3",{className:"text-4xl font-black",children:"68%"})]})]})]}),Ee>0&&e.jsxs(w.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"bg-error-container/30 backdrop-blur-sm text-on-error-container p-5 rounded-[32px] flex items-center justify-between border border-error/10 shadow-lg shadow-error/5",children:[e.jsxs("div",{className:"flex items-center gap-4 text-error",children:[e.jsx("div",{className:"bg-error p-3 rounded-2xl text-white shadow-lg shadow-error/20",children:e.jsx(ht,{size:20})}),e.jsxs("span",{className:"font-black text-base",children:["تنبيه: يوجد ",Ee," مواد منخفضة المخزون!"]})]}),e.jsx("button",{onClick:()=>we(!D),className:"text-sm font-black underline underline-offset-4 text-error px-6 py-2.5 hover:bg-error/10 rounded-full transition-all active:scale-95",children:D?"عرض الكل":"عرض المواد المنخفضة"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-10",children:[e.jsx("div",{className:"lg:col-span-8 space-y-8",children:e.jsxs("div",{className:"bg-surface-container-lowest rounded-[32px] overflow-hidden border border-outline/10 shadow-sm",children:[e.jsxs("div",{className:"p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-low/30 border-b border-outline/5",children:[e.jsxs("div",{className:"relative w-full md:w-80",children:[e.jsx(ut,{className:"absolute right-4 top-1/2 -translate-y-1/2 text-outline/60",size:20}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-full pr-12 pl-6 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all",placeholder:"بحث عن مادة (اسم أو صيغة)...",value:X,onChange:t=>de(t.target.value)})]}),e.jsx("div",{className:"flex gap-3",children:e.jsx("button",{onClick:()=>we(!D),className:b("p-3 border rounded-full transition-all active:scale-90",D?"bg-primary text-on-primary border-primary shadow-lg shadow-primary/20":"bg-surface-container-low hover:bg-surface-container-high border-outline/10 text-secondary"),title:D?"عرض الكل":"تصفية المواد المنخفضة",children:e.jsx(Ct,{size:22})})})]}),e.jsx("div",{className:"overflow-x-auto scrollbar-hide relative",children:e.jsxs("table",{className:"w-full text-right border-collapse table-auto",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-surface-container-low/50 text-secondary/60 text-[11px] font-black uppercase tracking-widest",children:[e.jsx("th",{className:"px-3 py-5 text-right w-12",children:e.jsx("div",{onClick:rt,className:b("w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all",y.length===v.length&&v.length>0?"bg-primary border-primary text-white":"border-outline/30 hover:border-primary/50"),children:y.length===v.length&&v.length>0&&e.jsx(be,{size:12})})}),e.jsx("th",{className:"px-3 py-5 text-right w-10",children:"#"}),e.jsx("th",{className:"px-3 py-5 text-right min-w-[140px] cursor-pointer hover:text-primary transition-colors",onClick:()=>S("nameEn"),children:e.jsxs("div",{className:"flex items-center",children:[z("nameEn"),"المادة (EN/AR)"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-16 hidden sm:table-cell cursor-pointer hover:text-primary transition-colors",onClick:()=>S("formula"),children:e.jsxs("div",{className:"flex items-center",children:[z("formula"),"الصيغة"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-20 cursor-pointer hover:text-primary transition-colors",onClick:()=>S("quantity"),children:e.jsxs("div",{className:"flex items-center",children:[z("quantity"),"الكمية"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-14 hidden lg:table-cell cursor-pointer hover:text-primary transition-colors",onClick:()=>S("state"),children:e.jsxs("div",{className:"flex items-center",children:[z("state"),"الحالة"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-18 cursor-pointer hover:text-primary transition-colors",onClick:()=>S("hazardClass"),children:e.jsxs("div",{className:"flex items-center",children:[z("hazardClass"),"الخطورة"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-20 hidden xl:table-cell",children:"GHS"}),e.jsx("th",{className:"px-3 py-5 text-right w-14 hidden md:table-cell cursor-pointer hover:text-primary transition-colors",onClick:()=>S("shelf"),children:e.jsxs("div",{className:"flex items-center",children:[z("shelf"),"الرف"]})}),e.jsx("th",{className:"px-3 py-5 text-right w-24 cursor-pointer hover:text-primary transition-colors",onClick:()=>S("expiryDate"),children:e.jsxs("div",{className:"flex items-center",children:[z("expiryDate"),"الصلاحية"]})}),e.jsx("th",{className:"px-3 py-5 text-right hidden 2xl:table-cell",children:"ملاحظات"}),e.jsx("th",{className:"px-3 py-5 text-center w-24",children:"إجراءات"})]})}),e.jsx("tbody",{className:"divide-y divide-outline/5",children:Ue?e.jsx("tr",{children:e.jsx("td",{colSpan:12,className:"px-8 py-20 text-center text-outline/60 font-bold",children:"جاري التحميل..."})}):$.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:12,className:"px-8 py-20 text-center text-outline/60 font-bold",children:"لا توجد مواد مطابقة للبحث"})}):$.map((t,a)=>{var s;return e.jsxs("tr",{onClick:()=>C(t),className:b("hover:bg-surface-container-low/40 transition-all group cursor-pointer text-base",(i==null?void 0:i.id)===t.id&&"bg-surface-container-low/60 border-r-4 border-primary"),children:[e.jsx("td",{className:"px-3 py-4",children:e.jsx("div",{onClick:r=>{r.stopPropagation(),st(t.id)},className:b("w-5 h-5 rounded border-2 cursor-pointer flex items-center justify-center transition-all",y.includes(t.id)?"bg-primary border-primary text-white scale-110":"border-outline/30 group-hover:border-primary/50"),children:y.includes(t.id)&&e.jsx(be,{size:12})})}),e.jsx("td",{className:"px-3 py-4 font-bold text-secondary/60",children:a+1}),e.jsx("td",{className:"px-3 py-4",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"font-black text-primary break-words leading-tight",children:t.nameEn}),e.jsx("span",{className:"text-xs text-secondary/60 break-words mt-0.5",children:t.nameAr})]})}),e.jsx("td",{className:"px-3 py-4 font-mono font-bold text-secondary/80 hidden sm:table-cell text-xs",children:t.formula}),e.jsxs("td",{className:"px-3 py-4 font-black text-primary whitespace-nowrap",children:[t.quantity," ",e.jsx("span",{className:"text-[10px] text-secondary/60",children:t.unit})]}),e.jsx("td",{className:"px-3 py-4 font-bold text-secondary/80 hidden lg:table-cell text-xs",children:t.state==="solid"?"صلب":t.state==="liquid"?"سائل":"غاز"}),e.jsx("td",{className:"px-3 py-4",children:e.jsx("span",{className:b("px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm",t.hazardClass==="danger"?"bg-error-container text-on-error-container":"bg-primary-fixed/40 text-primary"),children:t.hazardClass==="danger"?"خطر":"آمن"})}),e.jsx("td",{className:"px-3 py-4 hidden xl:table-cell",children:e.jsxs("div",{className:"flex gap-1.5",children:[(s=t.ghs)==null?void 0:s.slice(0,3).map((r,l)=>e.jsxs("div",{className:"w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-outline/20 p-1 shadow-sm hover:scale-125 transition-transform z-10 relative group/ghs",title:q[r]||r,children:[L[r]?e.jsx("img",{src:L[r],alt:r,className:"w-full h-full object-contain",referrerPolicy:"no-referrer"}):e.jsx("span",{className:"text-[8px] font-black",children:r}),e.jsx("div",{className:"absolute bottom-full mb-2 hidden group-hover/ghs:block bg-secondary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none shadow-xl",children:q[r]||r})]},l)),t.ghs&&t.ghs.length>3&&e.jsxs("span",{className:"text-[10px] text-secondary/40 self-center font-bold",children:["+",t.ghs.length-3]})]})}),e.jsx("td",{className:"px-3 py-4 font-bold text-primary hidden md:table-cell text-xs",children:t.shelf}),e.jsx("td",{className:"px-3 py-4",children:e.jsxs("span",{className:b("font-bold whitespace-nowrap text-xs",t.expiryDate&&new Date(t.expiryDate)<new Date?"text-error flex items-center gap-1":"text-secondary/80"),children:[pe(t.expiryDate),t.expiryDate&&new Date(t.expiryDate)<new Date&&e.jsx(fe,{size:14})]})}),e.jsx("td",{className:"px-3 py-4 text-xs text-secondary/60 hidden 2xl:table-cell min-w-[200px] leading-relaxed break-words",children:t.notes}),e.jsx("td",{className:"px-3 py-4 text-center",children:e.jsxs("div",{className:"flex gap-1 justify-center",children:[e.jsx("button",{onClick:r=>{r.stopPropagation(),De(t)},disabled:_,className:"p-1.5 text-outline/40 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-90",title:"تحديث ذكي",children:e.jsx(Q,{size:16})}),e.jsx("button",{onClick:r=>{r.stopPropagation(),K(t),x({nameEn:t.nameEn,nameAr:t.nameAr,formula:t.formula,casNumber:t.casNumber||"",storageTemp:t.storageTemp||"",unit:t.unit,quantity:t.quantity,state:t.state,hazardClass:t.hazardClass,ghs:t.ghs,shelf:t.shelf,expiryDate:t.expiryDate,notes:t.notes}),E(!0)},className:"p-1.5 text-outline/40 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-90",title:"تعديل",children:e.jsx(St,{size:16})}),e.jsx("button",{onClick:r=>{r.stopPropagation(),Je(t.id,t.nameAr)},className:"p-1.5 text-outline/40 hover:text-error hover:bg-error/10 transition-all rounded-full active:scale-90",title:"حذف",children:e.jsx(Pe,{size:16})})]})})]},t.id)})})]})})]})}),e.jsxs("div",{className:"lg:col-span-4 space-y-8",children:[i?e.jsxs(w.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},className:"bg-surface-container-lowest rounded-[32px] p-10 relative overflow-hidden border border-outline/10 shadow-sm",children:[e.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[120px] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"}),e.jsxs("div",{className:"relative z-10 space-y-8",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx("span",{className:b("text-[11px] px-4 py-1.5 rounded-[28px_28px_4px_28px] font-black uppercase tracking-widest shadow-sm",i.hazardClass==="danger"?"bg-error-container text-on-error-container":"bg-tertiary-fixed/60 text-tertiary"),children:i.hazardClass==="danger"?"مادة خطرة":"مادة آمنة"}),i.hazardClass==="danger"&&e.jsx("div",{className:"flex gap-2 text-error animate-pulse",children:e.jsx(fe,{size:28})})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-black text-primary mb-1 tracking-tight",children:i.nameEn}),e.jsx("h3",{className:"text-xl font-bold text-secondary mb-2 tracking-tight",children:i.nameAr}),e.jsx("p",{className:"text-lg font-mono font-bold text-secondary/60",children:i.formula})]}),e.jsxs("div",{className:"space-y-5 pt-8 border-t border-outline/5",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"رقم CAS"}),e.jsx("span",{className:"font-black text-primary text-lg",children:i.casNumber||"غير متوفر"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"درجة التخزين"}),e.jsx("span",{className:"font-black text-primary text-lg",children:i.storageTemp||"غير متوفر"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"الحالة"}),e.jsx("span",{className:"font-black text-primary text-lg",children:i.state==="solid"?"صلب":i.state==="liquid"?"سائل":"غاز"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"الرف"}),e.jsx("span",{className:"font-black text-primary text-lg",children:i.shelf})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"الصلاحية"}),e.jsx("span",{className:b("font-black text-lg",i.expiryDate&&new Date(i.expiryDate)<new Date?"text-error":"text-primary"),children:pe(i.expiryDate)})]}),e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx("span",{className:"text-base font-bold text-secondary/60 uppercase tracking-widest",children:"ملاحظات"}),e.jsx("span",{className:"font-black text-primary text-sm text-left flex-1 mr-4 leading-relaxed break-words",children:i.notes||"لا توجد"})]}),i.ghs&&i.ghs.length>0&&e.jsxs("div",{className:"pt-6 border-t border-outline/5",children:[e.jsx("span",{className:"text-[11px] font-black text-secondary/40 uppercase tracking-[0.2em] block mb-4",children:"رموز السلامة GHS"}),e.jsx("div",{className:"grid grid-cols-3 gap-4",children:i.ghs.map((t,a)=>e.jsxs("div",{className:"bg-white p-3 rounded-2xl border border-outline/10 shadow-md hover:shadow-lg hover:border-primary/30 transition-all flex flex-col items-center gap-2 group/card",children:[e.jsx("div",{className:"w-16 h-16 flex items-center justify-center group-hover/card:scale-110 transition-transform",children:L[t]?e.jsx("img",{src:L[t],alt:t,className:"w-full h-full object-contain",referrerPolicy:"no-referrer"}):e.jsx("div",{className:"w-full h-full flex items-center justify-center text-xs font-black bg-surface-container-high rounded-xl",children:t})}),e.jsx("span",{className:"text-[10px] font-black text-secondary text-center leading-tight",children:q[t]||t})]},a))})]}),e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex justify-between items-end",children:[e.jsx("span",{className:"text-sm font-black text-primary uppercase tracking-widest",children:"مستوى المخزون"}),e.jsxs("span",{className:"text-2xl font-black text-primary",children:[i.quantity," ",e.jsx("span",{className:"text-sm text-secondary/60",children:i.unit})]})]}),e.jsx("div",{className:"h-3 w-full bg-surface-container rounded-full overflow-hidden border border-outline/5 shadow-inner",children:e.jsx("div",{className:"h-full bg-primary rounded-full shadow-sm",style:{width:"70%"}})})]})]}),e.jsxs("div",{className:"flex gap-3 pt-4",children:[e.jsx("button",{onClick:()=>at(i),className:"p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90",title:"طباعة تعريفية",children:e.jsx(se,{size:22})}),e.jsx("button",{onClick:()=>me([i]),className:"p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90",title:"طباعة بطاقة المخزون",children:e.jsx(Te,{size:22})}),e.jsx("button",{onClick:()=>De(),disabled:_,className:"p-3 bg-primary-container hover:bg-primary/20 border border-primary/10 rounded-full text-primary transition-all active:scale-90 disabled:opacity-50",title:"تحديث ذكي للمعلومات",children:_?e.jsx("div",{className:"w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"}):e.jsx(Q,{size:22})}),e.jsx("button",{className:"p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90",title:"توليد رمز QR",children:e.jsx(He,{size:22})})]})]})]},i.id):e.jsx("div",{className:"bg-surface-container-lowest rounded-[32px] p-12 text-center text-outline/60 font-bold border border-outline/10 border-dashed",children:"اختر مادة من القائمة لعرض تفاصيلها المخبرية"}),e.jsxs("div",{className:"bg-primary-container/30 backdrop-blur-sm p-8 rounded-[32px] text-on-primary-container border border-primary/10 relative overflow-hidden group shadow-sm",children:[e.jsxs("div",{className:"relative z-10",children:[e.jsxs("h4",{className:"font-black text-lg mb-3 flex items-center gap-2 text-primary",children:[e.jsx(bt,{size:20}),"تعليمات السلامة"]}),e.jsx("p",{className:"text-sm font-medium text-primary/80 leading-relaxed",children:(i==null?void 0:i.hazardClass)==="danger"?"يجب ارتداء القفازات والنظارات الواقية عند التعامل مع هذه المادة. يحفظ في مكان بارد وجيد التهوية بعيداً عن مصادر الحرارة.":"يرجى اتباع بروتوكولات المختبر القياسية عند التعامل مع هذه المادة لضمان سلامتك وسلامة الزملاء."})]}),e.jsx(fe,{className:"absolute -bottom-6 -left-6 text-primary/5 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-700"})]})]})]}),e.jsx(Y,{children:y.length>0&&e.jsxs(w.div,{initial:{y:100,opacity:0},animate:{y:0,opacity:1},exit:{y:100,opacity:0},className:"fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-secondary text-white px-8 py-5 rounded-[32px] shadow-2xl flex items-center gap-10 min-w-[500px]",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("span",{className:"text-sm font-black",children:[y.length," مادة مختارة"]}),e.jsx("span",{className:"text-[10px] text-white/60 font-bold",children:"يمكنك إجراء عمليات جماعية على هذه المواد"})]}),e.jsx("div",{className:"h-10 w-px bg-white/10"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("button",{onClick:it,className:"flex items-center gap-2 px-6 py-2.5 rounded-full bg-error/20 text-error-container hover:bg-error hover:text-white transition-all font-black text-sm",children:[e.jsx(Pe,{size:18}),"حذف المختار"]}),e.jsxs("button",{className:"flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-black text-sm",onClick:()=>{const t=u.filter(r=>y.includes(r.id)),a=A.json_to_sheet(t.map(r=>({Chemical:r.nameEn,Arabic:r.nameAr,Formula:r.formula,Qty:r.quantity,Unit:r.unit}))),s=A.book_new();A.book_append_sheet(s,a,"SelectedItems"),Ie(s,`selected_chemicals_${new Date().getTime()}.xlsx`)},children:[e.jsx(qe,{size:18}),"تصدير المختار"]}),e.jsxs("button",{onClick:()=>{const t=u.filter(a=>y.includes(a.id));me(t)},className:"flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/20 text-primary-container hover:bg-primary hover:text-white transition-all font-black text-sm",children:[e.jsx(se,{size:18}),"بطاقات المختار"]}),e.jsx("button",{onClick:()=>U([]),className:"p-2.5 hover:bg-white/10 rounded-full transition-all",children:e.jsx(ge,{size:20})})]})]})}),e.jsx(Y,{children:Me&&e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[e.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>E(!1),className:"absolute inset-0 bg-primary/20 backdrop-blur-xl"}),e.jsxs(w.div,{initial:{opacity:0,scale:.95,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},className:"relative bg-surface w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-outline/10",children:[e.jsxs("div",{className:"p-8 flex justify-between items-center bg-surface-container-low border-b border-outline/5",children:[e.jsx("h3",{className:"text-2xl font-black text-primary",children:P?"تعديل بيانات المادة":"إضافة مادة كيميائية جديدة"}),e.jsx("button",{onClick:()=>{E(!1),K(null),x({nameEn:"",nameAr:"",formula:"",casNumber:"",storageTemp:"",unit:"g",quantity:0,state:"solid",hazardClass:"safe",ghs:[],shelf:"",expiryDate:"",notes:""})},className:"p-2.5 hover:bg-surface-container-high rounded-full transition-all active:scale-90",children:e.jsx(ge,{size:24})})]}),e.jsxs("form",{onSubmit:Be,className:"p-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto no-scrollbar",children:[e.jsxs("div",{className:"md:col-span-2 flex items-end gap-4",children:[e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"PRODUIT CHIMIQUE"}),e.jsx("input",{required:!0,className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.nameEn||"",onChange:t=>x({...o,nameEn:t.target.value})})]}),e.jsxs("button",{type:"button",onClick:We,disabled:_,className:"bg-primary-container text-primary px-6 py-4 rounded-2xl flex items-center gap-2 font-black hover:bg-primary/10 transition-all active:scale-95 disabled:opacity-50 h-[58px]",title:"تعبئة ذكية للمعلومات",children:[_?e.jsx("div",{className:"w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"}):e.jsx(Et,{size:20}),e.jsx("span",{className:"hidden md:inline",children:"تعبئة ذكية"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الاسم العربي"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.nameAr||"",onChange:t=>x({...o,nameAr:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الصيغة الكيميائية"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.formula||"",onChange:t=>x({...o,formula:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"رقم CAS"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.casNumber||"",onChange:t=>x({...o,casNumber:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"درجة حرارة التخزين"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.storageTemp||"",onChange:t=>x({...o,storageTemp:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الحالة"}),e.jsxs("select",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer",value:o.state||"solid",onChange:t=>x({...o,state:t.target.value}),children:[e.jsx("option",{value:"solid",children:"صلب (Solid)"}),e.jsx("option",{value:"liquid",children:"سائل (Liquid)"}),e.jsx("option",{value:"gas",children:"غاز (Gas)"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الكمية"}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("input",{type:"number",required:!0,className:"flex-1 bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.quantity||0,onChange:t=>x({...o,quantity:Number(t.target.value)})}),e.jsxs("select",{className:"bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer",value:o.unit||"g",onChange:t=>x({...o,unit:t.target.value}),children:[e.jsx("option",{value:"g",children:"g"}),e.jsx("option",{value:"kg",children:"kg"}),e.jsx("option",{value:"ml",children:"ml"}),e.jsx("option",{value:"L",children:"L"}),e.jsx("option",{value:"unit",children:"Unit"})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"تصنيف الخطورة"}),e.jsxs("select",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer",value:o.hazardClass||"safe",onChange:t=>x({...o,hazardClass:t.target.value}),children:[e.jsx("option",{value:"safe",children:"آمن"}),e.jsx("option",{value:"danger",children:"خطر"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"GHS (فواصل بين الرموز)"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",placeholder:"GHS01, GHS02...",value:(($e=o.ghs)==null?void 0:$e.join(", "))||"",onChange:t=>x({...o,ghs:t.target.value.split(",").map(a=>a.trim()).filter(Boolean)})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الرف"}),e.jsx("input",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.shelf||"",onChange:t=>x({...o,shelf:t.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"الصلاحية ⚠"}),e.jsx("input",{type:"date",className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold",value:o.expiryDate||"",onChange:t=>x({...o,expiryDate:t.target.value})})]}),e.jsxs("div",{className:"md:col-span-2 space-y-2",children:[e.jsx("label",{className:"text-xs font-black text-secondary/60 uppercase tracking-widest mr-2",children:"ملاحظات"}),e.jsx("textarea",{className:"w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold min-h-[100px]",value:o.notes||"",onChange:t=>x({...o,notes:t.target.value})})]}),e.jsx("div",{className:"md:col-span-2 pt-6",children:e.jsx("button",{type:"submit",className:"w-full bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95",children:P?"حفظ التعديلات":"تأكيد إضافة المادة للمخزن"})})]})]})]})}),e.jsx(Y,{children:Fe&&e.jsxs("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-6",children:[e.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>Z(!1),className:"absolute inset-0 bg-black/60 backdrop-blur-sm"}),e.jsxs(w.div,{initial:{opacity:0,scale:.9,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.9,y:20},className:"relative bg-surface-container-lowest rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-outline/10 text-right",children:[e.jsx("div",{className:"w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8",children:e.jsx(Q,{size:40,className:"text-primary"})}),e.jsx("h3",{className:"text-3xl font-black text-primary mb-4 tracking-tight",children:"تحديث ذكي شامل"}),e.jsxs("p",{className:"text-secondary/80 text-lg leading-relaxed mb-10",children:["هل أنت متأكد من رغبتك في تحديث معلومات ",e.jsx("span",{className:"font-black text-primary",children:u.length})," مادة ذكياً؟",e.jsx("br",{}),e.jsx("br",{}),"قد تستغرق هذه العملية بعض الوقت. سيتم تحديث البيانات تلقائياً بناءً على اقتراحات الذكاء الاصطناعي."]}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx("button",{onClick:Ke,className:"flex-1 bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95",children:"بدء التحديث"}),e.jsx("button",{onClick:()=>Z(!1),className:"flex-1 bg-surface border border-outline/20 text-secondary py-5 rounded-full font-black hover:bg-surface-container-high transition-all active:scale-95",children:"إلغاء"})]})]})]})}),e.jsx(Y,{children:Oe&&c&&i&&e.jsxs("div",{className:"fixed inset-0 z-[60] flex items-center justify-center p-4",children:[e.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>R(!1),className:"absolute inset-0 bg-primary/20 backdrop-blur-xl"}),e.jsxs(w.div,{initial:{opacity:0,scale:.95,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},className:"relative bg-surface w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden border border-outline/10",children:[e.jsxs("div",{className:"p-8 flex justify-between items-center bg-surface-container-low border-b border-outline/5",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-primary/10 p-2.5 rounded-2xl text-primary",children:e.jsx(Q,{size:24})}),e.jsx("h3",{className:"text-2xl font-black text-primary",children:"مراجعة التحديث الذكي"})]}),e.jsx("button",{onClick:()=>R(!1),className:"p-2.5 hover:bg-surface-container-high rounded-full transition-all active:scale-90",children:e.jsx(ge,{size:24})})]}),e.jsxs("div",{className:"p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar",children:[e.jsx("p",{className:"text-secondary/80 font-bold text-center bg-surface-container-low p-4 rounded-2xl border border-outline/5",children:"تم العثور على معلومات أكثر دقة لهذه المادة. يرجى مراجعة التغييرات المقترحة أدناه قبل الموافقة."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsx("h4",{className:"text-sm font-black text-secondary/40 uppercase tracking-widest border-b border-outline/5 pb-2",children:"المعلومات الحالية"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"الاسم"}),e.jsxs("p",{className:"font-bold text-secondary",children:[i.nameEn," / ",i.nameAr]})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"الصيغة"}),e.jsx("p",{className:"font-mono font-bold text-secondary",children:i.formula})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"رقم CAS"}),e.jsx("p",{className:"font-bold text-secondary",children:i.casNumber||"غير متوفر"})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"درجة التخزين"}),e.jsx("p",{className:"font-bold text-secondary",children:i.storageTemp||"غير متوفر"})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"الخطورة"}),e.jsx("p",{className:"font-bold text-secondary",children:i.hazardClass==="danger"?"خطر":"آمن"})]}),e.jsxs("div",{className:"bg-surface-container-low/50 p-4 rounded-2xl",children:[e.jsx("label",{className:"text-[10px] font-black text-secondary/40 uppercase block mb-1",children:"ملاحظات"}),e.jsx("p",{className:"text-xs text-secondary/60",children:i.notes||"لا توجد"})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsx("h4",{className:"text-sm font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2",children:"المعلومات المقترحة ✨"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:b("p-4 rounded-2xl border transition-all",c.nameEn!==i.nameEn||c.nameAr!==i.nameAr?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"الاسم"}),e.jsxs("p",{className:"font-bold text-primary",children:[c.nameEn," / ",c.nameAr]})]}),e.jsxs("div",{className:b("p-4 rounded-2xl border transition-all",c.formula!==i.formula?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"الصيغة"}),e.jsx("p",{className:"font-mono font-bold text-primary",children:c.formula})]}),e.jsxs("div",{className:b("p-4 rounded-2xl border transition-all",c.casNumber!==i.casNumber?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"رقم CAS"}),e.jsx("p",{className:"font-bold text-primary",children:c.casNumber})]}),e.jsxs("div",{className:b("p-4 rounded-2xl border transition-all",c.storageTemp!==i.storageTemp?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"درجة التخزين"}),e.jsx("p",{className:"font-bold text-primary",children:c.storageTemp})]}),e.jsxs("div",{className:b("p-4 rounded-2xl border transition-all",c.hazardClass!==i.hazardClass?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"الخطورة"}),e.jsx("p",{className:"font-bold text-primary",children:c.hazardClass==="danger"?"خطر":"آمن"})]}),e.jsxs("div",{className:b("p-4 rounded-2xl border transition-all",c.notes!==i.notes?"bg-primary/5 border-primary/20 shadow-sm":"bg-surface-container-low/50 border-transparent"),children:[e.jsx("label",{className:"text-[10px] font-black text-primary/40 uppercase block mb-1",children:"ملاحظات"}),e.jsx("p",{className:"text-xs text-primary/80",children:c.notes})]})]})]})]})]}),e.jsxs("div",{className:"p-10 bg-surface-container-low border-t border-outline/5 flex gap-4",children:[e.jsxs("button",{onClick:Xe,className:"flex-1 bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3",children:[e.jsx(be,{size:24}),"موافقة وتحديث البيانات"]}),e.jsxs("button",{onClick:()=>R(!1),className:"flex-1 bg-surface border border-outline/20 text-secondary py-5 rounded-full font-black hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-3",children:[e.jsx(zt,{size:24}),"إلغاء التغييرات"]})]})]})]})}),e.jsx(Y,{children:Ye&&e.jsx(Nt,{onClose:()=>ce(!1),onScan:t=>{ce(!1);let a=t;t.startsWith("APP_ID_")&&(a=t.split("_").slice(2,-1).join("_")),de(a);const s=u.find(r=>r.id===a||r.id===t);s?(C(s),K(s),E(!0)):alert("عذراً، لم يتم العثور على المادة بهذه الشيفرة.")}})})]})}export{Ft as default};
