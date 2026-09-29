import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { ListingCard } from "./ListingCard";
import { Listing } from "./App";

describe("ListingCard", () => {
  const listing: Listing = {
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
  };

  it("loads a saved listing and looks right", async () => {
    const { container } = render(
      <ListingCard
        listing={listing}
        photoURL={`https://images.unsplash.com/${"photo-1600585154340-be6161a56a0c"}?auto=format&fit=crop&w=900&q=82`}
        saveListing={function (listingId: string): void {
          throw new Error("Function not implemented.");
        }}
        isSaved={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

   it("loads an unsaved listing and looks right", async () => {
    const { container } = render(
      <ListingCard
        listing={listing}
        photoURL={`https://images.unsplash.com/${"photo-1600585154340-be6161a56a0c"}?auto=format&fit=crop&w=900&q=82`}
        saveListing={function (listingId: string): void {
          throw new Error("Function not implemented.");
        }}
        isSaved={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
