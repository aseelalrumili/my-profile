namespace PortfolioAPI.Models;

public class Profile
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? FullNameAr { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string? JobTitleAr { get; set; }
    public string? Bio { get; set; }
    public string? BioAr { get; set; }
    public string? PhotoUrl { get; set; }
    public string? ResumeUrl { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Location { get; set; }
    public string? LocationAr { get; set; }
    public string HeroEffect { get; set; } = "Parallax";
    public string ThemeColor { get; set; } = "#6366f1";
    public int StatsProjects { get; set; }
    public int StatsExperience { get; set; }
    public int StatsClients { get; set; }
    public int StatsAwards { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
