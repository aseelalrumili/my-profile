namespace PortfolioAPI.Models;

public class Testimonial
{
    public int Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? ClientNameAr { get; set; }
    public string? ClientTitle { get; set; }
    public string? ClientTitleAr { get; set; }
    public string? Content { get; set; }
    public string? ContentAr { get; set; }
    public int Rating { get; set; } = 5;
    public string? AvatarUrl { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
