import React, { useState, useEffect, useRef } from 'react';
import { onSnapshot, query, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, orderBy, limit, getDocs, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, getUserCollection } from '../firebase';
import * as XLSX from 'xlsx';
import { useSearchParams } from 'react-router-dom';
import { 
  Beaker, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileUp,
  History, 
  AlertTriangle,
  CheckCircle,
  Wrench,
  Monitor,
  Trash2,
  Edit,
  X,
  Printer,
  Package,
  ArrowLeft,
  Sparkles,
  MoreHorizontal,
  Map,
  FileText,
  RefreshCw,
  FileDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  QrCode,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ensureApiKey, getEquipmentIntelligence } from '../services/geminiService';
import { logActivity, LogAction, LogModule } from '../services/loggingService';

interface Equipment {
  id: string;
  name: string;
  type: 'glassware' | 'tech' | 'other';
  serialNumber: string;
  status: 'functional' | 'maintenance' | 'broken';
  totalQuantity: number;
  availableQuantity: number;
  brokenQuantity: number;
  lastCalibration?: string;
  nextCalibration?: string;
  supplier?: string;
  location?: string;
  notes?: string;
  foundationalInventory?: string;
  decennialReview?: string;
  smartNameAr?: string;
  smartDescriptionAr?: string;
  imageKeyword?: string;
  lastSmartUpdate?: any;
}

interface MaintenanceLog {
  id: string;
  equipmentId: string;
  previousStatus: string;
  newStatus: string;
  date: any;
  note: string;
}

