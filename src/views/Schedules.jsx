import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Schedules() {
  const [events, setEvents] = useState([
    { id: "1", title: "Project Meeting", start: "2025-09-30T11:00:00" },
    { id: "2", title: "Math Class", start: "2025-10-02T14:00:00" },
    { id: "3", title: "Exam Prep", start: "2025-10-05" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "" });

  const handleDateClick = (info) => {
    setNewEvent({ title: "", start: info.dateStr });
    setShowForm(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start) {
      setEvents([...events, { id: String(events.length + 1), ...newEvent }]);
      setShowForm(false);
    }
  };

  return (
    <div className="flex h-screen bg-purple-100" style={{ backgroundColor:"white"}}>
      
      {/* Main Content */}
      <main className="flex-1 p-8 my-5">
        

        {/* Calendar */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "dayGridMonth,timeGridWeek,timeGridDay",
            right: "prev,next today",
          }}
          selectable={true}
          events={events}
          dateClick={handleDateClick}
          height="80vh"
        />
      </main>

      {/* Add Event Form */}
      {showForm && (
        <aside className="w-80 bg-white shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Add Event</h3>
          <input
            type="text"
            placeholder="Event title"
            className="w-full border rounded-lg px-3 py-2 mb-3"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full border rounded-lg px-3 py-2 mb-3"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg"
              onClick={handleAddEvent}
            >
              Save
            </button>
            <button
              className="flex-1 bg-gray-200 py-2 rounded-lg"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Schedules;
