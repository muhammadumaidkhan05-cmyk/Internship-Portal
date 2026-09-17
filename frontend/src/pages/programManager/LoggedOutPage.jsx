/**
 * ProgramManagerLoggedOutPage
 * Shown after a Program Manager successfully logs out.
 * Extracted from inline JSX in App.jsx.
 */
export default function ProgramManagerLoggedOutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB] px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400" />

        <div className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-green-50">
            <span className="text-3xl font-bold text-green-500">✓</span>
          </div>

          <h1 className="mt-5 text-2xl font-black text-[#172033]">
            Successfully Logged Out
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            You have been securely logged out from the Program Manager module.
          </p>
        </div>
      </div>
    </div>
  );
}
