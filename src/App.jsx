import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, X, ChevronDown, Search, Trash2, Pencil, Check, ListTodo, CircleDot, CheckCircle2, AlertCircle, ShieldCheck, User, LogOut, PlayCircle, Archive, ArchiveRestore } from 'lucide-react';

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

const NHAN_SU = [
  'ThS. Lê Thanh Tâm',
  'ThS. Võ Tấn Cường',
  'BS. Dương Thị Anh Thư',
  'ThS. Lê Huyền Trân',
  'ĐD.CKI. Nguyễn Thị Ngọc Bảo',
  'BS. Nguyễn Minh Nhựt',
  'CN. Nguyễn Ngọc Thơ',
  'CN. Trần Thị Huệ',
  'BSCKI. Kim Ngọc Khánh Vinh',
  'BSCKI. Lại Khôi Nguyên',
  'ThS. Nguyễn Quang Đạt',
  'CN. Nguyễn Quách Ngọc Trâm',
];

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

import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Lưu & đồng bộ dữ liệu qua Firebase Firestore (thay cho window.storage của Claude)
// Mọi người mở cùng link sẽ thấy dữ liệu cập nhật theo thời gian thực.
const TASKS_DOC = doc(db, 'khth', 'tasks');

function subscribeTasks(callback) {
  return onSnapshot(TASKS_DOC, (snap) => {
    if (snap.exists()) callback(snap.data().list || []);
    else callback(null); // chưa có dữ liệu -> dùng seed
  }, (err) => { console.error('Firestore lỗi:', err); callback(null); });
}
async function saveTasks(tasks) {
  try { await setDoc(TASKS_DOC, { list: tasks }); }
  catch (e) { console.error('save failed', e); }
}

export default function App() {
  const [tasks, setTasks] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [filterNhom, setFilterNhom] = useState('all');
  const [filterPhuTrach, setFilterPhuTrach] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTasks((loaded) => {
      if (loaded) setTasks(loaded);
      else { setTasks(SEED_TASKS); saveTasks(SEED_TASKS); }
    });
    return () => unsubscribe();
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
      next = [...tasks, { ...task, id: uid(), batDauLuc: null, hoanThanhLuc: null, taoBoi }];
      showToast(isAdmin ? 'Đã giao việc mới' : 'Đã thêm việc');
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

  const phuTrachList = useMemo(() => {
    if (!tasks) return NHAN_SU;
    const fromTasks = tasks.map(t => t.phuTrach).filter(Boolean);
    return [...new Set([...NHAN_SU, ...fromTasks])];
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
    return pool;
  }, [activeTasks, archivedTasks, staffName, showArchive]);

  const filtered = useMemo(() => {
    return visibleTasks.filter(t => {
      if (filterNhom !== 'all' && t.nhom !== filterNhom) return false;
      if (!staffName && filterPhuTrach !== 'all' && t.phuTrach !== filterPhuTrach) return false;
      if (search && !t.ten.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [visibleTasks, filterNhom, filterPhuTrach, search, staffName]);

  const stats = useMemo(() => {
    const byPriority = MUC_UU_TIEN.map(p => ({ name: p, value: filtered.filter(t => t.uuTien === p).length }));
    const byStatus = TRANG_THAI.map(s => ({ name: s, value: filtered.filter(t => t.trangThai === s).length }));
    const total = filtered.length;
    const overdue = filtered.filter(t => t.trangThai !== 'Đã hoàn thành' && daysLeft(t.hanHoanThanh) < 0).length;
    return { byPriority, byStatus, total, overdue };
  }, [filtered]);

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
            <button className="btn" onClick={() => setRole(null)} title="Đổi chế độ"
              style={{background:'rgba(255,255,255,0.12)', color:'#fff', width:34, height:34, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              <LogOut size={15}/>
            </button>
          </div>
        </div>
      </div>

      <div style={{padding:'18px 16px', maxWidth:920, margin:'0 auto'}}>

        {/* Tabs: Đang hoạt động / Lưu trữ */}
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
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <TaskColumn title="Chưa bắt đầu" color="#9AA5B1" bg="#F1F0EB" tasks={filtered.filter(t=>t.trangThai==='Chưa bắt đầu')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onAdvance={(id)=>setStatus(id,'Đang xử lý')} advanceLabel="Bắt đầu" advanceIcon={<PlayCircle size={14}/>}/>
            <TaskColumn title="Đang xử lý" color="#1B6FA8" bg="#EAF2F7" tasks={filtered.filter(t=>t.trangThai==='Đang xử lý')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}
              onAdvance={(id)=>setStatus(id,'Đã hoàn thành')} advanceLabel="Hoàn thành" advanceIcon={<Check size={14}/>}/>
            <TaskColumn title="Đã hoàn thành" color="#1E7A5C" bg="#E9F3EE" tasks={filtered.filter(t=>t.trangThai==='Đã hoàn thành')}
              isAdmin={isAdmin} staffName={staffName} onEdit={(t)=>{setEditingId(t.id); setShowForm(true);}} onDelete={deleteTask}/>
          </div>
        )}
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

      {toast && (
        <div style={{position:'fixed', bottom:20, left:'50%', transform:'translateX(-50%)', background:NAVY_DEEP, color:'#fff', padding:'10px 18px', borderRadius:10, fontSize:13.5, animation:'fadeIn .2s ease', boxShadow:'0 6px 20px rgba(0,0,0,0.25)', zIndex:50}}>
          {toast}
        </div>
      )}
    </div>
  );
}

function RoleGate({ onAdmin, onStaff, staffList, showLogin, onCancelLogin, onAdminLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');

  const tryLogin = () => {
    if (pin === ADMIN_PIN) { onAdminLogin(); setPin(''); setError(''); }
    else setError('Sai mã PIN, vui lòng thử lại');
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
            <select value={selectedStaff} onChange={e=>setSelectedStaff(e.target.value)}
              style={{width:'100%', padding:'10px 12px', borderRadius:9, border:'1px solid #E3DACB', fontSize:13.5, marginBottom:10, background:'#fff'}}>
              <option value="">Chọn tên của bạn...</option>
              {staffList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn" disabled={!selectedStaff} onClick={()=>onStaff(selectedStaff)}
              style={{width:'100%', padding:11, borderRadius:9, background: selectedStaff ? NAVY : '#E3DACB', color:'#fff', fontWeight:700, fontSize:13.5}}>
              Vào xem việc của tôi
            </button>
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

function TaskColumn({ title, color, bg, tasks, isAdmin, staffName, onEdit, onDelete, onAdvance, advanceLabel, advanceIcon }) {
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
  const [error, setError] = useState('');

  const submit = () => {
    if (!ten.trim()) { setError('Vui lòng nhập tên công việc'); return; }
    if (!phuTrach.trim()) { setError('Vui lòng nhập người phụ trách'); return; }
    onSave({ ten: ten.trim(), nhom, phuTrach: phuTrach.trim(), uuTien, hanHoanThanh, trangThai, ghiChu });
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
