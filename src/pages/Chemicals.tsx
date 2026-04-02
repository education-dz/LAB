import React, { useState, useEffect, useRef } from 'react';
import { onSnapshot, query, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, getUserCollection } from '../firebase';
import * as XLSX from 'xlsx';
import { useSearchParams } from 'react-router-dom';
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileUp,
  History, 
  AlertTriangle,
  ShieldAlert,
  QrCode,
  Trash2,
  Edit,
  X,
  Printer,
  Bell,
  Sparkles,
  Wand2,
  Check,
  RotateCcw,
  FileText,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getChemicalIntelligence, ChemicalIntelligence, ensureApiKey } from '../services/geminiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Chemical {
  id: string;
  nameEn: string;
  nameAr: string;
  formula: string;
  casNumber?: string;
  storageTemp?: string;
  unit: string;
  quantity: number;
  state: string;
  hazardClass: string;
  ghs: string[];
  shelf: string;
  expiryDate: string;
  notes: string;
}

const GHS_ICONS: Record<string, string> = {
  'GHS01': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/GHS-pictogram-explos.svg/100px-GHS-pictogram-explos.svg.png',
  'GHS02': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/GHS-pictogram-flamme.svg/100px-GHS-pictogram-flamme.svg.png',
  'GHS03': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/GHS-pictogram-rondflam.svg/100px-GHS-pictogram-rondflam.svg.png',
  'GHS04': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/GHS-pictogram-bottle.svg/100px-GHS-pictogram-bottle.svg.png',
  'GHS05': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/GHS-pictogram-acid.svg/100px-GHS-pictogram-acid.svg.png',
  'GHS06': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/GHS-pictogram-skull.svg/100px-GHS-pictogram-skull.svg.png',
  'GHS07': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/GHS-pictogram-exclam.svg/100px-GHS-pictogram-exclam.svg.png',
  'GHS08': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/GHS-pictogram-silhouette.svg/100px-GHS-pictogram-silhouette.svg.png',
  'GHS09': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/GHS-pictogram-pollut.svg/100px-GHS-pictogram-pollut.svg.png',
};

