import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const version = localStorage.getItem('version');

window.control = function control() {window.location.href = 'https://prac-t.netlify.app/controlpanel1';}
if (!localStorage.getItem('practiceUserName')) {alert("שימו לב שהאפליקציה כרגע בגרסה ניסיונית, ייתכן שיהיו בה תקלות.");}
window.resetname =  function resetname() {return localStorage.removeItem('practiceUserName');}
let lboard = false;
let wakeLock = null;
let showntoasts = [];
let banned_names = [
    "admin", "administrator", "root", "test", "testuser", "nigger","ניגר"]
const admins = ['איתמר קצובר', 'itamar katzover', 'itamar2', 'itamar3']
const LANGS = {
    en: {
        practiceTitle: "🎵 PractiClick - Practice tracker 🎵",
        cycle: "Cycle",
        stopwatch: "Stopwatch",
        timer: "Timer",
        cycles: "Cycles",
        cycleLength: "Cycle Length (min)",
        break: "Break (sec)",
        startCycle: "Start Cycle",
        pause: "Pause",
        reset: "Reset",
        log: "Log",
        practiceLog: "Practice Log",
        weeklySummary: "Weekly Summary",
        day: "Day",
        totalTime: "Total Time",
        sessions: "Sessions",
        totalWeek: "Total Time Practiced This Week:",
        noSessions: "No sessions yet.",
        radioCycle: "Cycle",
        radioStopwatch: "Stopwatch",
        radioTimer: "Timer",
        metroTitle: "Metronome",
        metroBpm: "BPM",
        metroSound: "Sound",
        metroAccent: "Accent",
        metroVolume: "Volume",
        metroStart: "Start",
        metroStop: "Stop",
        metroSoundHigh: "High",
        metroSoundMid: "Mid",
        metroSoundLow: "Low",
        timerStart: "Start",
        timerPause: "Pause",
        timerReset: "Reset",
        timerLog: "Log",
        timerMin: "Min",
        timerSec: "Sec",
        lbName: "Name",
        lbWeek: "Week Start",
        lbTotal: "Total",
        lbtitle: "Leaderboard (Top 10 this week)",
        radioRooms: "Rooms",
        rstatus: 'Room Status',
        roomHeader: "Room",
        statusHeader: "Status",
        logRoom: "Room",
        logOther: "Other",
    },
    he: {
        practiceTitle: "🎵 פרקטיקליק - מעקב אימון 🎵",
        cycle: "סבב",
        stopwatch: "סטופר",
        timer: "טיימר",
        cycles: "סבבים",
        cycleLength: "אורך סבב (דקות)",
        break: "הפסקה (שניות)",
        startCycle: "התחל סבב",
        pause: "השהה",
        reset: "איפוס",
        log: "סיום",
        practiceLog: "יומן תרגול",
        weeklySummary: "סיכום שבועי",
        day: "יום",
        totalTime: "סה\"כ זמן",
        sessions: "סשנים",
        totalWeek: "סה\"כ זמן תרגול השבוע:",
        noSessions: "אין סשנים עדיין.",
        radioCycle: "סבב",
        radioStopwatch: "סטופר",
        radioTimer: "טיימר",
        metroTitle: "מטרונום",
        metroBpm: "מהירות",
        metroSound: "צליל",
        metroAccent: "הדגשה",
        metroVolume: "ווליום",
        metroStart: "התחל",
        metroStop: "עצור",
        metroSoundHigh: "גבוה",
        metroSoundMid: "אמצע",
        metroSoundLow: "נמוך",
        timerStart: "התחל",
        timerPause: "השהה",
        timerReset: "איפוס",
        timerLog: "סיום",
        timerMin: "דק׳",
        timerSec: "שנ׳",
        lbName: "שם",
        lbWeek: "תחילת שבוע",
        lbTotal: "סה\"כ",
        lbtitle: "לוח תוצאות (10 המובילים השבוע)",
        radioRooms: "חדרים",
        rstatus: 'מצב חדרים',
        roomHeader: "חדר",
        statusHeader: "מצב",
        logRoom: "חדר",
        logOther: "אחר",
    }
};

window.addEventListener("error", (event) => {
    if (currentLang === 'en') {
    alert("An error occurred: " + event.message + ". The app might not work; please contact the developere.");
    } else {
    alert("אירעה שגיאה: " + event.message + ". האפליקציה עשויה לא לעבוד; אנא פנה למפתח.");
    }
})

window.addEventListener('beforeunload', function (e) {
    if (currentPracticeRoom && currentPracticeRoom !== "Other") {
        navigator.sendBeacon && updateRoomStatus(currentPracticeRoom, "available", room.updated_at);
    }
});

function detectDefaultLang() {
    const sysLang = (navigator.language || navigator.userLanguage || '').slice(0,2).toLowerCase();
    if (LANGS[sysLang]) return sysLang;
    return 'he'; 
}
let currentLang = detectDefaultLang();
if (!localStorage.getItem('lang')) {
    let currentLang = detectDefaultLang();
} else {
    currentLang = localStorage.getItem('lang')
}

let userName = askForNameIfNeeded();

