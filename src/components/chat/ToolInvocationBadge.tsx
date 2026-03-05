"use client";

import { Loader2, FilePlus, FilePen, Eye, Trash2, FolderPen } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolName: string;
  args: Record<string, any>;
  state: "call" | "partial-call" | "result";
}

function getFileName(path: string): string {
  return path.split("/").filter(Boolean).pop() ?? path;
}

function getLabel(toolName: string, args: Record<string, any>): string {
  const file = getFileName(args.path ?? "");

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":     return `Creating ${file}`;
      case "str_replace":
      case "insert":     return `Editing ${file}`;
      case "undo_edit":  return `Undoing edit in ${file}`;
      case "view":       return `Reading ${file}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": return `Renaming ${file}`;
      case "delete": return `Deleting ${file}`;
    }
  }

  return toolName;
}

function getIcon(toolName: string, args: Record<string, any>) {
  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":    return <FilePlus className="w-3.5 h-3.5" />;
      case "str_replace":
      case "insert":
      case "undo_edit": return <FilePen className="w-3.5 h-3.5" />;
      case "view":      return <Eye className="w-3.5 h-3.5" />;
    }
  }
  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": return <FolderPen className="w-3.5 h-3.5" />;
      case "delete": return <Trash2 className="w-3.5 h-3.5" />;
    }
  }
  return null;
}

export function ToolInvocationBadge({ toolName, args, state }: ToolInvocationBadgeProps) {
  const label = getLabel(toolName, args);
  const icon = getIcon(toolName, args);
  const done = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-500">{icon}</span>
      <span className="text-neutral-700 font-medium">{label}</span>
    </div>
  );
}
