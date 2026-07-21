namespace PortfolioAPI.Models;

public class Visitor
{
    public int Id { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? Page { get; set; }
    public DateTime VisitedAt { get; set; } = DateTime.UtcNow;
}
