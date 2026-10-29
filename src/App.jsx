import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Home, Layers3, ClipboardList, Headset, UserRound, History, Wallet, ArrowUpRight, ArrowDownLeft, Copy, Check, LockKeyhole, ShieldCheck, Plus, Minus, LogOut, Menu, X, ShoppingBag, TrendingUp, Clock3, CircleDollarSign, Settings, PackageCheck, Upload, ChevronRight, Globe, Star, Sparkles } from 'lucide-react';

const demoSales = [
  ["James",120],["Olivia",4850],["William",800],["Emma",2175],
  ["Benjamin",30000],["Sophia",110],["Michael",6420],["Charlotte",1200],
  ["Ethan",820],["Amelia",3650],["Alejandro",25000],["Isabella",70],
  ["Mateo",3450],["Camila",5280],["Santiago",80000],["Valentina",1850],
  ["Diego",250],["Lucia",4200],["Gabriel",1100],["Sofia",2529],
  ["Muhammad",7600],["Aisha",150],["Omar",18400],["Fatima",980],
  ["Ali",390],["Maryam",3700],["Hassan",12750],["Zainab",460],
  ["Yusuf",1637],["Khadija",560],["Aarav",1200],["Ananya",570],
  ["Arjun",8500],["Priya",640],["Rohan",2529],["Diya",820],
  ["Vivaan",30000],["Aadhya",920],["Aditya",1637],["Meera",1050],
  ["Ahmed",5900],["Mariam",3450],["Mahmoud",25000],["Nour",230],
  ["Youssef",1200],["Salma",70],["Karim",4800],["Farah",390],
  ["Mostafa",30000],["Layla",820],["Mehmet",2529],["Zeynep",120],
  ["Emir",80000],["Elif",250],["Kerem",1637],["Defne",930],
  ["Burak",3700],["Ece",150],["Arda",25000],["Aylin",820],
  ["Oliver",1200],["Amelia",70],["George",5600],["Isla",250],
  ["Harry",30000],["Grace",1637],["Jack",120],["Lily",800],
  ["Thomas",2529],["Freya",150],["Leonardo",25000],["Giulia",820],
  ["Alessandro",1200],["Sofia",110],["Lorenzo",4500],["Aurora",250],
  ["Matteo",30000],["Chiara",1637],["Francesco",120],["Bianca",75],
  ["Gabriel",2529],["Manon",150],["Louis",4825],["Camille",820],
  ["Hugo",1200],["Chloé",70],["Arthur",25000],["Léa",250],
  ["Jules",1637],["Amélie",110],["Mohammed",3450],["Fatima",1145],
  ["Abdullah",30000],["Amina",741],["Faisal",2529],["Hessa",176],
  ["Khalid",25000],["Reem",820],["Saad",1200],["Lulwa",70],
  ["Suman",4800],["Anusha",250],["Prakash",1637],["Sushma",110],
  ["Ramesh",30000],["Sabina",800],["Bikash",2529],["Nisha",150],
  ["Kiran",25000],["Asha",820],["Gabriel",1200],["Beatriz",84],
  ["Lucas",80000],["Isabela",250],["Matheus",1637],["Mariana",47],
  ["Rafael",3450],["Júlia",800],["Pedro",90],["Larissa",149],
  ["Oleksandr",30000],["Olena",820],["Dmytro",1673],["Kateryna",110],
  ["Andriy",28000],["Anastasiia",250],["Maksym",1637],["Yulia",354],
  ["Bohdan",800],["Sofia",2529],["Andrei",674],["Elena",30000],
  ["Mihai",820],["Ioana",1200],["Alexandru",64],["Maria",25000],
  ["Vlad",784],["Ana",1637],["Stefan",110],["Cristina",800],
  ["Ivan",48415],["Anastasia",150],["Dmitry",80500],["Ekaterina",820],
  ["Alexei",1200],["Natalia",70],["Mikhail",30450],["Daria",250],
  ["Nikolai",1637],["Irina",120],["Ali",474],["Sana",2529],
  ["Hamza",150],["Hira",45000],["Bilal",820],["Ayesha",1200],
  ["Usman",742],["Mahnoor",17000],["Imran",250],["Zara",1789],
  ["Liam",110],["Ava",787],["Noah",2574],["Emily",145],
  ["Lucas",80000],["Chloe",820],["Ethan",1200],["Mia",73],
  ["Daniel",25000],["Sophie",250],["Bashar",1284],["Rania",120],
  ["Tarek",3480],["Yasmin",800],["Reza",2529],["Shirin",150],
  ["Arman",30000],["Niloofar",820],["Hassan",1200],["Leila",37164]
];

const STORE='sbc-affiliate-demo-v3';
const marketplaces=[
 {id:'amazon',name:'Amazon',level:1,min:20,max:499,rate:4,color:'#f5a623',logo:'amazon',desc:'Everyday products & accessories'},
 {id:'alibaba',name:'Alibaba',level:2,min:500,max:899,rate:8,color:'#f08b25',logo:'Alibaba',desc:'Global wholesale marketplace'},
 {id:'aliexpress',name:'AliExpress',level:3,min:900,max:90000000,rate:12,color:'#ee4d55',logo:'AliExpress',desc:'Global online shopping'}
];
import { catalog } from './catalog.js'; 
import { supabase } from './supabase.js';

const seedUsers=[{id:'',name:'',email:'',balance:0,level:0,done:0,role:'',password:''}];
const defaultState = () => ({
  users: seedUsers,
  activeId:null,
  isAdmin: false,
  assignments: [],
  taskCycles: {},
  taskReports: [],
  offers: [],
  depositAddresses: { TRC20: '', BTC: '', ETH: '' },
  deposits: [],
  withdrawals: [],
  ledger: [],
  nextId: 101,
  feedIndex: 0
});
const loadState=()=>{try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{return defaultState()}};
const normalizeSharedUsers=(input, preferredUser)=>{
 const seen=new Set();
 const users=(Array.isArray(input.users)?input.users:[]).filter(u=>{const email=String(u.email||'').trim().toLowerCase();if(!email)return true;if(seen.has(email))return false;seen.add(email);return true;});
 const matching=preferredUser?.email?users.find(u=>String(u.email||'').trim().toLowerCase()===String(preferredUser.email).trim().toLowerCase()):null;
const activeId=matching?.id||(users.some(u=>u.id===input.activeId)?input.activeId:null);
 return {...input,users,activeId};
};
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(Number(n)||0);
const code=(n)=>`ORD-${String(n).padStart(6,'0')}`;

const levelFor = balance =>
  balance >= 900 ? 3 :
  balance >= 500 ? 2 :
  balance >= 20 ? 1 : 0;

function App(){
 const [state,setState]=useState(loadState);
 const [cloudStatus,setCloudStatus]=useState(supabase?'Connecting to shared data…':'Offline demo mode');
 useEffect(() => {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
   viewport = document.createElement('meta');
   viewport.name = 'viewport';
   document.head.appendChild(viewport);
  }
  viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
 }, []);
 const cloudReady=useRef(false);
 const applyingCloud=useRef(false);
 const lastCloudJson=useRef('');
 const lastBalancesJson=useRef('');
 const stateRef=useRef(state);
 stateRef.current=state;
 const [tab,setTab]=useState('Home'); const [filter,setFilter]=useState('All'); const [language,setLanguage]=useState(localStorage.getItem('sbc-language')||'English'); const t=(en,bn)=>language==='বাংলা'?bn:en; const [auth,setAuth]=useState({mode:'signin',email:'',password:'',name:'',lang:'English'}); const [notice,setNotice]=useState(''); const [selectedTask,setSelectedTask]=useState(null); 
