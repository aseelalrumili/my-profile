using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProfileController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get()
    {
        var profile = await _context.Profiles.FindAsync(1);
        if (profile == null) return Ok(new Profile());
        return Ok(profile);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update([FromForm] ProfileUpdateRequest req)
    {
        try
        {
            var profile = await _context.Profiles.FindAsync(1);
            if (profile == null)
            {
                profile = new Profile { Id = 1 };
                _context.Profiles.Add(profile);
            }

            if (req.FullName != null) profile.FullName = req.FullName;
            if (req.FullNameAr != null) profile.FullNameAr = req.FullNameAr;
            if (req.JobTitle != null) profile.JobTitle = req.JobTitle;
            if (req.JobTitleAr != null) profile.JobTitleAr = req.JobTitleAr;
            if (req.Bio != null) profile.Bio = req.Bio;
            if (req.BioAr != null) profile.BioAr = req.BioAr;
            if (req.Email != null) profile.Email = req.Email;
            if (req.Phone != null) profile.Phone = req.Phone;
            if (req.Location != null) profile.Location = req.Location;
            if (req.LocationAr != null) profile.LocationAr = req.LocationAr;
            if (req.HeroEffect != null) profile.HeroEffect = req.HeroEffect;
            if (req.ThemeColor != null) profile.ThemeColor = req.ThemeColor;
            if (req.StatsProjects.HasValue) profile.StatsProjects = req.StatsProjects.Value;
            if (req.StatsExperience.HasValue) profile.StatsExperience = req.StatsExperience.Value;
            if (req.StatsClients.HasValue) profile.StatsClients = req.StatsClients.Value;
            if (req.StatsAwards.HasValue) profile.StatsAwards = req.StatsAwards.Value;

            if (req.Photo != null && req.Photo.Length > 0)
            {
                var uploadsPath = GetUploadsPath();
                Directory.CreateDirectory(uploadsPath);
                var ext = Path.GetExtension(req.Photo.FileName).ToLower();
                var name = $"profile_photo{ext}";
                var path = Path.Combine(uploadsPath, name);
                using var stream = new FileStream(path, FileMode.Create);
                await req.Photo.CopyToAsync(stream);
                profile.PhotoUrl = $"/uploads/{name}";
            }

            if (req.Resume != null && req.Resume.Length > 0)
            {
                var uploadsPath = GetUploadsPath();
                Directory.CreateDirectory(uploadsPath);
                var ext = Path.GetExtension(req.Resume.FileName).ToLower();
                var name = $"resume{ext}";
                var path = Path.Combine(uploadsPath, name);
                using var stream = new FileStream(path, FileMode.Create);
                await req.Resume.CopyToAsync(stream);
                profile.ResumeUrl = $"/uploads/{name}";
            }

            await _context.SaveChangesAsync();
            return Ok(profile);
        }
        catch (Exception ex)
        {
            var innerMessage = ex.InnerException?.Message ?? ex.InnerException?.ToString();
            return BadRequest(new { error = ex.Message, inner = innerMessage });
        }
    }

    [HttpGet("social")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSocialLinks()
    {
        var links = await _context.SocialLinks.OrderBy(s => s.SortOrder).ToListAsync();
        return Ok(links);
    }

    [HttpPost("social")]
    [Authorize]
    public async Task<IActionResult> AddSocialLink([FromBody] SocialLink link)
    {
        _context.SocialLinks.Add(link);
        await _context.SaveChangesAsync();
        return Ok(link);
    }

    [HttpPut("social/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateSocialLink(int id, [FromBody] SocialLink link)
    {
        var existing = await _context.SocialLinks.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Platform = link.Platform;
        existing.Url = link.Url;
        existing.Icon = link.Icon;
        existing.SortOrder = link.SortOrder;
        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("social/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSocialLink(int id)
    {
        var link = await _context.SocialLinks.FindAsync(id);
        if (link == null) return NotFound();
        _context.SocialLinks.Remove(link);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("skills")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSkills()
    {
        var skills = await _context.Skills.OrderBy(s => s.SortOrder).ToListAsync();
        return Ok(skills);
    }

    [HttpPost("skills")]
    [Authorize]
    public async Task<IActionResult> AddSkill([FromBody] Skill skill)
    {
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();
        return Ok(skill);
    }

    [HttpPut("skills/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateSkill(int id, [FromBody] Skill skill)
    {
        var existing = await _context.Skills.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Name = skill.Name;
        existing.NameAr = skill.NameAr;
        existing.Category = skill.Category;
        existing.CategoryAr = skill.CategoryAr;
        existing.Type = skill.Type;
        existing.Percentage = skill.Percentage;
        existing.SortOrder = skill.SortOrder;
        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("skills/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSkill(int id)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null) return NotFound();
        _context.Skills.Remove(skill);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("experience")]
    [AllowAnonymous]
    public async Task<IActionResult> GetExperience()
    {
        var items = await _context.Experiences.OrderBy(e => e.SortOrder).ToListAsync();
        return Ok(items);
    }

    [HttpPost("experience")]
    [Authorize]
    public async Task<IActionResult> AddExperience([FromBody] Experience exp)
    {
        _context.Experiences.Add(exp);
        await _context.SaveChangesAsync();
        return Ok(exp);
    }

    [HttpPut("experience/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateExperience(int id, [FromBody] Experience exp)
    {
        var existing = await _context.Experiences.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Title = exp.Title;
        existing.TitleAr = exp.TitleAr;
        existing.Company = exp.Company;
        existing.CompanyAr = exp.CompanyAr;
        existing.Period = exp.Period;
        existing.Description = exp.Description;
        existing.DescriptionAr = exp.DescriptionAr;
        existing.SortOrder = exp.SortOrder;
        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("experience/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteExperience(int id)
    {
        var exp = await _context.Experiences.FindAsync(id);
        if (exp == null) return NotFound();
        _context.Experiences.Remove(exp);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("education")]
    [AllowAnonymous]
    public async Task<IActionResult> GetEducation()
    {
        var items = await _context.Educations.OrderBy(e => e.SortOrder).ToListAsync();
        return Ok(items);
    }

    [HttpPost("education")]
    [Authorize]
    public async Task<IActionResult> AddEducation([FromBody] Education edu)
    {
        _context.Educations.Add(edu);
        await _context.SaveChangesAsync();
        return Ok(edu);
    }

    [HttpPut("education/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateEducation(int id, [FromBody] Education edu)
    {
        var existing = await _context.Educations.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Degree = edu.Degree;
        existing.DegreeAr = edu.DegreeAr;
        existing.Institution = edu.Institution;
        existing.InstitutionAr = edu.InstitutionAr;
        existing.Period = edu.Period;
        existing.Description = edu.Description;
        existing.DescriptionAr = edu.DescriptionAr;
        existing.SortOrder = edu.SortOrder;
        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("education/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteEducation(int id)
    {
        var edu = await _context.Educations.FindAsync(id);
        if (edu == null) return NotFound();
        _context.Educations.Remove(edu);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("settings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.SiteSettings.ToListAsync();
        var dict = settings.ToDictionary(s => s.SettingKey, s => s.SettingValue);
        return Ok(dict);
    }

    [HttpPut("settings")]
    [Authorize]
    public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string> settings)
    {
        foreach (var kv in settings)
        {
            var existing = await _context.SiteSettings.FindAsync(kv.Key);
            if (existing != null)
                existing.SettingValue = kv.Value;
            else
                _context.SiteSettings.Add(new SiteSetting { SettingKey = kv.Key, SettingValue = kv.Value });
        }
        await _context.SaveChangesAsync();
        return Ok(settings);
    }

    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var profile = await _context.Profiles.FindAsync(1) ?? new Profile();
        var socialLinks = await _context.SocialLinks.OrderBy(s => s.SortOrder).ToListAsync();
        var skills = await _context.Skills.OrderBy(s => s.SortOrder).ToListAsync();
        var experience = await _context.Experiences.OrderBy(e => e.SortOrder).ToListAsync();
        var education = await _context.Educations.OrderBy(e => e.SortOrder).ToListAsync();
        var projects = await _context.Projects.Include(p => p.Media).OrderBy(p => p.SortOrder)
            .Select(p => new
            {
                p.Id, p.Title, p.TitleAr, p.Description, p.DescriptionAr,
                p.Type, p.Category, p.TechStack, p.LiveUrl, p.SortOrder,
                p.CreatedAt, p.UpdatedAt,
                media = p.Media.Select(m => new { m.Id, m.MediaType, m.Url, m.FileName, m.IsPrimary }).ToList()
            }).ToListAsync();
        var certifications = await _context.Certifications.OrderBy(c => c.SortOrder).ToListAsync();
        var blogPosts = await _context.BlogPosts.OrderByDescending(b => b.CreatedAt).ToListAsync();
        var testimonials = await _context.Testimonials.OrderBy(t => t.SortOrder).ToListAsync();
        var settings = (await _context.SiteSettings.ToListAsync()).ToDictionary(s => s.SettingKey, s => s.SettingValue);

        return Ok(new
        {
            profile,
            socialLinks,
            skills,
            experience,
            education,
            projects,
            certifications,
            blogPosts,
            testimonials,
            settings
        });
    }

    private string GetUploadsPath()
    {
        return Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
    }
}

public class ProfileUpdateRequest
{
    public string? FullName { get; set; }
    public string? FullNameAr { get; set; }
    public string? JobTitle { get; set; }
    public string? JobTitleAr { get; set; }
    public string? Bio { get; set; }
    public string? BioAr { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Location { get; set; }
    public string? LocationAr { get; set; }
    public string? HeroEffect { get; set; }
    public string? ThemeColor { get; set; }
    public int? StatsProjects { get; set; }
    public int? StatsExperience { get; set; }
    public int? StatsClients { get; set; }
    public int? StatsAwards { get; set; }
    public IFormFile? Photo { get; set; }
    public IFormFile? Resume { get; set; }
}
