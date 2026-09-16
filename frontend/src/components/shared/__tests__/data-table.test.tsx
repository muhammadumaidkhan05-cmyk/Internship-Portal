import { expect, describe, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type Column } from "../data-table";

interface Row {
  id: number;
  name: string;
  score: number;
}

const ROWS: Row[] = [
  { id: 1, name: "Alice", score: 90 },
  { id: 2, name: "Bob", score: 70 },
  { id: 3, name: "Carol", score: 80 },
];

const COLS: Column<Row>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    sortFn: (a: Row, b: Row) => a.name.localeCompare(b.name),
  },
  {
    key: "score",
    header: "Score",
    sortable: true,
    sortFn: (a: Row, b: Row) => a.score - b.score,
  },
];

// ── Empty state ──────────────────────────────────────────────────────────────

describe("<DataTable /> — empty state", () => {
  it("shows default empty text when rows is empty", () => {
    render(<DataTable columns={COLS} rows={[]} rowKey={(r: Row) => r.id} />);
    expect(screen.getByText("No records found.")).toBeTruthy();
  });

  it("shows custom emptyText", () => {
    render(
      <DataTable columns={COLS} rows={[]} rowKey={(r: Row) => r.id} emptyText="Nothing here yet." />
    );
    expect(screen.getByText("Nothing here yet.")).toBeTruthy();
  });
});

// ── Data rendering ───────────────────────────────────────────────────────────

describe("<DataTable /> — data rendering", () => {
  it("renders all rows", () => {
    render(<DataTable columns={COLS} rows={ROWS} rowKey={(r: Row) => r.id} />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
    expect(screen.getByText("Carol")).toBeTruthy();
  });

  it("renders column headers", () => {
    render(<DataTable columns={COLS} rows={ROWS} rowKey={(r: Row) => r.id} />);
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Score")).toBeTruthy();
  });

  it("renders footer when provided", () => {
    render(
      <DataTable
        columns={COLS}
        rows={ROWS}
        rowKey={(r: Row) => r.id}
        footer={<span>3 results</span>}
      />
    );
    expect(screen.getByText("3 results")).toBeTruthy();
  });
});

// ── Internal sort ────────────────────────────────────────────────────────────

describe("<DataTable /> — internal sort", () => {
  it("sorts ascending by name on first header click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={COLS} rows={ROWS} rowKey={(r: Row) => r.id} />);

    await user.click(screen.getByRole("button", { name: /Name/i }));

    const cells = screen.getAllByRole("cell");
    const names = cells.filter((c) => ["Alice", "Bob", "Carol"].includes(c.textContent ?? ""));
    expect(names.map((n) => n.textContent)).toEqual(["Alice", "Bob", "Carol"]);
  });

  it("reverses sort on second header click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={COLS} rows={ROWS} rowKey={(r: Row) => r.id} />);

    const btn = screen.getByRole("button", { name: /Name/i });
    await user.click(btn); // asc
    await user.click(btn); // desc

    const cells = screen.getAllByRole("cell");
    const names = cells.filter((c) => ["Alice", "Bob", "Carol"].includes(c.textContent ?? ""));
    expect(names.map((n) => n.textContent)).toEqual(["Carol", "Bob", "Alice"]);
  });
});

// ── Controlled sort ──────────────────────────────────────────────────────────

describe("<DataTable /> — controlled sort", () => {
  it("calls onSortChange with correct key and dir on first click", async () => {
    const user = userEvent.setup();
    const onSortChange = mock();
    render(
      <DataTable columns={COLS} rows={ROWS} rowKey={(r: Row) => r.id} onSortChange={onSortChange} />
    );

    await user.click(screen.getByRole("button", { name: /Name/i }));
    expect(onSortChange).toHaveBeenCalledWith("name", "asc");
  });

  it("calls onSortChange with 'desc' when same column clicked with currentSortDir=asc", async () => {
    const user = userEvent.setup();
    const onSortChange = mock();
    render(
      <DataTable
        columns={COLS}
        rows={ROWS}
        rowKey={(r: Row) => r.id}
        currentSortKey="name"
        currentSortDir="asc"
        onSortChange={onSortChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /Name/i }));
    expect(onSortChange).toHaveBeenCalledWith("name", "desc");
  });
});
