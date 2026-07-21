namespace PortfolioAPI.Models;

public class Education
{
    public int Id { get; set; }
    public string Degree { get; set; } = string.Empty;
    public string? DegreeAr { get; set; }
    public string? Institution { get; set; }
    public string? InstitutionAr { get; set; }
    public string? Period { get; set; }
    public string? Description { get; set; }
    public string? DescriptionAr { get; set; }
    public int SortOrder { get; set; }
}
