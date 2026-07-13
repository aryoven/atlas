"use client";

export default function CreateEmployeeDialog() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0F172A] p-8 shadow-2xl">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Create AI Employee
          </h2>

          <p className="mt-2 text-gray-400">
            Step 1 of 4
          </p>

          <div className="mt-4 h-2 w-full rounded-full bg-white/10">
            <div className="h-2 w-1/4 rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="space-y-6">

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Employee Name
            </label>

            <input
              placeholder="Sales AI"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </div>

          <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500">
            Continue
          </button>

        </div>

      </div>
    </div>
  );
}