export default function Equipment({ isNested = false }: { isNested?: boolean }) {
  const [searchParams] = useSearchParams();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get('filter') || 'all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isSmartUpdating, setIsSmartUpdating] = useState(false);
  const [isSmartUpdateConfirmOpen, setIsSmartUpdateConfirmOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [sortField, setSortField] = useState<keyof Equipment | 'none'>('none');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [qrCodeItem, setQrCodeItem] = useState<Equipment | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    const targetId = searchParams.get('id');
    if (targetId && equipment.length > 0) {
      const item = equipment.find(e => e.id === targetId);
      if (item) {
        setEditingEquipment(item);
        setNewEquipment({
          name: item.name,
          type: item.type,
          serialNumber: item.serialNumber,
          status: item.status,
          totalQuantity: item.totalQuantity,
          availableQuantity: item.availableQuantity,
          brokenQuantity: item.brokenQuantity,
          supplier: item.supplier || '',
          location: item.location || '',
          notes: item.notes || '',
          foundationalInventory: item.foundationalInventory || '',
          decennialReview: item.decennialReview || ''
        });
        setIsAddModalOpen(true);
      }
    }
  }, [searchParams, equipment]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedEquipHistory, setSelectedEquipHistory] = useState<MaintenanceLog[]>([]);
  const [currentEquipName, setCurrentEquipName] = useState('');
  
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    type: 'glassware',
    serialNumber: '',
    status: 'functional',
    totalQuantity: 0,
    availableQuantity: 0,
    brokenQuantity: 0,
    supplier: '',
    location: '',
    notes: '',
    foundationalInventory: '',
    decennialReview: ''
  });

  useEffect(() => {
    const q = query(getUserCollection('equipment'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
      setEquipment(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'equipment');
    });
    return () => unsubscribe();
  }, []);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEquipment) {
        const { id } = editingEquipment;
        await updateDoc(doc(getUserCollection('equipment'), id), {
          ...newEquipment,
          updatedAt: serverTimestamp()
        });
        await logActivity(LogAction.UPDATE, LogModule.EQUIPMENT, `تعديل بيانات الجهاز: ${newEquipment.name}`, id);
      } else {
        const docRef = await addDoc(getUserCollection('equipment'), {
          ...newEquipment,
          createdAt: serverTimestamp()
        });
        await logActivity(LogAction.CREATE, LogModule.EQUIPMENT, `إضافة جهاز جديد: ${newEquipment.name}`, docRef.id);
      }
      setIsAddModalOpen(false);
      setEditingEquipment(null);
      setNewEquipment({
        name: '',
        type: 'glassware',
        serialNumber: '',
        status: 'functional',
        totalQuantity: 0,
        availableQuantity: 0,
        brokenQuantity: 0
      });
    } catch (error) {
      handleFirestoreError(error, editingEquipment ? OperationType.UPDATE : OperationType.CREATE, 'equipment');
    }
  };

  const handleDeleteEquipment = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(getUserCollection('equipment'), id));
      await logActivity(LogAction.DELETE, LogModule.EQUIPMENT, `حذف الجهاز: ${name}`, id);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `equipment/${id}`);
    }
  };

  const handleImportXLS = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const batch = writeBatch(db);
        data.forEach((item) => {
          const docRef = doc(getUserCollection('equipment'));
          const type = (item['النوع'] || item['Type'] || 'other').toLowerCase();
          const status = (item['الحالة'] || item['Status'] || 'functional').toLowerCase();
          const name = item['تعيين الجهاز'] || item['الاسم'] || item['Name'] || 'جهاز غير مسمى';
          const quantity = Number(item['الكمية'] || item['الكمية الإجمالية'] || item['Total'] || 0);
          
          batch.set(docRef, {
            name: String(name).trim() || 'جهاز غير مسمى',
            type: type === 'زجاجيات' || type === 'glassware' ? 'glassware' : type === 'أجهزة' || type === 'tech' ? 'tech' : 'other',
            serialNumber: item['رقم الجرد'] || item['الرقم التسلسلي'] || item['Serial'] || '',
            status: status === 'سليم' || status === 'functional' ? 'functional' : status === 'صيانة' || status === 'maintenance' ? 'maintenance' : 'broken',
            totalQuantity: isNaN(quantity) ? 0 : quantity,
            availableQuantity: isNaN(quantity) ? 0 : quantity,
            brokenQuantity: 0,
            supplier: item['الممون'] || '',
            location: item['الموقع'] || '',
            notes: item['ملاحظات'] || '',
            foundationalInventory: item['الجرد التأسيسي'] || '',
            decennialReview: item['المراجعة العشرية'] || '',
            createdAt: serverTimestamp()
          });
        });

        await batch.commit();
        alert(`تم استيراد ${data.length} صنف بنجاح!`);
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

  const handleUpdateStatus = async (id: string, currentStatus: string, newStatus: string) => {
    if (currentStatus === newStatus) return;
    try {
      await updateDoc(doc(getUserCollection('equipment'), id), { status: newStatus });
      await addDoc(getUserCollection('maintenance_logs'), {
        equipmentId: id,
        previousStatus: currentStatus,
        newStatus: newStatus,
        date: serverTimestamp(),
        note: `تغيير الحالة من ${currentStatus} إلى ${newStatus}`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `equipment/${id}`);
    }
  };

  const fetchHistory = async (id: string, name: string) => {
    setCurrentEquipName(name);
    try {
      const q = query(
        getUserCollection('maintenance_logs'), 
        orderBy('date', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const logs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceLog))
        .filter(log => log.equipmentId === id);
      setSelectedEquipHistory(logs);
      setIsHistoryModalOpen(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'maintenance_logs');
    }
  };

  const handleExportXLS = () => {
    if (equipment.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const exportData = equipment.map(e => ({
      'رقم الجرد': e.serialNumber || '---',
      'تعيين الجهاز': e.name,
      'النوع': e.type === 'glassware' ? 'زجاجيات' : e.type === 'tech' ? 'أجهزة تقنية' : 'أخرى',
      'الكمية': e.totalQuantity,
      'الممون': e.supplier || '---',
      'الموقع': e.location || '---',
      'الحالة': e.status === 'functional' ? 'سليم' : e.status === 'maintenance' ? 'صيانة' : 'تالف',
      'الجرد التأسيسي': e.foundationalInventory || '---',
      'المراجعة العشرية': e.decennialReview || '---',
      'ملاحظات': e.notes || '---'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment");
    XLSX.writeFile(workbook, `جرد_العتاد_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrintList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة القائمة');
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const tableRows = filteredEquipment.map((e, index) => `
      <tr>
        <td style="text-align: center;">${(index + 1).toString().padStart(2, '0')}</td>
        <td style="font-weight: 600;">${e.name}</td>
        <td style="text-align: center;">${e.type === 'glassware' ? 'زجاجيات' : e.type === 'tech' ? 'أجهزة تقنية' : 'أخرى'}</td>
        <td style="text-align: center; font-weight: 600;">${e.totalQuantity}</td>
        <td style="text-align: center;">${e.availableQuantity}</td>
        <td style="text-align: center;">${e.brokenQuantity}</td>
        <td style="text-align: center;">${e.status === 'functional' ? 'سليم' : e.status === 'maintenance' ? 'صيانة' : 'تالف'}</td>
        <td>${e.location || '-'}</td>
        <td style="font-size: 0.85em;">${e.notes || '-'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>سجل جرد العتاد والزجاجيات - ${formattedDate}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page { size: A4 landscape; margin: 10mm; }
            body { 
              font-family: 'Cairo', sans-serif; 
              margin: 0; 
              padding: 10px; 
              color: #1a1a1a;
              line-height: 1.4;
            }
            .official-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header-right { text-align: right; font-size: 12px; font-weight: bold; }
            .header-center { text-align: center; }
            .header-center p { margin: 2px 0; font-weight: bold; }
            .header-center .republic { font-size: 14px; font-weight: 900; }
            .header-left { text-align: left; font-size: 12px; font-weight: bold; }
            
            .doc-title { 
              text-align: center; 
              font-size: 22px; 
              font-weight: 900; 
              text-decoration: underline;
              margin: 20px 0;
            }
            
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 8px 4px; 
              text-align: right; 
            }
            th { 
              background-color: #f3f4f6; 
              font-weight: 700; 
              text-align: center;
            }
            .footer {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              padding: 0 50px;
            }
            .sig-box { text-align: center; width: 200px; }
            .sig-box p { margin-bottom: 50px; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="official-header">
            <div class="header-right">
              <p>مديرية التربية لولاية: أم البواقي</p>
              <p>ثانوية بوحازم عبد المجيد - عين كرشة</p>
            </div>
            <div class="header-center">
              <p class="republic">الجمهورية الجزائرية الديمقراطية الشعبية</p>
              <p>وزارة التربية الوطنية</p>
            </div>
            <div class="header-left">
              <p>السنة الدراسية: 2025 - 2026</p>
            </div>
          </div>

          <h2 class="doc-title">سجل جرد العتاد والزجاجيات المخبرية</h2>
          
          <table>
            <thead>
              <tr>
                <th style="width: 30px;">رقم</th>
                <th>تعيين الجهاز / الأداة</th>
                <th style="width: 80px;">النوع</th>
                <th style="width: 50px;">الإجمالي</th>
                <th style="width: 50px;">السليم</th>
                <th style="width: 50px;">التالف</th>
                <th style="width: 60px;">الحالة</th>
                <th style="width: 100px;">الموقع</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            <div class="sig-box"><p>المقتصد / مسير المصالح الاقتصادية</p>..........................</div>
            <div class="sig-box"><p>مسؤول المخبر</p>..........................</div>
            <div class="sig-box"><p>مدير المؤسسة</p>..........................</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintInventoryCards = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بالنوافذ المنبثقة لطباعة بطاقات الجرد');
      return;
    }

    const cardsHtml = filteredEquipment.map((e) => `
      <div class="card">
        <div class="card-header">
          <div class="ministry">وزارة التربية الوطنية</div>
          <div class="institution">ثانوية بوحازم عبد المجيد - عين كرشة</div>
        </div>
        <div class="card-title">بطاقة جرد العتاد</div>
        <div class="card-body">
          <div class="field"><span class="label">تعيين الجهاز:</span> <span class="value">${e.smartNameAr || e.name}</span></div>
          <div class="field"><span class="label">رقم الجرد:</span> <span class="value">${e.serialNumber || '---'}</span></div>
          <div class="field"><span class="label">النوع:</span> <span class="value">${e.type === 'glassware' ? 'زجاجيات' : e.type === 'tech' ? 'أجهزة تقنية' : 'أخرى'}</span></div>
          <div class="field"><span class="label">الموقع:</span> <span class="value">${e.location || '---'}</span></div>
        </div>
        <div class="card-qr">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(JSON.stringify({ id: e.id, type: 'equipment', name: e.name }))}" alt="QR Code" />
        </div>
        <div class="card-footer">نظام تسيير المخابر - الأرضية الرقمية</div>
      </div>
    `).join('');

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>طباعة بطاقات الجرد</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            body { 
              font-family: 'Cairo', sans-serif; 
              margin: 0; 
              padding: 20px; 
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 20px;
              background: #f5f5f5;
            }
            @media print {
              body { background: white; padding: 0; }
              .card { break-inside: avoid; margin-bottom: 10px; }
            }
            .card {
              background: white;
              border: 2px solid #1a2744;
              border-radius: 12px;
              padding: 15px;
              position: relative;
              height: 180px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .card-header {
              text-align: center;
              font-size: 10px;
              font-weight: bold;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
              margin-bottom: 5px;
            }
            .card-title {
              text-align: center;
              font-size: 14px;
              font-weight: 900;
              color: #1a2744;
              margin-bottom: 10px;
            }
            .card-body {
              font-size: 11px;
              flex-grow: 1;
            }
            .field { margin-bottom: 4px; display: flex; gap: 5px; }
            .label { font-weight: 900; color: #1a2744; min-width: 70px; }
            .value { font-weight: bold; color: #333; }
            .card-qr {
              position: absolute;
              bottom: 15px;
              left: 15px;
            }
            .card-qr img { width: 60px; height: 60px; }
            .card-footer {
              text-align: center;
              font-size: 8px;
              color: #999;
              border-top: 1px solid #eee;
              padding-top: 5px;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          ${cardsHtml}
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(20);
    doc.text('Equipment Inventory Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = filteredEquipment.map((e, index) => [
      index + 1,
      e.name,
      e.type === 'glassware' ? 'Glassware' : 'Tech',
      e.totalQuantity,
      e.status,
      e.location || 'N/A'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['#', 'Name', 'Type', 'Qty', 'Status', 'Location']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [74, 124, 89], textColor: 255 },
    });

    doc.save(`equipment_inventory_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSmartUpdate = async () => {
    if (equipment.length === 0) {
      alert('لا توجد بيانات لتحديثها.');
      return;
    }

    setIsSmartUpdateConfirmOpen(false);

    // Ensure API key is available before starting
    const hasKey = await ensureApiKey();
    if (!hasKey) {
      alert('يرجى اختيار مفتاح API الخاص بك لاستخدام ميزة التحديث الذكي.');
      return;
    }

    setIsSmartUpdating(true);
    setBulkProgress({ current: 0, total: equipment.length });

    try {
      // Process in chunks to avoid large payloads
      const CHUNK_SIZE = 10;
      for (let i = 0; i < equipment.length; i += CHUNK_SIZE) {
        const chunk = equipment.slice(i, i + CHUNK_SIZE);
        const itemsToProcess = chunk.map(item => ({ id: item.id, name: item.name }));
        
        const enrichedData = await getEquipmentIntelligence(itemsToProcess);
        
        if (!enrichedData) {
          throw new Error('فشل الحصول على بيانات الذكاء الاصطناعي.');
        }

        const batch = writeBatch(db);
        enrichedData.forEach((update: any) => {
          const docRef = doc(getUserCollection('equipment'), update.id);
          batch.update(docRef, {
            smartNameAr: update.smartNameAr,
            smartDescriptionAr: update.smartDescriptionAr,
            imageKeyword: update.imageKeyword,
            lastSmartUpdate: serverTimestamp()
          });
        });
        
        await batch.commit();
        setBulkProgress({ current: Math.min(i + CHUNK_SIZE, equipment.length), total: equipment.length });
        
        // Small delay between chunks to respect rate limits (15 RPM for free tier)
        if (i + CHUNK_SIZE < equipment.length) {
          await new Promise(r => setTimeout(r, 5000));
        }
      }

      alert('تم التحديث الذكي لجميع التجهيزات بنجاح!');
    } catch (error: any) {
      console.error('Error in smart update:', error);
      const errorMsg = error.message || '';
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        alert('تم تجاوز حد الاستخدام المسموح به للذكاء الاصطناعي (Quota Exceeded). يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.');
      } else {
        alert('حدث خطأ أثناء التحديث الذكي. يرجى المحاولة لاحقاً.');
      }
    } finally {
      setIsSmartUpdating(false);
      setBulkProgress({ current: 0, total: 0 });
    }
  };

  const handlePrint = (e: Equipment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>بطاقة تقنية - ${e.name}</title>
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 40px; background: #fdfdfb; }
            .header { text-align: center; border-bottom: 3px solid #1a2744; padding-bottom: 30px; margin-bottom: 40px; }
            .title { font-size: 32px; font-weight: 900; color: #1a2744; margin-bottom: 10px; }
            .subtitle { font-size: 14px; color: #666; font-weight: bold; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
            .item { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; justify-content: space-between; }
            .label { font-weight: 900; color: #1a2744; }
            .value { font-weight: bold; color: #444; }
            .footer { margin-top: 80px; text-align: left; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">بطاقة تقنية للعتاد المخبري</div>
            <div class="subtitle">نظام تسيير المخابر المدرسية — الأرضية الرقمية</div>
          </div>
          <div class="details">
            <div class="item"><span class="label">اسم الصنف:</span> <span class="value">${e.name}</span></div>
            <div class="item"><span class="label">النوع:</span> <span class="value">${e.type === 'glassware' ? 'زجاجيات' : e.type === 'tech' ? 'أجهزة تقنية' : 'أخرى'}</span></div>
            <div class="item"><span class="label">الرقم التسلسلي:</span> <span class="value">${e.serialNumber || 'N/A'}</span></div>
            <div class="item"><span class="label">الحالة الحالية:</span> <span class="value">${e.status === 'functional' ? 'سليم' : e.status === 'maintenance' ? 'صيانة' : 'تالف'}</span></div>
            <div class="item"><span class="label">الكمية الإجمالية:</span> <span class="value">${e.totalQuantity}</span></div>
            <div class="item"><span class="label">الكمية المتوفرة:</span> <span class="value">${e.availableQuantity}</span></div>
            <div class="item"><span class="label">الكمية التالفة:</span> <span class="value">${e.brokenQuantity}</span></div>
          </div>
          <div class="footer">طبع بتاريخ: ${new Date().toLocaleString('ar-DZ')}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSort = (field: keyof Equipment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredEquipment = equipment
    .filter(e => {
      const matchesSearch = 
        e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.smartNameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || 
                         (filterType === 'smart' ? !!e.smartNameAr : e.type === filterType);
      
      const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === 'none') return 0;
      
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPieces = equipment.reduce((acc, curr) => acc + (Number(curr.totalQuantity) || 0), 0);
  const totalAvailable = equipment.reduce((acc, curr) => acc + (Number(curr.availableQuantity) || 0), 0);
  const totalBroken = equipment.reduce((acc, curr) => acc + (Number(curr.brokenQuantity) || 0), 0);
  const totalTypes = equipment.length;

  return (
    <div className={cn("space-y-12 max-w-7xl mx-auto pb-24 rtl font-sans", !isNested && "px-6")} dir="rtl">
      {/* Official Algerian Header (Print Only or Toggle) */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="text-right text-sm font-bold">
            <p>مديرية التربية لولاية: أم البواقي</p>
            <p>ثانوية بوحازم عبد المجيد - عين كرشة</p>
          </div>
          <div className="text-center">
            <p className="font-black text-base">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="font-bold text-sm">وزارة التربية الوطنية</p>
          </div>
          <div className="text-left text-sm font-bold">
            <p>السنة الدراسية: 2025 - 2026</p>
          </div>
        </div>
        <h2 className="text-center text-2xl font-black underline mt-6">جرد مخزون الزجاجيات والعتاد — مخبر الوسائل التعليمية</h2>
      </div>

      {/* Header */}
      {!isNested && (
        <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
          <div className="text-right space-y-3 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-2">
              <Package size={14} />
              إدارة المخزون والعتاد
            </div>
            <h1 className="text-4xl font-black text-primary tracking-tighter">جرد الزجاجيات والعتاد</h1>
            <p className="text-on-surface/60 text-lg font-bold">إدارة وتتبع <span className="text-primary italic">الأدوات الزجاجية</span> والأجهزة التكنولوجية</p>
          </div>
          
          <div className="flex flex-wrap gap-4 relative z-10">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportXLS} 
              className="hidden" 
              accept=".xls,.xlsx"
            />
            <button 
              onClick={handlePrintInventoryCards}
              className="bg-white text-primary border-2 border-primary/10 px-6 py-3.5 rounded-full font-black flex items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all shadow-xl active:scale-95"
            >
              <QrCode size={20} />
              طباعة بطاقات الجرد
            </button>
            <button 
              onClick={handlePrintList}
              className="bg-white text-primary border-2 border-primary/10 px-6 py-3.5 rounded-full font-black flex items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all shadow-xl active:scale-95"
            >
              <Printer size={20} />
              طباعة القائمة
            </button>
            <button 
              onClick={handleExportPDF}
              className="bg-white text-primary border-2 border-primary/10 px-6 py-3.5 rounded-full font-black flex items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all shadow-xl active:scale-95"
            >
              <FileDown size={20} />
              تصدير PDF
            </button>
            <button 
              onClick={() => setIsSmartUpdateConfirmOpen(true)}
              disabled={isSmartUpdating}
              className="bg-white text-primary border-2 border-primary/10 px-6 py-3.5 rounded-full font-black flex items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSmartUpdating ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <Sparkles size={20} />
              )}
              تحديث ذكي للكل
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="bg-white text-primary border-2 border-primary/10 px-6 py-3.5 rounded-full font-black flex items-center gap-2 hover:bg-primary/5 hover:border-primary transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isImporting ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <FileUp size={20} />
              )}
              استيراد XLS
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-black flex items-center gap-2 shadow-2xl shadow-primary/30 hover:bg-primary-container hover:shadow-primary/40 transition-all active:scale-95"
            >
              <Plus size={22} />
              إضافة صنف
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </header>
      )}

      {/* Quick Access to Specialized Units */}
      {!isNested && (
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'الأجهزة التقنية', path: '/tech-inventory', icon: Monitor, color: 'bg-primary/5 text-primary' },
            { label: 'جرد الزجاجيات', path: '/glassware-breakage', icon: Beaker, color: 'bg-primary/5 text-primary' },
            { label: 'النماذج الذكية', path: '/smart-forms', icon: FileText, color: 'bg-primary/5 text-primary' },
            { label: 'النفايات الكيميائية', path: '/chemical-waste', icon: Trash2, color: 'bg-error/5 text-error' },
            { label: 'الخريطة التربوية', path: '/educational-map', icon: Map, color: 'bg-primary/5 text-primary' },
            { label: 'المستهلكات & SDS', path: '/consumables-sds', icon: Package, color: 'bg-primary/5 text-primary' },
          ].map((unit, i) => (
            <motion.a
              key={unit.label}
              href={`#${unit.path}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-[32px] border border-outline/5 shadow-sm hover:shadow-md transition-all group text-center gap-3",
                unit.color
              )}
            >
              <div className="p-3 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                <unit.icon size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{unit.label}</span>
            </motion.a>
          ))}
        </section>
      )}

      {/* Stats */}
      {!isNested && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'أصناف العتاد', value: totalTypes, icon: Layers, color: 'bg-primary/10', textColor: 'text-primary', status: 'all' },
            { label: 'إجمالي الكميات', value: totalPieces, icon: Package, color: 'bg-primary/5', textColor: 'text-primary', status: 'all' },
            { label: 'الحالة: جيدة', value: totalAvailable, icon: CheckCircle, color: 'bg-green-50', textColor: 'text-green-600', status: 'functional' },
            { label: 'الحالة: مكسورة', value: totalBroken, icon: AlertTriangle, color: 'bg-error/10', textColor: 'text-error', status: 'broken' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setFilterStatus(stat.status)}
              className={cn(
                "p-8 rounded-[40px] border border-outline/5 transition-all group relative overflow-hidden shadow-xl cursor-pointer",
                stat.color,
                filterStatus === stat.status && "ring-4 ring-primary/20 border-primary"
              )}
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-white/40 rounded-br-[80px] -ml-6 -mt-6 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-on-surface/40 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <span className={cn("text-5xl font-black tracking-tighter group-hover:scale-110 transition-transform inline-block", stat.textColor)}>{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-[50px] overflow-hidden shadow-2xl border border-outline/5 relative">
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-low/30 border-b border-outline/5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              className="w-full bg-white border-2 border-outline/5 rounded-full pr-14 pl-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
              placeholder="بحث في قائمة العتاد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-outline/10 shadow-sm">
              <Filter size={18} className="text-primary/40" />
              <select 
                className="bg-transparent border-none text-sm font-black text-primary focus:ring-0 cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">كل الأنواع</option>
                <option value="glassware">زجاجيات</option>
                <option value="tech">أجهزة تقنية</option>
                <option value="smart">تحديث ذكي ✨</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-primary/40 px-4">
              <Sparkles size={20} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">قاعدة البيانات</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface/40 text-xs font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('serialNumber')}>
                  <div className="flex items-center gap-2">
                    رقم الجرد
                    {sortField === 'serialNumber' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : <ArrowUpDown size={14} className="opacity-20" />}
                  </div>
                </th>
                <th className="px-10 py-6 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    تعيين الجهاز
                    {sortField === 'name' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : <ArrowUpDown size={14} className="opacity-20" />}
                  </div>
                </th>
                <th className="px-10 py-6 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('totalQuantity')}>
                  <div className="flex items-center justify-center gap-2">
                    الكمية
                    {sortField === 'totalQuantity' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : <ArrowUpDown size={14} className="opacity-20" />}
                  </div>
                </th>
                <th className="px-10 py-6 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('supplier')}>
                  <div className="flex items-center justify-center gap-2">
                    الممون
                    {sortField === 'supplier' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : <ArrowUpDown size={14} className="opacity-20" />}
                  </div>
                </th>
                <th className="px-10 py-6 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('location')}>
                  <div className="flex items-center justify-center gap-2">
                    الموقع
                    {sortField === 'location' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : <ArrowUpDown size={14} className="opacity-20" />}
                  </div>
                </th>
                <th className="px-10 py-6 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center justify-center gap-2">
                    الحالة
                    {sortField === 'status' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : <ArrowUpDown size={14} className="opacity-20" />}
                  </div>
                </th>
                <th className="px-10 py-6 text-center">ملاحظات</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                      <p className="text-on-surface/40 font-black uppercase tracking-widest text-xs">جاري تحميل البيانات...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Package size={64} />
                      <p className="text-xl font-black">لا توجد أصناف مطابقة للبحث</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((e) => (
                  <tr key={e.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <span className="text-sm font-black text-primary/60 bg-surface-container-low px-3 py-1 rounded-full">
                        {e.serialNumber || '---'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary shadow-inner relative">
                          {e.type === 'tech' ? <Monitor size={24} /> : <Beaker size={24} />}
                          {e.smartNameAr && (
                            <div className="absolute -top-1 -right-1 bg-primary text-on-primary p-1 rounded-full shadow-lg">
                              <Sparkles size={10} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-primary font-serif">{e.smartNameAr || e.name}</p>
                          {e.smartNameAr && e.name !== e.smartNameAr && (
                            <p className="text-[10px] font-bold text-on-surface/30 italic">الأصل: {e.name}</p>
                          )}
                          {e.smartDescriptionAr && (
                            <p className="text-xs font-bold text-on-surface/40 max-w-xs line-clamp-1">{e.smartDescriptionAr}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="text-xl font-black text-primary">{e.totalQuantity}</span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="text-sm font-bold text-on-surface/60">{e.supplier || '---'}</span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className="text-sm font-bold text-on-surface/60">{e.location || '---'}</span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <select 
                        className={cn(
                          "px-6 py-2.5 rounded-full text-xs font-black border-2 transition-all cursor-pointer focus:ring-4 focus:ring-primary/10",
                          e.status === 'maintenance' ? "bg-tertiary/10 border-tertiary/20 text-tertiary" : 
                          e.status === 'broken' ? "bg-error/10 border-error/20 text-error" : "bg-primary/5 border-primary/10 text-primary"
                        )}
                        value={e.status}
                        onChange={(ev) => handleUpdateStatus(e.id, e.status, ev.target.value)}
                      >
                        <option value="functional">سليم</option>
                        <option value="maintenance">صيانة</option>
                        <option value="broken">تالف</option>
                      </select>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <p className="text-xs text-on-surface/40 max-w-[150px] truncate" title={e.notes}>{e.notes || '---'}</p>
                    </td>
                    <td className="px-10 py-8 text-left">
                      <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => {
                            setQrCodeItem(e);
                            setIsQRModalOpen(true);
                          }}
                          className="p-3 text-primary/40 hover:text-primary transition-colors rounded-2xl hover:bg-primary/10 shadow-sm border border-outline/5 bg-white"
                          title="عرض رمز QR"
                        >
                          <QrCode size={20} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingEquipment(e);
                            setNewEquipment({
                              name: e.name,
                              type: e.type,
                              serialNumber: e.serialNumber,
                              status: e.status,
                              totalQuantity: e.totalQuantity,
                              availableQuantity: e.availableQuantity,
                              brokenQuantity: e.brokenQuantity,
                              supplier: e.supplier || '',
                              location: e.location || '',
                              notes: e.notes || '',
                              foundationalInventory: e.foundationalInventory || '',
                              decennialReview: e.decennialReview || ''
                            });
                            setIsAddModalOpen(true);
                          }}
                          className="p-3 text-primary/40 hover:text-primary transition-colors rounded-2xl hover:bg-primary/10 shadow-sm border border-outline/5 bg-white"
                          title="تعديل الصنف"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handlePrint(e)}
                          className="p-3 text-primary/40 hover:text-primary transition-colors rounded-2xl hover:bg-primary/10 shadow-sm border border-outline/5 bg-white"
                          title="طباعة البطاقة التقنية"
                        >
                          <Printer size={20} />
                        </button>
                        <button 
                          onClick={() => fetchHistory(e.id, e.name)}
                          className="p-3 text-primary/40 hover:text-primary transition-colors rounded-2xl hover:bg-primary/10 shadow-sm border border-outline/5 bg-white"
                          title="سجل الحركات"
                        >
                          <History size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEquipment(e.id, e.name)}
                          className="p-3 text-primary/40 hover:text-error transition-colors rounded-2xl hover:bg-error/10 shadow-sm border border-outline/5 bg-white"
                          title="حذف الصنف"
                        >
                          <Trash2 size={20} />
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

      {/* Smart Update Confirmation Modal */}
      <AnimatePresence>
        {isSmartUpdateConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSmartUpdateConfirmOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/20 p-10 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
                <Sparkles size={40} />
              </div>
              <h3 className="text-3xl font-black text-primary mb-4 font-serif">تحديث ذكي شامل</h3>
              <p className="text-on-surface/60 text-lg font-bold leading-relaxed mb-10">
                هل أنت متأكد من رغبتك في تحديث معلومات التجهيزات ذكياً؟
                <br />
                <span className="text-sm opacity-70">قد تستغرق هذه العملية بعض الوقت. سيتم تحديث البيانات تلقائياً بناءً على اقتراحات الذكاء الاصطناعي.</span>
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setIsSmartUpdateConfirmOpen(false);
                    handleSmartUpdate();
                  }}
                  className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
                >
                  بدء التحديث
                </button>
                <button 
                  onClick={() => setIsSmartUpdateConfirmOpen(false)}
                  className="flex-1 bg-surface-container-low text-on-surface/40 py-4 rounded-2xl font-black hover:bg-surface-container transition-all active:scale-95"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Smart Update Progress Overlay */}
      <AnimatePresence>
        {isSmartUpdating && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-3xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-12 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-8 border-primary/10 rounded-full" />
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle 
                    cx="64" cy="64" r="56" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - (bulkProgress.current / bulkProgress.total))}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw size={32} className="text-primary animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-primary mb-2 font-serif">جاري التحديث الذكي...</h3>
              <p className="text-on-surface/40 font-bold mb-8">
                معالجة العنصر {bulkProgress.current} من أصل {bulkProgress.total}
              </p>
              <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">يرجى عدم إغلاق الصفحة</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white w-full max-w-3xl rounded-[50px] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-10 flex justify-between items-center bg-surface-container-low/50 border-b border-outline/5">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary rounded-2xl text-on-primary shadow-xl shadow-primary/20">
                    {editingEquipment ? <Edit size={28} /> : <Plus size={28} />}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-primary font-serif">
                      {editingEquipment ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد'}
                    </h3>
                    <p className="text-on-surface/40 text-sm font-bold">
                      {editingEquipment ? 'تحديث بيانات العتاد أو الزجاجيات' : 'أدخل بيانات العتاد أو الزجاجيات الجديدة'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingEquipment(null);
                    setNewEquipment({
                      name: '',
                      type: 'glassware',
                      serialNumber: '',
                      status: 'functional',
                      totalQuantity: 0,
                      availableQuantity: 0,
                      brokenQuantity: 0,
                      supplier: '',
                      location: '',
                      notes: '',
                      foundationalInventory: '',
                      decennialReview: ''
                    });
                  }} 
                  className="p-4 hover:bg-error/10 hover:text-error rounded-full transition-all active:scale-90"
                >
                  <X size={28} />
                </button>
              </div>
              
              <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
                <form onSubmit={handleAddEquipment} className="p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">اسم الصنف</label>
                    <input 
                      required
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      placeholder="مثال: مجهر ضوئي، بيشر 250مل..."
                      value={newEquipment.name}
                      onChange={e => setNewEquipment({...newEquipment, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">النوع</label>
                    <select 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner appearance-none"
                      value={newEquipment.type}
                      onChange={e => setNewEquipment({...newEquipment, type: e.target.value as any})}
                    >
                      <option value="glassware">زجاجيات مخبرية</option>
                      <option value="tech">أجهزة تقنية / إلكترونية</option>
                      <option value="other">أدوات ووسائل أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">الرقم التسلسلي</label>
                    <input 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      placeholder="SN-000000"
                      value={newEquipment.serialNumber}
                      onChange={e => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">الحالة التشغيلية</label>
                    <select 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner appearance-none"
                      value={newEquipment.status}
                      onChange={e => setNewEquipment({...newEquipment, status: e.target.value as any})}
                    >
                      <option value="functional">سليم / نشط</option>
                      <option value="maintenance">قيد الصيانة</option>
                      <option value="broken">تالف / خارج الخدمة</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">إجمالي الكمية</label>
                    <input 
                      type="number"
                      required
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      value={newEquipment.totalQuantity}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setNewEquipment({...newEquipment, totalQuantity: val, availableQuantity: val - (newEquipment.brokenQuantity || 0)});
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">الكمية التالفة</label>
                    <input 
                      type="number"
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      value={newEquipment.brokenQuantity}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setNewEquipment({...newEquipment, brokenQuantity: val, availableQuantity: (newEquipment.totalQuantity || 0) - val});
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">الممون</label>
                    <input 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      placeholder="اسم الممون"
                      value={newEquipment.supplier}
                      onChange={e => setNewEquipment({...newEquipment, supplier: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">الموقع</label>
                    <input 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      placeholder="مكان التخزين"
                      value={newEquipment.location}
                      onChange={e => setNewEquipment({...newEquipment, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">الجرد التأسيسي</label>
                    <input 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      placeholder="بيانات الجرد التأسيسي"
                      value={newEquipment.foundationalInventory}
                      onChange={e => setNewEquipment({...newEquipment, foundationalInventory: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">المراجعة العشرية</label>
                    <input 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                      placeholder="بيانات المراجعة العشرية"
                      value={newEquipment.decennialReview}
                      onChange={e => setNewEquipment({...newEquipment, decennialReview: e.target.value})}
                    />
                  </div>
                  <div className="col-span-full space-y-3">
                    <label className="text-xs font-black text-on-surface/40 uppercase tracking-widest mr-4">ملاحظات</label>
                    <textarea 
                      className="w-full bg-surface-container-low border-2 border-transparent rounded-[24px] px-6 py-4 text-base font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner min-h-[100px]"
                      placeholder="أي ملاحظات إضافية..."
                      value={newEquipment.notes}
                      onChange={e => setNewEquipment({...newEquipment, notes: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 pt-8">
                    <button type="submit" className="w-full bg-primary text-on-primary py-6 rounded-full font-black text-xl shadow-2xl shadow-primary/30 hover:bg-primary-container hover:shadow-primary/40 transition-all active:scale-[0.98]">
                      {editingEquipment ? 'حفظ التعديلات' : 'تأكيد إضافة الصنف للجرد'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsHistoryModalOpen(false)} className="absolute inset-0 bg-primary/20 backdrop-blur-2xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }} 
              className="relative bg-white w-full max-w-2xl rounded-[50px] shadow-2xl p-12 max-h-[85vh] overflow-hidden flex flex-col border border-white/20"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                    <History size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-primary font-serif">سجل الحركات</h3>
                    <p className="text-on-surface/40 text-xs font-bold">{currentEquipName}</p>
                  </div>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} className="p-4 hover:bg-error/10 hover:text-error rounded-full transition-all active:scale-90">
                  <X size={28} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                {selectedEquipHistory.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 py-20 opacity-20">
                    <History size={64} />
                    <p className="text-xl font-black">لا يوجد سجل حركات لهذا الصنف</p>
                  </div>
                ) : (
                  selectedEquipHistory.map((log, i) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative border-r-4 border-primary/20 pr-8 py-6 bg-surface-container-low/30 rounded-l-[32px] group hover:border-primary transition-all"
                    >
                      <div className="absolute top-1/2 -right-[10px] w-4 h-4 rounded-full bg-primary shadow-lg border-4 border-white group-hover:scale-125 transition-transform" />
                      <div className="flex justify-between items-center mb-3">
                        <span className={cn(
                          "text-xs font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest",
                          log.newStatus === 'functional' ? "bg-primary/10 text-primary" : 
                          log.newStatus === 'maintenance' ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
                        )}>
                          {log.newStatus === 'functional' ? 'سليم / نشط' : log.newStatus === 'maintenance' ? 'قيد الصيانة' : 'تالف / خارج الخدمة'}
                        </span>
                        <span className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest">{log.date?.toDate()?.toLocaleString('ar-DZ')}</span>
                      </div>
                      <p className="text-base text-on-surface/70 font-bold leading-relaxed">{log.note}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* QR Code Modal */}
      <AnimatePresence>
        {isQRModalOpen && qrCodeItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQRModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-outline/10 p-8 flex flex-col items-center gap-6"
            >
              <div className="text-center">
                <h3 className="text-xl font-black text-primary">{qrCodeItem.name}</h3>
                <p className="text-xs text-secondary font-bold">{qrCodeItem.serialNumber}</p>
              </div>
              
              <div className="bg-white p-4 rounded-3xl shadow-inner border border-outline/5">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ id: qrCodeItem.id, type: 'equipment', name: qrCodeItem.name }))}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              
              <div className="w-full space-y-3">
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Printer size={18} />
                  طباعة الملصق
                </button>
                <button 
                  onClick={() => setIsQRModalOpen(false)}
                  className="w-full py-3 rounded-xl border border-outline/20 font-bold text-secondary hover:bg-surface-container-high transition-all"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