function updateLangUI() {
    const t = LANGS[currentLang];
    localStorage.setItem('lang', currentLang);
    document.querySelector('h1').textContent = t.practiceTitle;

    // --- Tab button labels ---
    document.getElementById('tabCycle').textContent = t.radioCycle;
    document.getElementById('tabStopwatch').textContent = t.radioStopwatch;
    document.getElementById('tabTimer').textContent = t.radioTimer;
    document.getElementById('tabRooms').textContent = t.radioRooms;

    // Metronome
    document.getElementById('metroTitle').textContent = t.metroTitle;
    document.getElementById('metroBpmLabel').childNodes[0].textContent = t.metroBpm + ": ";
    document.getElementById('metroSoundLabel').childNodes[0].textContent = t.metroSound + ": ";
    document.getElementById('metroAccentLabel').childNodes[0].textContent = t.metroAccent + ": ";
    document.getElementById('metroVolumeLabel').childNodes[0].textContent = t.metroVolume + ": ";
    document.getElementById('metroStartBtn').textContent = t.metroStart;
    document.getElementById('metroStopBtn').textContent = t.metroStop;
    // Metronome sound options
    const soundOptions = document.getElementById('metroSound').options;
    soundOptions[0].text = t.metroSoundHigh;
    soundOptions[1].text = t.metroSoundMid;
    soundOptions[2].text = t.metroSoundLow;

    // Cycle mode labels
    document.getElementById('cycleCountLabel').childNodes[0].textContent = t.cycles + ": ";
    document.getElementById('cycleLengthLabel').childNodes[0].textContent = t.cycleLength + ": ";
    document.getElementById('cycleBreakLabel').childNodes[0].textContent = t.break + ": ";

    // Cycle mode buttons
    document.getElementById('cycleStartBtn').textContent = t.startCycle;
    document.getElementById('cyclePauseBtn').textContent = t.pause;
    document.getElementById('cycleResetBtn').textContent = t.reset;
    document.getElementById('cycleLogBtn').textContent = t.log;

    // Log and summary section titles
    document.getElementById('practiceLogTitle').textContent = t.practiceLog;
    document.getElementById('weeklySummaryTitle').textContent = t.weeklySummary;

    // Table headers
    document.getElementById('thDay').textContent = t.day;
    document.getElementById('thTotalTime').textContent = t.totalTime;
    document.getElementById('thSessions').textContent = t.sessions;

    // Week total label
    document.getElementById('weekTotalLabel').textContent = t.totalWeek;

    // Set select value and direction
    document.getElementById('langSelect').value = currentLang;
    document.body.dir = (currentLang === 'he') ? 'rtl' : 'ltr';

    // Stopwatch/Timer buttons
    document.getElementById('startBtn').textContent = t.timerStart;
    document.getElementById('pauseBtn').textContent = t.timerPause;
    document.getElementById('resetBtn').textContent = t.timerReset;
    document.getElementById('logBtn').textContent = t.timerLog;

    // Timer input placeholders and labels
    document.getElementById('minutes').placeholder = t.timerMin;
    document.getElementById('seconds').placeholder = t.timerSec;
    document.getElementById('minutesLabel').textContent = t.timerMin;
    document.getElementById('secondsLabel').textContent = t.timerSec;
    document.getElementById('lbName').textContent = t.lbName;
    document.getElementById('lbTotal').textContent = t.lbTotal;
    document.getElementById('lbtitle').textContent = t.lbtitle;
    renderLeaderboard();

    // rooms section
    document.getElementById('rstatus').textContent = t.rstatus;

    // Update rooms table headers
    const roomsTable = document.getElementById('roomsTable');
    if (roomsTable) {
        const ths = roomsTable.querySelectorAll('thead th');
        if (ths.length >= 2) {
            ths[0].textContent = t.statusHeader;
            ths[1].textContent = t.roomHeader;
        }
    }

    document.getElementById('langSelect').addEventListener('change', function() {
    currentLang = this.value;
    updateLangUI();

    if (!localStorage.getItem('practiceUserName')) {
        userName = askForNameIfNeeded();
    }
    });

    // Update "No sessions yet" message if needed
    if (document.getElementById('logList').children.length === 1) {
        const first = document.getElementById('logList').firstChild;
        if (first && first.style && first.style.color === "rgb(170, 170, 170)") {
            first.textContent = t.noSessions;
        }
    }
}


async function askForPracticeRoom() {
    function showRoomModal(rooms, callback) {
        let modal = document.getElementById('roomModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'roomModal';
            modal.style = 'display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:#121212;z-index:1000;align-items:center;justify-content:center;overflow:scroll;';
            modal.innerHTML = `
            <div style="background:#121212;padding:20px;border-radius:8px;min-width:250px;max-width:90vw;">
                <h3 id="roomModalTitle"></h3>
                <div id="roomModalOptions" style="max-height:50vh;overflow-y:auto;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;"></div>
                <button id="roomModalCancel"></button>
            </div>
            `;
            document.body.appendChild(modal);
        }
        const optionsDiv = modal.querySelector('#roomModalOptions');
        const title = modal.querySelector('#roomModalTitle');
        const cancelBtn = modal.querySelector('#roomModalCancel');
        let statusMap = {
            en: { available: "available", taken: "taken", unavailable: "unavailable" },
            he: { available: "פנוי", taken: "תפוס", unavailable: "לא זמין" }
        };
        title.textContent = currentLang === 'he'
            ? "בחר חדר תרגול"
            : "Choose a practice room";
        optionsDiv.innerHTML = '';

        // "Other" option
        const otherBtn = document.createElement('button');
        otherBtn.textContent = currentLang === 'he' ? "אחר" : "Other";
        otherBtn.style.margin = "4px";
        otherBtn.onclick = () => {
            modal.style.display = 'none';
            callback("Other");
        };
        optionsDiv.appendChild(otherBtn);
        rooms.forEach((r) => {
            let status = statusMap[currentLang] && statusMap[currentLang][r.status] ? statusMap[currentLang][r.status] : r.status;
            const btn = document.createElement('button');
            btn.textContent = `${r.name || "Room " + r.id} (${status})`;
            btn.style.margin = "4px";
            btn.disabled = r.status !== "available";
            btn.onclick = () => {
                modal.style.display = 'none';
                callback(r.name || "Room " + r.id);
            };
            optionsDiv.appendChild(btn);
        });

        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            callback(null);
        };
        cancelBtn.textContent = currentLang === 'he' ? "ביטול" : "Cancel";
        modal.style.display = 'flex';

        optionsDiv.style.overflowY = 'scroll';
    }

    const rooms = await fetchRooms();
    return new Promise((resolve) => {
        showRoomModal(rooms, resolve);
    });
}

