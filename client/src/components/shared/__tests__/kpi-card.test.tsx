import { expect, describe, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "../kpi-card";
import type { KpiTone } from "../kpi-card";

// A minimal icon stub matching ComponentType<SVGProps & { size?: number }>
function TestIcon() {
  return <svg data-testid="icon" />;
}

// ── Rendering ────────────────────────────────────────────────────────────────

describe("<KpiCard />", () => {
  it("renders the value", () => {
    render(<KpiCard icon={TestIcon} value="42" label="Items" />);
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("renders the label", () => {
    render(<KpiCard icon={TestIcon} value="42" label="Total Users" />);
    expect(screen.getByText("Total Users")).toBeTruthy();
  });

  it("renders the description when provided", () => {
    render(<KpiCard icon={TestIcon} value="42" label="Items" description="Across all cohorts" />);
    expect(screen.getByText("Across all cohorts")).toBeTruthy();
  });

  it("does not render description element when omitted", () => {
    const { container } = render(<KpiCard icon={TestIcon} value="42" label="Items" />);
    // No description div should be present
    const descriptionDivs = container.querySelectorAll(".text-xs");
    expect(descriptionDivs.length).toBe(0);
  });

  it("renders the icon", () => {
    const { container } = render(<KpiCard icon={TestIcon} value="0" label="Test" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders numeric value", () => {
    render(<KpiCard icon={TestIcon} value={1234} label="Count" />);
    expect(screen.getByText("1234")).toBeTruthy();
  });

  const tones: KpiTone[] = ["blue", "cyan", "red", "amber", "violet", "green"];
  for (const tone of tones) {
    it(`renders tone '${tone}' without crashing`, () => {
      expect(() => render(<KpiCard icon={TestIcon} value="0" label="Test" tone={tone} />)).not.toThrow();
    });
  }
});
