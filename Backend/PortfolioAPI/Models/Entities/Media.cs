namespace PortfolioAPI.Models;

public class Media
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string MediaType { get; set; } = "Image";
    public string Url { get; set; } = string.Empty;
    public string? FileName { get; set; }
    public bool IsPrimary { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Project? Project { get; set; }
}