// yes, ik its not secure to expose these keys, but it doesnt really matter in this case
// and im really lazy to use an actual secure method
const SUPABASE_URL = 'https://uhdkzqyojjfshsdyrkyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZGt6cXlvampmc2hzZHlya3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDc0MDIsImV4cCI6MjA2NTM4MzQwMn0.-NcMckWGJ_Dz5YzzAXRl1VAIcUL8E2XBilicEEX3CVQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Loading Animation Helper ---
function showLoading(text = 'Processing...') {
    const loading = document.getElementById('loadingOverlay');
    if (!loading) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <div class="progress-text">${text}</div>
            </div>
        `;
        document.body.appendChild(overlay);
        // Force reflow to enable transitions
        void overlay.offsetWidth;
        overlay.classList.add('show');
        return;
    }
    
    if (text) {
        const textEl = loading.querySelector('.progress-text');
        if (textEl) textEl.textContent = text;
    }
    
    loading.classList.add('show');
}

function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.classList.remove('show');
        // Remove after transition completes
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }
}

async function withLoading(fn, loadingText) {
    showLoading(loadingText);
    try {
        return await fn();
    } finally {
        hideLoading();
    }
}

async function showtoast(msg, color="white", duration = 10000, size = "16px") {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toast.style.fontSize = size;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = color;
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, duration);
} window.showtoast = showtoast;
let currentPracticeRoom = null;

async function fetchtoast() {
    let { data, error } = await supabase
        .from('toast')
        .select('*')

    if (error) {
        console.error("Error fetching toast:", error);
        return [];
    }
    if (data[0]) {
    data = data[0];
    if (!showntoasts.includes(data.msg)) {
    await showtoast(data.msg, data.color, data.dur, data.size);
    showntoasts.push(data.msg);}}
    return;

}

setInterval(fetchtoast, 15000);
fetchtoast();

async function lockapp() {
    let { data, error } = await withLoading(() =>
        supabase
            .from('down')
            .select('is_down, why')
            .eq('id', 1)
    );
    if (error) {
        console.error('Error checking app status:', error.message);
        return;
    }
    data = data[0];
    if (data.is_down) {
        localStorage.removeItem("reason");
        localStorage.setItem('reason', data.why);
        if(admins.includes(userName)) {showtoast("The app is currently down for maintenance. You can still access the app cause you're Sigma 🥶", "orange", 60000, "16px");return;}
        window.location.href = "https://prac-t.netlify.app/maintenance";
    }
}

setInterval(lockapp, 15000);
lockapp();

async function upsertLeaderboard(ms) {
    const weekStart = getWeekStart(new Date());
    const { error } = await withLoading(() =>
        supabase
            .from('leaderboard')
            .upsert([{
                user_name: userName,
                total_time: ms,
                week_start: weekStart,
            }])
    );

    if (error) {
        console.error('Error upserting leaderboard:', error.message);
    }
}

async function fetchLeaderboard() {
    const weekStart = getWeekStart(new Date());
    const { data, error } = await withLoading(() =>
        supabase
            .from('leaderboard')
            .select('user_name, total_time')
            .eq('week_start', weekStart)
            .order('total_time', { ascending: false })
    );
    if (error) {
        console.error('Error fetching leaderboard:', error.message);
        return [];
    }
    return data || [];
}

async function renderLeaderboard() {
    if (!lboard) {
        lboard = true;;
    } else {
        return;
    }
    const tbody = document.getElementById('leaderboardTable').querySelector('tbody');
    tbody.innerHTML = '';
    const rows = await withLoading(() => fetchLeaderboard());

    if (!rows || rows.length === 0) {
        if (currentLang === 'he') {
            tbody.innerHTML = `<tr><td colspan="2" style="color:#aaa;text-align:center;">אין נתונים עדיין.</td></tr>`;
        } else {
        tbody.innerHTML = `<tr><td colspan="2" style="color:#aaa;text-align:center;">No data yet.</td></tr>`;}
        return;
    }

    const uniqueScores = new Map();
    for (const row of rows) {
        if (!uniqueScores.has(row.user_name) || row.total_time > uniqueScores.get(row.user_name).total_time) {
            uniqueScores.set(row.user_name, row);
        }
    }

    const sortedLeaderboard = Array.from(uniqueScores.values())
        .sort((a, b) => b.total_time - a.total_time)
        .slice(0, 10);

    sortedLeaderboard.forEach(row => {
        tbody.innerHTML += `
            <tr>
                <td>${row.user_name}</td>
                <td>${formatTime(row.total_time)}</td>
            </tr>
        `;
    });
}


function askForNameIfNeeded() {
    let name = localStorage.getItem('practiceUserName');
    if (!name) {
        let msg = currentLang === 'he'
            ? "נא הכנס את שמך בשביל ללוח התוצאות. אם תכניס שם לא הולם, תיחסם."
            : "Please enter your name for the leaderboard. If you enter an inappropriate name, you will be banned.";
        do {
            name = prompt(msg, "");
        } while (!name || !name.trim());
        if (banned_names.includes(name.toLowerCase())) {
            currentLang === 'he' ? alert("השם הזה חסום") : alert("The name " + name + " is banned.");
            location.reload()
            localStorage.removeItem('practiceUserName');
        }
        localStorage.setItem('practiceUserName', name.trim());
    } else if (banned_names.includes(name.toLowerCase())) {
        currentLang === 'he' ? alert("השם הזה חסום") : alert("The name " + name + " is banned.");
        location.reload()
        localStorage.removeItem('practiceUserName');
    }
    return name;
}

async function deleteAllLeaderboardRows() {
    const { error } = await withLoading(() =>
        supabase
            .from('leaderboard')
            .delete()
            .neq('user_name', '___impossible_value___')
    );
    if (error) {
        console.error('Failed to delete leaderboard rows:', error.message);
    } else {
        console.log('All leaderboard rows deleted.');
    }
}
window.deleteAllLeaderboardRows = deleteAllLeaderboardRows;

async function releaseCurrentPracticeRoom() {
    if (currentPracticeRoom && currentPracticeRoom !== "Other") {
        await withLoading(() => updateRoomStatus(currentPracticeRoom, "available", 0));
        currentPracticeRoom = null;
    }
}

async function autoReleaseStaleRooms() {
    const { data: rooms, error } = await withLoading(() =>
        supabase.from('rooms').select('id, name, status, updated_at')
    );
    if (error || !rooms) return;

    for (const room of rooms) {
        if (room.status === "taken" && room.updated_at > 5) {
            await withLoading(() => updateRoomStatus(room.name, "available", 0));
            alert("The room " + room.name + " has been automatically released due to inactivity.");
        }
    }
}

setInterval(autoReleaseStaleRooms, 1000 * 60); // Check every minute
autoReleaseStaleRooms();

async function update_stamp() {
    const { data: rooms, error } = await withLoading(() =>
        supabase.from('rooms').select('id, name, status, updated_at')
    );
    if (error || !rooms) return;

    for (const room of rooms) {
        if (room.status === "taken") {
            let time = room.updated_at + 1
            updateRoomStatus(room.name, "available", time);
        } else {
            updateRoomStatus(room.name, "available", 0);
        }

        if (currentPracticeRoom === room.name && room.status !== "taken") {
            if (currentLang === 'he') {
                showtoast("שים לב שהחדר שאתה מתאמן בו סומן כפנוי ", "orange", "10000", "32px");
        } else {showtoast("Attention! The room you are practicing in has been marked as available.", "orange", "10000", "32px")};
    }

}}

setInterval(update_stamp, 1000 * 60 * 30);

// --- Cycle Mode Logic ---
let cycleMode = {
    running: false,
    paused: false,
    interval: null,
    currentCycle: 1,
    totalCycles: 6,
    cycleLength: 15 * 60 * 1000,
    breakLength: 90 * 1000,
    inBreak: false,
    elapsed: 0,
    breakElapsed: 0,
    totalElapsed: 0
};

const cycleCountInput = document.getElementById('cycleCount');
const cycleLengthInput = document.getElementById('cycleLength');
const cycleBreakInput = document.getElementById('cycleBreak');
const cycleDisplay = document.getElementById('cycleDisplay');
const cycleStartBtn = document.getElementById('cycleStartBtn');
const cyclePauseBtn = document.getElementById('cyclePauseBtn');
const cycleResetBtn = document.getElementById('cycleResetBtn');
const cycleLogBtn = document.getElementById('cycleLogBtn');
const cycleStatus = document.getElementById('cycleStatus');

function updateCycleDisplay() {
    const t = LANGS[currentLang];
    if (cycleMode.inBreak) {
        cycleDisplay.textContent = (currentLang === 'he'
            ? t.break
            : "Break") + ": " + formatTime(cycleMode.breakLength - cycleMode.breakElapsed);
    } else {
        cycleDisplay.textContent = (currentLang === 'he'
            ? t.cycle
            : "Cycle") + " " + cycleMode.currentCycle + ": " + formatTime(cycleMode.cycleLength - cycleMode.elapsed);
    }
    // Enable log button if any time has elapsed
    if (cycleMode.totalElapsed > 0 && cycleMode.running) {
        cycleLogBtn.disabled = false;
    }
}

function updateCycleStatus() {
    const t = LANGS[currentLang];
    if (cycleMode.inBreak) {
        cycleStatus.textContent = (currentLang === 'he'
            ? `${t.break} לפני ${t.cycle} ${cycleMode.currentCycle + 1} מתוך ${cycleMode.totalCycles}`
            : `Break before cycle ${cycleMode.currentCycle + 1} of ${cycleMode.totalCycles}`);
    } else {
        cycleStatus.textContent = (currentLang === 'he'
            ? `${t.cycle} ${cycleMode.currentCycle} מתוך ${cycleMode.totalCycles}`
            : `Cycle ${cycleMode.currentCycle} of ${cycleMode.totalCycles}`);
    }
}

// Update room status in Supabase
async function updateRoomStatus(roomName, status, updated_at) {
    if (!roomName || roomName === "Other") return;
    await withLoading(() =>
        supabase
            .from('rooms')
            .update({ status })
            .eq('name', roomName)
    );
    await withLoading(() =>
        supabase
            .from('rooms')
            .update({ updated_at })
            .eq('name', roomName)
    );
} // make updateroomstatus accessable from the console
window.updateRoomStatus = updateRoomStatus;

// --- Cycle Mode Logic ---
async function startCycle() {
    wakeLock = await navigator.wakeLock.request('screen');
    currentPracticeRoom = await withLoading(() => askForPracticeRoom());
    if (!currentPracticeRoom) return;
    await withLoading(() => updateRoomStatus(currentPracticeRoom, "taken", 0));
    cycleMode.totalCycles = parseInt(cycleCountInput.value) || 6;
    cycleMode.cycleLength = (parseInt(cycleLengthInput.value) || 15) * 60 * 1000;
    cycleMode.breakLength = (parseInt(cycleBreakInput.value) || 90) * 1000;
    cycleMode.currentCycle = 1;
    cycleMode.elapsed = 0;
    cycleMode.breakElapsed = 0;
    cycleMode.totalElapsed = 0;
    cycleMode.inBreak = false;
    cycleMode.running = true;
    cycleMode.paused = false;
    updateCycleDisplay();
    updateCycleStatus();
    cycleStartBtn.disabled = true;
    cyclePauseBtn.disabled = false;
    cycleResetBtn.disabled = false;
    cycleLogBtn.disabled = true;
    cycleCountInput.disabled = cycleLengthInput.disabled = cycleBreakInput.disabled = true;
    cycleMode.interval = setInterval(cycleTick, 200);
}

function cycleTick() {
    existancesnitcher()
    if (!cycleMode.running || cycleMode.paused) return;
    if (cycleMode.inBreak) {
        cycleMode.breakElapsed += 200;
        updateCycleDisplay();
        if (cycleMode.breakElapsed >= cycleMode.breakLength) {
            cycleMode.inBreak = false;
            cycleMode.breakElapsed = 0;
            cycleMode.currentCycle++;
            if (cycleMode.currentCycle > cycleMode.totalCycles) {
                stopCycle();
                cycleLogBtn.disabled = false;
                cycleStatus.textContent = "Cycle session complete!";
                return;
            }
            updateCycleStatus();
        }
    } else {
        cycleMode.elapsed += 200;
        cycleMode.totalElapsed += 200;
        updateCycleDisplay();
        if (cycleMode.elapsed >= cycleMode.cycleLength) {
            if (cycleMode.currentCycle < cycleMode.totalCycles) {
                cycleMode.inBreak = true;
                cycleMode.elapsed = 0;
                updateCycleStatus();
            } else {
                stopCycle();
                cycleLogBtn.disabled = false;
                cycleStatus.textContent = "Cycle session complete!";
            }
        }
    }
    // Enable log button if any time has elapsed
    if (cycleMode.totalElapsed > 0 && cycleMode.running) {
        cycleLogBtn.disabled = false;
    }
}

function pauseCycle() {
    wakeLock = null;
    cycleMode.paused = true;
    cyclePauseBtn.disabled = true;
    cycleStartBtn.disabled = false;
    // Enable log button if any time has elapsed
    if (cycleMode.totalElapsed > 0) {
        cycleLogBtn.disabled = false;
    }
}

async function resumeCycle() {
    wakeLock = await navigator.wakeLock.request('screen');
    cycleMode.paused = false;
    cyclePauseBtn.disabled = false;
    cycleStartBtn.disabled = true;
    // Enable log button if any time has elapsed
    if (cycleMode.totalElapsed > 0) {
        cycleLogBtn.disabled = false;
    }
}

function stopCycle() {
    wakeLock = null;
    cycleMode.running = false;
    clearInterval(cycleMode.interval);
    cycleStartBtn.disabled = true;
    cyclePauseBtn.disabled = true;
    cycleResetBtn.disabled = false;
    cycleCountInput.disabled = cycleLengthInput.disabled = cycleBreakInput.disabled = false;
    // Release room when stopping
    releaseCurrentPracticeRoom();
    // Enable log button if any time has elapsed
    if (cycleMode.totalElapsed > 0) {
        cycleLogBtn.disabled = false;
    }
}

function resetCycle() {
    cycleMode.running = false;
    clearInterval(cycleMode.interval);
    cycleMode.currentCycle = 1;
    cycleMode.elapsed = 0;
    cycleMode.breakElapsed = 0;
    cycleMode.totalElapsed = 0;
    cycleMode.inBreak = false;
    updateCycleDisplay();
    updateCycleStatus();
    // Release room when resetting
    releaseCurrentPracticeRoom();
    cycleStartBtn.disabled = false;
    cyclePauseBtn.disabled = true;
    cycleResetBtn.disabled = true;
    cycleLogBtn.disabled = true;
    cycleCountInput.disabled = cycleLengthInput.disabled = cycleBreakInput.disabled = false;
    cycleStatus.textContent = "";
}

// Allow logging at any time if some time has elapsed
async function logCycleSession() {
    if (cycleMode.totalElapsed < 1000) return;
    const now = new Date();
    const entry = {
        time: cycleMode.totalElapsed,
        date: now.toISOString(),
        mode: "cycle",
        room: currentPracticeRoom || "Other"
    };
    logs.push(entry);
    localStorage.setItem('practiceLogs', JSON.stringify(logs));
    renderLogs();
    renderSummary();
    resetCycle();
    await withLoading(() => updateRoomStatus(currentPracticeRoom, "available", 0));
    await withLoading(() => upsertLeaderboard(getWeekTotal()));
    renderLeaderboard();
    if (currentLang === 'he') {
        showtoast("הסשן נשמר ביומן התרגול", "green");
    } else {
        showtoast("Session logged in practice log", "green");
    }
}

cycleStartBtn.onclick = function() {
    if (cycleMode.paused) {
        resumeCycle();
    } else {
        startCycle();
    }
};
cyclePauseBtn.onclick = pauseCycle;
cycleResetBtn.onclick = resetCycle;
cycleLogBtn.onclick = logCycleSession;


// --- Stopwatch/Timer Logic ---

let mode;
if (!localStorage.getItem('mode')) {
    mode = 'cycle';
} else {
    mode = localStorage.getItem('mode')
}
let interval = null;
let startTime = null;
let elapsed = 0;
let timerDuration = 0;
let running = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const logBtn = document.getElementById('logBtn');
const timerInputs = document.getElementById('timer-inputs');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

// --- Mode Switching Logic (Tab Buttons) ---
function showMode(mode) {
    wakeLock = null;
    localStorage.setItem('mode', mode);
    document.getElementById('cycle-inputs').style.display = 'none';
    document.getElementById('cycleDisplay').style.display = 'none';
    document.getElementById('cycle-controls').style.display = 'none';
    document.getElementById('cycleStatus').style.display = 'none';

    document.getElementById('timer-inputs').style.display = 'none';
    document.getElementById('display').style.display = 'none';
    document.getElementById('timer-controls').style.display = 'none';
    document.getElementById('roomsContainer').style.display = 'none';

    // Tab active state
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    if (mode === 'cycle') {
        document.getElementById('cycle-inputs').style.display = '';
        document.getElementById('cycleDisplay').style.display = '';
        document.getElementById('cycle-controls').style.display = '';
        document.getElementById('cycleStatus').style.display = '';
    } else if (mode === 'timer') {
        document.getElementById('timer-inputs').style.display = '';
        document.getElementById('display').style.display = '';
        document.getElementById('timer-controls').style.display = '';
    } else if (mode === 'stopwatch') {
        document.getElementById('timer-inputs').style.display = 'none';
        document.getElementById('display').style.display = '';
        document.getElementById('timer-controls').style.display = '';
    } else {
        document.getElementById('roomsContainer').style.display = '';
        renderRooms();
    }
}

// --- Tab button event listeners ---
document.getElementById('tabCycle').onclick = function() { mode = 'cycle'; showMode('cycle'); };
document.getElementById('tabStopwatch').onclick = function() { mode = 'stopwatch'; showMode('stopwatch'); };
document.getElementById('tabTimer').onclick = function() { mode = 'timer'; showMode('timer'); };
document.getElementById('tabRooms').onclick = function() { mode = 'rooms'; showMode('rooms'); };

showMode(mode);

async function fetchRooms() {
    const { data, error } = await withLoading(() =>
        supabase
            .from('rooms')
            .select('id, name, status', 'updated_at')
            .order('id', { ascending: true })
    );
    if (error) {
        console.error('Error fetching rooms:', error.message);
        return [];
    }
    return data || [];
}

async function renderRooms() {
    const tbody = document.getElementById('roomsTable').querySelector('tbody');
    tbody.innerHTML = '';
    const rooms = await withLoading(() => fetchRooms());
    if (!rooms.length) {
        tbody.innerHTML = `<tr><td colspan="2" style="color:#aaa;">No room data.</td></tr>`;
        return;
    }
    // Status translation map
    let statusMap = {
        en: { available: "available", taken: "taken", unavailable: "unavailable" },
        he: { available: "פנוי", taken: "תפוס", unavailable: "נעול" }
    };
    const t = LANGS[currentLang];
    // Update table headers
    const roomsTable = document.getElementById('roomsTable');
    if (roomsTable) {
        const ths = roomsTable.querySelectorAll('thead th');
        if (ths.length >= 2) {
            ths[0].textContent = t.statusHeader;
            ths[1].textContent = t.roomHeader;
        }
    }
    rooms.forEach(room => {
        let color = "#aaa";
        if (room.status === "available") color = "green";
        else if (room.status === "taken") color = "orange";
        else if (room.status === "unavailable") color = "red"
        let statusLabel = statusMap[currentLang] && statusMap[currentLang][room.status] ? statusMap[currentLang][room.status] : room.status;
        tbody.innerHTML += `
            <tr>
            <td style="color:${color};font-weight:bold;">${statusLabel}</td>
                <td>${room.name || "Room " + room.id}</td>
            </tr>
        `;
    });
}

function formatTime(ms) {
    let totalSec = Math.floor(ms / 1000);
    let h = Math.floor(totalSec / 3600);
    let m = Math.floor((totalSec % 3600) / 60);
    let s = totalSec % 60;
    return [h, m, s].map(x => String(x).padStart(2, '0')).join(':');
}

function updateDisplay() {
    if (mode === 'stopwatch') {
        display.textContent = formatTime(elapsed);
    } else {
        let remaining = Math.max(timerDuration - elapsed, 0);
        display.textContent = formatTime(remaining);
    }
}

function tick() {
    existancesnitcher()
    if (!running) return;
    elapsed = Date.now() - startTime;
    if (mode === 'timer' && elapsed >= timerDuration) {
        elapsed = timerDuration;
        updateDisplay();
        stopTimer();
        logBtn.disabled = false;
        return;
    }
    updateDisplay();
}

async function startTimer() {
    wakeLock = await navigator.wakeLock.request('screen');
    if (mode === 'timer') {
        let min = parseInt(minutesInput.value) || 0;
        let sec = parseInt(secondsInput.value) || 0;
        timerDuration = (min * 60 + sec) * 1000;
        if (timerDuration <= 0) return;
    }
    withLoading(() => askForPracticeRoom()).then(async room => {
        if (!room) return; // Cancel if user aborts
        currentPracticeRoom = room;
        await withLoading(() => updateRoomStatus(currentPracticeRoom, "taken", room.updated_at)); // Mark as taken
        running = true;
        startTime = Date.now() - elapsed;
        interval = setInterval(tick, 200);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        logBtn.disabled = true;
        minutesInput.disabled = secondsInput.disabled = true;
    });
}

function pauseTimer() {
    wakeLock = null;
    running = false;
    clearInterval(interval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    logBtn.disabled = false;
}

function resetTimer() {
    wakeLock = null;
    running = false;
    clearInterval(interval);
    elapsed = 0;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    logBtn.disabled = true;
    minutesInput.disabled = secondsInput.disabled = false;
    // Release room when resetting timer
    releaseCurrentPracticeRoom();
    // --- Reset click logic ---
    if (typeof resetClickCount === "undefined") window.resetClickCount = 0;
    if (typeof resetClickTimer === "undefined") window.resetClickTimer = null;
    resetClickCount++;
    if (resetClickTimer) clearTimeout(resetClickTimer);
    resetClickTimer = setTimeout(() => { resetClickCount = 0; }, 1000); // 1s window
    if (resetClickCount >= 7) {
        resetClickCount = 0; 
        if (currentLang == 'he') {
            if (confirm("האם אתה רוצה לאפס את כל יומני התרגול?")) {
                resetBtn.disabled = true;
                logs = [];
                localStorage.setItem('practiceLogs', JSON.stringify(logs));
                renderLogs();
                renderSummary();
            }
        }
        else if (confirm("Do you want to reset all saved practice logs?")) {
            resetBtn.disabled = true;
            logs = [];
            localStorage.setItem('practiceLogs', JSON.stringify(logs));
            renderLogs();
            renderSummary();
        }
    }
}

function switchMode(newMode) {
    releaseCurrentPracticeRoom();
    mode = newMode;
    resetTimer();
    if (mode === 'timer') {
        timerInputs.style.display = '';
    } else {
        timerInputs.style.display = 'none';
    }
}

document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', e => switchMode(e.target.value));
});

window.addEventListener('click', existancesnitcher);
window.addEventListener('scroll', existancesnitcher)

let idleTimer
window.addEventListener('beforeunload', exitsnitcher);
window.addEventListener('pagehide', exitsnitcher);
function resetIdleTimer() {
    clearTimeout(idleTimer);
    // idleTimer = setTimeout(exitsnitcher, 2000)
}

window.addEventListener('mousemove', resetIdleTimer);
window.addEventListener('keydown', resetIdleTimer);
window.addEventListener('click', resetIdleTimer);
window.addEventListener('scroll', resetIdleTimer);

resetIdleTimer();

async function existancesnitcher() {
    if (localStorage.getItem('practiceUserName')) {
        const { data, error } = await  supabase
            .from('online')
            .upsert({ username: localStorage.getItem('practiceUserName'), is_on: true })
            .eq('username', userName);
    }
}

async function exitsnitcher() {
    if (localStorage.getItem('practiceUserName')) {
        const { data, error} = await withLoading(() => supabase
            .from('online')
            .update({ is_on: false })
            .eq('username', userName)
        );
    }
}

startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetBtn.onclick = resetTimer;
logBtn.onclick = logSession;

// --- Logging & Persistence ---
const logList = document.getElementById('logList');
let logs = JSON.parse(localStorage.getItem('practiceLogs') || '[]');

async function logSession() {
    let ms;
    if (mode === 'timer') {
        ms = Math.min(elapsed, timerDuration);
    } else {
        ms = elapsed;
    }
    if (ms < 1000) return;
    const now = new Date();
    const entry = {
        time: ms,
        date: now.toISOString(),
        mode: mode,
        room: currentPracticeRoom || "Other"
    };
    logs.push(entry);
    localStorage.setItem('practiceLogs', JSON.stringify(logs));
    renderLogs();
    renderSummary();
    resetTimer();
    await withLoading(() => updateRoomStatus(currentPracticeRoom, "available", 0)); // Mark as available
    await withLoading(() => upsertLeaderboard(getWeekTotal()));
    renderLeaderboard();
    if (currentLang === 'he') {
        showtoast("הסשן נשמר ביומן התרגול", "green");
    } else {
        showtoast("Session logged in practice log", "green");
    }
}

function getCurrentWeekNumber() {
    const now = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - jan1) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + jan1.getDay() + 1) / 7);
}

function autoResetLogsIfNewWeek() {
    const now = new Date();
    const currentWeek = getCurrentWeekNumber();
    const currentYear = now.getFullYear();
    const lastWeekData = JSON.parse(localStorage.getItem('practiceLogsWeekInfo') || '{}');
    if (lastWeekData.year !== currentYear || lastWeekData.week !== currentWeek) {
        // New week, clear logs
        logs = [];
        localStorage.setItem('practiceLogs', JSON.stringify(logs));
        localStorage.setItem('practiceLogsWeekInfo', JSON.stringify({ year: currentYear, week: currentWeek }));
        renderLogs();
        renderSummary();
        updateWeekTotal();
        deleteAllLeaderboardRows();
    }
}

autoResetLogsIfNewWeek();

function renderLogs() {
    logList.innerHTML = '';
    if (logs.length === 0) {
        logList.innerHTML = '<div style="text-align:center;color:#aaa;">No sessions yet.</div>';
        return;
    }
    const t = LANGS[currentLang];
    const modeMap = {
        en: { cycle: "Cycle", timer: "Timer", stopwatch: "Stopwatch" },
        he: { cycle: "סבב", timer: "טיימר", stopwatch: "סטופר" }
    };
    logs.slice().reverse().forEach(log => {
        const d = new Date(log.date);
        const item = document.createElement('div');
        item.className = 'log-item';
        let roomLabel;
        if (log.room && log.room !== "Other" && log.room !== "אחר") {
            roomLabel = `${t.logRoom}: ${log.room}`;
        } else {
            const modeName = (modeMap[currentLang] && modeMap[currentLang][log.mode]) ? modeMap[currentLang][log.mode] : log.mode;
            roomLabel = `${t.logOther} (${modeName})`;
        }
        item.innerHTML = `
            <span>${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false })}</span>
            <span>${formatTime(log.time)}</span>
            <span style="color:#888;">${roomLabel}</span>
        `;
        logList.appendChild(item);
    });
}

// --- Weekly Summary ---
function getWeekStart(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().slice(0, 10);
}


function getWeekTotal() {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekStartDate = new Date(weekStart + "T00:00:00");
    const weekEndDate = new Date(weekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    let total = 0;
    logs.forEach(log => {
        const d = new Date(log.date);
        if (d >= weekStartDate && d < weekEndDate) {
            let day = d.getDay();
            if (day < 7) { // Sun-Sat
                total += log.time;
            }
        }
    });
    return total;
}

function updateWeekTotal() {
    const total = getWeekTotal();
    document.getElementById('weekTotal').textContent = formatTime(total);
}

function updateResetBtnLabel() {
    const t = LANGS[currentLang];
    resetBtn.textContent = t.reset;
    updateWeekTotal();
}


function renderSummary() {
    let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const tbody = document.getElementById('summaryTable').querySelector('tbody');
    tbody.innerHTML = '';
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekStartDate = new Date(weekStart + "T00:00:00");
    const weekEndDate = new Date(weekStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    let daily = Array(7).fill().map(() => ({time:0, count:0})); // 7 days: Sun-Sat
    logs.forEach(log => {
        const d = new Date(log.date);
        if (d >= weekStartDate && d < weekEndDate) {
            let day = d.getDay(); // Sunday=0
            if (day < 7) { // Sun-Sat
                daily[day].time += log.time;
                daily[day].count += 1;
            }
        }
    });
    if (currentLang === 'he') {
        days = ['א','ב','ג','ד','ה','ו','ש'];
        for (let i=0; i<7; ++i) {
            tbody.innerHTML += `
                <tr>
                    <td>${days[i]}</td>
                    <td>${daily[i].time ? formatTime(daily[i].time) : '-'}</td>
                    <td>${daily[i].count || '-'}</td>
                </tr>
            `;
        }
    } else {
        for (let i=0; i<7; ++i) {
            tbody.innerHTML += `
                <tr>
                    <td>${days[i]}</td>
                    <td>${daily[i].time ? formatTime(daily[i].time) : '-'}</td>
                    <td>${daily[i].count || '-'}</td>
                </tr>
            `;
        }
    }
    updateResetBtnLabel();


}

// --- Init ---
updateDisplay();
renderLogs();
renderSummary();
updateResetBtnLabel();
updateWeekTotal();

// --- Metronome Logic ---
let metroAudioCtx = null;
let metroNextTickTime = 0;
let metroSchedulerTimer = null;
let metroBpmValue = 100;
let metroAccentValue = 4;
let metroSoundValue = "low";
let metroVolumeValue = 1;
let metroTickCount = 0;

const metroBpm = document.getElementById('metroBpm');
const metroSound = document.getElementById('metroSound');
const metroAccent = document.getElementById('metroAccent');
const metroVolume = document.getElementById('metroVolume');
const metroStartBtn = document.getElementById('metroStartBtn');
const metroStopBtn = document.getElementById('metroStopBtn');
const metroIndicator = document.getElementById('metroIndicator');

function scheduleMetronomeTick(time, accented) {
    const ctx = metroAudioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    let freq = 1000;
    if (metroSoundValue === "high") freq = accented ? 900 : 600;
    if (metroSoundValue === "mid") freq = accented ? 600 : 400;
    if (metroSoundValue === "low") freq = accented ? 300 : 100;
    o.type = "square";
    o.frequency.value = freq;
    g.gain.value = metroVolumeValue * (accented ? 1 : 0.7);
    o.connect(g).connect(ctx.destination);
    o.start(time);
    o.stop(time + (accented ? 0.12 : 0.08));
    // UI update (not sample-accurate, but close enough)
    setTimeout(() => {
        metroIndicator.textContent = accented ? "●" : "•";
        metroIndicator.style.color = accented ? "#2e3a59" : "#888";
    }, Math.max(0, (time - ctx.currentTime) * 1000));
}

function metroScheduler() {
    existancesnitcher()
    const ctx = metroAudioCtx;
    while (metroNextTickTime < ctx.currentTime + 0.5) { // Schedule 0.5s ahead
        const accented = (metroTickCount % metroAccentValue === 0);
        scheduleMetronomeTick(metroNextTickTime, accented);
        metroTickCount++;
        metroNextTickTime += 60.0 / metroBpmValue;
    }
    metroSchedulerTimer = setTimeout(metroScheduler, 50);
}

metroStartBtn.onclick = function() {
    if (metroSchedulerTimer) clearTimeout(metroSchedulerTimer);
    if (metroAudioCtx) {
        try { metroAudioCtx.close(); } catch (e) {}
    }
    metroAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    metroBpmValue = Math.max(20, Math.min(700, parseInt(metroBpm.value) || 100));
    metroAccentValue = parseInt(metroAccent.value) || 4;
    metroSoundValue = metroSound.value;
    metroVolumeValue = metroVolume.value;
    metroTickCount = 0;
    metroNextTickTime = metroAudioCtx.currentTime + 0.1;
    metroStartBtn.disabled = true;
    metroStopBtn.disabled = false;
    metroScheduler();
};

metroStopBtn.onclick = function() {
    if (metroSchedulerTimer) clearTimeout(metroSchedulerTimer);
    metroSchedulerTimer = null;
    if (metroAudioCtx) {
        try { metroAudioCtx.close(); } catch (e) {}
        metroAudioCtx = null;
    }
    metroIndicator.textContent = "";
    metroStartBtn.disabled = false;
    metroStopBtn.disabled = true;
};

// Optional: Stop metronome when navigating away
window.addEventListener('beforeunload', () => {
    if (metroSchedulerTimer) clearTimeout(metroSchedulerTimer);
    if (metroAudioCtx) {
        try { metroAudioCtx.close(); } catch (e) {}
        metroAudioCtx = null;
    }
});

let practiceReminderInterval = null;

function getTodayPracticeMs() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let total = 0;
    logs.forEach(log => {
        const d = new Date(log.date);
        if (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
        ) {
            total += log.time;
        }
    });
    return total;
}

async function sendPracticeNotification() {
    const practicedMs = getTodayPracticeMs();
    const practicedMin = Math.floor(practicedMs / 60000);

    let title, body;

    if (currentLang === 'he') {
        if (practicedMin === 0) {
            title = "⏰ זמן לתרגל!";
            body = "עדיין לא תרגלת היום. התחל סשן כדי לשמור על הרצף!";
        } else if (practicedMin < 120) {
            title = "🎶 לתרגל עוד קצת?";
            body = `תרגלת ${practicedMin} דקות היום. תוכל להגיע לשעתיים?`;
        }
    } else {
        if (practicedMin === 0) {
            title = "⏰ Time to practice!";
            body = "You haven't practiced yet today. Start a session to keep your streak going!";
        } else if (practicedMin < 120) {
            title = "🎶 Practice a bit more?";
            body = `You've practiced ${practicedMin} min today. Can you reach 2 hours?`;
        }
    }

    // Push via OneSignal REST API (TEST ONLY)
    try {
        const response = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "os_v2_app_2etnx6e5xbcddf4go6eapp2b5seluslvt4uewreo3c2bqplomvs7pt7425blvhceqbvtompnrzk4vdvkzxt6tysumrqsvneerscuq2y"
            },
            body: JSON.stringify({
                app_id: "d126dbf8-9db8-4431-9786-778807bf41ec",
                included_segments: ["Subscribed Users"],
                headings: { en: title },
                contents: { en: body },
                url: "https://prac-t.netlify.app/"
            })
        });

        const result = await response.json();
        console.log("Push response:", result);

        if (response.ok) {
            alert("✅ Push sent!");
        } else {
            alert("❌ Push failed: " + JSON.stringify(result));
        }
    } catch (error) {
        console.error("Push error:", error);
        alert("❌ Error sending push");
    }
}

