export default function AdminFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-6 py-4 mt-auto">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} DiDoo Admin. All rights reserved.</p>
        <p>Version 1.0.0</p>
      </div>
    </footer>
  );
}