const [grabbedTask, setGrabbedTask] = useState(null);
const [grabbedTaskNos, setGrabbedTaskNos] = useState([]);
 const [depositForm,setDepositForm]=useState({network:'TRC20',amount:'',proof:'',proofName:''}); const [withdrawForm,setWithdrawForm]=useState({network:'TRC20',amount:'',address:''}); const [adminUser,setAdminUser]=useState('ID100'); const [adminTask,setAdminTask]=useState({taskNo:'4',combo:true,comboCount:'3',productA:'4',productB:'5',productC:'6',productD:'7',productE:'8',price:'200'}); const [newStudent,setNewStudent]=useState({name:'',email:'',balance:'20'}); const [depositDraft,setDepositDraft]=useState({TRC20:'',BTC:'',ETH:''}); const [mobileMenu,setMobileMenu]=useState(false);
 useEffect(()=>{localStorage.setItem(STORE,JSON.stringify(state))},[state]);
 // Shared demo state: admin changes are stored in Supabase and streamed to other devices.
 // The active account and admin session are intentionally kept local to each browser.
 useEffect(()=>{
  if(!supabase){cloudReady.current=true;setCloudStatus('Offline demo mode');return;}
  let alive=true;
  const loadCloud=async()=>{
   const {data,error}=await supabase.from('sbc_shared_state').select('state').eq('id','main').maybeSingle();
   if(!alive)return;
   if(error){setCloudStatus('Cloud setup needed');cloudReady.current=true;console.error('Supabase state load failed:',error.message);return;}
   let remote=defaultState();
   if(data?.state){
    const previousUser=stateRef.current.users.find(u=>u.id===stateRef.current.activeId);
    remote=normalizeSharedUsers({...defaultState(),...data.state},previousUser);
   }
   // The SQL balance table is authoritative for balances; user_id is the demo account ID (e.g. ID100).
   const {data:balanceRows,error:balanceError}=await supabase.from('sbc_demo_balances').select('user_id,balance');
   if(!alive)return;
   if(balanceError)console.warn('Balance table not ready yet; using shared-state balances:',balanceError.message);
   else if(Array.isArray(balanceRows)&&balanceRows.length){
    const balances=new Map(balanceRows.map(row=>[String(row.user_id),Number(row.balance)]));
    remote={...remote,users:remote.users.map(u=>balances.has(String(u.id))?{...u,balance:balances.get(String(u.id))}:u)};
    lastBalancesJson.current=JSON.stringify(remote.users.map(u=>({user_id:String(u.id),balance:Number(u.balance)||0})));
   }
   const normalized=normalizeSharedUsers(remote,stateRef.current.users.find(u=>u.id===stateRef.current.activeId));
   const cleanRemote={...normalized};
   delete cleanRemote.activeId; delete cleanRemote.isAdmin;
   applyingCloud.current=true;
   setState(prev=>({...cleanRemote,activeId:normalized.activeId,isAdmin:false}));
   lastCloudJson.current=JSON.stringify(cleanRemote);
   cloudReady.current=true;
   setCloudStatus('SALES.SHIPS.BUY');
  };
  loadCloud();
  const channel=supabase.channel('sbc-shared-state-live')
   .on('postgres_changes',{event:'*',schema:'public',table:'sbc_shared_state',filter:'id=eq.main'},payload=>{
    if(!alive||!payload.new?.state)return;
    const previousUser=stateRef.current.users.find(u=>u.id===stateRef.current.activeId);
    const normalized=normalizeSharedUsers({...defaultState(),...payload.new.state},previousUser);
    const remote={...normalized};
    delete remote.activeId; delete remote.isAdmin;
    const json=JSON.stringify(remote);
    if(json===lastCloudJson.current)return;
    applyingCloud.current=true;
    setState(prev=>({...remote,activeId:normalized.activeId,isAdmin:false}));
    lastCloudJson.current=json;
    setCloudStatus('Connected · live updates');
   })
   .on('postgres_changes',{event:'*',schema:'public',table:'sbc_demo_balances'},payload=>{
    if(!alive||!payload.new?.user_id)return;
    const userId=String(payload.new.user_id),balance=Number(payload.new.balance);
    if(!Number.isFinite(balance))return;
    setState(prev=>({...prev,users:prev.users.map(u=>String(u.id)===userId&&Number(u.balance)!==balance?{...u,balance}:u)}));
    setCloudStatus('Connected · live balance updates');
   }).subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')setCloudStatus('Cloud sync reconnecting…')});
  return()=>{alive=false;supabase.removeChannel(channel)};
 },[]);
 useEffect(()=>{
  if(!supabase||!cloudReady.current)return;
  if(applyingCloud.current){applyingCloud.current=false;return;}
  const {activeId,isAdmin,...shared}=state;
  const json=JSON.stringify(shared);
  if(json===lastCloudJson.current)return;
  const timeout=setTimeout(async()=>{
   const {error}=await supabase.from('sbc_shared_state').upsert({id:'main',state:shared,updated_at:new Date().toISOString()},{onConflict:'id'});
   if(error){setCloudStatus('Cloud save failed');console.error('Supabase state save failed:',error.message);}
   else{lastCloudJson.current=json;setCloudStatus('Connected');}
  },250);
  return()=>clearTimeout(timeout);
 },[state]);
 // Keep a queryable SQL row per demo user. The column is user_id (never student_id).
 useEffect(()=>{
  if(!supabase||!cloudReady.current||!state.users.length)return;
  const rows=state.users.map(u=>({user_id:String(u.id),balance:Number(Number(u.balance||0).toFixed(2)),updated_at:new Date().toISOString()}));
  const json=JSON.stringify(rows.map(({user_id,balance})=>({user_id,balance})));
  if(json===lastBalancesJson.current)return;
  const timeout=setTimeout(async()=>{
   const {error}=await supabase.from('sbc_demo_balances').upsert(rows,{onConflict:'user_id'});
   if(error){setCloudStatus('Balance SQL save failed');console.error('Balance SQL save failed:',error.message);return;}
   lastBalancesJson.current=json;
  },200);
  return()=>clearTimeout(timeout);
 },[state.users]);
 useEffect(()=>{
  if(window.location.pathname.replace(/\/$/,'')==='/admin'){
   let adminSession=false;
   try {
    const savedSession=JSON.parse(localStorage.getItem('sbc-student-session')||'null');
    adminSession=savedSession?.role==='admin' && loadState().isAdmin===true;
   } catch {}
   if(!adminSession){setShowAuth(true);setAuth(a=>({...a,mode:'admin'}));}
   else {setShowAuth(false);setTab('Admin');}
  }
 },[]);
 const user=state.users.find(u=>u.id===state.activeId);
 const activeMarket=marketplaces.find(m=>m.level===levelFor(user?.balance))||marketplaces[0];
 const assigned=state.assignments.filter(a=>a.userId===user?.id);
const taskData = useMemo(() => {
  const reports = state.taskReports || [];

  return assigned
    .slice()
    .sort((a, b) => Number(a.taskNo) - Number(b.taskNo))
    .map(a => {
      const market =
        marketplaces.find(m => m.id === a.market) || activeMarket;

      const done = reports.some(
        r =>
          r.userId === user?.id &&
          r.taskId === a.taskId &&
          r.cycleId === a.cycleId
      );

      return {
        taskId: a.taskId,
        cycleId: a.cycleId,
        taskNo: Number(a.taskNo),
        order: a.order,
        market,
        products: a.products || [],
        combo: Boolean(a.combo),
        done,
        assigned: true
      };
    });
}, [assigned, activeMarket, user?.id, state.taskReports]);

