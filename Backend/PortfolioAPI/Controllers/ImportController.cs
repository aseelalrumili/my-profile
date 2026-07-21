using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using System.Text.Json;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ImportController : ControllerBase
{
    private readonly AppDbContext _context;

    public ImportController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Import([FromBody] JsonElement payload)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var socialLinks = payload.TryGetProperty("socialLinks", out var sl) ? sl : default;
            var skills = payload.TryGetProperty("skills", out var sk) ? sk : default;
            var experience = payload.TryGetProperty("experience", out var ex) ? ex : default;
            var education = payload.TryGetProperty("education", out var ed) ? ed : default;
            var projects = payload.TryGetProperty("projects", out var pr) ? pr : default;
            var certifications = payload.TryGetProperty("certifications", out var ct) ? ct : default;
            var blogPosts = payload.TryGetProperty("blogPosts", out var bp) ? bp : default;
            var testimonials = payload.TryGetProperty("testimonials", out var ts) ? ts : default;
            var settings = payload.TryGetProperty("settings", out var st) ? st : default;

            // --- Profile ---
            if (payload.TryGetProperty("profile", out var profileEl) && profileEl.ValueKind == JsonValueKind.Object)
            {
                var profile = await _context.Profiles.FindAsync(1) ?? new Profile { Id = 1 };
                profile.FullName = profileEl.GetStringOrDefault("fullName", profile.FullName);
                profile.FullNameAr = profileEl.GetStringOrDefault("fullNameAr", profile.FullNameAr);
                profile.JobTitle = profileEl.GetStringOrDefault("jobTitle", profile.JobTitle);
                profile.JobTitleAr = profileEl.GetStringOrDefault("jobTitleAr", profile.JobTitleAr);
                profile.Bio = profileEl.GetStringOrDefault("bio", profile.Bio);
                profile.BioAr = profileEl.GetStringOrDefault("bioAr", profile.BioAr);
                profile.Email = profileEl.GetStringOrDefault("email", profile.Email);
                profile.Phone = profileEl.GetStringOrDefault("phone", profile.Phone);
                profile.Location = profileEl.GetStringOrDefault("location", profile.Location);
                profile.LocationAr = profileEl.GetStringOrDefault("locationAr", profile.LocationAr);
                profile.PhotoUrl = profileEl.GetStringOrDefault("photoUrl", profile.PhotoUrl);
                profile.ResumeUrl = profileEl.GetStringOrDefault("resumeUrl", profile.ResumeUrl);
                if (profileEl.TryGetProperty("heroEffect", out var he) && he.ValueKind != JsonValueKind.Null)
                    profile.HeroEffect = he.GetString() ?? profile.HeroEffect;
                if (profileEl.TryGetProperty("themeColor", out var tc) && tc.ValueKind != JsonValueKind.Null)
                    profile.ThemeColor = tc.GetString() ?? profile.ThemeColor;
                if (profileEl.TryGetProperty("statsProjects", out var sp) && sp.ValueKind != JsonValueKind.Null)
                    profile.StatsProjects = sp.GetInt32();
                if (profileEl.TryGetProperty("statsExperience", out var se) && se.ValueKind != JsonValueKind.Null)
                    profile.StatsExperience = se.GetInt32();
                if (profileEl.TryGetProperty("statsClients", out var sc) && sc.ValueKind != JsonValueKind.Null)
                    profile.StatsClients = sc.GetInt32();
                if (profileEl.TryGetProperty("statsAwards", out var sa) && sa.ValueKind != JsonValueKind.Null)
                    profile.StatsAwards = sa.GetInt32();
                profile.UpdatedAt = DateTime.UtcNow;

                if (profile.Id == 1 && !_context.Profiles.Any(p => p.Id == 1))
                    _context.Profiles.Add(profile);
            }

            // --- Clear & Replace: SocialLinks ---
            _context.SocialLinks.RemoveRange(_context.SocialLinks);
            if (socialLinks.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in socialLinks.EnumerateArray())
                {
                    _context.SocialLinks.Add(new SocialLink
                    {
                        Platform = item.GetStringOrDefault("platform", ""),
                        Url = item.GetStringOrDefault("url", ""),
                        Icon = item.GetStringOrDefault("icon", ""),
                        SortOrder = item.GetInt32OrDefault("sortOrder")
                    });
                }
            }

            // --- Clear & Replace: Skills ---
            _context.Skills.RemoveRange(_context.Skills);
            if (skills.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in skills.EnumerateArray())
                {
                    _context.Skills.Add(new Skill
                    {
                        Name = item.GetStringOrDefault("name", ""),
                        NameAr = item.GetStringOrDefault("nameAr", null),
                        Category = item.GetStringOrDefault("category", "Technical"),
                        CategoryAr = item.GetStringOrDefault("categoryAr", null),
                        Percentage = item.GetInt32OrDefault("percentage"),
                        SortOrder = item.GetInt32OrDefault("sortOrder")
                    });
                }
            }

            // --- Clear & Replace: Experience ---
            _context.Experiences.RemoveRange(_context.Experiences);
            if (experience.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in experience.EnumerateArray())
                {
                    _context.Experiences.Add(new Experience
                    {
                        Title = item.GetStringOrDefault("title", ""),
                        TitleAr = item.GetStringOrDefault("titleAr", null),
                        Company = item.GetStringOrDefault("company", null),
                        CompanyAr = item.GetStringOrDefault("companyAr", null),
                        Period = item.GetStringOrDefault("period", null),
                        Description = item.GetStringOrDefault("description", null),
                        DescriptionAr = item.GetStringOrDefault("descriptionAr", null),
                        SortOrder = item.GetInt32OrDefault("sortOrder")
                    });
                }
            }

            // --- Clear & Replace: Education ---
            _context.Educations.RemoveRange(_context.Educations);
            if (education.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in education.EnumerateArray())
                {
                    _context.Educations.Add(new Education
                    {
                        Degree = item.GetStringOrDefault("degree", ""),
                        DegreeAr = item.GetStringOrDefault("degreeAr", null),
                        Institution = item.GetStringOrDefault("institution", null),
                        InstitutionAr = item.GetStringOrDefault("institutionAr", null),
                        Period = item.GetStringOrDefault("period", null),
                        Description = item.GetStringOrDefault("description", null),
                        DescriptionAr = item.GetStringOrDefault("descriptionAr", null),
                        SortOrder = item.GetInt32OrDefault("sortOrder")
                    });
                }
            }

            // --- Clear & Replace: Projects (with Media) ---
            var existingMedia = await _context.Media.ToListAsync();
            _context.Media.RemoveRange(existingMedia);
            _context.Projects.RemoveRange(_context.Projects);
            if (projects.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in projects.EnumerateArray())
                {
                    var project = new Project
                    {
                        Title = item.GetStringOrDefault("title", ""),
                        TitleAr = item.GetStringOrDefault("titleAr", null),
                        Description = item.GetStringOrDefault("description", null),
                        DescriptionAr = item.GetStringOrDefault("descriptionAr", null),
                        Type = item.GetStringOrDefault("type", "Design"),
                        Category = item.GetStringOrDefault("category", null),
                        TechStack = item.GetStringOrDefault("techStack", null),
                        LiveUrl = item.GetStringOrDefault("liveUrl", null),
                        SortOrder = item.GetInt32OrDefault("sortOrder"),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Projects.Add(project);
                    await _context.SaveChangesAsync();

                    if (item.TryGetProperty("media", out var mediaArr) && mediaArr.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var m in mediaArr.EnumerateArray())
                        {
                            _context.Media.Add(new Media
                            {
                                ProjectId = project.Id,
                                MediaType = m.GetStringOrDefault("mediaType", "Image"),
                                Url = m.GetStringOrDefault("url", ""),
                                FileName = m.GetStringOrDefault("fileName", null),
                                IsPrimary = m.GetBooleanOrDefault("isPrimary")
                            });
                        }
                    }
                }
            }

            // --- Clear & Replace: Certifications ---
            _context.Certifications.RemoveRange(_context.Certifications);
            if (certifications.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in certifications.EnumerateArray())
                {
                    _context.Certifications.Add(new Certification
                    {
                        Name = item.GetStringOrDefault("name", ""),
                        NameAr = item.GetStringOrDefault("nameAr", null),
                        Issuer = item.GetStringOrDefault("issuer", null),
                        IssuerAr = item.GetStringOrDefault("issuerAr", null),
                        IssueDate = item.GetStringOrDefault("issueDate", null),
                        ExpiryDate = item.GetStringOrDefault("expiryDate", null),
                        CredentialUrl = item.GetStringOrDefault("credentialUrl", null),
                        LogoUrl = item.GetStringOrDefault("logoUrl", null),
                        ImageUrl1 = item.GetStringOrDefault("imageUrl1", null),
                        ImageUrl2 = item.GetStringOrDefault("imageUrl2", null),
                        ImageUrl3 = item.GetStringOrDefault("imageUrl3", null),
                        Category = item.GetStringOrDefault("category", "Technical"),
                        CategoryAr = item.GetStringOrDefault("categoryAr", null),
                        SortOrder = item.GetInt32OrDefault("sortOrder")
                    });
                }
            }

            // --- Clear & Replace: BlogPosts ---
            _context.BlogPosts.RemoveRange(_context.BlogPosts);
            if (blogPosts.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in blogPosts.EnumerateArray())
                {
                    _context.BlogPosts.Add(new BlogPost
                    {
                        Title = item.GetStringOrDefault("title", ""),
                        TitleAr = item.GetStringOrDefault("titleAr", null),
                        Slug = item.GetStringOrDefault("slug", ""),
                        Content = item.GetStringOrDefault("content", null),
                        ContentAr = item.GetStringOrDefault("contentAr", null),
                        Excerpt = item.GetStringOrDefault("excerpt", null),
                        ExcerptAr = item.GetStringOrDefault("excerptAr", null),
                        CoverImageUrl = item.GetStringOrDefault("coverImageUrl", null),
                        Author = item.GetStringOrDefault("author", null),
                        Tags = item.GetStringOrDefault("tags", null),
                        Published = item.GetBooleanOrDefault("published"),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            // --- Clear & Replace: Testimonials ---
            _context.Testimonials.RemoveRange(_context.Testimonials);
            if (testimonials.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in testimonials.EnumerateArray())
                {
                    _context.Testimonials.Add(new Testimonial
                    {
                        ClientName = item.GetStringOrDefault("clientName", ""),
                        ClientNameAr = item.GetStringOrDefault("clientNameAr", null),
                        ClientTitle = item.GetStringOrDefault("clientTitle", null),
                        ClientTitleAr = item.GetStringOrDefault("clientTitleAr", null),
                        Content = item.GetStringOrDefault("content", null),
                        ContentAr = item.GetStringOrDefault("contentAr", null),
                        Rating = item.GetInt32OrDefault("rating"),
                        AvatarUrl = item.GetStringOrDefault("clientAvatarUrl", null),
                        SortOrder = item.GetInt32OrDefault("sortOrder"),
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            // --- Clear & Replace: Settings ---
            _context.SiteSettings.RemoveRange(_context.SiteSettings);
            if (settings.ValueKind == JsonValueKind.Object)
            {
                foreach (var prop in settings.EnumerateObject())
                {
                    _context.SiteSettings.Add(new SiteSetting
                    {
                        SettingKey = prop.Name,
                        SettingValue = prop.Value.GetString()
                    });
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { message = "Data imported successfully" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest(new { error = "Failed to import data. Please check the file format and try again." });
        }
    }
}

public static class JsonElementExtensions
{
    public static string? GetStringOrDefault(this JsonElement el, string prop, string? defaultValue)
    {
        if (el.TryGetProperty(prop, out var val) && val.ValueKind != JsonValueKind.Null && val.ValueKind != JsonValueKind.Undefined)
            return val.GetString();
        return defaultValue;
    }

    public static int GetInt32OrDefault(this JsonElement el, string prop)
    {
        if (el.TryGetProperty(prop, out var val) && val.ValueKind == JsonValueKind.Number)
            return val.GetInt32();
        return 0;
    }

    public static bool GetBooleanOrDefault(this JsonElement el, string prop)
    {
        if (el.TryGetProperty(prop, out var val) && val.ValueKind == JsonValueKind.True)
            return true;
        return false;
    }
}
