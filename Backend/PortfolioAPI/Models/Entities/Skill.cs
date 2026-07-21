namespace PortfolioAPI.Models;

public class Skill
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? NameAr { get; set; }
    public string Category { get; set; } = "Technical";
    public string? CategoryAr { get; set; }
    public int Percentage { get; set; }
    public int SortOrder { get; set; }
    public string Type { get; set; } = "Design";
}
