namespace PortfolioAPI.Models;

public class ProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? TitleAr { get; set; }
    public string? Description { get; set; }
    public string? DescriptionAr { get; set; }
    public string Type { get; set; } = "Design";
    public string? Category { get; set; }
    public string? TechStack { get; set; }
    public string? LiveUrl { get; set; }
    public string? Problem { get; set; }
    public string? ProblemAr { get; set; }
    public string? Solution { get; set; }
    public string? SolutionAr { get; set; }
    public string? Role { get; set; }
    public string? RoleAr { get; set; }
    public string? Impact { get; set; }
    public string? ImpactAr { get; set; }
    public int SortOrder { get; set; }
    public List<MediaDto> Media { get; set; } = new();
}

public class MediaDto
{
    public int Id { get; set; }
    public string MediaType { get; set; } = "Image";
    public string Url { get; set; } = string.Empty;
    public string? FileName { get; set; }
    public bool IsPrimary { get; set; }
}
