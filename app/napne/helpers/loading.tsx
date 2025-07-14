export default function Loading() {
  return (
    <div className="flex flex-1 min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-700" />
        <span className="text-[#344054] text-lg font-medium">Carregando ajudantes...</span>
      </div>
    </div>
  )
} 