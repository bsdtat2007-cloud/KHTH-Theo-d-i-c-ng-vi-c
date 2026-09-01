import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, X, ChevronDown, Search, Trash2, Pencil, Check, ListTodo, CircleDot, CheckCircle2, AlertCircle, ShieldCheck, User, LogOut, PlayCircle, Archive, ArchiveRestore, Bell, Table2, Calendar, Mail, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

// ---------- Danh mục nhóm công việc gốc (theo Dự thảo phân công 1908) ----------
const NHOM_CV = [
  { ma: '01', ten: 'Quản lý chuyên môn' },
  { ma: '02', ten: 'Kế hoạch – Thống kê – Báo cáo' },
  { ma: '03', ten: 'Hồ sơ bệnh án – Y chứng – Ấn phẩm – Hành chính chuyên môn' },
  { ma: '04', ten: 'Quản lý khám chữa bệnh BHYT' },
  { ma: '05', ten: 'Đào tạo – Quản lý người học – Chuyển giao kỹ thuật' },
  { ma: '06', ten: 'Nghiên cứu khoa học – Thử nghiệm lâm sàng – Đạo đức nghiên cứu' },
  { ma: '07', ten: 'Hợp tác – Hội nghị – Hội thảo' },
  { ma: '08', ten: 'Chuyển đổi số – Các mô hình chuyên môn mới' },
];

const MUC_UU_TIEN = ['Cao', 'Trung bình', 'Thấp'];
const TRANG_THAI = ['Chưa bắt đầu', 'Đang xử lý', 'Đã hoàn thành'];
const ARCHIVE_DAYS = 90;

// ---------- Bảng màu — xanh dương & đỏ đô, lấy cảm hứng từ huy hiệu bệnh viện ----------
const NAVY = '#1B3A6B';
const NAVY_DEEP = '#122548';
const SKY = '#2C6FB0';
const SKY_DEEP = '#1F5A93';
const GOLD = '#F0B429';
const RED = '#A32638';
const BG = '#F6F5F1';

const COLOR_UUTIEN = { 'Cao': '#A32638', 'Trung bình': '#C89B3C', 'Thấp': '#9AA5B1' };
const COLOR_TRANGTHAI = { 'Đã hoàn thành': '#1E7A5C', 'Đang xử lý': '#1B6FA8', 'Chưa bắt đầu': '#D7D2C4' };

const ADMIN_PIN = '2026';

// Mỗi nhân viên có 1 mã PIN riêng (4 số) để đăng nhập đúng tên mình,
// và 1 email để nhận nhắc việc qua thư điện tử.
// Thu điền lại email thật của từng người vào đây (hiện đang là email giả để demo).
const NHAN_SU = [
  { name: 'ThS. Lê Thanh Tâm', pin: '1111', email: 'lttam.bv@ctump.edu.vn' },
  { name: 'ThS. Võ Tấn Cường', pin: '2222', email: 'vtcuong.bv@ctump.edu.vn' },
  { name: 'BS. Dương Thị Anh Thư', pin: '3333', email: 'dtathu.bv@ctump.edu.vn' },
  { name: 'ThS. Lê Huyền Trân', pin: '4444', email: 'lhtran.bv@ctump.edu.vn' },
  { name: 'ĐD.CKI. Nguyễn Thị Ngọc Bảo', pin: '5555', email: 'ntnbao.bv@ctump.edu.vn' },
  { name: 'BS. Nguyễn Minh Nhựt', pin: '6666', email: 'nmnhut.bv@ctump.edu.vn' },
  { name: 'CN. Nguyễn Ngọc Thơ', pin: '7777', email: 'nntho.bv@ctump.edu.vn' },
  { name: 'CN. Trần Thị Huệ', pin: '8888', email: 'tthue.bv@ctump.edu.vn' },
  { name: 'BSCKI. Kim Ngọc Khánh Vinh', pin: '9999', email: 'knkvinh.bv@ctump.edu.vn' },
  { name: 'BSCKI. Lại Khôi Nguyên', pin: '1212', email: 'lknguyen.bv@ctump.edu.vn' },
  { name: 'ThS. Nguyễn Quang Đạt', pin: '3434', email: 'nqdat.bv@ctump.edu.vn' },
  { name: 'CN. Nguyễn Quách Ngọc Trâm', pin: '5656', email: 'nqntram.bv@ctump.edu.vn' },
];
const NHAN_SU_NAMES = NHAN_SU.map(n => n.name);

const SEED_TASKS = [];

function uid() { return 'id' + Math.random().toString(36).slice(2, 10); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function nowISO() { return new Date().toISOString().slice(0, 16); }

function daysLeft(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0,0,0,0);
  return Math.round((d - now) / 86400000);
}
function daysSince(iso) {
  if (!iso) return 0;
  const d = new Date(iso);
  const now = new Date();
  return Math.floor((now - d) / 86400000);
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mi = String(d.getMinutes()).padStart(2,'0');
  return `${hh}:${mi} ${dd}/${mm}`;
}

// Ghi nhớ lần cuối mỗi nhân viên xem thông báo (lưu theo trình duyệt/thiết bị đang dùng)
function getLastSeen(staffName) {
  try { return localStorage.getItem('khth:lastSeen:' + staffName) || null; }
  catch (e) { return null; }
}
function setLastSeen(staffName, iso) {
  try { localStorage.setItem('khth:lastSeen:' + staffName, iso); }
  catch (e) { /* ignore */ }
}

async function loadTasks() {
  try {
    const res = await window.storage.get('khth:tasks', true);
    if (res && res.value) return JSON.parse(res.value);
  } catch (e) { /* not found */ }
  return null;
}
async function saveTasks(tasks) {
  try { await window.storage.set('khth:tasks', JSON.stringify(tasks), true); }
  catch (e) { console.error('save failed', e); }
}

// Lưu ý: gửi email nhắc việc (EmailJS) chỉ hoạt động ở bản web (Vercel) vì cần cài thêm gói riêng.
// Trong bản xem trước này, gửi email sẽ báo lỗi nhẹ nếu bấm thử.
async function sendReminderEmail(task) {
  return { ok: false, reason: 'Tính năng này chỉ hoạt động trên bản web đã deploy (Vercel), không dùng được trong bản xem trước Claude.' };
}


