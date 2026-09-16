import { expect, describe, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { StatusBadge, statusToneFor } from "../status-badge";
import type { StatusTone } from "../status-badge";

// ── statusToneFor ────────────────────────────────────────────────────────────

describe("statusToneFor()", () => {
  const cases: [string, StatusTone][] = [
    ["active", "blue"],
    ["ok", "blue"],
    ["healthy", "blue"],
    ["in_progress", "cyan"],
    ["in progress", "cyan"],
    ["pending", "cyan"],
    ["completed", "green"],
    ["approved", "green"],
    ["inactive", "amber"],
    ["suspended", "red"],
    ["failed", "red"],
    ["critical", "red"],
    ["archived", "neutral"],
    ["unknown_value", "neutral"],
  ];

  for (const [input, expected] of cases) {
    it(`maps '${input}' → '${expected}'`, () => {
      expect(statusToneFor(input)).toBe(expected);
    });
  }
});

// ── StatusBadge ──────────────────────────────────────────────────────────────

describe("<StatusBadge />", () => {
  it("renders children text", () => {
    render(<StatusBadge tone="blue">Active</StatusBadge>);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders the leading dot by default", () => {
    const { container } = render(<StatusBadge tone="blue">Active</StatusBadge>);
    const dots = container.querySelectorAll("span[aria-hidden]");
    expect(dots.length).toBeGreaterThan(0);
  });

  it("does not render a dot when dot=false", () => {
    const { container } = render(
      <StatusBadge tone="blue" dot={false}>
        Active
      </StatusBadge>
    );
    const dots = container.querySelectorAll("span[aria-hidden]");
    expect(dots.length).toBe(0);
  });

  it("applies extra className", () => {
    const { container } = render(
      <StatusBadge tone="green" className="my-custom-class">
        OK
      </StatusBadge>
    );
    expect(container.firstChild?.nodeType).toBeDefined();
    // Simple workaround for toHaveClass since we aren't using jest-dom matchers
    expect(container.innerHTML.includes("my-custom-class")).toBe(true);
  });

  const tones: StatusTone[] = ["blue", "cyan", "red", "amber", "violet", "green", "neutral"];
  for (const tone of tones) {
    it(`renders tone '${tone}' without crashing`, () => {
      expect(() => render(<StatusBadge tone={tone}>Label</StatusBadge>)).not.toThrow();
    });
  }
});
