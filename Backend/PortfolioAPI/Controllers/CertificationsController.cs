using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificationsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public CertificationsController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Certifications.OrderBy(c => c.SortOrder).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.Certifications.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromForm] CertificationCreateRequest request)
    {
        var certification = new Certification
        {
            Name = request.Name,
            NameAr = request.NameAr,
            Issuer = request.Issuer,
            IssuerAr = request.IssuerAr,
            IssueDate = request.IssueDate,
            ExpiryDate = request.ExpiryDate,
            CredentialUrl = request.CredentialUrl,
            Category = request.Category ?? "Technical",
            CategoryAr = request.CategoryAr,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow
        };

        _context.Certifications.Add(certification);
        await _context.SaveChangesAsync();

        if (request.Files != null && request.Files.Count > 0)
        {
            await SaveFiles(request.Files, certification);
        }

        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = certification.Id }, certification);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromForm] CertificationCreateRequest request)
    {
        var existing = await _context.Certifications.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = request.Name ?? existing.Name;
        existing.NameAr = request.NameAr ?? existing.NameAr;
        existing.Issuer = request.Issuer ?? existing.Issuer;
        existing.IssuerAr = request.IssuerAr ?? existing.IssuerAr;
        existing.IssueDate = request.IssueDate ?? existing.IssueDate;
        existing.ExpiryDate = request.ExpiryDate ?? existing.ExpiryDate;
        existing.CredentialUrl = request.CredentialUrl ?? existing.CredentialUrl;
        existing.Category = request.Category ?? existing.Category;
        existing.CategoryAr = request.CategoryAr ?? existing.CategoryAr;
        existing.SortOrder = request.SortOrder;

        if (request.Files != null && request.Files.Count > 0)
        {
            await SaveFiles(request.Files, existing);
        }

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Certifications.FindAsync(id);
        if (item == null) return NotFound();
        _context.Certifications.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task SaveFiles(List<IFormFile> files, Certification certification)
    {
        var uploadsPath = Path.Combine(
            _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
            "uploads");
        Directory.CreateDirectory(uploadsPath);

        var imageSlots = new[] { nameof(Certification.ImageUrl1), nameof(Certification.ImageUrl2), nameof(Certification.ImageUrl3) };
        var currentUrls = new[] { certification.ImageUrl1, certification.ImageUrl2, certification.ImageUrl3 };

        int slotIndex = 0;
        foreach (var file in files)
        {
            if (file.Length == 0 || slotIndex >= 3) break;

            var ext = Path.GetExtension(file.FileName).ToLower();
            var uniqueName = $"cert_{certification.Id}_{slotIndex + 1}_{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsPath, uniqueName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var url = $"/uploads/{uniqueName}";
            switch (slotIndex)
            {
                case 0: certification.ImageUrl1 = url; break;
                case 1: certification.ImageUrl2 = url; break;
                case 2: certification.ImageUrl3 = url; break;
            }
            slotIndex++;
        }
    }
}

public class CertificationCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string? NameAr { get; set; }
    public string? Issuer { get; set; }
    public string? IssuerAr { get; set; }
    public string? IssueDate { get; set; }
    public string? ExpiryDate { get; set; }
    public string? CredentialUrl { get; set; }
    public string? Category { get; set; }
    public string? CategoryAr { get; set; }
    public int SortOrder { get; set; }
    public List<IFormFile>? Files { get; set; }
}
