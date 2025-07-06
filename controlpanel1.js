import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// yes, ik its not secure to expose these keys, but it doesnt really matter in this case
// and im really lazy to use an actual secure method
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
        for (let id = 0; id < 21; i++) {
            // Update each room by ID
        await withLoading(() =>
        supabase
            .from('rooms')
            .update({ status, updated_at })
            .eq('id ',id)
    );} alert('all rooms updated successfully!'); return;
    }
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

async function shutdown() {
    const { error } = await withLoading(() =>
        supabase
            .from('down')
            .update([{ is_down: true, why: document.getElementById('shutmsg').value }])
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
            .from('down')
            .update([{ is_down: false, why: '' }])
            .eq('id', 1)
    ); if (error) {console.error('Error:', error.message); return;}

    alert('server is now unblocked, everyone can access the app again');
});
// whoever touched my code; you are a mean person ):