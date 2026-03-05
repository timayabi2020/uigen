import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

describe("ToolInvocationBadge", () => {
  describe("str_replace_editor labels", () => {
    it("shows 'Creating <filename>' for create command", () => {
      render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/components/Button.tsx" }} state="call" />);
      expect(screen.getByText("Creating Button.tsx")).toBeDefined();
    });

    it("shows 'Editing <filename>' for str_replace command", () => {
      render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "str_replace", path: "/App.jsx" }} state="call" />);
      expect(screen.getByText("Editing App.jsx")).toBeDefined();
    });

    it("shows 'Editing <filename>' for insert command", () => {
      render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "insert", path: "/utils/helpers.ts" }} state="call" />);
      expect(screen.getByText("Editing helpers.ts")).toBeDefined();
    });

    it("shows 'Reading <filename>' for view command", () => {
      render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "view", path: "/utils/helpers.ts" }} state="call" />);
      expect(screen.getByText("Reading helpers.ts")).toBeDefined();
    });

    it("shows 'Undoing edit in <filename>' for undo_edit command", () => {
      render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "undo_edit", path: "/App.jsx" }} state="call" />);
      expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
    });
  });

  describe("file_manager labels", () => {
    it("shows 'Renaming <filename>' for rename command", () => {
      render(<ToolInvocationBadge toolName="file_manager" args={{ command: "rename", path: "/old.tsx", new_path: "/new.tsx" }} state="call" />);
      expect(screen.getByText("Renaming old.tsx")).toBeDefined();
    });

    it("shows 'Deleting <filename>' for delete command", () => {
      render(<ToolInvocationBadge toolName="file_manager" args={{ command: "delete", path: "/components/Unused.tsx" }} state="call" />);
      expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
    });
  });

  describe("unknown tools", () => {
    it("falls back to the raw tool name", () => {
      render(<ToolInvocationBadge toolName="some_unknown_tool" args={{}} state="call" />);
      expect(screen.getByText("some_unknown_tool")).toBeDefined();
    });
  });

  describe("state indicators", () => {
    it("shows a spinner when pending", () => {
      const { container } = render(
        <ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.jsx" }} state="call" />
      );
      expect(container.querySelector(".animate-spin")).toBeDefined();
    });

    it("shows a green dot when done and no spinner", () => {
      const { container } = render(
        <ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.jsx" }} state="result" />
      );
      expect(container.querySelector(".bg-emerald-500")).toBeDefined();
      expect(container.querySelector(".animate-spin")).toBeNull();
    });
  });

  describe("path handling", () => {
    it("extracts the filename from a nested path", () => {
      render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/components/ui/Card.tsx" }} state="call" />);
      expect(screen.getByText("Creating Card.tsx")).toBeDefined();
    });

    it("uses the full value when path has no slashes", () => {
      render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "App.jsx" }} state="call" />);
      expect(screen.getByText("Creating App.jsx")).toBeDefined();
    });
  });
});
