import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// yes, ik its not secure to expose these keys, but it doesnt really matter in this case
const SUPABASE_URL = 'https://uhdkzqyojjfshsdyrkyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZGt6cXlvampmc2hzZHlya3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDc0MDIsImV4cCI6MjA2NTM4MzQwMn0.-NcMckWGJ_Dz5YzzAXRl1VAIcUL8E2XBilicEEX3CVQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function withLoading(fn) {
    const loading = document.createElement('div');
    loading.textContent = 'Loading...';
    loading.className = 'loading-overlay';
    document.body.appendChild(loading);
    try {
        return await fn();
    } finally {
        document.body.removeChild(loading);
    }
}
async function updateRoomStatus(roomName, status, updated_at) {
    if (!roomName || roomName === "Other") return;
    if (roomName === "*") {
        await withLoading(() =>
        supabase
            .from('rooms')
            .update({ status, updated_at })
            .neq('id ',"69")
    );} alert('all rooms updated successfully!'); window.location.reload();;
    await withLoading(() =>
        supabase
            .from('rooms')
            .update({ status, updated_at })
            .eq('name', roomName)
    );
}
window.updateRoomStatus = updateRoomStatus;

document.getElementById('updateStatusBtn').addEventListener('click', async () => {
    const roomName = document.getElementById('roomName').value;
    const status = document.getElementById('status').value;
    const updated_at = new Date().toISOString();
    await updateRoomStatus(roomName, status, 0);
    alert(`Room ${roomName} status updated to ${status}`);
});

document.getElementById('roomnames').addEventListener('click', async (event) => {
    const list = "אווז \nקאנון \nפרוג \nטוקטה \nפיוזן \nבי בופ \nדיקסילנד \nפוגה \nלאטין \nערבסק \nנוקטורן \nגראנג \nגיפסי \nפאנק \nסווינג \nתופים אלקטרונים \nפסנתרים אלקטרונים \nהרכבים קטן \nהרכבים חדש \nהכבים גדול \nכלנית"
    alert(`Available rooms:\n${list}`);
})

async function sendtoast() {
    const { data, error } = await withLoading(() =>
        supabase
            .from('toast')
            .insert([{
                msg: document.getElementById('msg').value,
                color: document.getElementById('color').value,
                dur: parseInt(document.getElementById('duration').value) * 1000,
                size: document.getElementById('size').value,
            }])
    );
    if (error) {
        console.error('Error:', error.message);
        return [];
    }
}
document.getElementById('sendtoast').addEventListener('click', async () => {
    await sendtoast();
    alert('Toast message sent successfully!');
});

async function deletetoast() {
    const toastmsg = document.getElementById('toastmsg').value;
    if (!toastmsg) {
        alert('Please enter a toast message to delete.');
        return;
    }
    const { data, error } = await withLoading(() =>
        supabase
            .from('toast')
            .delete()
            .eq('msg', toastmsg)
    );
    if (error) {
        console.error('Error:', error.message);
        return;
    }
    alert(`Toast message "${toastmsg}" deleted`);
}

document.getElementById('deletetoast').addEventListener('click', async () => {
    await deletetoast();
});

document.getElementById('deletealltoasts').addEventListener('click', async () => {
    const { data, error } = await withLoading(() =>
        supabase
            .from('toast')
            .delete()
            .neq('msg', '*')
    );
    if (error) {
        console.error('Error:', error.message);
        return;
    }
    alert('All toast messages deleted');
});

async function whatsnew() {
    const msg = document.getElementById('wnew-text').innerText;

    const { error } = await withLoading (() => supabase.from('misc').update('new', msg).eq('id', 3))
}

async function shutdown() {
    const { error } = await withLoading(() =>
        supabase
            .from('misc')
            .update([{ what:"true", why: document.getElementById('shutmsg').value }])
            .eq('id', 1)
    ); if (error) {console.error('Error:', error.message); return;}

    alert('server is now blocking and kicking everyone out, only admins can access the app now');
}

document.getElementById('shutdown').addEventListener('click', async () => {
    if (confirm('Are you sure you want to shut down the server? This will block all users except admins.\n האם אתה בטוח שאתה רוצה לכבות את השרת? זה יחסום את כל המשתמשים מלבד מנהלים.')) {
    await shutdown();}
    else {return;}
});

document.getElementById('reopen').addEventListener('click', async () => {
    const { error } = await withLoading(() =>
        supabase
            .from('misc')
            .update([{ what: false, why: '' }])
            .eq('id', 1)
    ); if (error) {console.error('Error:', error.message); return;}

    alert('server is now unblocked, everyone can access the app again');
});

document.getElementById('updateversion').addEventListener('click', async () => {
    const { data, error } = await withLoading(() =>
        supabase
            .from('misc')
            .update([{ what: document.getElementById('Notes').value, why: document.getElementById('version').value }])
            .eq('id', 2)
    ); if (error) {
        console.error('Error fetching version:', error.message);
        return;
    } alert(`Version updated to ${document.getElementById('version').value}`);
});

async function getOnlineCreatures() {
  const { data, error } = await
    supabase.from('online').select('username, is_on');

  if (error) {
    console.error("Fetch error:", error);
    return;
  }
  
  const sortedData = data.sort((a, b) => a.username.localeCompare(b.username));
  updateTable(sortedData);
}

function updateTable(creatures) {
  document.getElementById('lastU').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  const tbody = document.querySelector('.creatures-table tbody');
  tbody.innerHTML = '';

  creatures.forEach(creature => {
    const row = document.createElement('tr');
    
    const userCell = document.createElement('td');
    userCell.textContent = creature.username;
    row.appendChild(userCell);
    
    const statusCell = document.createElement('td');
    statusCell.innerHTML = creature.is_on 
      ? '<span class="online">Active</span>' 
      : '<span class="offline">Idle</span>';
    row.appendChild(statusCell);
    
    tbody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getOnlineCreatures();
  setInterval(getOnlineCreatures, 800);
});

async function whoisstillonline() {
    const { datta, error } = await supabase
        .from('online')
        .update({ is_on: false })
        .neq('username', 'bannedusername');
    if (error) {
        console.error('Error:', error.message);
        return;
    }
} setInterval(whoisstillonline, 500);
