import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { LuBookImage, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MdWorkHistory } from "react-icons/md";
import PageHeader from "../../../components/PageHeader"; // adjust path if needed

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
    const dayOfWeek = d.getDay(); // 4 = Thu, 5 = Fri, 6 = Sat

    return (
      dayOfWeek === 4 ||
      dayOfWeek === 5 ||
      dayOfWeek === 6 ||
      nationalHolidays.includes(dateStr)
    );
  };

  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
  };

  const handleDayClick = (day) => {
    if (isPastDay(day)) return;

    const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    navigate(`/dashboard/rooms/all-rooms?date=${selectedDate}&mode=reserve`);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-5xl">
      {/* ===== Page Header (Title + History + Logout) ===== */}
      <PageHeader
        title="Reservations"
        subtitle="Select a date to view available rooms and make a reservation."
        icon={<LuBookImage className="text-xl text-white" />}
        extra={
          <Link to="/dashboard/reservations/reservation_history">
            <button className="btn btn-outline btn-sm border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white gap-2">
              <MdWorkHistory className="text-lg" />
              History
            </button>
          </Link>
        }
      />

      {/* Live Date & Time */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-8 text-center shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Current Date & Time</p>
        <p className="text-xl font-bold text-rose-900">
          {now.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-2xl font-mono text-rose-900 mt-1 tracking-wider">
          {now.toLocaleTimeString("en-GB")}
        </p>
      </div>

      {/* Calendar Card */}
      <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-6 border border-gray-100">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="btn btn-circle btn-ghost hover:bg-rose-50"
          >
            <LuChevronLeft className="text-2xl text-rose-900" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </h2>

          <button
            onClick={nextMonth}
            className="btn btn-circle btn-ghost hover:bg-rose-50"
          >
            <LuChevronRight className="text-2xl text-rose-900" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-500 text-xs sm:text-sm py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const special = isSpecialDay(day);
            const past = isPastDay(day);
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={past}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center
                  font-bold transition-all duration-200
                  ${
                    past
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                      : special
                        ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-md"
                        : "bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95 shadow-md"
                  }
                  ${isToday && !past ? "ring-4 ring-rose-500 ring-offset-2" : ""}
                `}
              >
                <span className="text-base sm:text-lg">{day}</span>
                {special && !past && (
                  <span className="text-[9px] sm:text-[10px] opacity-90 leading-none mt-0.5">
                    Holiday
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 text-sm justify-center">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-green-500 shadow-sm"></span>
            <span className="text-gray-700">Normal Day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-orange-500 shadow-sm"></span>
            <span className="text-gray-700">Thu / Fri / Sat + Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded ring-4 ring-rose-500 ring-offset-1 bg-white"></span>
            <span className="text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-100 border border-gray-300"></span>
            <span className="text-gray-700">Past Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