export default function App() {
  const [tasks, setTasks] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [filterNhom, setFilterNhom] = useState('all');
  const [filterPhuTrach, setFilterPhuTrach] = useState('all');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'table' | 'calendar'
  const [calendarMonth, setCalendarMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selectedDay, setSelectedDay] = useState(null);
  const [emailSending, setEmailSending] = useState(null); // id của task đang gửi email
  const [autoShown, setAutoShown] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadTasks();
      if (loaded) setTasks(loaded);
      else { setTasks(SEED_TASKS); saveTasks(SEED_TASKS); }
    })();
  }, []);

  const persist = useCallback((next) => { setTasks(next); saveTasks(next); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const isAdmin = role === 'admin';
  const staffName = role && role.type === 'staff' ? role.name : null;

  const upsertTask = (task) => {
    if (!tasks) return;
    let next;
    if (editingId) {
      next = tasks.map(t => t.id === editingId ? { ...t, ...task } : t);
      showToast('Đã cập nhật công việc');
    } else {
      const taoBoi = isAdmin ? 'admin' : staffName;
      const newTask = { ...task, id: uid(), batDauLuc: null, hoanThanhLuc: null, taoBoi, createdAt: nowISO() };
      next = [...tasks, newTask];
      showToast(isAdmin ? 'Đã giao việc mới' : 'Đã thêm việc');
      // Tự động gửi email nhắc việc ngay khi Quản lý giao việc mới cho nhân viên
      if (isAdmin) {
        sendReminderEmail(newTask).then(result => {
          if (result.ok) showToast(`Đã gửi email báo việc mới tới ${newTask.phuTrach}`);
        });
      }
    }
    persist(next);
    setShowForm(false);
    setEditingId(null);
  };

  const deleteTask = (id) => {
    if (!tasks) return;
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    if (!isAdmin && t.taoBoi !== staffName) return;
    persist(tasks.filter(t => t.id !== id));
    showToast('Đã xoá công việc');
  };

  const setStatus = (id, trangThai) => {
    if (!tasks) return;
    const now = nowISO();
    persist(tasks.map(t => {
      if (t.id !== id) return t;
      const patch = { trangThai };
      if (trangThai === 'Đang xử lý' && !t.batDauLuc) patch.batDauLuc = now;
      if (trangThai === 'Đã hoàn thành') patch.hoanThanhLuc = now;
      if (trangThai === 'Chưa bắt đầu') { patch.batDauLuc = null; patch.hoanThanhLuc = null; }
      return { ...t, ...patch };
    }));
    showToast(trangThai === 'Đang xử lý' ? 'Đã bắt đầu công việc' : trangThai === 'Đã hoàn thành' ? 'Đã hoàn thành công việc' : 'Đã cập nhật trạng thái');
  };

  const handleSendReminder = async (task) => {
    setEmailSending(task.id);
    const result = await sendReminderEmail(task);
    setEmailSending(null);
    showToast(result.ok ? `Đã gửi nhắc việc qua email tới ${task.phuTrach}` : result.reason);
  };

  const phuTrachList = useMemo(() => {
    if (!tasks) return NHAN_SU_NAMES;
    const fromTasks = tasks.map(t => t.phuTrach).filter(Boolean);
    return [...new Set([...NHAN_SU_NAMES, ...fromTasks])];
  }, [tasks]);

  // Tách việc đang hoạt động và việc đã lưu trữ (hoàn thành > 90 ngày)
  const { activeTasks, archivedTasks } = useMemo(() => {
    if (!tasks) return { activeTasks: [], archivedTasks: [] };
    const active = [], archived = [];
    for (const t of tasks) {
      const isOld = t.trangThai === 'Đã hoàn thành' && t.hoanThanhLuc && daysSince(t.hoanThanhLuc) >= ARCHIVE_DAYS;
      if (isOld) archived.push(t); else active.push(t);
    }
    return { activeTasks: active, archivedTasks: archived };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const pool = showArchive ? archivedTasks : activeTasks;
    if (staffName) return pool.filter(t => t.phuTrach === staffName);
    // Quản lý không thấy các việc được đánh dấu "riêng tư" (chỉ người tự tạo mới thấy)
    return pool.filter(t => !t.riengTu);
  }, [activeTasks, archivedTasks, staffName, showArchive]);

  const filtered = useMemo(() => {
    return visibleTasks.filter(t => {
      if (filterNhom !== 'all' && t.nhom !== filterNhom) return false;
      if (!staffName && filterPhuTrach !== 'all' && t.phuTrach !== filterPhuTrach) return false;
      if (!staffName && filterFrom && t.hanHoanThanh < filterFrom) return false;
      if (!staffName && filterTo && t.hanHoanThanh > filterTo) return false;
      if (search && !t.ten.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [visibleTasks, filterNhom, filterPhuTrach, filterFrom, filterTo, search, staffName]);

  const stats = useMemo(() => {
    const byPriority = MUC_UU_TIEN.map(p => ({ name: p, value: filtered.filter(t => t.uuTien === p).length }));
    const byStatus = TRANG_THAI.map(s => ({ name: s, value: filtered.filter(t => t.trangThai === s).length }));
    const total = filtered.length;
    const overdue = filtered.filter(t => t.trangThai !== 'Đã hoàn thành' && daysLeft(t.hanHoanThanh) < 0).length;
    return { byPriority, byStatus, total, overdue };
  }, [filtered]);

  // Thông báo cho nhân viên: việc mới được giao (kể từ lần xem gần nhất) + việc sắp/đã tới hạn
  const notifications = useMemo(() => {
    if (!staffName || !tasks) return { newTasks: [], dueTasks: [] };
    const lastSeen = getLastSeen(staffName);
    const mine = tasks.filter(t => t.phuTrach === staffName);
    const newTasks = lastSeen
      ? mine.filter(t => t.taoBoi === 'admin' && t.createdAt && t.createdAt > lastSeen)
      : [];
    const dueTasks = mine.filter(t => t.trangThai !== 'Đã hoàn thành' && daysLeft(t.hanHoanThanh) <= 1);
    return { newTasks, dueTasks };
  }, [tasks, staffName]);

  const notificationCount = notifications.newTasks.length + notifications.dueTasks.length;

  useEffect(() => {
    if (staffName) {
      // Đánh dấu đã xem tại thời điểm đăng nhập lần này (áp dụng cho lần thông báo tiếp theo)
      const lastSeen = getLastSeen(staffName);
      if (!lastSeen) setLastSeen(staffName, nowISO());
    } else {
      setAutoShown(false);
    }
  }, [staffName]);

  // Tự động bật cảnh báo giữa màn hình ngay khi nhân viên đăng nhập, nếu có thông báo
  useEffect(() => {
    if (staffName && tasks && !autoShown) {
      setAutoShown(true);
      if (notificationCount > 0) setShowNotifications(true);
    }
  }, [staffName, tasks, autoShown, notificationCount]);

  const maxBar = Math.max(1, ...stats.byPriority.map(p => p.value));

  if (!tasks) {
    return (
      <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:BG, fontFamily:'Georgia, serif', color:SKY_DEEP, gap:10}}>
        <span>Đang tải dữ liệu…</span>
      </div>
    );
  }

  if (!role) {
    return <RoleGate onAdmin={() => setShowLogin(true)} onStaff={(name) => setRole({ type: 'staff', name })}
      staffList={phuTrachList} showLogin={showLogin} onCancelLogin={() => setShowLogin(false)}
      onAdminLogin={() => { setRole('admin'); setShowLogin(false); }} />;
  }

  return (
    <div style={{minHeight:'100vh', background:BG, fontFamily:"'Inter', -apple-system, sans-serif", color:'#20242B', paddingBottom: 60}}>
      <style>{`
        * { box-sizing: border-box; }
        .card { background:#fff; border:1px solid #E7E3D8; border-radius:14px; }
        .btn { cursor:pointer; border:none; font-family:inherit; transition:all .15s ease; }
        .btn:active { transform: scale(0.97); }
        select, input, textarea { font-family:inherit; }
        ::-webkit-scrollbar { height:6px; width:6px; }
        ::-webkit-scrollbar-thumb { background:#D7D2C4; border-radius:4px; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px);} to {opacity:1; transform:translateY(0);} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .khth-sidebar { width:176px; }
        .khth-sidebar-label { display:inline; }
        @media (max-width: 620px) {
          .khth-sidebar { width:52px; }
          .khth-sidebar-label { display:none; }
          .khth-sidebar-btn { justify-content:center !important; padding:10px 6px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg, ${SKY} 0%, ${SKY_DEEP} 100%)`, padding:'20px 18px 22px', position:'sticky', top:0, zIndex:10, boxShadow:'0 2px 12px rgba(31,90,147,0.18)'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, maxWidth:920, margin:'0 auto'}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'#fff', fontWeight:700}}>Bệnh viện Trường Đại học Y Dược Cần Thơ</div>
            <div style={{fontSize:10.5, color:'rgba(255,255,255,0.8)', marginTop:1}}>Phòng Kế hoạch Tổng hợp</div>
            <h1 style={{margin:'3px 0 0', fontSize:17, fontWeight:800, fontFamily:'Georgia, serif', color:'#fff', letterSpacing:'0.01em', textTransform:'uppercase'}}>Bộ công cụ theo dõi công việc</h1>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, maxWidth:920, margin:'14px auto 0'}}>
          <div style={{display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:'rgba(255,255,255,0.85)', fontWeight:600, background:'rgba(255,255,255,0.1)', padding:'5px 11px', borderRadius:20}}>
            {isAdmin ? <ShieldCheck size={13}/> : <User size={13}/>}
            {isAdmin ? 'Chế độ Quản lý' : staffName}
          </div>
          <div style={{display:'flex', gap:8}}>
            {(isAdmin || staffName) && (
              <button className="btn" onClick={() => { setEditingId(null); setShowForm(true); }}
                style={{display:'flex', alignItems:'center', gap:6, background:GOLD, color:NAVY_DEEP, padding:'9px 14px', borderRadius:9, fontWeight:700, fontSize:13}}>
                <Plus size={15}/> {isAdmin ? 'Giao việc' : 'Thêm việc'}
              </button>
            )}
            {isAdmin && tasks.length > 0 && (
              <button className="btn" onClick={() => {
                  if (window.confirm(`Xoá toàn bộ ${tasks.length} công việc hiện có? Hành động này không thể hoàn tác.`)) {
                    persist([]);
                    showToast('Đã xoá toàn bộ dữ liệu');
                  }
                }} title="Xoá toàn bộ dữ liệu"
                style={{background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <Trash2 size={15}/>
              </button>
            )}
            {staffName && (
              <button className="btn" onClick={() => setShowNotifications(true)} title="Thông báo"
                style={{position:'relative', background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <Bell size={15}/>
                {notificationCount > 0 && (
                  <span style={{position:'absolute', top:-4, right:-4, background:RED, color:'#fff', fontSize:9.5, fontWeight:700, minWidth:16, height:16, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px', border:'2px solid ' + SKY_DEEP}}>
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            <button className="btn" onClick={() => setRole(null)} title="Đổi chế độ"
              style={{background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              <LogOut size={15}/>
            </button>
          </div>
        </div>
      </div>

      <div style={{padding:'18px 16px', maxWidth: isAdmin ? 1080 : 920, margin:'0 auto', display:'flex', gap:16, alignItems:'flex-start'}}>

        {isAdmin && (
          <AdminSidebar
            current={showArchive ? 'archive' : viewMode}
            archiveCount={archivedTasks.length}
            onSelect={(key) => {
              if (key === 'archive') { setShowArchive(true); }
              else { setShowArchive(false); setViewMode(key); }
            }}
          />
        )}

        <div style={{flex:1, minWidth:0}}>

        {/* Tabs: Đang hoạt động / Lưu trữ — chỉ hiện cho nhân viên, Quản lý dùng thanh dọc bên trái */}
        {!isAdmin && (
          <div style={{display:'flex', gap:6, marginBottom:16, background:'#EEEAE0', padding:4, borderRadius:11, width:'fit-content'}}>
            <button className="btn" onClick={()=>setShowArchive(false)}
              style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:12.5, fontWeight:700,
                background: !showArchive ? '#fff' : 'transparent', color: !showArchive ? NAVY : '#8a8072', boxShadow: !showArchive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}}>
              <ListTodo size={14}/> Đang hoạt động
            </button>
            <button className="btn" onClick={()=>setShowArchive(true)}
              style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, fontSize:12.5, fontWeight:700,
                background: showArchive ? '#fff' : 'transparent', color: showArchive ? NAVY : '#8a8072', boxShadow: showArchive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'}}>
              <Archive size={14}/> Lưu trữ ({archivedTasks.filter(t=>!staffName || t.phuTrach===staffName).length})
            </button>
          </div>
        )}

        {showArchive && (
          <div style={{background:'#EEF3F0', color:'#1E7A5C', fontSize:12, padding:'9px 12px', borderRadius:9, marginBottom:16, lineHeight:1.4}}>
            Việc đã hoàn thành hơn {ARCHIVE_DAYS} ngày được tự động chuyển vào đây để bảng chính gọn hơn. Dữ liệu vẫn được giữ đầy đủ.
          </div>
        )}

        {/* Summary strip */}
        <div style={{display:'flex', gap:10, marginBottom:16, overflowX:'auto'}}>
          <StatChip icon={<ListTodo size={15}/>} label="Tổng việc" value={stats.total} color={NAVY}/>
          <StatChip icon={<CircleDot size={15}/>} label="Đang xử lý" value={stats.byStatus[1].value} color="#1B6FA8"/>
          <StatChip icon={<CheckCircle2 size={15}/>} label="Hoàn thành" value={stats.byStatus[2].value} color="#1E7A5C"/>
          <StatChip icon={<AlertCircle size={15}/>} label="Trễ hạn" value={stats.overdue} color={RED}/>
        </div>

        {/* Filters */}
        <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}>
          <div style={{position:'relative', flex:'1 1 160px'}}>
            <Search size={15} style={{position:'absolute', left:10, top:10, color:'#A89B85'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm việc..."
              style={{width:'100%', padding:'8px 10px 8px 32px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}/>
          </div>
          <SelectBox value={filterNhom} onChange={setFilterNhom} options={[{ma:'all', ten:'Tất cả nhóm'}, ...NHOM_CV]} getLabel={o=>o.ma==='all'?o.ten:`${o.ma} · ${o.ten}`} getValue={o=>o.ma} minWidth={140}/>
          {!staffName && (
            <SelectBox value={filterPhuTrach} onChange={setFilterPhuTrach} options={[{v:'all', l:'Tất cả người phụ trách'}, ...phuTrachList.map(p=>({v:p,l:p}))]} getLabel={o=>o.l} getValue={o=>o.v} minWidth={140}/>
          )}
        </div>

        {!staffName && (
          <div style={{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center'}}>
            <span style={{fontSize:12, color:'#8a8072', fontWeight:600, flexShrink:0}}>Khoảng thời gian:</span>
            <input type="date" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)}
              style={{padding:'7px 10px', borderRadius:9, border:'1px solid #E3DACB', fontSize:12.5, background:'#fff'}}/>
            <span style={{fontSize:12, color:'#A89B85'}}>đến</span>
            <input type="date" value={filterTo} onChange={e=>setFilterTo(e.target.value)}
              style={{padding:'7px 10px', borderRadius:9, border:'1px solid #E3DACB', fontSize:12.5, background:'#fff'}}/>
            {(filterFrom || filterTo) && (
              <button className="btn" onClick={()=>{setFilterFrom(''); setFilterTo('');}}
                style={{fontSize:11.5, color:RED, background:'transparent', padding:'4px 8px'}}>Xoá lọc</button>
            )}
          </div>
        )}

        {/* Charts */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16}}>
          <div className="card" style={{padding:14}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#6b6258', marginBottom:12, letterSpacing:'0.04em'}}>SỐ VIỆC THEO ƯU TIÊN</div>
            <div style={{display:'flex', alignItems:'flex-end', gap:10, height:100}}>
              {stats.byPriority.map(p => (
                <div key={p.name} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
                  <div style={{fontSize:13, fontWeight:700}}>{p.value}</div>
                  <div style={{width:'100%', maxWidth:34, height: Math.max(4, (p.value/maxBar)*66), background: COLOR_UUTIEN[p.name], borderRadius:'5px 5px 2px 2px'}}/>
                  <div style={{fontSize:10, color:'#8a8072', textAlign:'center'}}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:14}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#6b6258', marginBottom:4, letterSpacing:'0.04em'}}>TRẠNG THÁI CÔNG VIỆC</div>
            <div style={{height:100, position:'relative'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.byStatus} dataKey="value" nameKey="name" innerRadius={28} outerRadius={44} paddingAngle={2} stroke="none">
                    {stats.byStatus.map((s,i) => <Cell key={i} fill={COLOR_TRANGTHAI[s.name]}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <div style={{fontSize:15, fontWeight:800, color:NAVY}}>{stats.total}</div>
              </div>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginTop:2}}>
              {stats.byStatus.map(s => (
                <div key={s.name} style={{display:'flex', alignItems:'center', gap:4, fontSize:9.5, color:'#6b6258'}}>
                  <div style={{width:7, height:7, borderRadius:'50%', background:COLOR_TRANGTHAI[s.name]}}/>{s.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task lists */}
        {showArchive ? (
          <ArchiveList tasks={filtered} isAdmin={isAdmin} staffName={staffName} onDelete={deleteTask}/>
        ) : isAdmin && viewMode === 'table' ? (
          <TaskTable tasks={filtered} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
            onSendReminder={handleSendReminder} emailSending={emailSending}/>
        ) : isAdmin && viewMode === 'calendar' ? (
          <TaskCalendar tasks={filtered} month={calendarMonth} onMonthChange={setCalendarMonth}
            selectedDay={selectedDay} onSelectDay={setSelectedDay}
            onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
            onSendReminder={handleSendReminder} emailSending={emailSending}/>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <TaskColumn title="Chưa bắt đầu" color="#9AA5B1" bg="#F1F0EB" tasks={filtered.filter(t=>t.trangThai==='Chưa bắt đầu')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onAdvance={(id)=>setStatus(id,'Đang xử lý')} advanceLabel="Bắt đầu" advanceIcon={<PlayCircle size={14}/>}
              onSendReminder={handleSendReminder} emailSending={emailSending}/>
            <TaskColumn title="Đang xử lý" color="#1B6FA8" bg="#EAF2F7" tasks={filtered.filter(t=>t.trangThai==='Đang xử lý')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onAdvance={(id)=>setStatus(id,'Đã hoàn thành')} advanceLabel="Hoàn thành" advanceIcon={<Check size={14}/>}
              onSendReminder={handleSendReminder} emailSending={emailSending}/>
            <TaskColumn title="Đã hoàn thành" color="#1E7A5C" bg="#E9F3EE" tasks={filtered.filter(t=>t.trangThai==='Đã hoàn thành')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onSendReminder={handleSendReminder} emailSending={emailSending}/>
          </div>
        )}
        </div>
      </div>

      {showForm && (isAdmin || staffName) && (
        <TaskForm
          initial={editingId ? tasks.find(t=>t.id===editingId) : null}
          phuTrachList={phuTrachList}
          isAdmin={isAdmin}
          staffName={staffName}
          onCancel={() => { setShowForm(false); setEditingId(null); }}
          onSave={upsertTask}
        />
      )}

      {showNotifications && staffName && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => {
            setLastSeen(staffName, nowISO());
            setShowNotifications(false);
          }}
        />
      )}

      {toast && (
        <div style={{position:'fixed', bottom:20, left:'50%', transform:'translateX(-50%)', background:NAVY_DEEP, color:'#fff', padding:'10px 18px', borderRadius:10, fontSize:13.5, animation:'fadeIn .2s ease', boxShadow:'0 6px 20px rgba(0,0,0,0.25)', zIndex:50}}>
          {toast}
        </div>
      )}
    </div>
  );
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 11) return 'Chúc ngày mới tốt lành!';
  if (h < 14) return 'Chúc buổi trưa vui vẻ!';
  if (h < 18) return 'Chúc buổi chiều làm việc hiệu quả!';
  return 'Chúc buổi tối an lành!';
}

function NotificationPanel({ notifications, onClose }) {
  const { newTasks, dueTasks } = notifications;
  const hasAny = newTasks.length > 0 || dueTasks.length > 0;
  const pad2 = (n) => String(n).padStart(2, '0');
  const summary = newTasks.length > 0 && dueTasks.length > 0
    ? `Hôm nay bạn có ${pad2(newTasks.length)} việc mới được giao và ${pad2(dueTasks.length)} việc đến hạn.`
    : newTasks.length > 0
      ? `Hôm nay bạn có ${pad2(newTasks.length)} việc mới được giao.`
      : dueTasks.length > 0
        ? `Hôm nay bạn có ${pad2(dueTasks.length)} việc đến hạn.`
        : 'Bạn chưa có thông báo mới nào.';
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(18,37,72,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:45, animation:'fadeIn .15s ease', padding:24}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff', width:'100%', maxWidth:420, borderRadius:18, padding:'22px', boxShadow:'0 20px 60px rgba(0,0,0,0.35)', animation:'slideUp .2s ease', maxHeight:'80vh', overflowY:'auto'}}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:16}}>
          <div style={{width:52, height:52, borderRadius:'50%', background: hasAny ? '#FBEAEA' : '#EAF2F7', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10}}>
            <Bell size={24} color={hasAny ? RED : SKY_DEEP}/>
          </div>
          <h2 style={{margin:0, fontSize:16.5, fontWeight:800, fontFamily:'Georgia, serif', color:NAVY}}>
            {greetingByHour()}
          </h2>
          <p style={{margin:'6px 0 0', fontSize:13, color:'#6b6258', lineHeight:1.4}}>{summary}</p>
        </div>

        {!hasAny && (
          <div style={{textAlign:'center', padding:'8px 0 20px', color:'#A89B85', fontSize:13}}>Không có thông báo mới</div>
        )}

        {newTasks.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#8a8072', marginBottom:8, letterSpacing:'0.03em'}}>VIỆC MỚI ĐƯỢC GIAO</div>
            {newTasks.map(t => (
              <div key={t.id} style={{padding:'10px 12px', background:'#EAF2F7', borderRadius:10, marginBottom:8}}>
                <div style={{fontSize:13.5, fontWeight:600, color:'#20242B'}}>{t.ten}</div>
                <div style={{fontSize:11, color:'#1B6FA8', marginTop:3}}>Hạn: {t.hanHoanThanh}</div>
              </div>
            ))}
          </div>
        )}

        {dueTasks.length > 0 && (
          <div style={{marginBottom:hasAny ? 6 : 0}}>
            <div style={{fontSize:11.5, fontWeight:700, color:'#8a8072', marginBottom:8, letterSpacing:'0.03em'}}>SẮP / ĐÃ ĐẾN HẠN</div>
            {dueTasks.map(t => {
              const dl = daysLeft(t.hanHoanThanh);
              const label = dl < 0 ? `Trễ ${Math.abs(dl)} ngày` : dl === 0 ? 'Đến hạn hôm nay' : 'Đến hạn ngày mai';
              return (
                <div key={t.id} style={{padding:'10px 12px', background:'#FBEAEA', borderRadius:10, marginBottom:8}}>
                  <div style={{fontSize:13.5, fontWeight:600, color:'#20242B'}}>{t.ten}</div>
                  <div style={{fontSize:11, color:RED, marginTop:3, fontWeight:600}}>{label}</div>
                </div>
              );
            })}
          </div>
        )}

        <button className="btn" onClick={onClose}
          style={{width:'100%', padding:12, borderRadius:11, background:NAVY, color:'#fff', fontWeight:700, fontSize:14, marginTop:6}}>
          Đã xem
        </button>
      </div>
    </div>
  );
}

function RoleGate({ onAdmin, onStaff, staffList, showLogin, onCancelLogin, onAdminLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffStep, setStaffStep] = useState('pick'); // 'pick' -> 'pin'
  const [staffPin, setStaffPin] = useState('');
  const [staffError, setStaffError] = useState('');

  const tryLogin = () => {
    if (pin === ADMIN_PIN) { onAdminLogin(); setPin(''); setError(''); }
    else setError('Sai mã PIN, vui lòng thử lại');
  };

  const goToStaffPin = () => {
    if (!selectedStaff) return;
    setStaffStep('pin');
    setStaffPin('');
    setStaffError('');
  };

  const tryStaffLogin = () => {
    const person = NHAN_SU.find(n => n.name === selectedStaff);
    if (person && staffPin === person.pin) { onStaff(selectedStaff); }
    else setStaffError('Sai mã PIN, vui lòng thử lại');
  };

  return (
    <div style={{minHeight:'100vh', background:`linear-gradient(180deg, ${SKY_DEEP} 0%, ${SKY} 55%, ${BG} 55%)`, fontFamily:"'Inter', -apple-system, sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24}}>
      <style>{`.btn { cursor:pointer; border:none; font-family:inherit; } .btn:active{transform:scale(0.97);}`}</style>
      <div style={{textAlign:'center', marginBottom:30}}>
        <div style={{fontSize:10.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff', fontWeight:700}}>Bệnh viện Trường Đại học Y Dược Cần Thơ</div>
        <div style={{fontSize:12, color:'rgba(255,255,255,0.85)', marginTop:2}}>Phòng Kế hoạch Tổng hợp</div>
        <h1 style={{margin:'8px 0 0', fontSize:22, fontWeight:800, fontFamily:'Georgia, serif', color:'#fff', textTransform:'uppercase'}}>Bộ công cụ theo dõi công việc</h1>
      </div>

      {!showLogin ? (
        <div style={{width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:12}}>
          <button className="btn" onClick={onAdmin}
            style={{display:'flex', alignItems:'center', gap:12, padding:'16px 18px', borderRadius:14, background:`linear-gradient(135deg, ${GOLD}, #D99A0B)`, color:NAVY_DEEP, textAlign:'left', boxShadow:'0 6px 18px rgba(240,180,41,0.35)'}}>
            <ShieldCheck size={22}/>
            <div>
              <div style={{fontWeight:800, fontSize:15}}>Quản lý / Lãnh đạo</div>
              <div style={{fontSize:12, opacity:0.85}}>Giao việc, sửa, xoá — cần mã PIN</div>
            </div>
          </button>

          <div style={{background:'#fff', border:'1px solid #E7E3D8', borderRadius:14, padding:'14px 16px', boxShadow:'0 6px 18px rgba(18,37,72,0.08)'}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10, color:NAVY}}>
              <User size={18}/><span style={{fontWeight:700, fontSize:15}}>Nhân viên</span>
            </div>

            {staffStep === 'pick' ? (
              <>
                <select value={selectedStaff} onChange={e=>setSelectedStaff(e.target.value)}
                  style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, marginBottom:10, background:'#fff'}}>
                  <option value="">Chọn tên của bạn...</option>
                  {staffList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn" disabled={!selectedStaff} onClick={goToStaffPin}
                  style={{width:'100%', padding:11, borderRadius:9, background: selectedStaff ? NAVY : '#E3DACB', color:'#fff', fontWeight:700, fontSize:13.5}}>
                  Tiếp tục
                </button>
              </>
            ) : (
              <>
                <div style={{fontSize:12.5, color:'#6b6258', marginBottom:8}}>Nhập mã PIN của <strong>{selectedStaff}</strong></div>
                <input type="password" value={staffPin} onChange={e=>{setStaffPin(e.target.value); setStaffError('');}}
                  onKeyDown={e => e.key==='Enter' && tryStaffLogin()}
                  placeholder="••••" autoFocus inputMode="numeric" maxLength={6}
                  style={{width:'100%', padding:'11px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:16, letterSpacing:4, textAlign:'center', marginBottom:10}}/>
                {staffError && <div style={{color:RED, fontSize:12, marginBottom:10}}>{staffError}</div>}
                <div style={{display:'flex', gap:8}}>
                  <button className="btn" onClick={()=>{setStaffStep('pick'); setStaffError('');}}
                    style={{flex:1, padding:11, borderRadius:9, background:'#F0EBE0', color:'#6b6258', fontWeight:600, fontSize:13.5}}>Quay lại</button>
                  <button className="btn" onClick={tryStaffLogin}
                    style={{flex:1, padding:11, borderRadius:9, background:NAVY, color:'#fff', fontWeight:700, fontSize:13.5}}>Vào</button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{width:'100%', maxWidth:300, background:'#fff', border:'1px solid #E7E3D8', borderRadius:14, padding:20, boxShadow:'0 6px 18px rgba(18,37,72,0.08)'}}>
          <div style={{fontWeight:700, fontSize:15, marginBottom:10, color:NAVY}}>Nhập mã PIN quản lý</div>
          <input type="password" value={pin} onChange={e=>{setPin(e.target.value); setError('');}}
            onKeyDown={e => e.key==='Enter' && tryLogin()}
            placeholder="••••" autoFocus
            style={{width:'100%', padding:'11px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:16, letterSpacing:4, textAlign:'center', marginBottom:10}}/>
          {error && <div style={{color:RED, fontSize:12, marginBottom:10}}>{error}</div>}
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={onCancelLogin} style={{flex:1, padding:11, borderRadius:9, background:'#F0EBE0', color:'#6b6258', fontWeight:600, fontSize:13.5}}>Quay lại</button>
            <button className="btn" onClick={tryLogin} style={{flex:1, padding:11, borderRadius:9, background:NAVY, color:'#fff', fontWeight:700, fontSize:13.5}}>Vào</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminSidebar({ current, archiveCount, onSelect }) {
  const items = [
    { key: 'board', icon: <LayoutGrid size={16}/>, label: 'Bảng công việc' },
    { key: 'table', icon: <Table2 size={16}/>, label: 'Bảng tổng hợp' },
    { key: 'calendar', icon: <Calendar size={16}/>, label: 'Lịch' },
    { key: 'archive', icon: <Archive size={16}/>, label: `Lưu trữ (${archiveCount})` },
  ];
  return (
    <div className="card khth-sidebar" style={{padding:8, flexShrink:0, display:'flex', flexDirection:'column', gap:4, position:'sticky', top:100}}>
      {items.map(it => (
        <button key={it.key} className="btn khth-sidebar-btn" onClick={()=>onSelect(it.key)}
          style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, fontSize:12.5, fontWeight:600, textAlign:'left',
            background: current===it.key ? NAVY : 'transparent', color: current===it.key ? '#fff' : '#20242B'}}>
          {it.icon}<span className="khth-sidebar-label">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function StatChip({ icon, label, value, color }) {
  return (
    <div className="card" style={{padding:'10px 14px', display:'flex', alignItems:'center', gap:8, minWidth:104, flexShrink:0}}>
      <div style={{color}}>{icon}</div>
      <div>
        <div style={{fontSize:16, fontWeight:800, lineHeight:1}}>{value}</div>
        <div style={{fontSize:10, color:'#8a8072', marginTop:2, whiteSpace:'nowrap'}}>{label}</div>
      </div>
    </div>
  );
}

function SelectBox({ value, onChange, options, getLabel, getValue, minWidth }) {
  return (
    <div style={{position:'relative', minWidth}}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:'100%', appearance:'none', padding:'8px 28px 8px 10px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13, background:'#fff', color:'#20242B'}}>
        {options.map(o => <option key={getValue(o)} value={getValue(o)}>{getLabel(o)}</option>)}
      </select>
      <ChevronDown size={14} style={{position:'absolute', right:9, top:10, color:'#A89B85', pointerEvents:'none'}}/>
    </div>
  );
}

function TaskTable({ tasks, onEdit, onDelete, onSendReminder, emailSending }) {
  return (
    <div className="card" style={{overflowX:'auto'}}>
      {tasks.length === 0 ? (
        <div style={{padding:'24px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào</div>
      ) : (
        <table style={{width:'100%', borderCollapse:'collapse', minWidth:640}}>
          <thead>
            <tr style={{background:'#F1F0EB'}}>
              <th style={thStyle}>STT</th>
              <th style={{...thStyle, textAlign:'left', minWidth:180}}>Tên công việc</th>
              <th style={thStyle}>Nhóm</th>
              <th style={thStyle}>Người phụ trách</th>
              <th style={thStyle}>Ưu tiên</th>
              <th style={thStyle}>Hạn</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => {
              const dl = daysLeft(t.hanHoanThanh);
              const overdue = t.trangThai !== 'Đã hoàn thành' && dl < 0;
              const selfCreated = t.taoBoi && t.taoBoi !== 'admin';
              return (
                <tr key={t.id} style={{borderTop:'1px solid #F0EDE3'}}>
                  <td style={tdStyle}>{i+1}</td>
                  <td style={{...tdStyle, textAlign:'left', fontWeight:600}}>
                    {t.ten}
                    {selfCreated && <span style={{marginLeft:6, fontSize:9.5, padding:'1px 6px', borderRadius:20, background:'#EDE7DA', color:'#8a7350', fontWeight:600}}>Tự thêm</span>}
                    {t.riengTu && <span style={{marginLeft:6, fontSize:9.5, padding:'1px 6px', borderRadius:20, background:'#FBEAEA', color:RED, fontWeight:600}}>Riêng tư</span>}
                  </td>
                  <td style={tdStyle}>{t.nhom}</td>
                  <td style={tdStyle}>{t.phuTrach}</td>
                  <td style={tdStyle}>
                    <span style={{fontSize:10, padding:'1px 7px', borderRadius:20, background: COLOR_UUTIEN[t.uuTien]+'20', color:COLOR_UUTIEN[t.uuTien], fontWeight:600}}>{t.uuTien}</span>
                  </td>
                  <td style={{...tdStyle, color: overdue ? RED : '#20242B', fontWeight: overdue ? 700 : 400}}>{t.hanHoanThanh}</td>
                  <td style={tdStyle}>
                    <span style={{fontSize:10, padding:'1px 7px', borderRadius:20, background: COLOR_TRANGTHAI[t.trangThai]+'30', color:'#20242B', fontWeight:600}}>{t.trangThai}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{display:'flex', gap:5, justifyContent:'center'}}>
                      {!selfCreated && onSendReminder && (
                        <button className="btn" onClick={()=>onSendReminder(t)} title="Nhắc qua email" disabled={emailSending===t.id}
                          style={{background:'#F3F0EA', color:'#1B6FA8', width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>
                          <Mail size={11}/>
                        </button>
                      )}
                      <button className="btn" onClick={()=>onEdit(t)} title="Sửa"
                        style={{background:'#F3F0EA', color:'#6b6258', width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Pencil size={11}/>
                      </button>
                      <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá"
                        style={{background:'#F3F0EA', color:RED, width:24, height:24, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Trash2 size={11}/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
const thStyle = { padding:'9px 10px', fontSize:11, fontWeight:700, color:'#6b6258', textAlign:'center', whiteSpace:'nowrap' };
const tdStyle = { padding:'9px 10px', fontSize:12, color:'#20242B', textAlign:'center' };

function TaskCalendar({ tasks, month, onMonthChange, selectedDay, onSelectDay, onEdit, onDelete, onSendReminder, emailSending }) {
  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const firstDay = new Date(year, monthIdx, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Thứ 2 = 0
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!t.hanHoanThanh) return;
      const d = t.hanHoanThanh;
      if (!d.startsWith(`${year}-${String(monthIdx+1).padStart(2,'0')}`)) return;
      if (!map[d]) map[d] = [];
      map[d].push(t);
    });
    return map;
  }, [tasks, year, monthIdx]);

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = todayISO();
  const monthLabel = month.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const selectedTasks = selectedDay ? (tasksByDay[selectedDay] || []) : [];
  const monthDates = useMemo(() => Object.keys(tasksByDay).sort(), [tasksByDay]);

  return (
    <div>
      <div className="card" style={{padding:14, marginBottom:14, maxWidth:400, margin:'0 auto 14px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
          <button className="btn" onClick={()=>{ const d = new Date(month); d.setMonth(d.getMonth()-1); onMonthChange(d); onSelectDay(null); }}
            style={{width:28, height:28, borderRadius:8, background:'#F3F0EA', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <ChevronLeft size={15}/>
          </button>
          <div style={{fontSize:14, fontWeight:700, color:NAVY, textTransform:'capitalize'}}>{monthLabel}</div>
          <button className="btn" onClick={()=>{ const d = new Date(month); d.setMonth(d.getMonth()+1); onMonthChange(d); onSelectDay(null); }}
            style={{width:28, height:28, borderRadius:8, background:'#F3F0EA', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <ChevronRight size={15}/>
          </button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3, marginBottom:6}}>
          {['T2','T3','T4','T5','T6','T7','CN'].map(d => (
            <div key={d} style={{textAlign:'center', fontSize:10, fontWeight:700, color:'#A89B85'}}>{d}</div>
          ))}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3}}>
          {cells.map((d, i) => {
            if (d === null) return <div key={i}/>;
            const dateStr = `${year}-${String(monthIdx+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const dayTasks = tasksByDay[dateStr] || [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDay;
            const hasOverdue = dayTasks.some(t => t.trangThai !== 'Đã hoàn thành' && dateStr < todayStr);
            return (
              <button key={i} className="btn" onClick={()=>onSelectDay(isSelected ? null : dateStr)}
                style={{
                  aspectRatio:'1', borderRadius:9, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
                  background: isSelected ? NAVY : isToday ? '#EAF2F7' : 'transparent',
                  border: isToday && !isSelected ? `1px solid ${SKY}` : '1px solid transparent',
                }}>
                <span style={{fontSize:12, fontWeight: isToday||isSelected ? 700 : 500, color: isSelected ? '#fff' : '#20242B'}}>{d}</span>
                {dayTasks.length > 0 && (
                  <span style={{
                    fontSize:8.5, fontWeight:700, minWidth:14, height:14, borderRadius:7, padding:'0 3px',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: isSelected ? '#fff' : hasOverdue ? RED : SKY,
                    color: isSelected ? (hasOverdue ? RED : SKY) : '#fff',
                  }}>{dayTasks.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay ? (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{background:'#F1F0EB', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span style={{fontSize:12.5, fontWeight:700, color:'#20242B'}}>Công việc ngày {selectedDay.split('-').reverse().join('/')} ({selectedTasks.length})</span>
            <button className="btn" onClick={()=>onSelectDay(null)} style={{fontSize:11, color:'#1B6FA8', background:'transparent', padding:'2px 6px'}}>Xem cả tháng</button>
          </div>
          {selectedTasks.length === 0 ? (
            <div style={{padding:'16px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào đến hạn ngày này</div>
          ) : (
            selectedTasks.map(t => <CalendarTaskRow key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} onSendReminder={onSendReminder} emailSending={emailSending}/>)
          )}
        </div>
      ) : (
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{background:'#F1F0EB', padding:'10px 14px', fontSize:12.5, fontWeight:700, color:'#20242B'}}>
            Danh sách công việc trong tháng ({tasks.length})
          </div>
          {monthDates.length === 0 ? (
            <div style={{padding:'20px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào đến hạn trong tháng này</div>
          ) : (
            monthDates.map(dateStr => {
              const dayTasks = tasksByDay[dateStr] || [];
              const isOverdueDay = dateStr < todayStr;
              return (
                <div key={dateStr}>
                  <div style={{padding:'7px 14px', background:'#FAF9F5', fontSize:11, fontWeight:700, color: isOverdueDay ? RED : '#6b6258', borderTop:'1px solid #F0EDE3'}}>
                    {dateStr.split('-').reverse().join('/')}
                  </div>
                  {dayTasks.map(t => <CalendarTaskRow key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} onSendReminder={onSendReminder} emailSending={emailSending}/>)}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function CalendarTaskRow({ t, onEdit, onDelete, onSendReminder, emailSending }) {
  const selfCreated = t.taoBoi && t.taoBoi !== 'admin';
  return (
    <div style={{padding:'10px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start'}}>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:13, fontWeight:600, color:'#20242B'}}>{t.ten}</div>
        <div style={{fontSize:10.5, color:'#8a8072', marginTop:3}}>{t.phuTrach} · {t.trangThai}</div>
      </div>
      <div style={{display:'flex', gap:6, flexShrink:0}}>
        {!selfCreated && onSendReminder && (
          <button className="btn" onClick={()=>onSendReminder(t)} title="Nhắc qua email" disabled={emailSending===t.id}
            style={{background:'#F3F0EA', color:'#1B6FA8', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Mail size={12}/>
          </button>
        )}
        <button className="btn" onClick={()=>onEdit(t)} title="Sửa"
          style={{background:'#F3F0EA', color:'#6b6258', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Pencil size={12}/>
        </button>
        <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá"
          style={{background:'#F3F0EA', color:RED, width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Trash2 size={12}/>
        </button>
      </div>
    </div>
  );
}

function TaskColumn({ title, color, bg, tasks, isAdmin, staffName, onEdit, onDelete, onAdvance, advanceLabel, advanceIcon, onSendReminder, emailSending }) {
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <div style={{background:bg, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:7}}>
          <div style={{width:8, height:8, borderRadius:'50%', background:color}}/>
          <span style={{fontSize:13, fontWeight:700, color:'#20242B'}}>{title}</span>
        </div>
        <span style={{fontSize:12, fontWeight:700, color}}>{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div style={{padding:'16px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Không có việc nào</div>
      ) : (
        <div>
          {tasks.map(t => {
            const dl = daysLeft(t.hanHoanThanh);
            const overdue = t.trangThai !== 'Đã hoàn thành' && dl < 0;
            const nhomTen = NHOM_CV.find(n=>n.ma===t.nhom)?.ten || '';
            const selfCreated = t.taoBoi && t.taoBoi !== 'admin';
            const canManage = isAdmin || (staffName && t.taoBoi === staffName);
            const canRemind = isAdmin && !selfCreated && onSendReminder;
            return (
              <div key={t.id} style={{padding:'10px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start'}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13.5, fontWeight:600, color:'#20242B', lineHeight:1.35}}>{t.ten}</div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:5, alignItems:'center'}}>
                    <span style={{fontSize:10.5, color:'#8a8072'}}>{t.phuTrach}</span>
                    <span style={{fontSize:10, padding:'1px 7px', borderRadius:20, background: COLOR_UUTIEN[t.uuTien]+'20', color:COLOR_UUTIEN[t.uuTien], fontWeight:600}}>{t.uuTien}</span>
                    <span style={{fontSize:10.5, color: overdue ? RED : '#8a8072', fontWeight: overdue?700:400}}>
                      {overdue ? `Trễ ${Math.abs(dl)} ngày` : `Hạn ${t.hanHoanThanh}`}
                    </span>
                    {selfCreated && (
                      <span style={{fontSize:9.5, padding:'1px 7px', borderRadius:20, background:'#EDE7DA', color:'#8a7350', fontWeight:600}}>Tự thêm</span>
                    )}
                    {t.riengTu && (
                      <span style={{fontSize:9.5, padding:'1px 7px', borderRadius:20, background:'#FBEAEA', color:RED, fontWeight:600}}>Riêng tư</span>
                    )}
                  </div>
                  <div style={{fontSize:10, color:'#B8ADA0', marginTop:3}}>{t.nhom} · {nhomTen}</div>
                  {(t.batDauLuc || t.hoanThanhLuc) && (
                    <div style={{fontSize:9.5, color:'#A89B85', marginTop:4, display:'flex', gap:10}}>
                      {t.batDauLuc && <span>Bắt đầu: {fmtDateTime(t.batDauLuc)}</span>}
                      {t.hoanThanhLuc && <span style={{color: overdue ? RED : '#1E7A5C'}}>Hoàn thành: {fmtDateTime(t.hoanThanhLuc)}</span>}
                    </div>
                  )}
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:6, alignItems:'center', flexShrink:0}}>
                  {onAdvance && (
                    <button className="btn" onClick={()=>onAdvance(t.id)} title={advanceLabel}
                      style={{background:color, color:'#fff', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {advanceIcon}
                    </button>
                  )}
                  {canRemind && (
                    <button className="btn" onClick={()=>onSendReminder(t)} title="Nhắc qua email" disabled={emailSending===t.id}
                      style={{background:'#F3F0EA', color:'#1B6FA8', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', opacity: emailSending===t.id ? 0.5 : 1}}>
                      <Mail size={12}/>
                    </button>
                  )}
                  {canManage && (
                    <>
                      <button className="btn" onClick={()=>onEdit(t)} title="Sửa"
                        style={{background:'#F3F0EA', color:'#6b6258', width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Pencil size={12}/>
                      </button>
                      <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá"
                        style={{background:'#F3F0EA', color:RED, width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Trash2 size={12}/>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArchiveList({ tasks, isAdmin, staffName, onDelete }) {
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <div style={{background:'#EEF3F0', padding:'10px 14px', display:'flex', alignItems:'center', gap:7}}>
        <Archive size={14} color="#1E7A5C"/>
        <span style={{fontSize:13, fontWeight:700, color:'#20242B'}}>Việc đã lưu trữ</span>
        <span style={{fontSize:12, fontWeight:700, color:'#1E7A5C', marginLeft:'auto'}}>{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div style={{padding:'20px 14px', fontSize:12.5, color:'#A89B85', textAlign:'center'}}>Chưa có việc nào trong lưu trữ</div>
      ) : (
        <div>
          {tasks.map(t => {
            const nhomTen = NHOM_CV.find(n=>n.ma===t.nhom)?.ten || '';
            const canManage = isAdmin || (staffName && t.taoBoi === staffName);
            return (
              <div key={t.id} style={{padding:'10px 14px', borderTop:'1px solid #F0EDE3', display:'flex', gap:10, alignItems:'flex-start', opacity:0.85}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13.5, fontWeight:600, color:'#20242B', lineHeight:1.35}}>{t.ten}</div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:5, alignItems:'center'}}>
                    <span style={{fontSize:10.5, color:'#8a8072'}}>{t.phuTrach}</span>
                    <span style={{fontSize:10.5, color:'#1E7A5C'}}>Hoàn thành: {fmtDateTime(t.hoanThanhLuc)}</span>
                  </div>
                  <div style={{fontSize:10, color:'#B8ADA0', marginTop:3}}>{t.nhom} · {nhomTen}</div>
                </div>
                {canManage && (
                  <button className="btn" onClick={()=>onDelete(t.id)} title="Xoá vĩnh viễn"
                    style={{background:'#F3F0EA', color:RED, width:26, height:26, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                    <Trash2 size={12}/>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TaskForm({ initial, phuTrachList, isAdmin, staffName, onCancel, onSave }) {
  const [ten, setTen] = useState(initial?.ten || '');
  const [nhom, setNhom] = useState(initial?.nhom || NHOM_CV[0].ma);
  const [phuTrach, setPhuTrach] = useState(initial?.phuTrach || (!isAdmin ? staffName : ''));
  const [uuTien, setUuTien] = useState(initial?.uuTien || 'Trung bình');
  const [hanHoanThanh, setHanHoanThanh] = useState(initial?.hanHoanThanh || todayISO());
  const [trangThai, setTrangThai] = useState(initial?.trangThai || 'Chưa bắt đầu');
  const [ghiChu, setGhiChu] = useState(initial?.ghiChu || '');
  const [riengTu, setRiengTu] = useState(initial?.riengTu || false);
  const [error, setError] = useState('');

  const submit = () => {
    if (!ten.trim()) { setError('Vui lòng nhập tên công việc'); return; }
    if (!phuTrach.trim()) { setError('Vui lòng nhập người phụ trách'); return; }
    onSave({ ten: ten.trim(), nhom, phuTrach: phuTrach.trim(), uuTien, hanHoanThanh, trangThai, ghiChu, riengTu: !isAdmin ? riengTu : false });
  };

  const formTitle = initial ? 'Sửa công việc' : (isAdmin ? 'Giao việc mới' : 'Thêm việc');
  const submitLabel = initial ? 'Lưu thay đổi' : (isAdmin ? 'Giao việc này' : 'Thêm vào bảng theo dõi');

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(18,37,72,0.45)', display:'flex', alignItems:'flex-end', zIndex:40, animation:'fadeIn .15s ease'}}
      onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{background:BG, width:'100%', maxHeight:'88vh', overflowY:'auto', borderRadius:'20px 20px 0 0', padding:'18px 18px 26px', animation:'slideUp .2s ease'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
          <h2 style={{margin:0, fontSize:17, fontWeight:800, fontFamily:'Georgia, serif', color:NAVY}}>{formTitle}</h2>
          <button className="btn" onClick={onCancel} style={{background:'#F0EBE0', width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}><X size={16}/></button>
        </div>

        {!isAdmin && !initial && (
          <div style={{background:'#EAF2F7', color:'#1B6FA8', fontSize:12, padding:'9px 12px', borderRadius:9, marginBottom:14, lineHeight:1.4}}>
            Công việc do tự người được giao cập nhật để quản lý theo dõi.
          </div>
        )}

        <Field label="Tên công việc">
          <input value={ten} onChange={e=>setTen(e.target.value)} placeholder="VD: Báo cáo thống kê tuần 34"
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14}}/>
        </Field>

        <Field label="Nhóm công việc">
          <select value={nhom} onChange={e=>setNhom(e.target.value)}
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}>
            {NHOM_CV.map(n => <option key={n.ma} value={n.ma}>{n.ma} · {n.ten}</option>)}
          </select>
        </Field>

        <Field label="Người phụ trách">
          {isAdmin ? (
            <>
              <input value={phuTrach} onChange={e=>setPhuTrach(e.target.value)} placeholder="VD: ThS. Lê Thanh Tâm" list="staff-list"
                style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14}}/>
              <datalist id="staff-list">{phuTrachList.map(p => <option key={p} value={p}/>)}</datalist>
            </>
          ) : (
            <div style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:14, background:'#F3F0EA', color:'#6b6258'}}>
              {phuTrach}
            </div>
          )}
        </Field>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          <Field label="Mức ưu tiên">
            <select value={uuTien} onChange={e=>setUuTien(e.target.value)}
              style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, background:'#fff'}}>
              {MUC_UU_TIEN.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Hạn hoàn thành">
            <input type="date" value={hanHoanThanh} onChange={e=>setHanHoanThanh(e.target.value)}
              style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5}}/>
          </Field>
        </div>

        <Field label="Trạng thái ban đầu">
          <div style={{display:'flex', gap:8}}>
            {TRANG_THAI.map(s => (
              <button key={s} className="btn" onClick={()=>setTrangThai(s)}
                style={{flex:1, padding:'9px 6px', borderRadius:9, fontSize:12, fontWeight:600,
                  background: trangThai===s ? COLOR_TRANGTHAI[s] : '#F0EBE0',
                  color: trangThai===s ? '#fff' : '#6b6258'}}>
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Ghi chú (không bắt buộc)">
          <textarea value={ghiChu} onChange={e=>setGhiChu(e.target.value)} rows={2}
            style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, resize:'vertical'}}/>
        </Field>

        {!isAdmin && (
          <button type="button" className="btn" onClick={()=>setRiengTu(v=>!v)}
            style={{width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 12px', borderRadius:9, background: riengTu ? '#FBEAEA' : '#F3F0EA', border: riengTu ? `1px solid ${RED}` : '1px solid transparent', marginBottom:14, textAlign:'left'}}>
            <div style={{width:18, height:18, borderRadius:5, border: `2px solid ${riengTu ? RED : '#B8ADA0'}`, background: riengTu ? RED : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              {riengTu && <Check size={12} color="#fff"/>}
            </div>
            <div>
              <div style={{fontSize:13, fontWeight:600, color: riengTu ? RED : '#20242B'}}>Chỉ mình tôi xem</div>
              <div style={{fontSize:11, color:'#8a8072', marginTop:1}}>Ẩn việc này khỏi màn hình Quản lý</div>
            </div>
          </button>
        )}

        {error && <div style={{color:RED, fontSize:12.5, marginBottom:10}}>{error}</div>}

        <button className="btn" onClick={submit}
          style={{width:'100%', padding:13, borderRadius:11, background:NAVY, color:'#fff', fontWeight:700, fontSize:14.5, marginTop:4}}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11.5, fontWeight:600, color:'#8a8072', marginBottom:5}}>{label}</div>
      {children}
    </div>
  );
}
