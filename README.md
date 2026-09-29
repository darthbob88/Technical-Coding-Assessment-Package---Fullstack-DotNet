This is my submission for the coding assessment. I created the ASP.NET project, asked Github Copilot to add a React Frontend, and it spit out this, or at least the first commit. I have since edited it to better fit the spec.

To run: `dotnet run` in the top-level file, then `cd ClientApp` and `npm run dev` to get the developer build.

Target budget scoring: I couldn't think of a much better solution, so it's just `Math.abs(listing.price - targetBudget)`. I don't know what to do with recency there.

Pagination: I'm not sure how much pagination to do with only 12 listings.