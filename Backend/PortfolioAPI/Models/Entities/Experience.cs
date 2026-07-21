namespace PortfolioAPI.Models;

public class Experience
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? TitleAr { get; set; }
    public string? Company { get; set; }
    public string? CompanyAr { get; set; }
    public string? Period { get; set; }
    public string? Description { get; set; }
    public string? DescriptionAr { get; set; }
    public int SortOrder { get; set; }
}
