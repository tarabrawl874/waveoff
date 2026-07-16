export default function LibraryPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>
      <h2 className="text-white font-semibold text-lg mb-2">Tu biblioteca</h2>
      <p className="text-gray-600 text-sm leading-relaxed">
        Las canciones que reproduzcas aparecerán aquí. Empieza explorando tendencias o buscando tu música favorita.
      </p>
    </div>
  );
}