const recentActivities = useMemo(() => {
  // Real activity from completed student tasks
  const realActivities = (state.taskReports || [])
    .filter(r => r.status === 'Completed')
    .map(r => {
      const student = state.users.find(
        u => u.id === r.userId
      );

      return {
        id: r.id,
        name: student?.name || 'Member',
        amount: Number(r.commission) || 0,
        real: true,
        date: r.date || ''
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Existing demo activities
  const demoActivities = demoSales.map(([name, amount], i) => ({
    id: `demo-${i}`,
    name,
    amount: Number(amount) || 0,
    real: false
  }));

  // Mix real and demo activities in the same list
  return [...realActivities, ...demoActivities];
}, [state.taskReports, state.users]);
 const [sales,setSales]=useState(0);
 useEffect(()=>{const t=setInterval(()=>setSales(x=>(x+1)%3000),1800);return()=>clearInterval(t)},[]);
const [showAuth,setShowAuth]=useState(() => {
  const isAdminRoute = window.location.pathname.replace(/\/$/,'') === '/admin';
  let savedSessionId = '';
  let savedSessionRole = '';
  try {
    // Clear a legacy auto-selected demo account once. A student must sign in themselves.
    if (localStorage.getItem('sbc-session-v2-migrated') !== '1') {
      const legacySession = JSON.parse(localStorage.getItem('sbc-student-session') || 'null');
      if (legacySession?.role === 'student' && legacySession?.userId === 'ID100') {
        localStorage.removeItem('sbc-student-session');
      }
      localStorage.setItem('sbc-session-v2-migrated', '1');
    }
    const savedSession = JSON.parse(localStorage.getItem('sbc-student-session') || 'null');
    savedSessionId = savedSession?.userId || '';
    savedSessionRole = savedSession?.role || '';
  } catch {}
  const savedState = loadState();
  // Restore only a session created by an explicit sign-in/register action.
  // Do not treat the seeded demo state's activeId (ID100) as a login session.
  const hasValidSavedStudent = Boolean(
    savedSessionId && savedState.users.some(u => u.id === savedSessionId)
  );
  const hasValidSavedAdmin = savedSessionRole === 'admin' && savedState.isAdmin === true;
  return isAdminRoute ? !hasValidSavedAdmin : !(hasValidSavedStudent || hasValidSavedAdmin);
});
 const update=(fn)=>setState(s=>fn({...s}));
 const flash=(s)=>{setNotice(s);setTimeout(()=>setNotice(''),3500)};
 const setTabSafe=(t)=>{setTab(t);setSelectedTask(null);setMobileMenu(false)};
 const login = (e) => {
  e.preventDefault();

  const email = auth.email.trim().toLowerCase();
  const password = auth.password;

  // Admin login
  if (
    auth.mode === 'admin' ||
    (email === 'iqbalitengineer@gmail.com' &&
      password === 'Nbi.bristy7')
  ) {
    if (
      email === 'iqbalitengineer@gmail.com' &&
      password === 'Nbi.bristy7'
    ) {
      localStorage.setItem('sbc-student-session', JSON.stringify({ role: 'admin' }));
      setState(s => ({ ...s, isAdmin: true }));
      setTab('Admin');
      setShowAuth(false);
      flash('Admin panel opened.');
    } else {
      flash('Invalid admin email or password.');
    }
    return;
  }

  // Student registration
  if (auth.mode === 'register') {
    if (!auth.name.trim()) {
      flash('Enter your name.');
      return;
    }

    if (password.length < 6) {
      flash('Password must be at least 6 characters.');
      return;
    }

    const exists = state.users.some(
      u => u.email.trim().toLowerCase() === email
    );

    if (exists) {
      flash('This email already exists. Sign in instead.');
      return;
    }

    const id = `ID${state.nextId}`;

    const newUser = {
      id,
      name: auth.name.trim(),
      email,
      balance: 0,
      level: 0,
      done: 0,
      role: 'Member',
      password
    };

    localStorage.setItem('sbc-student-session', JSON.stringify({ userId: id, role: 'student' }));
    setState(s => ({
      ...s,
      users: [...s.users, newUser],
      activeId: id,
      nextId: s.nextId + 1,
      isAdmin: false
    }));

    setShowAuth(false);
    setTab('Home');
    flash(`Welcome! Your ID is ${id}.`);
    return;
  }

  // Student sign in
  const found = state.users.find(
    u =>
      u.email.trim().toLowerCase() === email &&
      u.password === password &&
      u.role !== 'admin'
  );

  if (!found) {
    flash('Invalid email or password.');
    return;
  }

  localStorage.setItem('sbc-student-session', JSON.stringify({ userId: found.id, role: 'student' }));
  setState(s => ({
    ...s,
    activeId: found.id,
    isAdmin: false
  }));

  setShowAuth(false);
  setTab('Home');
  flash(`Signed in as ${found.id}.`);
};
 const addLedger=(userId,type,amount,note)=>({id:`TX${Date.now()}`,userId,type,amount:Number(amount),note,date:new Date().toISOString()});
 
const submitTask = (task) => {
  if (!task?.taskId || !task.cycleId) {
    flash('This task is not assigned correctly. Contact support.');
    return;
  }

  const current = stateRef.current;
  const reports = current.taskReports || [];

  if (
    reports.some(
      r =>
        r.userId === user.id &&
        r.taskId === task.taskId &&
        r.cycleId === task.cycleId
    )
  ) {
    flash('This task has already been completed.');
    return;
  }

  const assignment = current.assignments.find(
    a =>
      a.userId === user.id &&
      a.taskId === task.taskId &&
      a.cycleId === task.cycleId
  );

  if (!assignment) {
    flash('This task is no longer assigned to your account.');
    return;
  }

  
  // একই সাইকেলে একই Task Number দ্বিতীয়বার সম্পন্ন করা যাবে না।
  const alreadyCompleted = reports.some(
    r =>
      r.userId === user.id &&
      r.cycleId === task.cycleId &&
      Number(r.taskNo) === Number(task.taskNo) &&
      r.status === 'Completed'
  );

  if (alreadyCompleted) {
    flash('This task is already completed in the current cycle.');
    return;
  }


  const total = task.products.reduce(
    (sum, product) => sum + Number(product.price || 0),
    0
  );

  const gap = total - Number(user.balance || 0);

  if (gap > 0) {
    flash(
      `Cash gap ${money(gap)}.`
    );
    setTabSafe('Profile');
    return;
  }

  const commission = total * task.market.rate / 100;

  const report = {
    id: `REPORT-${Date.now()}`,
    taskId: task.taskId,
    cycleId: task.cycleId,
    userId: user.id,
    taskNo: task.taskNo,
    order: task.order,
    market: task.market.name,
    products: task.products,
    total,
    commission,
    date: new Date().toISOString(),
    status: 'Completed'
  };

  setState(s => {
    const existingReports = s.taskReports || [];

    // Protect against duplicate submissions.
    if (
  existingReports.some(
    r =>
      r.userId === user.id &&
      r.taskId === task.taskId &&
      r.cycleId === task.cycleId
  )
) {
  return s;
}

    // Make sure the assignment still exists.
    const stillAssigned = s.assignments.some(
      a =>
        a.userId === user.id &&
        a.taskId === task.taskId &&
        a.cycleId === task.cycleId
    );

    if (!stillAssigned) return s;

    const cycleReports = [
      ...existingReports,
      report
    ].filter(
      r =>
        r.userId === user.id &&
        r.cycleId === task.cycleId
    );

    return {
      ...s,

      taskReports: [report, ...existingReports],

      users: s.users.map(u =>
        u.id === user.id
          ? {
              ...u,
              balance: Number(
                (Number(u.balance || 0) + commission).toFixed(2)
              ),
              done: cycleReports.length
            }
          : u
      ),

      ledger: [
        addLedger(
          user.id,
          'commission',
          commission,
          `${task.market.name} task ${task.taskNo} commission`
        ),
        ...s.ledger
      ]
    };
  });

  setGrabbedTaskNos(previous =>
    previous.includes(task.taskNo)
      ? previous
      : [...previous, task.taskNo]
  );

  setGrabbedTask(null);
  setSelectedTask(null);
  setTabSafe('Tasks');

  flash(
    `Task ${task.taskNo} completed. ${money(commission)} Affiliate Commission Credit`
  );
};
 const depositSubmit=(e)=>{e.preventDefault();if(!(Number(depositForm.amount)>0)){flash('Enter a valid amount.');return}setState(s=>({...s,deposits:[{id:`DEP${Date.now()}`,userId:user.id,amount:Number(depositForm.amount),network:depositForm.network,proof:depositForm.proof,status:'Pending',date:new Date().toISOString()},...s.deposits]}));setDepositForm({network:'TRC20',amount:'',proof:'',proofName:''});flash('Your deposit request submitted wait for 1 minutes')};
 

const withdrawSubmit = (e) => {
  e.preventDefault();

  const current = stateRef.current;
  const currentCycleId = current.taskCycles?.[user.id];

  const completedTaskNos = new Set(
    (current.taskReports || [])
      .filter(
        r =>
          r.userId === user.id &&
          r.cycleId === currentCycleId &&
          r.status === 'Completed'
      )
      .map(r => Number(r.taskNo))
      .filter(
        n => Number.isInteger(n) && n >= 1 && n <= 25
      )
  );

  // ২৫টি আলাদা টাস্ক শেষ না হলে Withdraw বন্ধ।
  if (!currentCycleId || completedTaskNos.size !== 25) {
    flash('Complete all 25 tasks in your current cycle before withdrawing.');
    setTabSafe('Tasks');
    return;
  }

  const amt = Number(withdrawForm.amount);

  if (
    !withdrawForm.address.trim() ||
    !Number.isFinite(amt) ||
    amt <= 0 ||
    amt > Number(user.balance || 0)
  ) {
    flash('Enter a wallet address and a valid amount within demo balance.');
    return;
  }

  setState(s => {
    // Submit করার মুহূর্তেও বর্তমান সাইকেল পুনরায় যাচাই।
    const liveCycleId = s.taskCycles?.[user.id];

    const liveCompleted = new Set(
      (s.taskReports || [])
        .filter(
          r =>
            r.userId === user.id &&
            r.cycleId === liveCycleId &&
            r.status === 'Completed'
        )
        .map(r => Number(r.taskNo))
        .filter(
          n => Number.isInteger(n) && n >= 1 && n <= 25
        )
    );

    if (
      !liveCycleId ||
      liveCycleId !== currentCycleId ||
      liveCompleted.size !== 25
    ) {
      return s;
    }

    return {
      ...s,
      withdrawals: [
        {
          id: `WDR${Date.now()}`,
          userId: user.id,
          cycleId: liveCycleId,
          amount: amt,
          network: withdrawForm.network,
          address: withdrawForm.address.trim(),
          status: 'Pending',
          date: new Date().toISOString()
        },
        ...s.withdrawals
      ]
    };
  });

  setWithdrawForm({
    network: 'TRC20',
    amount: '',
    address: ''
  });

  flash('Withdrawal request submitted');
};

 const approveDeposit=(id,approve)=>setState(s=>{const d=s.deposits.find(x=>x.id===id);if(!d||d.status!=='Pending')return s;return {...s,deposits:s.deposits.map(x=>x.id===id?{...x,status:approve?'Approved':'Rejected'}:x),users:approve?s.users.map(u=>u.id===d.userId?{...u,balance:Number((u.balance+d.amount).toFixed(2))}:u):s.users,ledger:approve?[addLedger(d.userId,'deposit',d.amount,'Admin-approved demo deposit'),...s.ledger]:s.ledger}});

const approveWithdraw = (id, approve) =>
  setState(s => {
    const w = s.withdrawals.find(x => x.id === id);

    if (!w || w.status !== 'Pending') return s;

    const target = s.users.find(u => u.id === w.userId);

    if (!approve) {
      return {
        ...s,
        withdrawals: s.withdrawals.map(x =>
          x.id === id ? { ...x, status: 'Rejected' } : x
        )
      };
    }

    const currentCycleId = s.taskCycles?.[w.userId];

    const completedTaskNos = new Set(
      (s.taskReports || [])
        .filter(
          r =>
            r.userId === w.userId &&
            r.cycleId === currentCycleId &&
            r.status === 'Completed'
        )
        .map(r => Number(r.taskNo))
        .filter(
          n => Number.isInteger(n) && n >= 1 && n <= 25
        )
    );

    // Request যে সাইকেলে করা হয়েছে, সেটি এখনও বর্তমান হতে হবে।
    if (
      !target ||
      !w.cycleId ||
      w.cycleId !== currentCycleId ||
      completedTaskNos.size !== 25 ||
      Number(target.balance) < Number(w.amount) ||
      !Number.isFinite(Number(w.amount)) ||
      Number(w.amount) <= 0
    ) {
      flash('Withdrawal rejected: current cycle must have all 25 unique completed tasks.');
      return {
        ...s,
        withdrawals: s.withdrawals.map(x =>
          x.id === id ? { ...x, status: 'Rejected' } : x
        )
      };
    }

    return {
      ...s,
      withdrawals: s.withdrawals.map(x =>
        x.id === id ? { ...x, status: 'Approved' } : x
      ),
      users: s.users.map(u =>
        u.id === w.userId
          ? {
              ...u,
              balance: Number(
                (Number(u.balance) - Number(w.amount)).toFixed(2)
              )
            }
          : u
      ),
      ledger: [
        addLedger(
          w.userId,
          'withdrawal',
          -Number(w.amount),
          'Admin-approved demo withdrawal'
        ),
        ...s.ledger
      ]
    };
  }); 
const assignTask = () => {
  const taskNo = Number(adminTask.taskNo);
  const price = Number(adminTask.price);

  if (!Number.isInteger(taskNo) || taskNo < 1 || taskNo > 25) {
    flash('Task number must be between 1 and 25.');
    return;
  }

  if (!Number.isFinite(price) || price < 20) {
    flash('Enter a valid product price of at least $20.');
    return;
  }

  const market = marketplaces.find(
    m => price >= m.min && price <= m.max
  );

  if (!market) {
    flash('No marketplace level matches this price.');
    return;
  }

  const chosen = [
    adminTask.productA,
    adminTask.productB,
    adminTask.productC,
    adminTask.productD,
    adminTask.productE
  ].slice(
    0,
    adminTask.combo
      ? Number(adminTask.comboCount || 3)
      : 1
  );

  const products = chosen.map(v => ({
    ...catalog[Number(v) % catalog.length],
    price
  }));

  const taskId = `TASK-${adminUser}-${taskNo}-${Date.now()}`;
  const order = `ORD-${Date.now().toString().slice(-8)}`;

  setState(s => {
    const taskCycles = s.taskCycles || {};

    // Task 1 starts a new cycle for this student only.
    
const currentCycleId = taskCycles[adminUser];

const cycleId =
  taskNo === 1
    ? `CYCLE-${adminUser}-${Date.now()}`
    : currentCycleId || null;


    if (!cycleId) {
      flash('Assign Task 1 first to start a new cycle.');
      return s;
    }

    // Never modify another student's assignments.
    const otherUsersTasks = s.assignments.filter(
      a => a.userId !== adminUser
    );

    const thisUsersTasks = s.assignments.filter(
      a => a.userId === adminUser
    );

    // Task 1 clears only the selected student's current assignments.
    // Other task numbers replace only that task in the current cycle.
    const remainingTasks =
      taskNo === 1
        ? []
        : thisUsersTasks.filter(
            a =>
              a.cycleId !== cycleId ||
              Number(a.taskNo) !== taskNo
          );

    return {
      ...s,

      taskCycles: {
        ...taskCycles,
        [adminUser]: cycleId
      },

      users:
        taskNo === 1
          ? s.users.map(u =>
              u.id === adminUser
                ? { ...u, done: 0 }
                : u
            )
          : s.users,

      assignments: [
        ...otherUsersTasks,
        ...remainingTasks,
        {
          taskId,
          cycleId,
          order,
          userId: adminUser,
          taskNo,
          combo: adminTask.combo,
          products,
          market: market.id,
          price
        }
      ]
    };
  });

  if (taskNo === 1) {
    setGrabbedTask(null);
    setGrabbedTaskNos([]);
    setSelectedTask(null);
  }

  flash(
    taskNo === 1
      ? `New cycle started for ${adminUser}: Task 1/25`
      : `Task ${taskNo}/25 assigned to ${adminUser}`
  );
};

 const addStudent=()=>{if(!newStudent.name||!newStudent.email){flash('Enter student name and email.');return}if(state.users.some(u=>u.email.toLowerCase()===newStudent.email.trim().toLowerCase())){flash('This email already belongs to a demo student. Use a unique email.');return}const id=`ID${state.nextId}`;setState(s=>({...s,users:[...s.users,{id,name:newStudent.name,email:newStudent.email,balance:Number(newStudent.balance)||0,level:1,done:0,role:'member',password:'student123'}],nextId:s.nextId+1}));setNewStudent({name:'',email:'',balance:'20'});flash(`Created ${id} demo student. Set real auth before production.`)};
 const setBalance=async(id,delta)=>{
  const current=stateRef.current;
  const amount=Number(delta);
  if(!Number.isFinite(amount)||amount===0){flash('Enter a non-zero balance adjustment amount.');return;}
  const target=current.users.find(u=>u.id===id);
  if(!target){flash('Student not found. Refresh Admin and try again.');return;}
  const newBalance=Math.max(0,Number((Number(target.balance||0)+amount).toFixed(2)));
  const next={...current,users:current.users.map(u=>u.id===id?{...u,balance:newBalance}:u),ledger:[addLedger(id,'adjustment',amount,'Admin demo balance adjustment'),...current.ledger]};
  if(!supabase){setCloudStatus('Offline demo mode');flash('Cloud is not connected; balance was not saved.');return;}
  const {activeId,isAdmin,...shared}=next;
  const json=JSON.stringify(shared);
  setCloudStatus('Saving balance to shared data…');
  try{
   const {error:balanceWriteError}=await supabase.from('sbc_demo_balances').upsert({user_id:String(id),balance:newBalance,updated_at:new Date().toISOString()},{onConflict:'user_id'});
   if(balanceWriteError)throw balanceWriteError;
   const {data:balanceVerify,error:balanceReadError}=await supabase.from('sbc_demo_balances').select('user_id,balance').eq('user_id',String(id)).single();
   if(balanceReadError)throw balanceReadError;
   if(String(balanceVerify?.user_id)!==String(id)||Number(balanceVerify?.balance)!==newBalance)throw new Error('SQL user_id/balance verification failed.');
   lastBalancesJson.current=JSON.stringify(next.users.map(u=>({user_id:String(u.id),balance:Number(u.balance||0)})));
   const {error:writeError}=await supabase.from('sbc_shared_state').upsert({id:'main',state:shared,updated_at:new Date().toISOString()},{onConflict:'id'});
   if(writeError)throw writeError;
   const {data:verify,error:readError}=await supabase.from('sbc_shared_state').select('state,updated_at').eq('id','main').single();
   if(readError)throw readError;
   const savedUser=(verify?.state?.users||[]).find(u=>u.id===id);
   if(!savedUser||Number(savedUser.balance)!==newBalance)throw new Error('Supabase save verification did not match the requested student balance.');
   stateRef.current=next;
   setState(next);
   lastCloudJson.current=json;
   setCloudStatus('Connected');
   flash(`Balance saved and verified for ${id}: ${money(newBalance)}.`);
  }catch(error){
   setCloudStatus('Cloud save failed');
   console.error('Supabase balance save/verify failed:',error?.message||error);
   flash('Balance NOT saved to cloud. '+(error?.message||'Check Supabase table permissions and RLS.'));
  }
 };
 const saveAddresses=()=>{setState(s=>({...s,depositAddresses:{...depositDraft}}));flash('Demo deposit address settings saved.')};
 const logout = () => {
  localStorage.removeItem('sbc-student-session');
  sessionStorage.removeItem('sbc-student-session');

  setState(s => ({
    ...s,
    isAdmin: false,
    activeId: ''
  }));

  setTab('Home');
  setSelectedTask(null);
  setShowAuth(true);

  setAuth({
    mode: 'signin',
    email: '',
    password: '',
    name: '',
    lang: 'English'
  });
};
 const nav=[['Home',Home],['Levels',Layers3],['Record',ClipboardList],['Profile',UserRound],['History',History]];
 const pageTitle=selectedTask?'Task details':tab;
 const firstNames=['Alex','Jamie','Taylor','Jordan','Casey','Morgan','Avery','Riley','Cameron','Drew','Sam','Robin','Skyler','Quinn','Parker','Reese','Rowan','Kendall','Emerson','Finley','Harper','Logan','Dakota','Charlie','Sage','Blake','River','Ellis','Remy','Phoenix','Milan','Ari','Noah','Maya','Luca','Zara','Theo','Nina','Owen','Iris','Elliot','Aria','Kai','Leah','Ezra','Milo','Lina','Eden','Aiden','Amara']; const lastNames=['Morgan','Wilson','Brooks','Lee','Parker','Reed','Cooper','Bennett','Hayes','Turner','Mitchell','Carter','Bailey','Collins','Murphy','Rivera','Cook','Bell','Ward','Gray','James','Price','Kelly','Ross','Howard','Flores','Powell','Long','Perry','Hughes','Foster','Bryant','Alexander','Russell','Griffin','Diaz','Hayward','Morris','Barnes','Jenkins','Watson','Coleman','Sanders','Patel','Kim','Lopez','Evans','Stewart','Young','Wood']; const fakeSalesNames=Array.from({length:3000},(_,i)=>`${firstNames[i%firstNames.length]} ${lastNames[Math.floor(i/firstNames.length)%lastNames.length]}${Math.floor(i/(firstNames.length*lastNames.length))?` ${Math.floor(i/(firstNames.length*lastNames.length))+1}`:''}`);
 return <div className="app-shell">
  
{tab === 'Home' && !showAuth && !state.isAdmin && (
  <a
    className="sbc-customer-service"
    href="https://t.me/sbeaffiliatemarket_778"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Customer Service on Telegram"
  >
    <span className="sbc-support-icon">
      <Headset size={25} />
    </span>

    <span>
      <span className="sbc-support-title">
        Customer Service
      </span>

      <span className="sbc-support-subtitle">
        Telegram Support ↗
      </span>
    </span>
  </a>
)}
  <style>{`
    *, *::before, *::after { box-sizing: border-box; }
    html, body, #root { width: 100%; max-width: 100%; margin: 0; }
    body { overflow-x: hidden; }
    .app-shell { width: 100%; max-width: 100%; min-width: 0; overflow-x: clip; }
    .main-content { min-width: 0; max-width: 100%; }
    @media (max-width: 768px) {
      .bottom-nav { position: fixed !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 1000 !important; width: 100% !important; }
      html, body, #root { min-width: 0 !important; }
      .app-shell { padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important; }
      .topbar { width: 100%; max-width: 100%; min-width: 0; flex-wrap: wrap; gap: 8px; padding-left: 12px; padding-right: 12px; }
      .top-balance { min-width: 0; }
      .top-actions { min-width: 0; max-width: 100%; flex-wrap: wrap; gap: 6px; }
      .cloud-status, .demo-pill { display: none !important; }
      .main-content, .page-section, .section-block, .hero, .brand-showcase, .market-grid, .levels-list, .admin-columns, .task-details-grid { width: 100%; max-width: 100%; min-width: 0; }
      .hero { grid-template-columns: minmax(0, 1fr) !important; }
      .hero-art { min-width: 0; max-width: 100%; }
      .market-grid, .levels-list, .admin-columns, .task-details-grid { grid-template-columns: minmax(0, 1fr) !important; }
      .brand-showcase { overflow: hidden; }
      .brand-showcase-track { max-width: 100%; }
      .bottom-nav { display: flex !important; justify-content: space-around !important; align-items: stretch !important; padding: 7px 4px calc(7px + env(safe-area-inset-bottom, 0px)) !important; min-height: 64px; background: rgba(12, 13, 15, .97) !important; backdrop-filter: blur(16px); border-top: 1px solid rgba(245, 166, 35, .28); }
      .bottom-nav button { flex: 1 1 0; min-width: 0; padding: 4px 2px !important; }
      .bottom-nav button small { font-size: 10px; white-space: nowrap; }
      .site-footer { margin-bottom: 12px; }
      img, video, canvas { max-width: 100%; }
      .auth-modal { width: calc(100% - 24px) !important; max-width: 440px; max-height: calc(100dvh - 24px); overflow-y: auto; }
    }
    .profile-settings { margin-bottom: 18px; }
    .profile-language { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin: 12px 0 16px; }
    .profile-language select { min-width: 150px; max-width: 100%; }
    .profile-account-actions { display: flex; flex-wrap: wrap; gap: 10px; }
    @media (max-width: 480px) {
      .profile-language { align-items: flex-start; flex-direction: column; }
      .profile-language select { width: 100%; }
      .profile-account-actions .btn { flex: 1 1 100%; justify-content: center; }
    }
  `}</style>
  <header className="topbar"><button className="brand" onClick={()=>setTabSafe('Home')}><span className="brand-mark">S</span><span><b>SBC</b><small>AFFILIATE · 2001</small></span></button><div className="top-balance"><small>YOUR ACCOUNT BALANCE</small><strong>{money(user?.balance)}</strong></div><div className="top-actions"><span className="demo-pill">A/C</span><span className="cloud-status" title="Shared database connection">{cloudStatus}</span>{state.isAdmin && <button className="btn btn-outline" onClick={logout}><LogOut size={16} /> Exit Admin</button>} <button className="avatar" onClick={()=>setTabSafe('Profile')}>{(user?.name||'S').slice(0,1).toUpperCase()}</button><button className="mobile-toggle" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X/>:<Menu/>}</button></div></header>
  {notice&&<div className="toast" role="status">{notice}<button onClick={()=>setNotice('')}><X size={15}/></button></div>}
  <div className="app-layout">

   <main className="main-content">
    {!state.isAdmin&&tab==='Home'&&!selectedTask&&<><section className="hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> AFFILIATE MARKET</span><h1>Passive Income, Strategic Partnerships, And Scaling Digital Growth <span>Connecting trusted brands with global audiences</span></h1><p>Empowering financial freedom through strategic partnerships Unlocking new revenue streams for brands while delivering authentic product recommendations that drive global digital growth.</p><div className="hero-buttons"><button className="btn btn-gold" onClick={()=>setTabSafe('Levels')}>Explore levels <ChevronRight size={17}/></button><button className="btn btn-glass" onClick={()=>setTabSafe('Record')}>View task records</button></div><div className="hero-stats"><div><strong>25</strong><span>tasks per cycle</span></div><div><strong>3</strong><span>Levels</span></div><div><strong>100%</strong><span>Stragy</span></div></div></div><div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="floating-card"><span className="market-symbol">a</span><div><small>MARKETPLACE TASK</small><b>Product review flow</b><span>Ranking</span></div><TrendingUp className="trend-icon"/></div><div className="floating-stat"><TrendingUp/><div><small>THIS MONTH</small><b>+23.0%</b></div></div><div className="gold-disc"><ShoppingBag size={52}/></div></div></section>
    <section className="brand-showcase" aria-label="Marketplace banners"><div className="brand-showcase-track">{[...marketplaces,{id:'adidas',name:'adidas',color:'#eeeeee'},...marketplaces,{id:'adidas',name:'adidas',color:'#eeeeee'}].map((m,i)=><article className={`brand-banner banner-${m.id}`} key={`${m.id}-${i}`}><div className="banner-copy"><span className="banner-kicker">OFFICIAL BRAND</span><div className={`banner-wordmark wordmark-${m.id}`}><img
  className="brand-official-icon"
  src={
    m.id === 'amazon'
      ? '/logos/amazon.png'
      : m.id === 'alibaba'
        ? '/logos/alibaba.png'
        : m.id === 'aliexpress'
          ? '/logos/aliexpress.png'
          : '/logos/adidas.png'
  }
  alt={`${m.name} logo`}
  onError={(e) => {
    console.error('Logo load failed:', e.currentTarget.src);
    e.currentTarget.style.display = 'none';
  }}
/><span>{m.name}</span></div><h2>{m.id==='amazon'?'Discover products. Track growth.':m.id==='alibaba'?'Global wholesale marketplace':m.id==='aliexpress'?'Find products across categories':'Impossible is nothing.'}</h2><p>{m.id==='amazon'?'Share Product Link · Customer Buy · Earn Commission':m.id==='adidas'?'Footwear · Sportswear · Accessories':'Product discovery · Reviews · Marketplace'}</p>{m.id==='amazon'&&<div className="banner-earnings"><span>THIS MONTH EARNING</span><b>$2,480.00 <em>↗ +23%</em></b><div className="earning-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div>}</div><div className="banner-products">{[0,1,2].map((n)=><div className="banner-product" key={n}><img src={catalog[(i*13+n*7)%catalog.length]?.image || catalog[(i*13+n*7)%catalog.length]?.img} alt={catalog[(i*13+n*7)%catalog.length]?.name||'Marketplace demo product'} loading="lazy"/><span>{catalog[(i*13+n*7)%catalog.length]?.name||'Featured product'}</span><b>{money(catalog[(i*13+n*7)%catalog.length]?.price||49.99)}</b></div>)}</div><span className="banner-glow"/></article>)}</div></section>
    <section className="section-block"><div className="section-heading"><div><span className="eyebrow">MARKETPLACE PARTNERS</span><h2>{t('Explore the marketplace','মার্কেটপ্লেস দেখুন')}</h2><p>Amazon market Alibaba market, Aliexpess market affiliate connection.</p></div><button className="text-button" onClick={()=>setTabSafe('Levels')}>View all levels <ArrowUpRight size={16}/></button></div><div className="market-grid">{marketplaces.map(m=><article className="market-card" key={m.id} style={{'--market':m.color}}><div className="market-card-top"><span className={`market-logo ${m.id}`}>{m.logo}</span><span className="level-badge"><Star size={12}/> LEVEL {m.level}</span></div><h3>{m.name}</h3><p>{m.desc}</p><div className="market-bottom"><span>{m.rate}% <small>demo rate</small></span><button onClick={()=>{setFilter(m.name);setTabSafe('Levels')}}>Explore <ChevronRight size={15}/></button></div></article>)}</div></section> 
<section className="section-block recent-section">
  <div className="section-heading">
    <div>
      <span className="eyebrow">ACTIVITY</span>
      <h2>
        {t('Recent sales', 'সাম্প্রতিক কার্যকলাপ')}{' '}
        <span className="demo-inline">Member</span>
      </h2>
      <p>sales or earnings.</p>
    </div>
    <span className="live-dot">Commission</span>
  </div>

  <div className="sales-window">
    
<div className="sales-track" key={sales}>
  {Array.from(
    { length: Math.min(20, recentActivities.length) },
    (_, i) => {
      const idx = (sales + i) % recentActivities.length;
      const activity = recentActivities[idx];

      return (
        <div
          className="sale-row"
          key={`${activity.id}-${sales}-${i}`}
        >
          <span className="sale-avatar">
            {activity.name.charAt(0).toUpperCase()}
          </span>

          <div className="sale-person">
            <b>{activity.name}</b>
            <small>
              {activity.real
                ? 'Task Completed · Commission'
                : 'Demo Activity'}
            </small>
          </div>

          <strong>+{money(activity.amount)}</strong>
        </div>
      );
    }
  )}
</div>
  </div>
</section> 
</>}
{state.isAdmin? <AdminView state={state} setState={setState} setTab={setTabSafe} users={state.users} adminUser={adminUser} setAdminUser={setAdminUser} adminTask={adminTask} setAdminTask={setAdminTask} assignTask={assignTask} newStudent={newStudent} setNewStudent={setNewStudent} addStudent={addStudent} setBalance={setBalance} depositDraft={depositDraft} setDepositDraft={setDepositDraft} saveAddresses={saveAddresses} approveDeposit={approveDeposit} approveWithdraw={approveWithdraw} flash={flash} logout={logout}/>:selectedTask?<TaskView task={selectedTask} user={user} onBack={()=>setSelectedTask(null)} onSubmit={() => submitTask(selectedTask)} onDeposit={()=>{
  setTabSafe('Profile');
  setTimeout(
    () => document.getElementById('deposit-panel')?.scrollIntoView({behavior:'smooth'}),
    50
  );
}} /> : tab === 'Levels' ?<section className="page-section"><div className="page-heading"><span className="eyebrow">LEVEL PATH</span><h1>{t('All VIP levels','সব VIP লেভেল')}</h1><p>Your First Step to Financial Freedom Starts Here. Unlock Basic Perks & Begin Your Affiliate Ascent</p></div><div className="filter-row">{['All','Amazon','Alibaba','AliExpress'].map(f=><button key={f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="levels-list">{marketplaces.filter(m=>filter==='All'||m.name===filter).map(m=>{const eligible = Number(user.balance) >= m.min;return <article className="level-card" key={m.id}><div className="level-top"><span className={`market-logo ${m.id}`}>{m.logo}</span><div className="level-name"><h2>{m.name}</h2><span>Marketplace</span></div><span className="level-badge"><Star size={13}/> LEVEL {m.level}</span></div><div className="level-price">{money(m.min)} <span>—</span> {money(m.max)}</div><div className="level-metrics"><span>Commission <b>{m.rate.toFixed(2)}%</b></span><span>Daily tasks <b>25</b></span></div>{eligible?<button className="btn btn-primary wide" onClick={()=>{setFilter(m.name);setSelectedTask(null);setTab('Tasks')}}>View tasks <ChevronRight size={17}/></button>:<div className="locked-box"><LockKeyhole size={16}/><div><b>Balance not eligible</b><span>Keep a demo balance of {money(m.min)} – {money(m.max)} to explore this level.</span></div></div>}</article>})}</div></section>:
tab==='Tasks'?<TasksView
  tasks={taskData}
  user={user}
  setSelectedTask={setSelectedTask}
  setTab={setTabSafe}
  grabbedTask={grabbedTask}
  setGrabbedTask={setGrabbedTask}
  grabbedTaskNos={grabbedTaskNos}
/>:tab==='Record'?
<RecordView
  user={user}
  tasks={taskData}
  ledger={state.ledger.filter(x => x.userId === user.id)}
  taskReports={(state.taskReports || []).filter(x => x.userId === user.id)}
  currentCycleId={state.taskCycles?.[user.id]}
  setTab={setTabSafe}
/>
:tab==='Profile'?<ProfileView user={user} deposits={state.deposits.filter(x=>x.userId===user.id)} withdrawals={state.withdrawals.filter(x=>x.userId===user.id)} addresses={state.depositAddresses} depositForm={depositForm} setDepositForm={setDepositForm} depositSubmit={depositSubmit} withdrawForm={withdrawForm} setWithdrawForm={setWithdrawForm} withdrawSubmit={withdrawSubmit} flash={flash} language={language} setLanguage={setLanguage} setAuth={setAuth} setShowAuth={setShowAuth} logout={logout} isAdmin={state.isAdmin}/>:tab==='History'?<HistoryView ledger={state.ledger.filter(x=>x.userId===user.id)} deposits={state.deposits.filter(x=>x.userId===user.id)} withdrawals={state.withdrawals.filter(x=>x.userId===user.id)}/>:tab==='Support'?<SupportView/>:<section className="page-section"><h1>Welcome to SBC Affiliate</h1><button className="btn btn-gold" onClick={()=>setTabSafe('Levels')}>Explore levels</button></section>}
   </main>
  </div>
  <nav className="bottom-nav">{nav.slice(0,5).map(([n,I])=><button key={n} className={tab===n?'active':''} onClick={()=>setTabSafe(n)}><span><I size={19}/></span><small>{language==='বাংলা'?({Home:'হোম',Levels:'লেভেল',Record:'রেকর্ড',Profile:'প্রোফাইল',History:'ইতিহাস'}[n]||n):n}</small></button>)}</nav>
  <footer className="site-footer"><span><span className="footer-mark">S</span> SBC Affiliate ©2001</span><span></span></footer>
  {showAuth&&<div className="modal-backdrop" onClick={()=>{}}><div className="auth-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>{flash('Please sign in or register first.')}}><X/></button><span className="brand-mark large">S</span><h2>{auth.mode==='register'?'Create your account':auth.mode==='admin'?'Admin access':'Welcome back'}</h2><p>Login.</p><div className="auth-tabs"><button className={auth.mode==='signin'?'chosen':''} onClick={()=>setAuth(a=>({...a,mode:'signin'}))}>Sign in</button><button className={auth.mode==='register'?'chosen':''} onClick={()=>setAuth(a=>({...a,mode:'register'}))}>Register</button></div><form onSubmit={login}>{auth.mode==='register'&&<label>Full name<input value={auth.name} onChange={e=>setAuth(a=>({...a,name:e.target.value}))} required placeholder="Your name"/></label>}<label>Email<input type="email" value={auth.email} onChange={e=>setAuth(a=>({...a,email:e.target.value}))} required /></label><label>Password<input type="password" value={auth.password} onChange={e=>setAuth(a=>({...a,password:e.target.value}))} required/></label>{auth.mode==='signin'&&<button type="button" className="forgot-link" onClick={()=>flash('Password reset is not connected in this local demo. Production password recovery must use Supabase Auth.')}>Forgot password?</button>}<label>Form language<select value={auth.lang} onChange={e=>setAuth(a=>({...a,lang:e.target.value}))}><option>English</option><option>বাংলা</option><option>हिन्दी</option><option>العربية</option><option>Español</option></select><small>Language selection applies to sign-in/register forms only.</small></label><button className="btn btn-gold wide" type="submit">{auth.mode==='register'?'Create account':auth.mode==='admin'?'Open admin demo':'Sign in'} <ChevronRight size={17}/></button></form></div></div>}
  <div className="demo-disclaimer"><p className="sbc-brand-description">
  SBC with Amazon, Alibaba, and AliExpress brands through connected offices in Russia, Portugal, Spain, France, Germany, Italy, the Netherlands, Turkey, Japan, South Korea, Thailand, Arabic-speaking regions, Israel, Poland, the UK, New Zealand, the USA, and Dubai.
</p>
    .</div>
 </div>
}
function TaskView({task,user,onBack,onSubmit,onDeposit}){const total=task.products.reduce((a,p)=>a+Number(p.price),0), commission=total*task.market.rate/100,gap=Math.max(0,total-user.balance);return <section className="task-page"><button className="back-link" onClick={onBack}>← Back to tasks</button><div className="task-card"><div className="task-card-head"><span className="eyebrow">CURRENT LEVEL: {task.market.name}</span><span className="multiplier">×{task.combo?'1.5':'1.0'} multiplier</span><h1>{task.combo?'Combo task':''}</h1><div className="order-no"># Order no: {task.order}</div></div><div className="product-list">{task.products.map((p,i)=><div className="product-row" key={i}><img src={p.image} alt={p.name} onError={e=>e.currentTarget.src='https://placehold.co/160x160/eee/555?text=Demo+Product'}/><div className="product-info"><h3>{p.name}</h3><p>{task.combo?'Combo item':'Marketplace'} Product</p><strong>{money(p.price)} USD</strong>{task.combo&&<small>Product {i+1} of {task.products.length}</small>}</div></div>)}</div><div className="task-details-grid"><div><span>Transaction time</span><b>{new Date().toLocaleString('sv-SE')}</b></div><div><span>Order amount</span><b>{money(total)} USD</b></div><div><span>Commission ({task.market.rate}%)</span><b className="green">{money(commission)} USD</b></div><div><span>Expected income</span><b className="gold-text">{money(total+commission)} USD</b></div></div>{gap>0&&<div className="cash-gap"><div><span>Cash gap</span><b>−{money(gap)} USD</b></div><button onClick={onDeposit}>Deposit now</button></div>}<div className="notice-box"><ShieldCheck size={18}/> Commission Earned </div><button className="btn btn-primary wide submit-order" onClick={onSubmit}>{gap>0?'Simulate task (cash gap shown)':'Submit order'} <ChevronRight size={18}/></button>{gap>0&&<p className="helper-text"></p>}</div></section>}

function TasksView({
  tasks,
  user,
  setSelectedTask,
  setTab,
  grabbedTask,
  setGrabbedTask,
  grabbedTaskNos
}) {
    const completedCount = tasks.filter(t => t.done).length;
  const assignedCount = tasks.length;

  const allAssignedTasksCompleted =
    assignedCount === 25 &&
    completedCount === 25;

  const hasAnyAssignment = assignedCount > 0;

  const nextTask = tasks.find(
    t => !t.done && t.assigned
  );

  const nextTaskAssigned = Boolean(nextTask?.assigned);

  const progress = Math.min(
    100,
    (completedCount / 25) * 100
  );

  return (
    <section className="page-section">
      <div className="page-heading">
        <span className="eyebrow">YOUR LIVE AFFILIATE MARKET WORK</span>
        <h1>Tasks</h1>
        <p>
          
        </p>
      </div>

      <div className="task-cycle">
        <div>
          <span>TASK CYCLE</span>
          <h2>{completedCount} of 25 completed</h2>
          <p>{Math.max(0, 25 - completedCount)} tasks left</p>
        </div>

        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>

        <strong>{Math.round(progress)}%</strong>
      </div>

      {!hasAnyAssignment ? (
  <div className="task-cycle">
    <h2>Please contact customer service</h2>
    <p>
      No task has been assigned to your account yet.
      Please contact customer service for assistance.
    </p>
    <a
      className="btn btn-primary"
      href="https://t.me/sbeaffiliatemarket_778"
      target="_blank"
      rel="noreferrer"
    >
      Contact customer service
    </a>
  </div>
) : grabbedTask ? (
        <article className="task-list-card">
          <div className="task-number">
            {String(grabbedTask.taskNo).padStart(2, '0')}
          </div>

          <div className="task-list-info">
            <span className="normal-tag">
              ORDER READY
            </span>
            <h3>Task {grabbedTask.taskNo}</h3>
            <p>
              {grabbedTask.market.name} · Order {grabbedTask.order}
            </p>
            <p>
              {grabbedTask.products.length} product(s)
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setSelectedTask(grabbedTask)}
          >
            Open order <ChevronRight size={15} />
          </button>
        </article>
      ) : nextTask && nextTaskAssigned ? (
        <div className="task-cycle">
          <div>
            <span>NEXT AVAILABLE ORDER</span>
            <h2>Task {nextTask.taskNo} of 25</h2>
            <p>
              
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setGrabbedTask(nextTask)}
          >
            Grab the next order <ChevronRight size={18} />
          </button>
        </div>
            ) : (
        allAssignedTasksCompleted ? (
  <div className="task-cycle">
    <h2>All 25 tasks completed!</h2>
    <p>
      {assignedCount < 25
        ? `You have completed all ${assignedCount} currently assigned tasks. Wait for the admin to assign the remaining tasks.`
        : 'Your current task cycle is complete.'}
    </p>
  </div>
) : (
  <div className="task-cycle">
    <h2>No more assigned tasks</h2>
    <p>Please contact the Customer Servie</p>
  </div>
)
)}  
      <div className="task-list">
        {tasks.filter(t => t.done).map(t => (
          <article
            className="task-list-card completed"
            key={t.taskNo}
          >
            <div className="task-number">
              <Check />
            </div>

            <div className="task-list-info">
              <span className="normal-tag">COMPLETED TASK</span>
              <h3>Task {t.taskNo}</h3>
              <p>{t.market.name} · Order {t.order}</p>
            </div>

            <button
              className="btn btn-outline"
              onClick={() => setTab('Record')}
            >
              View record <ChevronRight size={15} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecordView({
  user,
  tasks,
  ledger,
  taskReports = [],
  currentCycleId,
  setTab
}) {
  const reports = taskReports
    .filter(r => r.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  
const activeCycleId =
  currentCycleId ||
  tasks.find(t => t.cycleId)?.cycleId ||
  reports[0]?.cycleId;

const currentCycleReports = reports.filter(
  r =>
    r.userId === user.id &&
    r.cycleId === activeCycleId &&
    r.status === 'Completed'
);


  const completedCount = currentCycleReports.length;
  const remaining = Math.max(0, 25 - completedCount);

  const marketplace = marketplaces.find(
    m => m.level === levelFor(user.balance)
  ) || marketplaces[0];

  const cycles = Object.entries(
    reports.reduce((groups, report) => {
      const cycle = report.cycleId || 'previous-cycle';
      if (!groups[cycle]) groups[cycle] = [];
      groups[cycle].push(report);
      return groups;
    }, {})
  ).sort((a, b) => {
    const dateA = new Date(a[1][0]?.date || 0).getTime();
    const dateB = new Date(b[1][0]?.date || 0).getTime();
    return dateB - dateA;
  });

  return (
    <section className="page-section">
      <div className="record-hero">
        <span className="eyebrow">TASK CYCLE</span>
        <h1>Task records</h1>
        <p>
          {remaining} of 25 tasks left in this cycle · {marketplace.name} level
        </p>

        <div className="progress-track">
          <span
            style={{
              width: `${Math.min(100, completedCount / 25 * 100)}%`
            }}
          />
        </div>

        <div className="record-total">
          <span>TOTAL ACCOUNT BALANCE</span>
          <b>{money(user.balance)}</b>
        </div>
      </div>

      <div className="record-stats">
        <div>
          <span>Tasks done</span>
          <b>{completedCount}</b>
        </div>
        <div>
          <span>Tasks remaining</span>
          <b>{remaining}</b>
        </div>
        <div>
          <span>Commission (24h)</span>
          <b className="green">
            {money(
              ledger
                .filter(
                  x =>
                    x.type === 'commission' &&
                    Date.now() - new Date(x.date).getTime() < 86400000
                )
                .reduce((sum, x) => sum + Number(x.amount || 0), 0)
            )}
          </b>
        </div>
        <div>
          <span>Cash gap</span>
          <b>{money(0)}</b>
        </div>
        <div>
          <span>Frozen funds</span>
          <b>{money(0)}</b>
        </div>
      </div>

      <div className="section-heading compact">
        <div>
          <h2>Task history by cycle</h2>
          <p>Your completed tasks are saved separately for each cycle.</p>
        </div>
        <button
          className="text-button"
          onClick={() => setTab('Tasks')}
        >
          All tasks <ChevronRight size={15} />
        </button>
      </div>

      {cycles.length === 0 ? (
        <div className="task-cycle">
          <h2>No completed task records yet</h2>
          <p>Completed tasks will appear here.</p>
        </div>
      ) : (
        cycles.map(([cycleId, cycleReports], index) => (
          <section className="panel" key={cycleId}>
            <h2>
              {cycleId === 'previous-cycle'
                ? 'Previous cycle records'
                : `Task cycle ${cycles.length - index}`}
            </h2>

            <p>
              {cycleReports.length} completed task
              {cycleReports.length === 1 ? '' : 's'}
            </p>

            <div className="task-list">
              {cycleReports
                .slice()
                .sort((a, b) => Number(a.taskNo) - Number(b.taskNo))
                .map(report => {
                  const marketName =
                    report.market?.name ||
                    marketplaces.find(
                      m => m.id === report.market
                    )?.name ||
                    report.market ||
                    'Marketplace';

                  const productName =
                    report.products?.map(p => p.name).filter(Boolean).join(', ') ||
                    `Task ${report.taskNo}`;

                  return (
                    <article
                      className="task-list-card completed"
                      key={report.id}
                    >
                      <div className="task-number">
                        <Check />
                      </div>

                      <div className="task-list-info">
                        <span className="normal-tag">
                          COMPLETED TASK
                        </span>
                        <h3>Task {report.taskNo}</h3>
                        <p>{marketName} · {productName}</p>
                        <p>
                          {report.date
                            ? new Date(report.date).toLocaleString()
                            : 'Date unavailable'}
                        </p>
                        <p>
                          Task total: {money(report.total || 0)}
                        </p>
                        <p className="green">
                          Commission: {money(report.commission || 0)}
                        </p>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        ))
      )}
    </section>
  );
}

function ProfileView({user,deposits,withdrawals,addresses,depositForm,setDepositForm,depositSubmit,withdrawForm,setWithdrawForm,withdrawSubmit,flash,language,setLanguage,setAuth,setShowAuth,logout,isAdmin}){return <section className="page-section"><div className="page-heading"><span className="eyebrow">ACCOUNT CENTER</span><h1>My profile</h1><p>Manage your wallet and account preferences</p></div><section className="panel profile-settings"><div className="panel-title"><span className="panel-icon"><Settings/></span><div><h2>Account settings</h2><p>Language and sign-in options</p></div></div><label className="profile-language"><Globe size={17}/> Interface language<select aria-label="Language" value={language} onChange={e=>{setLanguage(e.target.value);localStorage.setItem('sbc-language',e.target.value)}}><option>English</option><option>বাংলা</option></select></label><div className="profile-account-actions">{isAdmin?<button className="btn btn-outline" onClick={logout}><LogOut size={16}/> Exit Admin</button>:user?.id?<button className="btn btn-outline" onClick={logout}><LogOut size={16}/> Sign Out</button>:<><button className="btn btn-glass" onClick={()=>{setAuth(a=>({...a,mode:'signin',email:'',password:''}));setShowAuth(true)}}>Sign In</button><button className="btn btn-gold" onClick={()=>{setAuth(a=>({...a,mode:'register',email:'',password:'',name:''}));setShowAuth(true)}}>Register</button></>}</div></section><div className="profile-summary"><span className="profile-avatar">{user.name[0]}</span><div><h2>{user.name}</h2><p>{user.email} · <b>{user.id}</b></p><span className="level-badge">LEVEL {levelFor(user.balance)||'LOCKED'}</span></div><div className="profile-balance"><span>BALANCE</span><b>{money(user.balance)}</b></div></div><div className="wallet-grid"><section className="panel" id="deposit-panel"><div className="panel-title"><span className="panel-icon deposit"><ArrowDownLeft/></span><div><h2>Deposit request</h2><p>Your deposit is being processed. It may take 30s-1 minutes</p></div></div><form onSubmit={depositSubmit}><label>Network<select value={depositForm.network} onChange={e=>setDepositForm(s=>({...s,network:e.target.value}))}><option>TRC20</option><option>BTC</option><option>ETH</option></select></label><div className="address-box"><span>{addresses[depositForm.network]||'Deposit address will appear here when available'}</span><button type="button" disabled={!addresses[depositForm.network]} onClick={async()=>{const address=String(addresses[depositForm.network]||'').trim();if(!address){flash('Admin has not configured this demo address yet.');return}try{await navigator.clipboard.writeText(address);flash('Deposit address copied.')}catch{flash('Copy was blocked by the browser. Select the address text and copy it manually.')}}}><Copy size={15}/> Copy</button></div><label>Amount (USD)<input type="number" min="1" step=".01" value={depositForm.amount} onChange={e=>setDepositForm(s=>({...s,amount:e.target.value}))} placeholder="Enter amount" required/></label><label className="upload-box"><Upload size={22}/><b>Upload deposit screenshot (optional)</b><span>{depositForm.proofName||'Click to choose an image · You can submit without it'}</span><input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>setDepositForm(s=>({...s,proof:String(reader.result),proofName:f.name}));reader.readAsDataURL(f)}}/></label><p className="helper-text"></p><button className="btn btn-primary wide" type="submit">Submit deposit request <ChevronRight size={16}/></button></form></section><section className="panel"><div className="panel-title"><span className="panel-icon withdraw"><ArrowUpRight/></span><div><h2>Withdraw request</h2><p>Enter your own wallet address</p></div></div><form onSubmit={withdrawSubmit}><label>Network<select value={withdrawForm.network} onChange={e=>setWithdrawForm(s=>({...s,network:e.target.value}))}><option>TRC20</option><option>BTC</option><option>ETH</option></select></label><label>Wallet address<div className="input-with-action"><input value={withdrawForm.address} onChange={e=>setWithdrawForm(s=>({...s,address:e.target.value}))} placeholder="Enter your demo wallet address" required/><button type="button" className="paste-button" onClick={async()=>{try{const clip=await navigator.clipboard.readText();if(!clip.trim()){flash('Clipboard is empty. Copy your wallet address first.');return}setWithdrawForm(s=>({...s,address:clip.trim()}));flash('Wallet address pasted.')}catch{flash('Clipboard access blocked. Right-click the field and choose Paste.')}}}><ClipboardList size={14}/> Paste</button></div></label><label>Amount (USD $)<input type="number" min="1" max={user.balance} step=".01" value={withdrawForm.amount} onChange={e=>setWithdrawForm(s=>({...s,amount:e.target.value}))} placeholder={`Available ${money(user.balance)}`} required/></label><p className="helper-text">Please double-check your address</p><button className="btn btn-gold wide" type="submit">Submit withdrawal request <ChevronRight size={16}/></button></form></section></div><div className="history-panels"><RequestTable title="Deposit requests" rows={deposits}/><RequestTable title="Withdrawal requests" rows={withdrawals}/></div></section>}
function RequestTable({title,rows}){return <section className="panel"><h2>{title}</h2>{!rows.length?<p className="empty-state">No requests yet.</p>:rows.slice(0,5).map(r=><div className="mini-row" key={r.id}><div><b>{money(r.amount)}</b><small>{r.network} · {new Date(r.date).toLocaleDateString()}</small></div><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></div>)}</section>}
function HistoryView({ledger,deposits,withdrawals}){const rows=[...ledger.map(x=>({...x,kind:x.type})),...deposits.map(x=>({...x,kind:'deposit request'})),...withdrawals.map(x=>({...x,kind:'withdrawal request'}))].sort((a,b)=>new Date(b.date)-new Date(a.date));return <section className="page-section"><div className="page-heading"><span className="eyebrow">ACCOUNT ACTIVITY</span><h1>History</h1><p>Your commissions</p></div><div className="panel history-table"><div className="table-head"><span>Activity</span><span>Date</span><span>Amount</span><span>Status</span></div>{!rows.length?<p className="empty-state">No activity yet.</p>:rows.map(r=><div className="table-row" key={r.id}><div><b>{r.note||r.kind}</b><small>{r.kind} · {r.id}</small></div><span>{new Date(r.date).toLocaleString()}</span><strong className={r.amount<0?'red':r.kind==='commission'||r.kind==='deposit'?'green':''}>{money(r.amount)}</strong><span className="status">{r.status||'Recorded'}</span></div>)}</div></section>}
function SupportView(){return <section className="page-section"><div className="support-hero"><span className="support-big"><Headset size={35}/></span><span className="eyebrow">WE'RE HERE TO HELP</span><h1>Student support</h1><p>Contact the SBC Affiliate Customer support</p><a className="btn btn-gold" href="https://t.me/sbeaffiliatemarket_778" target="_blank" rel="noreferrer">Open Telegram support <ArrowUpRight size={17}/></a></div></section>}
function AdminView({state,setState,setTab,users,adminUser,setAdminUser,adminTask,setAdminTask,assignTask,newStudent,setNewStudent,addStudent,setBalance,depositDraft,setDepositDraft,saveAddresses,approveDeposit,approveWithdraw,flash,logout}){const [section,setSection]=useState('Overview');const [delta,setDelta]=useState('50');const pendingD=state.deposits.filter(x=>x.status==='Pending'),pendingW=state.withdrawals.filter(x=>x.status==='Pending');return <section className="page-section admin-page"><div className="admin-banner"><div><span className="eyebrow"><ShieldCheck size={14}/> RESTRICTED DEMO AREA</span><h1>Admin control room</h1><p>Manage demo students, assignments and simulated wallet requests.</p></div><button className="btn btn-outline light" onClick={logout}><LogOut size={16}/> Exit admin</button></div><div className="admin-tabs">{['Overview','Students','Task assignment','Combo offers','Wallet settings','Requests'].map(x=><button className={section===x?'selected':''} onClick={()=>setSection(x)} key={x}>{x}</button>)}</div>{section==='Overview'&&<><div className="admin-stats"><div><span>Students</span><b>{users.length}</b></div><div><span>Pending deposits</span><b>{pendingD.length}</b></div><div><span>Pending withdrawals</span><b>{pendingW.length}</b></div><div><span>Assigned tasks</span><b>{state.assignments.length}</b></div></div><div className="panel"><h2>Admin quick actions</h2><p></p><button className="btn btn-gold" onClick={()=>setSection('Task assignment')}>Assign a task <ChevronRight size={16}/></button></div></>}
 {section==='Students'&&<div className="admin-columns"><div className="panel"><h2>Student accounts</h2>{users.map(u=><div className="student-row" key={u.id}><div className="student-avatar">{u.name[0]}</div><div className="student-data"><b>{u.name}</b><small>{u.id} · {u.email}</small><strong>{money(u.balance)}</strong></div><div className="balance-actions"><button onClick={()=>setBalance(u.id,Number(delta))}><Plus size={15}/></button><button onClick={()=>setBalance(u.id,-Number(delta))}><Minus size={15}/></button></div></div>)}</div><div className="panel"><h2>Member</h2><form onSubmit={e=>{e.preventDefault();addStudent()}}><label>Full name<input value={newStudent.name} onChange={e=>setNewStudent(s=>({...s,name:e.target.value}))} required/></label><label>Email<input type="email" value={newStudent.email} onChange={e=>setNewStudent(s=>({...s,email:e.target.value}))} required/></label><label>Starting demo balance<input type="number" value={newStudent.balance} onChange={e=>setNewStudent(s=>({...s,balance:e.target.value}))}/></label><label>Balance adjustment amount<input type="number" value={delta} onChange={e=>setDelta(e.target.value)}/></label><button className="btn btn-gold wide">Create student</button></form></div></div>}
 {section==='Task assignment'&&<div className="panel admin-form"><h2>Assign a task to one student</h2><p>Only the selected student's task is changed in this demo. A combo has 3, 4 or 5 products and counts as one task.</p><label>Student<select value={adminUser} onChange={e=>setAdminUser(e.target.value)}>{users.map(u=><option value={u.id} key={u.id}>{u.id} · {u.name} · {money(u.balance)}</option>)}</select></label><label>Task number (1–25)<input type="number" min="1" max="25" value={adminTask.taskNo} onChange={e=>setAdminTask(s=>({...s,taskNo:e.target.value}))}/></label><label>Task type<select value={adminTask.combo?'combo':'normal'} onChange={e=>setAdminTask(s=>({...s,combo:e.target.value==='combo'}))}><option value="normal">Normal — one product</option><option value="combo">Combo — 3, 4 or 5 products</option></select></label>{adminTask.combo&&<label>Products in combo<select value={adminTask.comboCount||'3'} onChange={e=>setAdminTask(s=>({...s,comboCount:e.target.value}))}><option value="3">3 products</option><option value="4">4 products</option><option value="5">5 products</option></select></label>}<label>Product 1<select value={adminTask.productA} onChange={e=>setAdminTask(s=>({...s,productA:e.target.value}))}>{catalog.map((p,i)=><option value={i} key={p.name}>{p.name}</option>)}</select></label>{adminTask.combo&&<><label>Product 2<select value={adminTask.productB} onChange={e=>setAdminTask(s=>({...s,productB:e.target.value}))}>{catalog.map((p,i)=><option value={i} key={p.name}>{p.name}</option>)}</select></label><label>Product 3<select value={adminTask.productC} onChange={e=>setAdminTask(s=>({...s,productC:e.target.value}))}>{catalog.map((p,i)=><option value={i} key={p.name}>{p.name}</option>)}</select></label>{Number(adminTask.comboCount||3)>=4&&<label>Product 4<select value={adminTask.productD} onChange={e=>setAdminTask(s=>({...s,productD:e.target.value}))}>{catalog.map((p,i)=><option value={i} key={p.id||p.name}>{p.name}</option>)}</select></label>}{Number(adminTask.comboCount||3)>=5&&<label>Product 5<select value={adminTask.productE} onChange={e=>setAdminTask(s=>({...s,productE:e.target.value}))}>{catalog.map((p,i)=><option value={i} key={p.id||p.name}>{p.name}</option>)}</select></label>}</>}<label>Price per product (USD)<input type="number" min="1" step=".01" value={adminTask.price} onChange={e=>setAdminTask(s=>({...s,price:e.target.value}))}/></label><button className="btn btn-gold" onClick={assignTask}>Publish task to selected student <ChevronRight size={16}/></button></div>}
 {section==='Combo offers'&&<div className="panel"><h2>Combo offer assignments</h2><p>Combo offers are hidden until the student reaches the assigned task number.</p>{state.assignments.filter(a=>a.combo).length===0?<p className="empty-state">No combo assignments yet. Create one in Task assignment.</p>:state.assignments.filter(a=>a.combo).map(a=><div className="mini-row" key={a.userId+a.taskNo}><div><b>{a.userId} · Task {a.taskNo}</b><small>{a.products.map(p=>p.name).join(' + ')}</small></div><span className="combo-tag">3 PRODUCTS</span></div>)}</div>}
 {section==='Wallet settings'&&<div className="panel admin-form"><h2>Deposit address settings</h2><p>Students can copy these configured demo addresses. Never paste a real wallet address into this educational simulation.</p>{['TRC20','BTC','ETH'].map(n=><label key={n}>{n} demo address<input value={depositDraft[n]??state.depositAddresses[n]??''} onChange={e=>setDepositDraft(s=>({...s,[n]:e.target.value}))} placeholder={`${n} address (leave blank until configured)`}/></label>)}<button className="btn btn-gold" onClick={saveAddresses}>Save wallet settings <Check size={16}/></button></div>}
 {section==='Requests'&&<div className="admin-columns"><div className="panel"><h2>Deposit requests</h2>{!state.deposits.length?<p className="empty-state">No deposit requests.</p>:state.deposits.map(d=><div className="request-row" key={d.id}><div><b>{money(d.amount)} · {d.network}</b><small>{d.userId} · {d.id} · {new Date(d.date).toLocaleString()}</small><span className={`status ${d.status.toLowerCase()}`}>{d.status}</span></div>{d.status==='Pending'&&<div className="request-actions"><button onClick={()=>approveDeposit(d.id,true)}>Approve</button><button onClick={()=>approveDeposit(d.id,false)}>Reject</button></div>}</div>)}</div><div className="panel"><h2>Withdrawal requests</h2>{!state.withdrawals.length?<p className="empty-state">No withdrawal requests.</p>:state.withdrawals.map(w=><div className="request-row" key={w.id}><div><b>{money(w.amount)} · {w.network}</b><small>{w.userId} · {w.address}</small><span className={`status ${w.status.toLowerCase()}`}>{w.status}</span></div>{w.status==='Pending'&&<div className="request-actions"><button onClick={()=>approveWithdraw(w.id,true)}>Approve</button><button onClick={()=>approveWithdraw(w.id,false)}>Reject</button></div>}</div>)}</div></div>}
 <div className="admin-warning"><LockKeyhole size={16}/> This is a local prototype. Demo admin credentials are visible in source code and are NOT secure. Do not deploy as a live multi-user financial system until Supabase Auth, database RLS and server-side transaction logic are implemented.</div></section>}
export default App;
