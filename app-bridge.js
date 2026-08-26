// 1. إنشاء قناة الاتصال الموحدة بين البوابتين
const auditChannel = new BroadcastChannel('audit_system_channel');
const STORAGE_KEY = 'audit_documents_db';

// بيانات أولية تجريبية في حال كان النظام فارغاً
const initialDocs = [
    { id: 101, name: 'ميزان المراجعة 2025.xlsx', category: 'القوائم المالية', status: 'مقبول', note: 'تم الاعتماد والتطابق', date: '10:00 AM' },
    { id: 102, name: 'كشف حساب بنك الاتحاد - Q4.pdf', category: 'المطابقات البنكية', status: 'قيد المراجعة', note: '', date: '10:15 AM' },
    { id: 103, name: 'فواتير المشتريات الآجلة - شهر 12.pdf', category: 'المشتريات والموردين', status: 'قيد المراجعة', note: '', date: '11:30 AM' }
];

// دالة جلب البيانات من ذاكرة المتصفح
function getStoredDocs() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDocs));
        return initialDocs;
    }
    return JSON.parse(data);
}

// دالة حفظ البيانات وتنبيه البوابة الأخرى
function saveAndNotify(docsArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docsArray));
    auditChannel.postMessage({ type: 'DATA_CHANGED' });
}

// --- عمليات العميل ---
function clientUploadDoc(docName, category = 'مستندات عامة') {
    const docs = getStoredDocs();
    const newDoc = {
        id: Date.now(),
        name: docName,
        category: category,
        status: 'قيد المراجعة',
        note: '',
        date: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })
    };
    docs.push(newDoc);
    saveAndNotify(docs);
}

// --- عمليات المدقق ---
function auditorUpdateStatus(docId, newStatus, auditorNote = '') {
    let docs = getStoredDocs();
    docs = docs.map(doc => {
        if (doc.id == docId) {
            return { ...doc, status: newStatus, note: auditorNote };
        }
        return doc;
    });
    saveAndNotify(docs);
}
