const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function toMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function dateToMinutes(date) {
  const options = { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit", hour12: false };
  const parts = new Intl.DateTimeFormat("en-GB", options).formatToParts(date);

  const hours = parseInt(parts.find(p => p.type === "hour").value, 10);
  const minutes = parseInt(parts.find(p => p.type === "minute").value, 10);

  return hours * 60 + minutes;
}

async function updateRoomStatus(room, status) {
  await supabase.from("rooms").update({ status: status }).eq("name", room);
}

async function checkforBook() {
  const { data, error } = await supabase.from("booking").select('*');

  if (!data || data.length === 0) return 'nothing';

  for (const d of data) {
    const name = d.name;
    const room = d.room;
    const status = d.status;
    const del = d.del;

    const time = toMinutes(d.time);
    const date = d.date ? new Date(d.date) : null;
    const length = parseInt(d.length);

    if (!date) {
      const now = dateToMinutes(new Date());
      console.log([time <= now && time + length >= now, time + length < now, time, time + length, now]);

      if (time <= now && time + length >= now) {
        if (room !== "all") {
          await updateRoomStatus(room, status);
        } else {
          await supabase.from("rooms").update({ status }).neq("name", "randomroomname");
        }
      } else if (time + length < now) {
        if (del) {
          await supabase.from("booking").delete().eq("name", name);
        }

        if (room !== "all") {
          await updateRoomStatus(room, "available");
        } else {
          await supabase.from("rooms").update({ status: "available" }).neq("name", "randomroomname");
        }
      }
    }
  }
}

exports.handler = async (event, context) => {
  try {
    const msg = await checkforBook();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: msg }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};

exports.schedule = "*/1 * * * *";