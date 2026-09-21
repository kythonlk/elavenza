import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 bg-[#FAF9F5] text-[#242A24]">
      <div className="max-w-md w-full mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase bg-[#E8EFE6] text-[#3D5634]">
          Under Construction
        </span>
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#1E261D]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          Site In Progress
        </h1>
        <p className="text-sm sm:text-base text-[#5D665B] leading-relaxed">
          This section is currently undergoing a mindful refresh as we prepare our full botanical collection.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-white bg-[#3D5634] hover:bg-[#2C3E25] transition-colors shadow-sm"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
