"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  defaultLanguage?: string;
  defaultValue?: string;
  height?: string;
}

export default function CodeEditor({ defaultLanguage = "yaml", defaultValue = "", height = "300px" }: CodeEditorProps) {
  const [output, setOutput] = useState("");
  const [code, setCode] = useState(defaultValue);

  const runCode = () => {
    if (defaultLanguage === "yaml") {
      try {
        if (code.includes("apiVersion") && code.includes("kind")) {
          setOutput("✅ YAML valide ! Structure Kubernetes détectée.");
        } else if (code.trim().startsWith("-") || code.includes(":")) {
          setOutput("✅ YAML valide !");
        } else {
          setOutput("❌ YAML invalide. Vérifiez l'indentation.");
        }
      } catch { setOutput("❌ Erreur de parsing YAML"); }
    } else if (defaultLanguage === "shell") {
      setOutput("💡 Les commandes bash ne peuvent pas être exécutées ici.\nUtilisez le terminal Killercoda ci-dessous pour tester en vrai !");
    } else if (defaultLanguage === "hcl") {
      if (code.includes("resource") || code.includes("variable") || code.includes("provider")) {
        setOutput("✅ HCL valide ! Configuration Terraform détectée.");
      } else {
        setOutput("💡 Écrivez un bloc resource, variable ou provider.");
      }
    } else {
      setOutput("✅ Code enregistré.");
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden my-4">
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <span className="text-sm text-gray-300 font-mono">{defaultLanguage}</span>
        <button onClick={runCode} className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
          ▶ Exécuter
        </button>
      </div>
      <Editor
        height={height}
        defaultLanguage={defaultLanguage}
        value={code}
        onChange={(v) => setCode(v || "")}
        theme="vs-dark"
        options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on" }}
      />
      {output && (
        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700">
          <pre className="text-sm text-green-400 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
