import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        Yangon TV Production Lab
      </h1>
      <p className="text-slate-400 mb-10 max-w-md">
        Professional subtitle editing & automated cloud distribution system for Yangon TV media team.
      </p>
      <Link href="/login" className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl font-bold transition shadow-lg shadow-cyan-900/20">
        Enter Workspace
      </Link>
    </div>
  );
}