[There's a Hebrew version at the bottom - יש גרסא בעברית למטה](#hebrew-version)

# Practick - Music Practice Tracker

Practick is a web-based application designed to help musicians and students track their practice sessions, manage room usage, and stay motivated with features like a metronome, practice logs, weekly summaries, and a leaderboard. The app supports both English and Hebrew languages.

---

## Features

### 🎵 Practice Modes

- **Cycle Mode**:  
  Set up a series of practice cycles with customizable cycle count, length (in minutes), and break duration (in seconds). The app guides you through each cycle and break, tracking your total practice time.

- **Stopwatch Mode**:  
  A simple stopwatch to track open-ended practice sessions.

- **Timer Mode**:  
  Set a countdown timer for focused practice sessions.

### 🏠 Room Management

- **Room Status Tracking**:  
  View the status of practice rooms (Available, Taken, Unavailable) in real-time.  
  When starting a session, you are prompted to select a room. The room's status is updated automatically.

- **Automatic Room Release**:  
  Rooms marked as "taken" are automatically released after inactivity, ensuring fair usage.

- **Control Panel**:  
  An admin panel (`controlpanel1.html`) allows authorized users to manually update room statuses.

### 📝 Practice Log

- **Session Logging**:  
  Every completed session (cycle, timer, or stopwatch) is logged with the date, time, duration, and room.

- **Weekly Summary**:  
  View a breakdown of your practice time and session count for each day of the current week.

- **Auto-Reset**:  
  Logs are automatically cleared at the start of a new week to keep your data fresh.

### 🏆 Leaderboard

- **Top 10 Leaderboard**:  
  See the top 10 users with the most practice time for the current week.  
  Enter your name to appear on the leaderboard (inappropriate names are banned).

### ⏰ Practice Reminders

- **Smart Notifications**:  
  The app can send browser notifications reminding you to practice, based on your daily activity.

### 🎚️ Metronome

- **Customizable Metronome**:  
  Set BPM, accent, sound type, and volume.  
  Visual indicator and audio click help you keep time during practice.

### 🌐 Multi-language Support

- **English & Hebrew**:  
  All UI elements, logs, and summaries are available in both languages.  
  Easily switch between languages using the selector at the top.

### 💡 Additional Features

- **Responsive Design**:  
  Works well on both desktop and mobile devices.

- **Footer Shortcuts**:  
  Quick access to credits and bug report form.

- **Loading Indicators**:  
  Smooth loading overlays for all database/network operations.

---

## File Structure

- `index.html` - Main app interface
- `script.js` - All app logic (practice tracking, metronome, Supabase integration, etc.)
- `style.css` - App styling
- `controlpanel1.html` - Admin panel for room status
- `site.webmanifest` - PWA manifest
- `apks/` - (Optional) APK files for Android
- `web2apk.py` - Script for generating APKs from the web app

---

## Technologies Used

- **JavaScript (ES Modules)**
- **Supabase** (for real-time database and authentication)
- **HTML5 & CSS3**
- **PWA Support** (manifest included)

---

## Credits

- **Development**: Itamar Katzover
- **Design**: Yogev Sharon

---

## Bug Reports

Please use the [bug report form](https://forms.gle/1b3GkAFXpf7WXGt1A) for any issues or suggestions.

---

<a id="hebrew-version"></a>

# פרקטיק - מעקב אימון מוזיקלי

פרקטיק היא אפליקציה מבוססת דפדפן לניהול ומעקב אחרי אימונים מוזיקליים, ניהול חדרי תרגול, יומן אימונים, סיכום שבועי, מטרונום, ולוח תוצאות. האפליקציה תומכת בעברית ובאנגלית.

---

## תכונות עיקריות

### 🎵 מצבי אימון

- **מצב סבב**  
  הגדרת מספר סבבים, אורך כל סבב (בדקות) וזמן הפסקה (בשניות). האפליקציה תדריך אותך בין סבב להפסקה ותחשב את זמן האימון הכולל.

- **סטופר**  
  סטופר פשוט למדידת זמן אימון חופשי.

- **טיימר**  
  הגדרת טיימר לאימון ממוקד.

### 🏠 ניהול חדרים

- **מעקב מצב חדרים**  
  צפייה במצב החדרים (פנוי, תפוס, לא זמין) בזמן אמת.  
  בתחילת אימון תתבקש לבחור חדר, והסטטוס יתעדכן אוטומטית.

- **שחרור אוטומטי**  
  חדרים תפוסים משתחררים אוטומטית לאחר חוסר פעילות.

- **פאנל ניהול**  
  פאנל ניהול (`controlpanel1.html`) מאפשר לעדכן סטטוס חדרים ידנית.

### 📝 יומן אימון

- **רישום סשנים**  
  כל סשן אימון נשמר עם תאריך, שעה, משך וחדר.

- **סיכום שבועי**  
  פירוט זמן האימון ומספר הסשנים לכל יום בשבוע הנוכחי.

- **איפוס אוטומטי**  
  היומן מתאפס אוטומטית בתחילת שבוע חדש.

### 🏆 לוח תוצאות

- **10 המובילים השבוע**  
  הצגת המשתמשים עם הכי הרבה זמן אימון השבוע.  
  יש להזין שם (שמות לא הולמים ייחסמו).

### ⏰ תזכורות לאימון

- **התראות חכמות**  
  האפליקציה יכולה לשלוח התראות דפדפן לתזכורת לאימון, בהתאם לפעילות היומית שלך.

### 🎚️ מטרונום

- **מטרונום מתקדם**  
  הגדרת BPM, הדגשה, סוג צליל ועוצמה.  
  אינדיקטור חזותי וצליל קצב.

### 🌐 תמיכה בשפות

- **עברית ואנגלית**  
  כל הממשק, היומן והסיכומים זמינים בשתי השפות.  
  ניתן להחליף שפה בקלות מהתפריט העליון.

### 💡 תוספות

- **עיצוב רספונסיבי**  
  מתאים לדסקטופ ולנייד.

- **קיצורי דרך בתחתית**  
  גישה מהירה לקרדיטים וטופס דיווח תקלות.

- **אנימציות טעינה**  
  חווית משתמש חלקה בכל פעולה.

---

## מבנה קבצים

- `index.html` - ממשק ראשי
- `script.js` - לוגיקת האפליקציה (מעקב, מטרונום, אינטגרציה עם Supabase ועוד)
- `style.css` - עיצוב
- `controlpanel1.html` - פאנל ניהול חדרים
- `site.webmanifest` - קובץ PWA
- `apks/` - (אופציונלי) קבצי APK לאנדרואיד
- `web2apk.py` - סקריפט ליצירת APK מהאפליקציה

---

## טכנולוגיות

- **JavaScript (ES Modules)**
- **Supabase** (מסד נתונים בזמן אמת ואימות)
- **HTML5 & CSS3**
- **תמיכה ב-PWA**

---

## קרדיטים

- **פיתוח**: איתמר קצובר  
- **עיצוב**: יוגב שרון

---

## דיווח תקלות

יש להשתמש ב[טופס הדיווח](https://forms.gle/1b3GkAFXpf7WXGt1A) לכל
