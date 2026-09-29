import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import App, { type Listing } from "./App";

const listings: Listing[] = [
  {
    id: "listing-1",
    source: "sample_feed",
    address: "42 Maple Street",
    city: "Arlington",
    state: "VA",
    zip: "22201",
    price: 525000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    listedDate: "2026-09-20",
    status: "active",
    description: "Bright home near parks",
  },
  {
    id: "listing-2",
    source: "sample_feed",
    address: "8 River Road",
    city: "Alexandria",
    state: "VA",
    zip: "22301",
    price: 610000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2100,
    listedDate: "2026-09-18",
    status: "pending",
    description: "Quiet street with a garden",
  },
];

describe("App", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => listings,
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("loads listings and filters them by search text", async () => {
    const { container } = render(<App />);

    expect(container).toMatchSnapshot();

    expect(
      await screen.findByRole("heading", { name: "42 Maple Street" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "8 River Road" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Search listings" }), {
      target: { value: "Arlington" },
    });

    expect(
      screen.getByRole("heading", { name: "42 Maple Street" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "8 River Road" }),
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("1 matching properties")).toBeInTheDocument(),
    );
  });
});