export default function Chemicals({ isNested = false }: { isNested?: boolean }) {
  const [searchParams] = useSearchParams();
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(searchParams.get('filter') === 'low');
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChemical, setEditingChemical] = useState<Chemical | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [suggestedUpdate, setSuggestedUpdate] = useState<ChemicalIntelligence | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Chemical; direction: 'asc' | 'desc' } | null>(null);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'غير محدد';
    if (!dateStr.includes('-')) return dateStr;
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  };

  const [newChemical, setNewChemical] = useState<Partial<Chemical>>({
    nameEn: '',
    nameAr: '',
    formula: '',
    casNumber: '',
    storageTemp: '',
    unit: 'g',
    quantity: 0,
    state: 'solid',
    hazardClass: 'safe',
    ghs: [],
    shelf: '',
    expiryDate: '',
    notes: ''
  });

  useEffect(() => {
    const q = query(getUserCollection('chemicals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chemical));
      setChemicals(items);
      if (items.length > 0 && !selectedChemical) {
        setSelectedChemical(items[0]);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chemicals');
    });
    return () => unsubscribe();
  }, []);

  const handleAddChemical = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChemical) {
        const { id, ...data } = editingChemical;
        await updateDoc(doc(getUserCollection('chemicals'), id), {
          ...newChemical,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(getUserCollection('chemicals'), {
          ...newChemical,
          createdAt: serverTimestamp()
        });
      }
      setIsAddModalOpen(false);
      setEditingChemical(null);
      setNewChemical({
        nameEn: '',
        nameAr: '',
        formula: '',
        casNumber: '',
        storageTemp: '',
        unit: 'g',
        quantity: 0,
        state: 'solid',
        hazardClass: 'safe',
        ghs: [],
        shelf: '',
        expiryDate: '',
        notes: ''
      });
    } catch (error) {
      handleFirestoreError(error, editingChemical ? OperationType.UPDATE : OperationType.CREATE, 'chemicals');
    }
  };

  const handleSmartFill = async () => {
    const nameToUse = newChemical.nameEn || newChemical.nameAr;
    if (!nameToUse) {
      alert('يرجى إدخال اسم المادة أولاً (بالعربية أو الإنجليزية)');
      return;
    }

    setIsGenerating(true);
    try {
      const info = await getChemicalIntelligence(nameToUse);
      if (info) {
        // Calculate expiry date based on expiryYears
        let expiryDate = '';
        if (info.expiryYears > 0) {
          const date = new Date();
          date.setFullYear(date.getFullYear() + info.expiryYears);
          expiryDate = date.toISOString().split('T')[0];
        }

        setNewChemical(prev => ({
          ...prev,
          nameEn: info.nameEn || prev.nameEn,
          nameAr: info.nameAr || prev.nameAr,
          formula: info.formula || prev.formula,
          casNumber: info.casNumber || prev.casNumber,
          storageTemp: info.storageTemp || prev.storageTemp,
          hazardClass: info.hazardClass || prev.hazardClass,
          ghs: info.ghs || prev.ghs,
          expiryDate: expiryDate || prev.expiryDate,
          notes: info.notes || prev.notes
        }));
      } else {
        alert('لم نتمكن من الحصول على معلومات دقيقة لهذه المادة. يرجى إدخالها يدوياً.');
      }
    } catch (error) {
      console.error('Smart fill error:', error);
      alert('حدث خطأ أثناء محاولة الحصول على المعلومات الذكية.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRequestSmartUpdate = async (chemical?: Chemical) => {
    const target = chemical || selectedChemical;
    if (!target) return;
    
    setIsGenerating(true);
    try {
      const info = await getChemicalIntelligence(target.nameEn || target.nameAr);
      if (info) {
        setSuggestedUpdate(info);
        if (chemical) setSelectedChemical(chemical);
        setIsReviewModalOpen(true);
      } else {
        alert('لم نتمكن من الحصول على اقتراحات تحديث لهذه المادة.');
      }
    } catch (error) {
      console.error('Smart update request error:', error);
      alert('حدث خطأ أثناء طلب التحديث الذكي.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveUpdate = async () => {
    if (!selectedChemical || !suggestedUpdate) return;

    try {
      let expiryDate = selectedChemical.expiryDate;
      if (suggestedUpdate.expiryYears > 0) {
        const date = new Date();
        date.setFullYear(date.getFullYear() + suggestedUpdate.expiryYears);
        expiryDate = date.toISOString().split('T')[0];
      }

      await updateDoc(doc(getUserCollection('chemicals'), selectedChemical.id), {
        nameEn: suggestedUpdate.nameEn,
        nameAr: suggestedUpdate.nameAr,
        formula: suggestedUpdate.formula,
        casNumber: suggestedUpdate.casNumber,
        storageTemp: suggestedUpdate.storageTemp,
        hazardClass: suggestedUpdate.hazardClass,
        ghs: suggestedUpdate.ghs,
        expiryDate: expiryDate,
        notes: suggestedUpdate.notes,
        updatedAt: serverTimestamp()
      });
      
      setIsReviewModalOpen(false);
      setSuggestedUpdate(null);
      alert('تم تحديث معلومات المادة بنجاح!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `chemicals/${selectedChemical.id}`);
    }
  };

  const handleBulkSmartUpdate = async () => {
    setIsBulkConfirmOpen(false);
    
    // Ensure API key is available before starting
    const hasKey = await ensureApiKey();
    if (!hasKey) {
      alert('يرجى اختيار مفتاح API الخاص بك لاستخدام ميزة التحديث الذكي.');
      return;
    }

    setIsBulkUpdating(true);
    setBulkProgress({ current: 0, total: chemicals.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < chemicals.length; i++) {
      const c = chemicals[i];
      setBulkProgress({ current: i + 1, total: chemicals.length });

      try {
        const info = await getChemicalIntelligence(c.nameEn || c.nameAr);
        if (info) {
          let expiryDate = c.expiryDate;
          if (info.expiryYears > 0) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + info.expiryYears);
            expiryDate = date.toISOString().split('T')[0];
          }

          await updateDoc(doc(getUserCollection('chemicals'), c.id), {
            nameEn: info.nameEn || c.nameEn,
            nameAr: info.nameAr || c.nameAr,
            formula: info.formula || c.formula,
            casNumber: info.casNumber || c.casNumber,
            storageTemp: info.storageTemp || c.storageTemp,
            hazardClass: info.hazardClass || c.hazardClass,
            ghs: info.ghs || c.ghs,
            expiryDate: expiryDate || c.expiryDate,
            notes: info.notes || c.notes,
            updatedAt: serverTimestamp()
          });
          successCount++;
        } else {
          failCount++;
          // If we get null back, it might be a hard quota limit. 
          // We can't be 100% sure without changing the service return type, 
          // but we can check if the console logged a hard quota error.
        }
      } catch (error: any) {
        console.error(`Error updating chemical ${c.nameEn}:`, error);
        failCount++;
        
        const errorMessage = error?.message || String(error);
        if (errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
          alert("تم إيقاف التحديث التلقائي بسبب تجاوز حصة الاستخدام المسموح بها (Quota Exceeded). يرجى المحاولة لاحقاً أو التحقق من حساب Gemini API الخاص بك.");
          break; // Stop the loop
        }
      }
      
      // Increase delay to 5 seconds to stay well within the 15 RPM limit for Gemini 3 Flash
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    setIsBulkUpdating(false);
    alert(`اكتمل التحديث الذكي!\nتم تحديث: ${successCount} مادة بنجاح\nفشل: ${failCount} مادة`);
  };

  const handleDeleteChemical = async (id: string) => {
    try {
      await deleteDoc(doc(getUserCollection('chemicals'), id));
      if (selectedChemical?.id === id) {
        setSelectedChemical(chemicals.find(c => c.id !== id) || null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `chemicals/${id}`);
    }
  };

  const handlePrintList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة القائمة');
      return;
    }

    const hazardousCount = sortedChemicals.filter(c => (c.ghs && c.ghs.length > 0) || c.hazardClass === 'danger').length;
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const tableRows = sortedChemicals.map((c, index) => {
      const isHazardous = (c.ghs && c.ghs.length > 0) || c.hazardClass === 'danger';
      const ghsIcons = (c.ghs || []).map(code => 
        `<img src="${GHS_ICONS[code]}" style="height: 24px; width: 24px; margin: 0 2px;" alt="${code}" />`
      ).join('');

      return `
        <tr style="${isHazardous ? 'background-color: #fee2e2;' : ''}">
          <td style="text-align: center;">${index + 1}</td>
          <td style="font-weight: 600;">${c.nameEn}</td>
          <td>${c.nameAr}</td>
          <td style="font-family: 'JetBrains Mono', monospace;">${c.formula}</td>
          <td style="text-align: center;">${c.unit}</td>
          <td style="text-align: center; font-weight: 600;">${c.quantity}</td>
          <td style="text-align: center;">${c.state === 'solid' ? 'صلب' : c.state === 'liquid' ? 'سائل' : 'غاز'}</td>
          <td>${c.hazardClass === 'danger' ? 'خطر' : 'آمن'}</td>
          <td style="text-align: center;">${ghsIcons}</td>
          <td style="text-align: center;">${c.shelf}</td>
          <td style="font-size: 0.85em;">${c.notes || '-'}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>سجل المواد الكيميائية للمخبر - ${formattedDate}</title>
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
            <span>إجمالي المواد: ${sortedChemicals.length}</span>
            <span>المواد الخطرة: ${hazardousCount}</span>
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
              ${tableRows}
            </tbody>
          </table>

          <div class="legend">
            <span style="display: inline-block; width: 15px; height: 15px; background: #fee2e2; border: 1px solid #000; vertical-align: middle; margin-left: 5px;"></span>
            خلفية حمراء = مادة خطرة (GHS)
          </div>

          <div style="margin-top: 20px; text-align: left; font-weight: 600;">
            حرر بـ: عين كرشة &nbsp;&nbsp; في: ${formattedDate}
          </div>

          <div class="footer-signatures">
            <div class="signature-box">
              <p>مسؤول المخبر</p>
            </div>
            <div class="signature-box">
              <p>مدير(ة) الثانوية</p>
            </div>
          </div>

          <div class="print-meta">
            تم الاستخراج بواسطة نظام جرد المختبر الذكي - ${new Date().toLocaleString('ar-DZ')}
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                // window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Note: Arabic support in jsPDF requires embedding a .ttf font.
    // For this implementation, we'll focus on English names and data.
    // We advise users to use "Print to PDF" for full Arabic support.
    
    doc.setFontSize(20);
    doc.text('Chemical Inventory Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = filteredChemicals.map((c, index) => [
      index + 1,
      c.nameEn || c.nameAr,
      c.formula,
      `${c.quantity} ${c.unit}`,
      c.hazardClass === 'danger' ? 'Danger' : 'Safe',
      c.shelf,
      formatDisplayDate(c.expiryDate)
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['#', 'Chemical Name', 'Formula', 'Quantity', 'Hazard', 'Shelf', 'Expiry']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [63, 81, 181], textColor: 255 },
      styles: { font: 'helvetica', halign: 'left' },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 }
      }
    });

    doc.save(`chemical_inventory_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredChemicals.map(c => ({
      'الاسم (EN)': c.nameEn,
      'الاسم (AR)': c.nameAr,
      'الصيغة': c.formula,
      'رقم CAS': c.casNumber,
      'الكمية': c.quantity,
      'الوحدة': c.unit,
      'الحالة': c.state,
      'الخطورة': c.hazardClass,
      'الرف': c.shelf,
      'تاريخ الصلاحية': c.expiryDate,
      'ملاحظات': c.notes
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, `chemical_inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleImportXLS = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const formatDate = (val: any) => {
          if (!val) return '';
          if (val instanceof Date) {
            return val.toISOString().split('T')[0];
          }
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
          }
          return String(val).trim();
        };

        const getVal = (item: any, keys: string[]) => {
          const itemKeys = Object.keys(item);
          for (const key of keys) {
            const foundKey = itemKeys.find(k => k.toLowerCase().trim() === key.toLowerCase().trim());
            if (foundKey) return item[foundKey];
          }
          return undefined;
        };

        const batch = writeBatch(db);
        data.forEach((item) => {
          const nameEn = getVal(item, ['PRODUIT CHIMIQUE', 'Name', 'nameEn', 'Product', 'Chemical']) || 'Unnamed Chemical';
          const nameAr = getVal(item, ['الاسم العربي', 'الاسم', 'Arabic Name', 'nameAr', 'Arabic']) || '';
          const rawQuantity = getVal(item, ['الكمية', 'Quantity', 'quantity', 'Qty', 'Amount']);
          const quantity = typeof rawQuantity === 'number' ? rawQuantity : parseFloat(String(rawQuantity || '0').replace(/[^0-9.]/g, ''));
          
          // Map Arabic state to English values
          let rawState = String(getVal(item, ['الحالة', 'State', 'state', 'Status']) || 'solid').trim();
          let state = 'solid';
          if (rawState === 'صلب' || rawState.toLowerCase() === 'solid') state = 'solid';
          else if (rawState === 'سائل' || rawState.toLowerCase() === 'liquid') state = 'liquid';
          else if (rawState === 'غاز' || rawState.toLowerCase() === 'gas') state = 'gas';

          // Map Arabic hazard to English values
          let rawHazard = String(getVal(item, ['الخطورة', 'Hazard', 'hazardClass', 'Danger']) || 'safe').trim();
          let hazard = 'safe';
          if (rawHazard === 'خطر' || rawHazard.toLowerCase() === 'danger') hazard = 'danger';
          else if (rawHazard === 'آمن' || rawHazard.toLowerCase() === 'safe') hazard = 'safe';

          const docRef = doc(getUserCollection('chemicals'));
          batch.set(docRef, {
            nameEn: String(nameEn).trim(),
            nameAr: String(nameAr).trim(),
            formula: getVal(item, ['الصيغة', 'Formula', 'formula']) || '',
            unit: getVal(item, ['الوحدة', 'Unit', 'unit']) || 'g',
            quantity: isNaN(quantity) ? 0 : quantity,
            state: state,
            hazardClass: hazard,
            ghs: Array.isArray(item['GHS']) ? item['GHS'] : (item['GHS'] ? String(item['GHS']).split(',').map(s => s.trim()) : []),
            shelf: getVal(item, ['الرف', 'Shelf', 'shelf']) || '',
            expiryDate: formatDate(getVal(item, ['الصلاحية', 'Expiry', 'تاريخ الانتهاء', 'expiryDate'])),
            notes: getVal(item, ['ملاحظات', 'Notes', 'notes']) || '',
            createdAt: serverTimestamp()
          });
        });

        await batch.commit();
        alert(`تم استيراد ${data.length} مادة بنجاح!`);
      } catch (error) {
        console.error('Error importing XLS:', error);
        alert('حدث خطأ أثناء استيراد الملف. يرجى التأكد من صيغة الملف.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handlePrint = (c: Chemical) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>بطاقة مادة - ${c.nameEn}</title>
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
            <div class="item"><span class="label">PRODUIT CHIMIQUE:</span> ${c.nameEn}</div>
            <div class="item"><span class="label">الاسم العربي:</span> ${c.nameAr}</div>
            <div class="item"><span class="label">الصيغة الكيميائية:</span> ${c.formula}</div>
            <div class="item"><span class="label">رقم CAS:</span> ${c.casNumber || 'غير متوفر'}</div>
            <div class="item"><span class="label">درجة التخزين:</span> ${c.storageTemp || 'غير متوفر'}</div>
            <div class="item"><span class="label">الحالة:</span> ${c.state}</div>
            <div class="item"><span class="label">الكمية الحالية:</span> ${c.quantity} ${c.unit}</div>
            <div class="item"><span class="label">الرف:</span> ${c.shelf}</div>
            <div class="item"><span class="label">الصلاحية:</span> ${c.expiryDate || 'غير محدد'}</div>
            <div class="item"><span class="label">GHS:</span> ${c.ghs?.join(', ')}</div>
            <div class="item"><span class="label">تصنيف الخطورة:</span> <span class="${c.hazardClass === 'danger' ? 'hazard' : ''}">${c.hazardClass === 'danger' ? 'خطر' : 'آمن'}</span></div>
            <div class="item" style="grid-column: span 2;"><span class="label">ملاحظات:</span> ${c.notes || 'لا توجد'}</div>
          </div>
          <div class="footer">طبع بتاريخ: ${new Date().toLocaleString('ar-DZ')}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSort = (key: keyof Chemical) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredChemicals = chemicals.filter(c => {
    const matchesSearch = c.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.formula?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = !filterLowStock || c.quantity < 10;
    return matchesSearch && matchesLowStock;
  });

  const sortedChemicals = React.useMemo(() => {
    const sortableItems = [...filteredChemicals];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredChemicals, sortConfig]);

  const getSortIcon = (key: keyof Chemical) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />;
    }
    return <div className="w-[14px] mr-1" />;
  };

  const lowStockCount = chemicals.filter(c => c.quantity < 10).length;

  return (
    <div className={cn("space-y-10 max-w-7xl mx-auto pb-20", !isNested && "px-4")}>
      {/* Header */}
      {!isNested && (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
          <div className="text-right space-y-1">
            <h1 className="text-5xl font-black text-primary tracking-tighter">المخزن الكيميائي</h1>
            <p className="text-secondary/80 text-lg font-medium">إدارة وتتبع المحاليل والكواشف الكيميائية</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportXLS} 
              className="hidden" 
              accept=".xls,.xlsx"
            />
            <button 
              onClick={handlePrintList}
              className="bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
            >
              <Printer size={20} />
              طباعة القائمة
            </button>
            <button 
              onClick={handleExportPDF}
              className="bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
            >
              <FileText size={20} />
              تصدير PDF
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm disabled:opacity-50"
            >
              {isImporting ? (
                <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
              ) : (
                <FileUp size={20} />
              )}
              استيراد XLS
            </button>
            <button 
              onClick={handleExportXLS}
              className="bg-white text-secondary border border-outline/10 px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
            >
              <Download size={20} />
              تصدير الجرد
            </button>
            <button 
              onClick={() => setIsBulkConfirmOpen(true)}
              disabled={isBulkUpdating || chemicals.length === 0}
              className="bg-primary text-on-primary px-6 py-3.5 rounded-full flex items-center gap-2 font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
              title="تحديث ذكي لجميع المواد في القائمة"
            >
              {isBulkUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs">{bulkProgress.current}/{bulkProgress.total}</span>
                </div>
              ) : (
                <Sparkles size={20} />
              )}
              تحديث ذكي للكل
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-on-primary px-8 py-3.5 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus size={20} />
              إضافة مادة
            </button>
          </div>
        </header>
      )}

      {/* Stats */}
      {!isNested && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-low p-7 rounded-[32px] border border-outline/5 hover:border-outline/20 transition-all group">
            <p className="text-xs text-secondary/60 font-black uppercase tracking-widest mb-3">إجمالي المواد</p>
            <h3 className="text-4xl font-black text-primary group-hover:scale-110 transition-transform origin-right">{chemicals.length}</h3>
          </div>
          <div className="bg-error-container/40 p-7 rounded-[32px] border border-error/10 hover:border-error/20 transition-all group">
            <p className="text-xs text-on-error-container/60 font-black uppercase tracking-widest mb-3">مواد خطرة</p>
            <h3 className="text-4xl font-black text-error group-hover:scale-110 transition-transform origin-right">
              {chemicals.filter(c => (c.ghs && c.ghs.length > 0) || c.hazardClass === 'danger').length}
            </h3>
          </div>
          <div className="bg-tertiary-fixed/40 p-7 rounded-[32px] border border-tertiary/10 hover:border-tertiary/20 transition-all group">
            <p className="text-xs text-on-tertiary-fixed/60 font-black uppercase tracking-widest mb-3">تنتهي قريباً</p>
            <h3 className="text-4xl font-black text-tertiary group-hover:scale-110 transition-transform origin-right">
              {chemicals.filter(c => {
                if (!c.expiryDate) return false;
                const expiry = new Date(c.expiryDate);
                const threeMonthsFromNow = new Date();
                threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                return expiry < threeMonthsFromNow && expiry > new Date();
              }).length.toString().padStart(2, '0')}
            </h3>
          </div>
          <div className="bg-primary p-7 rounded-[32px] text-on-primary shadow-xl shadow-primary/20 hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-3">سعة التخزين</p>
              <h3 className="text-4xl font-black">68%</h3>
            </div>
          </div>
        </section>
      )}

      {lowStockCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-container/30 backdrop-blur-sm text-on-error-container p-5 rounded-[32px] flex items-center justify-between border border-error/10 shadow-lg shadow-error/5"
        >
          <div className="flex items-center gap-4 text-error">
            <div className="bg-error p-3 rounded-2xl text-white shadow-lg shadow-error/20">
              <Bell size={20} />
            </div>
            <span className="font-black text-base">تنبيه: يوجد {lowStockCount} مواد منخفضة المخزون!</span>
          </div>
          <button 
            onClick={() => setFilterLowStock(!filterLowStock)}
            className="text-sm font-black underline underline-offset-4 text-error px-6 py-2.5 hover:bg-error/10 rounded-full transition-all active:scale-95"
          >
            {filterLowStock ? 'عرض الكل' : 'عرض المواد المنخفضة'}
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest rounded-[32px] overflow-hidden border border-outline/10 shadow-sm">
            <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-low/30 border-b border-outline/5">
              <div className="relative w-full md:w-80">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/60" size={20} />
                <input 
                  className="w-full bg-surface-container-low border border-outline/10 rounded-full pr-12 pl-6 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                  placeholder="بحث عن مادة (اسم أو صيغة)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setFilterLowStock(!filterLowStock)}
                  className={cn(
                    "p-3 border rounded-full transition-all active:scale-90",
                    filterLowStock 
                      ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20" 
                      : "bg-surface-container-low hover:bg-surface-container-high border-outline/10 text-secondary"
                  )}
                  title={filterLowStock ? "عرض الكل" : "تصفية المواد المنخفضة"}
                >
                  <Filter size={22} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-right border-collapse table-auto">
                <thead>
                  <tr className="bg-surface-container-low/50 text-secondary/60 text-[11px] font-black uppercase tracking-widest">
                    <th className="px-3 py-5 text-right w-10">#</th>
                    <th 
                      className="px-3 py-5 text-right min-w-[140px] cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('nameEn')}
                    >
                      <div className="flex items-center">
                        {getSortIcon('nameEn')}
                        المادة (EN/AR)
                      </div>
                    </th>
                    <th 
                      className="px-3 py-5 text-right w-16 hidden sm:table-cell cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('formula')}
                    >
                      <div className="flex items-center">
                        {getSortIcon('formula')}
                        الصيغة
                      </div>
                    </th>
                    <th 
                      className="px-3 py-5 text-right w-20 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('quantity')}
                    >
                      <div className="flex items-center">
                        {getSortIcon('quantity')}
                        الكمية
                      </div>
                    </th>
                    <th 
                      className="px-3 py-5 text-right w-14 hidden lg:table-cell cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('state')}
                    >
                      <div className="flex items-center">
                        {getSortIcon('state')}
                        الحالة
                      </div>
                    </th>
                    <th 
                      className="px-3 py-5 text-right w-18 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('hazardClass')}
                    >
                      <div className="flex items-center">
                        {getSortIcon('hazardClass')}
                        الخطورة
                      </div>
                    </th>
                    <th className="px-3 py-5 text-right w-20 hidden xl:table-cell">GHS</th>
                    <th 
                      className="px-3 py-5 text-right w-14 hidden md:table-cell cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('shelf')}
                    >
                      <div className="flex items-center">
                        {getSortIcon('shelf')}
                        الرف
                      </div>
                    </th>
                    <th 
                      className="px-3 py-5 text-right w-24 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('expiryDate')}
                    >
                      <div className="flex items-center">
                        {getSortIcon('expiryDate')}
                        الصلاحية
                      </div>
                    </th>
                    <th className="px-3 py-5 text-right hidden 2xl:table-cell">ملاحظات</th>
                    <th className="px-3 py-5 text-center w-24">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/5">
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="px-8 py-20 text-center text-outline/60 font-bold">جاري التحميل...</td>
                    </tr>
                  ) : sortedChemicals.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-8 py-20 text-center text-outline/60 font-bold">لا توجد مواد مطابقة للبحث</td>
                    </tr>
                  ) : (
                    sortedChemicals.map((c, index) => (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedChemical(c)}
                        className={cn(
                          "hover:bg-surface-container-low/40 transition-all group cursor-pointer text-base",
                          selectedChemical?.id === c.id && "bg-surface-container-low/60 border-r-4 border-primary"
                        )}
                      >
                        <td className="px-3 py-4 font-bold text-secondary/60">{index + 1}</td>
                        <td className="px-3 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-primary break-words leading-tight">{c.nameEn}</span>
                            <span className="text-xs text-secondary/60 break-words mt-0.5">{c.nameAr}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 font-mono font-bold text-secondary/80 hidden sm:table-cell text-xs">{c.formula}</td>
                        <td className="px-3 py-4 font-black text-primary whitespace-nowrap">{c.quantity} <span className="text-[10px] text-secondary/60">{c.unit}</span></td>
                        <td className="px-3 py-4 font-bold text-secondary/80 hidden lg:table-cell text-xs">{c.state === 'solid' ? 'صلب' : c.state === 'liquid' ? 'سائل' : 'غاز'}</td>
                        <td className="px-3 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm",
                            c.hazardClass === 'danger' ? "bg-error-container text-on-error-container" : "bg-primary-fixed/40 text-primary"
                          )}>
                            {c.hazardClass === 'danger' ? 'خطر' : 'آمن'}
                          </span>
                        </td>
                        <td className="px-3 py-4 hidden xl:table-cell">
                          <div className="flex gap-1">
                            {c.ghs?.slice(0, 3).map((g, i) => (
                              <div key={i} className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-outline/10 p-0.5 shadow-sm" title={g}>
                                {GHS_ICONS[g] ? (
                                  <img src={GHS_ICONS[g]} alt={g} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                ) : (
                                  <span className="text-[8px] font-black">{g}</span>
                                )}
                              </div>
                            ))}
                            {c.ghs && c.ghs.length > 3 && <span className="text-[10px] text-secondary/40 self-center">+{c.ghs.length - 3}</span>}
                          </div>
                        </td>
                        <td className="px-3 py-4 font-bold text-primary hidden md:table-cell text-xs">{c.shelf}</td>
                        <td className="px-3 py-4">
                          <span className={cn(
                            "font-bold whitespace-nowrap text-xs",
                            c.expiryDate && new Date(c.expiryDate) < new Date() ? "text-error flex items-center gap-1" : "text-secondary/80"
                          )}>
                            {formatDisplayDate(c.expiryDate)}
                            {c.expiryDate && new Date(c.expiryDate) < new Date() && <AlertTriangle size={14} />}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-xs text-secondary/60 hidden 2xl:table-cell min-w-[200px] leading-relaxed break-words">{c.notes}</td>
                        <td className="px-3 py-4 text-center">
                          <div className="flex gap-1 justify-center">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRequestSmartUpdate(c);
                              }}
                              disabled={isGenerating}
                              className="p-1.5 text-outline/40 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-90"
                              title="تحديث ذكي"
                            >
                              <Sparkles size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingChemical(c);
                                setNewChemical({
                                  nameEn: c.nameEn,
                                  nameAr: c.nameAr,
                                  formula: c.formula,
                                  casNumber: c.casNumber || '',
                                  storageTemp: c.storageTemp || '',
                                  unit: c.unit,
                                  quantity: c.quantity,
                                  state: c.state,
                                  hazardClass: c.hazardClass,
                                  ghs: c.ghs,
                                  shelf: c.shelf,
                                  expiryDate: c.expiryDate,
                                  notes: c.notes
                                });
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 text-outline/40 hover:text-primary hover:bg-primary/10 transition-all rounded-full active:scale-90"
                              title="تعديل"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChemical(c.id);
                              }}
                              className="p-1.5 text-outline/40 hover:text-error hover:bg-error/10 transition-all rounded-full active:scale-90"
                              title="حذف"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {selectedChemical ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={selectedChemical.id}
              className="bg-surface-container-lowest rounded-[32px] p-10 relative overflow-hidden border border-outline/10 shadow-sm"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[120px] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-start justify-between">
                  <span className={cn(
                    "text-[11px] px-4 py-1.5 rounded-[28px_28px_4px_28px] font-black uppercase tracking-widest shadow-sm",
                    selectedChemical.hazardClass === 'danger' ? "bg-error-container text-on-error-container" : "bg-tertiary-fixed/60 text-tertiary"
                  )}>
                    {selectedChemical.hazardClass === 'danger' ? 'مادة خطرة' : 'مادة آمنة'}
                  </span>
                  {selectedChemical.hazardClass === 'danger' && (
                    <div className="flex gap-2 text-error animate-pulse">
                      <AlertTriangle size={28} />
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-3xl font-black text-primary mb-1 tracking-tight">{selectedChemical.nameEn}</h2>
                  <h3 className="text-xl font-bold text-secondary mb-2 tracking-tight">{selectedChemical.nameAr}</h3>
                  <p className="text-lg font-mono font-bold text-secondary/60">{selectedChemical.formula}</p>
                </div>

                <div className="space-y-5 pt-8 border-t border-outline/5">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-secondary/60 uppercase tracking-widest">رقم CAS</span>
                    <span className="font-black text-primary text-lg">{selectedChemical.casNumber || 'غير متوفر'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-secondary/60 uppercase tracking-widest">درجة التخزين</span>
                    <span className="font-black text-primary text-lg">{selectedChemical.storageTemp || 'غير متوفر'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-secondary/60 uppercase tracking-widest">الحالة</span>
                    <span className="font-black text-primary text-lg">{selectedChemical.state === 'solid' ? 'صلب' : selectedChemical.state === 'liquid' ? 'سائل' : 'غاز'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-secondary/60 uppercase tracking-widest">الرف</span>
                    <span className="font-black text-primary text-lg">{selectedChemical.shelf}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-secondary/60 uppercase tracking-widest">الصلاحية</span>
                    <span className={cn(
                      "font-black text-lg",
                      selectedChemical.expiryDate && new Date(selectedChemical.expiryDate) < new Date() ? "text-error" : "text-primary"
                    )}>
                      {formatDisplayDate(selectedChemical.expiryDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-base font-bold text-secondary/60 uppercase tracking-widest">ملاحظات</span>
                    <span className="font-black text-primary text-sm text-left flex-1 mr-4 leading-relaxed break-words">{selectedChemical.notes || 'لا توجد'}</span>
                  </div>

                  {selectedChemical.ghs && selectedChemical.ghs.length > 0 && (
                    <div className="pt-4 border-t border-outline/5">
                      <span className="text-[11px] font-black text-secondary/40 uppercase tracking-[0.2em] block mb-4">رموز السلامة GHS</span>
                      <div className="flex flex-wrap gap-3">
                        {selectedChemical.ghs.map((g, i) => (
                          <div key={i} className="bg-white p-2 rounded-xl border border-outline/10 shadow-sm hover:scale-110 transition-transform cursor-help" title={g}>
                            {GHS_ICONS[g] ? (
                              <img src={GHS_ICONS[g]} alt={g} className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center text-[10px] font-black bg-surface-container-high rounded-lg">{g}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black text-primary uppercase tracking-widest">مستوى المخزون</span>
                      <span className="text-2xl font-black text-primary">{selectedChemical.quantity} <span className="text-sm text-secondary/60">{selectedChemical.unit}</span></span>
                    </div>
                    <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden border border-outline/5 shadow-inner">
                      <div className="h-full bg-primary rounded-full shadow-sm" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => handlePrint(selectedChemical)}
                    className="p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90"
                    title="طباعة البطاقة"
                  >
                    <Printer size={22} />
                  </button>
                  <button 
                    onClick={() => handleRequestSmartUpdate()}
                    disabled={isGenerating}
                    className="p-3 bg-primary-container hover:bg-primary/20 border border-primary/10 rounded-full text-primary transition-all active:scale-90 disabled:opacity-50" 
                    title="تحديث ذكي للمعلومات"
                  >
                    {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <Sparkles size={22} />
                    )}
                  </button>
                  <button className="p-3 bg-surface-container-low hover:bg-surface-container-high border border-outline/10 rounded-full text-primary transition-all active:scale-90" title="توليد رمز QR">
                    <QrCode size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-surface-container-lowest rounded-[32px] p-12 text-center text-outline/60 font-bold border border-outline/10 border-dashed">
              اختر مادة من القائمة لعرض تفاصيلها المخبرية
            </div>
          )}

          <div className="bg-primary-container/30 backdrop-blur-sm p-8 rounded-[32px] text-on-primary-container border border-primary/10 relative overflow-hidden group shadow-sm">
            <div className="relative z-10">
              <h4 className="font-black text-lg mb-3 flex items-center gap-2 text-primary">
                <ShieldAlert size={20} />
                تعليمات السلامة
              </h4>
              <p className="text-sm font-medium text-primary/80 leading-relaxed">
                {selectedChemical?.hazardClass === 'danger' 
                  ? 'يجب ارتداء القفازات والنظارات الواقية عند التعامل مع هذه المادة. يحفظ في مكان بارد وجيد التهوية بعيداً عن مصادر الحرارة.'
                  : 'يرجى اتباع بروتوكولات المختبر القياسية عند التعامل مع هذه المادة لضمان سلامتك وسلامة الزملاء.'}
              </p>
            </div>
            <AlertTriangle className="absolute -bottom-6 -left-6 text-primary/5 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-outline/10"
            >
              <div className="p-8 flex justify-between items-center bg-surface-container-low border-b border-outline/5">
                <h3 className="text-2xl font-black text-primary">
                  {editingChemical ? 'تعديل بيانات المادة' : 'إضافة مادة كيميائية جديدة'}
                </h3>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingChemical(null);
                    setNewChemical({
                      nameEn: '',
                      nameAr: '',
                      formula: '',
                      casNumber: '',
                      storageTemp: '',
                      unit: 'g',
                      quantity: 0,
                      state: 'solid',
                      hazardClass: 'safe',
                      ghs: [],
                      shelf: '',
                      expiryDate: '',
                      notes: ''
                    });
                  }} 
                  className="p-2.5 hover:bg-surface-container-high rounded-full transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddChemical} className="p-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="md:col-span-2 flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">PRODUIT CHIMIQUE</label>
                    <input 
                      required
                      className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                      value={newChemical.nameEn || ''}
                      onChange={e => setNewChemical({...newChemical, nameEn: e.target.value})}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleSmartFill}
                    disabled={isGenerating}
                    className="bg-primary-container text-primary px-6 py-4 rounded-2xl flex items-center gap-2 font-black hover:bg-primary/10 transition-all active:scale-95 disabled:opacity-50 h-[58px]"
                    title="تعبئة ذكية للمعلومات"
                  >
                    {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <Wand2 size={20} />
                    )}
                    <span className="hidden md:inline">تعبئة ذكية</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">الاسم العربي</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                    value={newChemical.nameAr || ''}
                    onChange={e => setNewChemical({...newChemical, nameAr: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">الصيغة الكيميائية</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                    value={newChemical.formula || ''}
                    onChange={e => setNewChemical({...newChemical, formula: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">رقم CAS</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                    value={newChemical.casNumber || ''}
                    onChange={e => setNewChemical({...newChemical, casNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">درجة حرارة التخزين</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                    value={newChemical.storageTemp || ''}
                    onChange={e => setNewChemical({...newChemical, storageTemp: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">الحالة</label>
                  <select 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer"
                    value={newChemical.state || 'solid'}
                    onChange={e => setNewChemical({...newChemical, state: e.target.value})}
                  >
                    <option value="solid">صلب (Solid)</option>
                    <option value="liquid">سائل (Liquid)</option>
                    <option value="gas">غاز (Gas)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">الكمية</label>
                  <div className="flex gap-3">
                    <input 
                      type="number"
                      required
                      className="flex-1 bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                      value={newChemical.quantity || 0}
                      onChange={e => setNewChemical({...newChemical, quantity: Number(e.target.value)})}
                    />
                    <select 
                      className="bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer"
                      value={newChemical.unit || 'g'}
                      onChange={e => setNewChemical({...newChemical, unit: e.target.value})}
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="unit">Unit</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">تصنيف الخطورة</label>
                  <select 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold appearance-none cursor-pointer"
                    value={newChemical.hazardClass || 'safe'}
                    onChange={e => setNewChemical({...newChemical, hazardClass: e.target.value})}
                  >
                    <option value="safe">آمن</option>
                    <option value="danger">خطر</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">GHS (فواصل بين الرموز)</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                    placeholder="GHS01, GHS02..."
                    value={newChemical.ghs?.join(', ') || ''}
                    onChange={e => setNewChemical({...newChemical, ghs: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">الرف</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                    value={newChemical.shelf || ''}
                    onChange={e => setNewChemical({...newChemical, shelf: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">الصلاحية ⚠</label>
                  <input 
                    type="date"
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold"
                    value={newChemical.expiryDate || ''}
                    onChange={e => setNewChemical({...newChemical, expiryDate: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-secondary/60 uppercase tracking-widest mr-2">ملاحظات</label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all font-bold min-h-[100px]"
                    value={newChemical.notes || ''}
                    onChange={e => setNewChemical({...newChemical, notes: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 pt-6">
                  <button type="submit" className="w-full bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95">
                    {editingChemical ? 'حفظ التعديلات' : 'تأكيد إضافة المادة للمخزن'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Update Confirmation Modal */}
      <AnimatePresence>
        {isBulkConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkConfirmOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface-container-lowest rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-outline/10 text-right"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles size={40} className="text-primary" />
              </div>
              <h3 className="text-3xl font-black text-primary mb-4 tracking-tight">تحديث ذكي شامل</h3>
              <p className="text-secondary/80 text-lg leading-relaxed mb-10">
                هل أنت متأكد من رغبتك في تحديث معلومات <span className="font-black text-primary">{chemicals.length}</span> مادة ذكياً؟ 
                <br /><br />
                قد تستغرق هذه العملية بعض الوقت. سيتم تحديث البيانات تلقائياً بناءً على اقتراحات الذكاء الاصطناعي.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleBulkSmartUpdate}
                  className="flex-1 bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95"
                >
                  بدء التحديث
                </button>
                <button 
                  onClick={() => setIsBulkConfirmOpen(false)}
                  className="flex-1 bg-surface border border-outline/20 text-secondary py-5 rounded-full font-black hover:bg-surface-container-high transition-all active:scale-95"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Update Modal */}
      <AnimatePresence>
        {isReviewModalOpen && suggestedUpdate && selectedChemical && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden border border-outline/10"
            >
              <div className="p-8 flex justify-between items-center bg-surface-container-low border-b border-outline/5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-2xl text-primary">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-primary">مراجعة التحديث الذكي</h3>
                </div>
                <button 
                  onClick={() => setIsReviewModalOpen(false)} 
                  className="p-2.5 hover:bg-surface-container-high rounded-full transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                <p className="text-secondary/80 font-bold text-center bg-surface-container-low p-4 rounded-2xl border border-outline/5">
                  تم العثور على معلومات أكثر دقة لهذه المادة. يرجى مراجعة التغييرات المقترحة أدناه قبل الموافقة.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Current Data */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-secondary/40 uppercase tracking-widest border-b border-outline/5 pb-2">المعلومات الحالية</h4>
                    <div className="space-y-4">
                      <div className="bg-surface-container-low/50 p-4 rounded-2xl">
                        <label className="text-[10px] font-black text-secondary/40 uppercase block mb-1">الاسم</label>
                        <p className="font-bold text-secondary">{selectedChemical.nameEn} / {selectedChemical.nameAr}</p>
                      </div>
                      <div className="bg-surface-container-low/50 p-4 rounded-2xl">
                        <label className="text-[10px] font-black text-secondary/40 uppercase block mb-1">الصيغة</label>
                        <p className="font-mono font-bold text-secondary">{selectedChemical.formula}</p>
                      </div>
                      <div className="bg-surface-container-low/50 p-4 rounded-2xl">
                        <label className="text-[10px] font-black text-secondary/40 uppercase block mb-1">رقم CAS</label>
                        <p className="font-bold text-secondary">{selectedChemical.casNumber || 'غير متوفر'}</p>
                      </div>
                      <div className="bg-surface-container-low/50 p-4 rounded-2xl">
                        <label className="text-[10px] font-black text-secondary/40 uppercase block mb-1">درجة التخزين</label>
                        <p className="font-bold text-secondary">{selectedChemical.storageTemp || 'غير متوفر'}</p>
                      </div>
                      <div className="bg-surface-container-low/50 p-4 rounded-2xl">
                        <label className="text-[10px] font-black text-secondary/40 uppercase block mb-1">الخطورة</label>
                        <p className="font-bold text-secondary">{selectedChemical.hazardClass === 'danger' ? 'خطر' : 'آمن'}</p>
                      </div>
                      <div className="bg-surface-container-low/50 p-4 rounded-2xl">
                        <label className="text-[10px] font-black text-secondary/40 uppercase block mb-1">ملاحظات</label>
                        <p className="text-xs text-secondary/60">{selectedChemical.notes || 'لا توجد'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Data */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">المعلومات المقترحة ✨</h4>
                    <div className="space-y-4">
                      <div className={cn(
                        "p-4 rounded-2xl border transition-all",
                        (suggestedUpdate.nameEn !== selectedChemical.nameEn || suggestedUpdate.nameAr !== selectedChemical.nameAr) 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "bg-surface-container-low/50 border-transparent"
                      )}>
                        <label className="text-[10px] font-black text-primary/40 uppercase block mb-1">الاسم</label>
                        <p className="font-bold text-primary">{suggestedUpdate.nameEn} / {suggestedUpdate.nameAr}</p>
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl border transition-all",
                        suggestedUpdate.formula !== selectedChemical.formula 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "bg-surface-container-low/50 border-transparent"
                      )}>
                        <label className="text-[10px] font-black text-primary/40 uppercase block mb-1">الصيغة</label>
                        <p className="font-mono font-bold text-primary">{suggestedUpdate.formula}</p>
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl border transition-all",
                        suggestedUpdate.casNumber !== selectedChemical.casNumber 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "bg-surface-container-low/50 border-transparent"
                      )}>
                        <label className="text-[10px] font-black text-primary/40 uppercase block mb-1">رقم CAS</label>
                        <p className="font-bold text-primary">{suggestedUpdate.casNumber}</p>
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl border transition-all",
                        suggestedUpdate.storageTemp !== selectedChemical.storageTemp 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "bg-surface-container-low/50 border-transparent"
                      )}>
                        <label className="text-[10px] font-black text-primary/40 uppercase block mb-1">درجة التخزين</label>
                        <p className="font-bold text-primary">{suggestedUpdate.storageTemp}</p>
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl border transition-all",
                        suggestedUpdate.hazardClass !== selectedChemical.hazardClass 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "bg-surface-container-low/50 border-transparent"
                      )}>
                        <label className="text-[10px] font-black text-primary/40 uppercase block mb-1">الخطورة</label>
                        <p className="font-bold text-primary">{suggestedUpdate.hazardClass === 'danger' ? 'خطر' : 'آمن'}</p>
                      </div>
                      <div className={cn(
                        "p-4 rounded-2xl border transition-all",
                        suggestedUpdate.notes !== selectedChemical.notes 
                          ? "bg-primary/5 border-primary/20 shadow-sm" 
                          : "bg-surface-container-low/50 border-transparent"
                      )}>
                        <label className="text-[10px] font-black text-primary/40 uppercase block mb-1">ملاحظات</label>
                        <p className="text-xs text-primary/80">{suggestedUpdate.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-surface-container-low border-t border-outline/5 flex gap-4">
                <button 
                  onClick={handleApproveUpdate}
                  className="flex-1 bg-primary text-on-primary py-5 rounded-full font-black shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Check size={24} />
                  موافقة وتحديث البيانات
                </button>
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 bg-surface border border-outline/20 text-secondary py-5 rounded-full font-black hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <RotateCcw size={24} />
                  إلغاء التغييرات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