function createOrUpdateFooterButtons() {
    // Use emoji for icons, smaller size, and responsive width
    const buttonStyle = `
        color: #fff;
        width: 40px;
        height: 40px;
        padding: 0;
        font-size: 1.4em;
        border-radius: 8px;
        border: 1px solid #bbb;
        background: #222;
        cursor: pointer;
        box-shadow: 0 1px 4px #0002;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;
        min-width: 40px;
        min-height: 40px;
        max-width: 40px;
        max-height: 40px;
        ${currentLang === 'he' ? 'direction: ltr;' : 'direction: rtl;'}
    `;

    let footer = document.getElementById('footerBtns');
    if (!footer) {
        footer = document.createElement('div');
        footer.id = 'footerBtns';
        document.body.appendChild(footer);
    }

    // Responsive: side on desktop, bottom on mobile
    const isMobile = window.innerWidth <= 600;
    if (isMobile) {
        footer.style = `
            position: fixed;
            bottom: 12px;
            left: 0;
            right: 0;
            z-index: 1001;
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
            justify-content: center;
            background: none;
            box-shadow: none;
            width: 100vw;
            padding: 0 4px;
            overflow-x: auto;
            pointer-events: auto;
        `;
    } else {
        footer.style = `
            position: fixed;
            top: auto;
            bottom: 32px;
            ${currentLang === 'he' ? 'left: 24px; right: auto;' : 'right: 24px; left: auto;'}
            z-index: 1001;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: ${currentLang === 'he' ? 'flex-start' : 'flex-end'};
            background: none;
            box-shadow: none;
            width: auto;
            padding: 0;
            pointer-events: auto;
        `;
    }
    footer.innerHTML = ''; // Clear for language update

    // Bug report button (emoji: 🐞)
    const bugBtn = document.createElement('button');
    bugBtn.id = 'bugBtn';
    bugBtn.title = (currentLang === 'he') ? 'דיווח תקלה' : 'Report a Bug';
    bugBtn.innerHTML = '🐞';
    bugBtn.style = buttonStyle;
    bugBtn.onclick = function() {
        window.open('https://forms.gle/1b3GkAFXpf7WXGt1A', '_blank');
    };

    // Reload button (emoji: 🔄)
    const reload = document.createElement('button');
    reload.id = 'reload';
    reload.title = (currentLang === 'he') ? 'רענן' : 'Reload';
    reload.innerHTML = '🔄';
    reload.style = buttonStyle;
    reload.onclick = function() {
        window.location.reload();
    };

    // Usage guide button (emoji: ❔)
    const guideBtn = document.createElement('button');
    guideBtn.id = 'guideBtn';
    guideBtn.title = (currentLang === 'he') ? 'מדריך שימוש' : 'Usage Guide';
    guideBtn.innerHTML = '❔';
    guideBtn.style = buttonStyle;
    guideBtn.onclick = showUsageGuide;

    footer.appendChild(reload);
    footer.appendChild(bugBtn);
    footer.appendChild(guideBtn);


    // Developer console button (emoji: 🛠️)
    const consoleBtn = document.createElement('button');
    consoleBtn.id = 'consoleBtn';
    consoleBtn.title = (currentLang === 'he') ? 'קונסולה' : 'Console';
    consoleBtn.innerHTML = '🛠️';
    consoleBtn.style = buttonStyle;
    consoleBtn.onclick = devconsole;

    footer.appendChild(reload);
    footer.appendChild(bugBtn);
    footer.appendChild(guideBtn);
    footer.appendChild(consoleBtn);
}

