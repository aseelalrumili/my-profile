namespace PortfolioAPI.Models;

public class BlogPost
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? TitleAr { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? ContentAr { get; set; }
    public string? Excerpt { get; set; }
    public string? ExcerptAr { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? Author { get; set; }
    public string? Tags { get; set; }
    public bool Published { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
