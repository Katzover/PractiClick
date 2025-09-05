import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase server keys (stored in Netlify environment variables)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper functions
function toMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function dateToMinutes(date) {
  return date.getHours() * 60 + date.getMinutes();
}

// Replace this with your real function
async function updateRoomStatus(room, status, dummy) {
  // Example update, replace with your actual code
  await supabase.from("rooms").update({ status }).eq("name", room);
}

// The main function
async function checkforBook() {
  const { data, error } = await supabase
    .from("booking")
    .select()
    .neq("name", "randomname");

  if (!data) return;

  for (const d of data) {
    const name = d.name;
    const room = d.room;
    const status = d.status;
    const del = d.delete;

    const time = toMinutes(d.time);
    const date = d.date ? new Date(d.date) : null;
    const length = parseInt(d.length);

    if (!date) {
      const now = dateToMinutes(new Date());

      if (time <= now && time + length >= now) {
        if (del) {
          await supabase.from("booking").delete().eq("name", name);
        }

        if (room !== "all") {
          await updateRoomStatus(room, status, 0);
        } else {
          await supabase
            .from("rooms")
            .update({ status })
            .neq("name", "randomroomname");
        }
      } else if (time + length <= now) {
        if (del) {
          await supabase.from("booking").delete().eq("name", name);
        }

        if (room !== "all") {
          await updateRoomStatus(room, "available", 0);
        } else {
          await supabase
            .from("rooms")
            .update({ status: "available" })
            .neq("name", "randomroomname");
        }
      }
    }
  }
}

// Expose function to Netlify
exports.handler = async (event, context) => {
  try {
    await checkforBook();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Checked bookings" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
