"use client";

export default function TerminalEmbed({ scenario }: { scenario?: string }) {
  const url = scenario || "https://killercoda.com/playgrounds/scenario/ubuntu";

  return (
    <div className="my-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-300 ml-2 font-mono">Terminal Linux</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
          Ouvrir en plein écran ↗
        </a>
      </div>
      <iframe
        src={url}
        className="w-full h-[500px] bg-black"
        title="Terminal interactif"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