// Ensure buttons are created on load and on language change
document.addEventListener('DOMContentLoaded', createOrUpdateFooterButtons);

const origUpdateLangUI = updateLangUI;
updateLangUI = function() {
    origUpdateLangUI();
    createOrUpdateFooterButtons();
};

document.getElementById('langSelect').addEventListener('change', function() {
    currentLang = this.value;
    updateLangUI();
});


document.addEventListener('DOMContentLoaded', function() {
    updateLangUI();
    document.getElementById('langSelect').value = currentLang;
    document.body.dir = (currentLang === 'he') ? 'rtl' : 'ltr';
    const cycleRadio = document.querySelector('input[name="mode"][value="cycle"]');
    if (cycleRadio) {
        cycleRadio.checked = true;
        showMode('cycle');
    }
});

function showUsageGuide() {
    const guide = {
        en: `
        <h2>🎵 PractiClick - Quick Guide 🎵</h2>
        <ul>
            <li><b>Cycle:</b> Set your cycles, lengths, and breaks.</li>
            <li><b>Stopwatch:</b> Hit start, and play for as long you can.</li>
            <li><b>Timer:</b> Set a time, hit start, and race against the clock. No pressur.</li>
            <li><b>Rooms:</b> Know what room is taken from your bed.</li>
            <li><b>Leaderboard:</b> Practice more, climb higher. Bragging rights included, trophies not (yet).</li>
            <li><b>Metronome:</b> Stay in time. Or at least try.</li>
            <li><b>Logs & Summary:</b> See your practice history. Yes, it counts even if you "practiced" random stuff.</li>
        </ul>
        <p style="color:gray;font-size:0.95em;">Tip: Click the language selector to switch languages.</p>
        <p style="color:gray;font-size:0.95em;">Questions? Bugs? Use the '🐞' button. Or just contact me on whatsapp.</p>
        <p style="color:gray;font-size:0.95em;">Side note: This page will pop up everytime the app is updated</p>
        `,
        he: `
        <h2>🎵 מדריך זריז לפרקטיקליק 🎵</h2>
        <ul>
            <li><b>סבב:</b> קבעו סבבים, אורכים והפסקות.</li>
            <li><b>סטופר:</b> התחילו, נגנו, לכמה זמן שאתם יכולים.</li>
            <li><b>טיימר:</b> קבעו זמן, התחילו, ותנסו להספיק לפני שהשעון מצלצל. בהצלחה!</li>
            <li><b>חדרים:</b> ראו איזה חדרים תפוסים בלי לצאת מהפנימיה</li>
            <li><b>לוח תוצאות:</b> מתרגלים יותר? עולים למעלה!.</li>
            <li><b>מטרונום:</b> שמרו על קצב. או לפחות תנסו.</li>
            <li><b>יומן & סיכום:</b> צפו בהיסטוריית התרגול שלכם.</li>
        </ul>
        <p style="color:gray;font-size:0.95em;">טיפ: אפשר להחליף שפה מהתפריט למעלה.</p>
        <p style="color:gray;font-size:0.95em;">שאלות? תקלות? השתמשו בכפתור ה"🐞". או תפנו אלי בוואצאפ.</p>
        <p style="color:gray;font-size:0.95em;">העמוד הזה יופיע כל פעם שהאפליקציה מקבלת עדכון!</p>
        `
    };
    
    let modal = document.getElementById('usageGuideModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'usageGuideModal';
        modal.style = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;
            background:rgba(0,0,0,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;
        `;
        modal.innerHTML = `
            <div style=";background:rgb(17, 18, 23);color:white;padding:24px 18px;max-width:420px;width:90vw;border-radius:10px;box-shadow:0 2px 16px #0005;position:relative;">
                <button id="closeGuideBtn" style="position:fixed;top:8px;right:12px;font-size:1.2em;background:none;border:none;cursor:pointer;">✖</button>
                <div id="guideContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.querySelector('#guideContent').innerHTML = guide[currentLang] || guide.en;
    modal.style.display = 'flex';
    
    modal.querySelector('#closeGuideBtn').onclick = () => { 
        modal.style.display = 'none'; 
    };
}

function devconsole() {
    let msg, command, output;
    if (currentLang === 'he') {
        msg = 'אם אין לך מושג מה זה פשוט תתעלם'
    } else {
        msg = 'If you have no idea what this is, just ignore it'}
    command = prompt(msg, "");
    if (command == 'gimmie control') {window.location.href = 'https://prac-t.netlify.app/controlpanel1';exitsnitcher();}
    try {
        output = eval(command);
    } catch (e) {
        output = e.message;
    }
    if (command) {return;}
    alert(output);
}

if (!localStorage.getItem('lang')) {showUsageGuide();}

async function getversion() {
    let { data, error } = await withLoading(() =>
        supabase
            .from('down')
            .select('why')
            .eq('id', 2)
    ); if (error) {
        console.error('Error fetching version:', error.message);
        return;
    }
    if (data[0].why !== localStorage.getItem('version')) {
        if (currentLang === 'he') {
            alert("האפליקציה עודכנה בהצלחה")
        } else {
            alert("The app has been updated successfully.");
        }
        showUsageGuide();
        localStorage.setItem('version', data[0].why);
    }
    return data[0].why;
}

getversion();
setInterval(getversion, 1000 * 60 * 60);