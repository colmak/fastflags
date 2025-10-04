export function Footer() {
  const shortcuts = [
    { key: "1/2/3/4", desc: "select answer" },
    { key: "tab", desc: "restart test" },
    { key: "esc", desc: "command palette" },
  ];

  return (
    <footer className="relative z-10 p-6 text-center">
      <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-400 font-mono">
              {shortcut.key}
            </kbd>
            <span>{shortcut.desc}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}
