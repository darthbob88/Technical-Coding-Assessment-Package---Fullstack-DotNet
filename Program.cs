using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173") // Vite default port
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowReactApp");
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/api/listings", async (IWebHostEnvironment environment) =>
{
    var listingsPath = Path.Combine(environment.ContentRootPath, "sample_listings.json");
    var listingsJson = await File.ReadAllTextAsync(listingsPath);
    var listings = JsonSerializer.Deserialize<List<Listing>>(
        listingsJson,
        new JsonSerializerOptions(JsonSerializerDefaults.Web));

    return Results.Ok(listings ?? []);
});

app.Run();

record Listing(
    string Id,
    string Source,
    string Address,
    string City,
    string State,
    string Zip,
    int Price,
    int Bedrooms,
    double Bathrooms,
    int Sqft,
    double Latitude,
    double Longitude,
    DateOnly ListedDate,
    string Status,
    string Description);
