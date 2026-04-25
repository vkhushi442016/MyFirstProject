import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const EVENT_COLORS = [
  { bg: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-700" },
  { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-600" },
  { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-600" },
  { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-700" },
  { bg: "bg-sky-100", border: "border-sky-400", text: "text-sky-700" },
  { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-700" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  // 0=Sun..6=Sat → convert to Mon-based (0=Mon..6=Sun)
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

function timeToMinutes(t) {
  const [time, period] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}


export default function MyFullCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [newEvent, setNewEvent] = useState({ title: "", event_time: "", color_idx: 0 });
  const [nextId, setNextId] = useState(100);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Prev month days to fill leading blanks
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1 < 0 ? 11 : viewMonth - 1);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const openAddEvent = (dateStr) => {
    setModalDate(dateStr);
    setNewEvent({ title: "", event_time: "", color_idx: 0 });
    setShowModal(true);
  };

  const saveEvent = async () => {
    if (!newEvent.title.trim()) return;

    //post event function
    const result = await axios.post("http://localhost:5008/schoolevent", {
      title: newEvent.title,
      event_date: modalDate,
      event_time: convertTo24Hour(newEvent.event_time),
      color_idx: newEvent.color_idx
    })

    setEvents(ev => [...ev, result.data]);
    setNextId(n => n + 1);
    setShowModal(false);
  };

  const deleteEvent = async (id) => {
    const del = await axios.delete(`http://localhost:5008/schoolevent/${id}`)
    setEvents(ev => ev.filter(e => e.id !== id));
  }


  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  //get events
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      const result = await axios.get(`http://localhost:5008/schoolevent`)

      const formattedEvents = result.data.map(ev => ({
        ...ev,
        event_date: new Date(ev.event_date).toLocaleDateString("en-CA")
      }));
      setEvents(formattedEvents)
    }
    fetchCalendarEvents()
  }, [])


  function formatTime24To12(time24) {
    if (!time24) return "";
    const [hoursStr, minutesStr] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const period = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;       // midnight
    if (hours > 12) hours -= 12;       // afternoon/evening
    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  }

  //Convert to 24 Hour format before sending to database because it stores like that
  function convertTo24Hour(time) {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }

    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours}:${minutes}:00`;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-purple-500 uppercase tracking-widest">
                {MONTHS[viewMonth].slice(0, 3).toUpperCase()}
              </span>
              <span className="text-2xl font-bold text-gray-800 leading-none">
                {today.getDate()}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {MONTHS[viewMonth]} {viewYear}
              </h1>
              <p className="text-xs text-gray-400">
                {events.filter(e => e.event_date?.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`)).length} events
              </p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={() => openAddEvent(todayStr)}
            className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Event
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2 tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7" style={{ minHeight: "520px" }}>
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayOffset = i - firstDay;
            let day, dateStr, isCurrentMonth;

            if (dayOffset < 0) {
              day = prevMonthDays + dayOffset + 1;
              const pm = viewMonth === 0 ? 11 : viewMonth - 1;
              const py = viewMonth === 0 ? viewYear - 1 : viewYear;
              dateStr = toDateStr(py, pm, day);
              isCurrentMonth = false;
            } else if (dayOffset >= daysInMonth) {
              day = dayOffset - daysInMonth + 1;
              const nm = viewMonth === 11 ? 0 : viewMonth + 1;
              const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
              dateStr = toDateStr(ny, nm, day);
              isCurrentMonth = false;
            } else {
              day = dayOffset + 1;
              dateStr = toDateStr(viewYear, viewMonth, day);
              isCurrentMonth = true;
            }

            const isToday = dateStr === todayStr;
            const dayEvents = events
              .filter(e => e.event_date?.split("T")[0] === dateStr)
              .sort((a, b) => timeToMinutes(a.event_time) - timeToMinutes(b.event_time));
            const maxVisible = 3;
            const overflow = dayEvents.length - maxVisible;

            return (
              <div
                key={i}
                className={`border-b border-r border-gray-100 p-1.5 relative group cursor-pointer transition-colors
                  ${isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50"}
                  ${i % 7 === 0 ? "border-l-0" : ""}
                `}
                style={{ minHeight: "100px" }}
                onClick={() => openAddEvent(dateStr)}
              >
                <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full
                  ${isToday ? "bg-purple-500 text-white" : isCurrentMonth ? "text-gray-700" : "text-gray-300"}
                `}>
                  {day}
                </div>

                <div className="flex flex-col gap-0.5">
                  {dayEvents.slice(0, maxVisible).map(ev => {
                    const c = EVENT_COLORS[ev.color_idx % EVENT_COLORS.length];
                    return (
                      <div
                        key={ev.id}
                        className={`flex items-center justify-between rounded-lg border px-1.5 py-0.5 text-xs font-semibold ${c.bg} ${c.border} ${c.text}`}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                          setShowEventModal(true);
                        }}
                      >
                        <span className="truncate max-w-[70%]">{ev.title}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-normal opacity-80">{formatTime24To12(ev.event_time)}</span>
                          <button
                            className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition ml-0.5"
                            onClick={e => { e.stopPropagation(); deleteEvent(ev.id); }}
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {overflow > 0 && (
                    <span className="text-[10px] text-gray-400 font-medium pl-1">+{overflow} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Add Event</h2>
            <p className="text-xs text-gray-400 mb-4">{modalDate}</p>

            <label className="block text-xs font-semibold text-gray-500 mb-1">Event Title</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="e.g. Team Standup"
              value={newEvent.title}
              onChange={e => setNewEvent(n => ({ ...n, title: e.target.value }))}
            />

            <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="e.g. 9:00 AM"
              value={newEvent.event_time}
              onChange={e => setNewEvent(n => ({ ...n, event_time: e.target.value }))}
            />

            <label className="block text-xs font-semibold text-gray-500 mb-2">Color</label>
            <div className="flex gap-2 mb-4">
              {EVENT_COLORS.map((c, idx) => (
                <button
                  key={idx}
                  className={`w-6 h-6 rounded-full border-2 ${c.bg} ${newEvent.color_idx === idx ? "border-gray-600 scale-110" : "border-transparent"} transition`}
                  onClick={() => setNewEvent(n => ({ ...n, color_idx: idx }))}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEvent}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2 rounded-xl shadow transition"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {showEventModal && selectedEvent && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowEventModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Event Details
            </h2>

            <p className="text-sm mb-2">
              <strong>Title:</strong> {selectedEvent.title}
            </p>

            <p className="text-sm mb-2">
              <strong>Date:</strong> {formatDate(selectedEvent.event_date)}
            </p>

            <p className="text-sm mb-2">
              <strong>Time:</strong> {formatTime24To12(selectedEvent.event_time)}
            </p>

            <button
              onClick={() => setShowEventModal(false)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}