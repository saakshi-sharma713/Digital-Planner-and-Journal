export default function CalendarWidget() {
  return (
    <section className="px-6 py-10 bg-blue-50 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calendar</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Placeholder calendar grid */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="p-2 rounded hover:bg-blue-100 cursor-pointer"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Click a date to view events or journals.
        </p>
      </div>
    </section>
  );
}