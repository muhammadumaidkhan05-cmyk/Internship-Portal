/**
 * ProjectManagerLoggedOutPage
 * Shown after a Project Manager successfully logs out.
 * Extracted from inline JSX in App.jsx.
 */
export default function ProjectManagerLoggedOutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071426] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-[#111418] p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
            <span className="text-3xl font-bold text-green-400">✓</span>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-white">
            Successfully Logged Out
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            You have been securely logged out from the Project Manager module.
          </p>
        </div>
      </div>
    </div>
  );
}
