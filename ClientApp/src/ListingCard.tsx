import { Heart } from "lucide-react";
import { Listing, money } from "./App";

const photos = [
  "photo-1600596542815-ffad4c1539a9",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600566753086-00f18fb6b3ea",
  "photo-1600047509807-ba8f99d2cdde",
  "photo-1600607687920-4e2a09cf159d",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600566753190-17f0baa2a6c3",
];

export const ListingCard: React.FC<{
  listing: Listing;
  index: number;
  saveListing: (listingId: string) => void;
  isSaved: boolean;
}> = ({ listing, index, saveListing, isSaved }) => {
  return (
    <article className="listing-card" key={listing.id}>
      <div
        className="listing-photo"
        style={{
          backgroundImage: `url(https://images.unsplash.com/${photos[index % photos.length]}?auto=format&fit=crop&w=900&q=82)`,
        }}
      >
        <span className={`status-badge ${listing.status}`}>
          <i />
          {listing.status}
        </span>
        <button
          className={isSaved ? "save saved" : "save"}
          onClick={() => saveListing(listing.id)}
          aria-label={isSaved ? "Unsave listing" : "Save listing"}
        >
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <span className="source-badge">{listing.source.replace("_", " ")}</span>
      </div>
      <div className="card-body">
        <div className="price-line">
          <strong>{money(listing.price)}</strong>
          <span>
            {Math.round(listing.price / listing.sqft).toLocaleString()}{" "}
            <small>/ sqft</small>
          </span>
        </div>
        <h3>{listing.address}</h3>
        <p className="location">
          {listing.city}, {listing.state} {listing.zip}
        </p>
        <div className="specs">
          <span>
            <b>{listing.bedrooms}</b> beds
          </span>
          <i />
          <span>
            <b>{listing.bathrooms}</b> baths
          </span>
          <i />
          <span>
            <b>{listing.sqft.toLocaleString()}</b> sqft
          </span>
        </div>
        <p className="description">{listing.description}</p>
        <div className="card-foot">
          <span>
            Listed{" "}
            {new Date(`${listing.listedDate}T00:00:00`).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              },
            )}
          </span>
          <span className="listing-id">ID {listing.id}</span>
        </div>
      </div>
    </article>
  );
};
