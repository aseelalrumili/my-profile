using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProjectsController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAll()
    {
        var projects = await _context.Projects
            .Include(p => p.Media)
            .OrderBy(p => p.SortOrder)
            .Select(p => MapToDto(p))
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProjectDto>> GetById(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Media)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound();
        return Ok(MapToDto(project));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProjectDto>> Create([FromForm] ProjectCreateRequest request)
    {
        var project = new Project
        {
            Title = request.Title,
            TitleAr = request.TitleAr,
            Description = request.Description,
            DescriptionAr = request.DescriptionAr,
            Type = request.Type,
            Category = request.Category,
            TechStack = request.TechStack,
            LiveUrl = request.LiveUrl,
            Problem = request.Problem,
            ProblemAr = request.ProblemAr,
            Solution = request.Solution,
            SolutionAr = request.SolutionAr,
            Role = request.Role,
            RoleAr = request.RoleAr,
            Impact = request.Impact,
            ImpactAr = request.ImpactAr,
            SortOrder = request.SortOrder
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        if (request.Files != null && request.Files.Count > 0)
        {
            await SaveFiles(request.Files, project.Id);
        }

        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, await GetById(project.Id));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromForm] ProjectUpdateRequest request)
    {
        var project = await _context.Projects
            .Include(p => p.Media)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound();

        project.Title = request.Title ?? project.Title;
        project.TitleAr = request.TitleAr ?? project.TitleAr;
        project.Description = request.Description ?? project.Description;
        project.DescriptionAr = request.DescriptionAr ?? project.DescriptionAr;
        project.Type = request.Type ?? project.Type;
        project.Category = request.Category ?? project.Category;
        project.TechStack = request.TechStack ?? project.TechStack;
        project.LiveUrl = request.LiveUrl ?? project.LiveUrl;
        project.Problem = request.Problem ?? project.Problem;
        project.ProblemAr = request.ProblemAr ?? project.ProblemAr;
        project.Solution = request.Solution ?? project.Solution;
        project.SolutionAr = request.SolutionAr ?? project.SolutionAr;
        project.Role = request.Role ?? project.Role;
        project.RoleAr = request.RoleAr ?? project.RoleAr;
        project.Impact = request.Impact ?? project.Impact;
        project.ImpactAr = request.ImpactAr ?? project.ImpactAr;
        project.SortOrder = request.SortOrder;
        project.UpdatedAt = DateTime.UtcNow;

        if (request.Files != null && request.Files.Count > 0)
        {
            await SaveFiles(request.Files, project.Id);
        }

        await _context.SaveChangesAsync();
        return Ok(await GetById(id));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Media)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound();

        var uploadsPath = GetUploadsPath();
        foreach (var media in project.Media)
        {
            var filePath = Path.Combine(uploadsPath, Path.GetFileName(media.Url));
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("media/{mediaId}")]
    [Authorize]
    public async Task<IActionResult> DeleteMedia(int mediaId)
    {
        var media = await _context.Media.FindAsync(mediaId);
        if (media == null) return NotFound();

        var uploadsPath = GetUploadsPath();
        var filePath = Path.Combine(uploadsPath, Path.GetFileName(media.Url));
        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        _context.Media.Remove(media);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static readonly HashSet<string> AllowedImageExtensions = new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private static readonly HashSet<string> AllowedModelExtensions = new(StringComparer.OrdinalIgnoreCase) { ".glb", ".gltf", ".obj", ".fbx" };
    private const long MaxFileSize = 50 * 1024 * 1024;

    private static readonly Dictionary<string, byte[][]> FileSignatures = new(StringComparer.OrdinalIgnoreCase)
    {
        { ".jpg",  new[] { new byte[] { 0xFF, 0xD8, 0xFF } } },
        { ".jpeg", new[] { new byte[] { 0xFF, 0xD8, 0xFF } } },
        { ".png",  new[] { new byte[] { 0x89, 0x50, 0x4E, 0x47 } } },
        { ".gif",  new[] { new byte[] { 0x47, 0x49, 0x46, 0x38 } } },
        { ".webp", new[] { new byte[] { 0x52, 0x49, 0x46, 0x46 } } },
        { ".glb",  new[] { new byte[] { 0x67, 0x6C, 0x54, 0x46 } } },
        { ".gltf", new[] { new byte[] { } } },
        { ".obj",  new[] { new byte[] { } } },
        { ".fbx",  new[] { new byte[] { 0x46, 0x42, 0x58 } } },
    };

    private static bool IsValidFileSignature(Stream stream, string extension)
    {
        if (!FileSignatures.TryGetValue(extension, out var signatures) || signatures.Length == 0 || signatures[0].Length == 0)
            return true;

        stream.Position = 0;
        var header = new byte[signatures[0].Length];
        stream.Read(header, 0, header.Length);
        stream.Position = 0;

        return header.SequenceEqual(signatures[0]);
    }

    private async Task SaveFiles(List<IFormFile> files, int projectId)
    {
        var uploadsPath = GetUploadsPath();
        Directory.CreateDirectory(uploadsPath);

        foreach (var file in files)
        {
            if (file.Length == 0) continue;
            if (file.Length > MaxFileSize) continue;
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!AllowedImageExtensions.Contains(ext) && !AllowedModelExtensions.Contains(ext)) continue;

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            if (!IsValidFileSignature(stream, ext)) continue;

            var mediaType = AllowedModelExtensions.Contains(ext) ? "3DModel" : "Image";
            var uniqueName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsPath, uniqueName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                stream.Position = 0;
                await stream.CopyToAsync(fileStream);
            }

            _context.Media.Add(new Media
            {
                ProjectId = projectId,
                MediaType = mediaType,
                Url = $"/uploads/{uniqueName}",
                FileName = file.FileName,
                IsPrimary = false
            });
        }
    }

    private static ProjectDto MapToDto(Project p) => new()
    {
        Id = p.Id,
        Title = p.Title,
        TitleAr = p.TitleAr,
        Description = p.Description,
        DescriptionAr = p.DescriptionAr,
        Type = p.Type,
        Category = p.Category,
        TechStack = p.TechStack,
        LiveUrl = p.LiveUrl,
        Problem = p.Problem,
        ProblemAr = p.ProblemAr,
        Solution = p.Solution,
        SolutionAr = p.SolutionAr,
        Role = p.Role,
        RoleAr = p.RoleAr,
        Impact = p.Impact,
        ImpactAr = p.ImpactAr,
        SortOrder = p.SortOrder,
        Media = p.Media.Select(m => new MediaDto
        {
            Id = m.Id,
            MediaType = m.MediaType,
            Url = m.Url,
            FileName = m.FileName,
            IsPrimary = m.IsPrimary
        }).ToList()
    };

    private string GetUploadsPath() =>
        Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");

    private static bool IsModelFile(string ext) =>
        ext is ".glb" or ".gltf" or ".obj" or ".fbx";
}

public class ProjectCreateRequest
{
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
    public List<IFormFile>? Files { get; set; }
}

public class ProjectUpdateRequest
{
    public string? Title { get; set; }
    public string? TitleAr { get; set; }
    public string? Description { get; set; }
    public string? DescriptionAr { get; set; }
    public string? Type { get; set; }
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
    public List<IFormFile>? Files { get; set; }
}
