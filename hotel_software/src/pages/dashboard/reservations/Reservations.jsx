import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { LuBookImage, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MdWorkHistory } from "react-icons/md";

const Reservations = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Bangladesh National Holidays 2026
  const nationalHolidays = [
    "2026-02-04", // Shab-e-Barat
    "2026-02-21", // Shaheed Dibosh
    "2026-03-17", // Shab-e-Qadr
    "2026-03-19",
    "2026-03-20",
    "2026-03-21",
    "2026-03-22",
    "2026-03-23", // Eid-ul-Fitr
    "2026-03-26", // Independence Day
    "2026-04-14", // Pohela Boishakh
    "2026-05-01", // May Day
    "2026-05-26",
    "2026-05-27",
    "2026-05-28",
    "2026-05-29",
    "2026-05-30",
    "2026-05-31", // Eid-ul-Adha
    "2026-06-26", // Ashura
    "2026-08-05", // July Mass Uprising Day
    "2026-08-15", // National Mourning Day
    "2026-08-26", // Eid-e-Milad-un-Nabi
    "2026-09-04", // Janmashtami
    "2026-10-20",
    "2026-10-21", // Durga Puja
    "2026-12-16", // Victory Day
    "2026-12-25", // Christmas
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isSpecialDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay(); // 4=Thu, 5=Fri, 6=Sat

    return (
      dayOfWeek === 4 ||
      dayOfWeek === 5 ||
      dayOfWeek === 6 ||
      nationalHolidays.includes(dateStr)
    );
  };

  const handleDayClick = (day) => {
    const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    navigate(`/dashboard/rooms/all-rooms?date=${selectedDate}&mode=reserve`);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-rose-700 flex items-center justify-center">
              <LuBookImage className="text-xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-rose-700">Reservations</h1>
          </div>
          <p className="text-gray-500 ml-13">
            Select a date to view available rooms and make a reservation.
          </p>
        </div>

        <Link to="/dashboard/reservations/reservation_history">
          <button className="btn btn-outline btn-sm border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white">
            <MdWorkHistory className="text-lg" />
            History
          </button>
        </Link>
      </div>

      {/* Live Date & Time */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6 text-center">
        <p className="text-sm text-gray-500">Current Date & Time</p>
        <p className="text-xl font-bold text-rose-700">
          {now.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-2xl font-mono text-rose-800 mt-1">
          {now.toLocaleTimeString("en-GB")}
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="btn btn-circle btn-ghost">
            <LuChevronLeft className="text-2xl" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="btn btn-circle btn-ghost">
            <LuChevronRight className="text-2xl" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-500 text-sm py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for previous month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const special = isSpecialDay(day);
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center
                  font-bold transition-all hover:scale-105 active:scale-95
                  ${
                    special
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }
                  ${isToday ? "ring-4 ring-rose-500 ring-offset-2" : ""}
                `}
              >
                <span className="text-lg">{day}</span>
                {special && (
                  <span className="text-[10px] opacity-90">Holiday</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-8 text-sm justify-center">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-green-500"></span>
            <span>Normal Day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-orange-500"></span>
            <span>Thu / Fri / Sat + National Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded ring-4 ring-rose-500 ring-offset-1"></span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
