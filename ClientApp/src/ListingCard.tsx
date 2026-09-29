import { Heart } from "lucide-react";
import { Listing, money } from "./App";

export const ListingCard: React.FC<{
  listing: Listing;
  photoURL: string;
  saveListing: (listingId: string) => void;
  isSaved: boolean;
}> = ({ listing, photoURL, saveListing, isSaved }) => {
  return (
    <article className="listing-card" key={listing.id}>
      <div
        className="listing-photo"
        style={{
          backgroundImage: `url(${photoURL})`,
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
