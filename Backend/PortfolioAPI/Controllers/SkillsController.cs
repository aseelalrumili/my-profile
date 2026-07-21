using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SkillsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Skills.OrderBy(s => s.SortOrder).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.Skills.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] SkillCreateRequest request)
    {
        var skill = new Skill
        {
            Name = request.Name,
            NameAr = request.NameAr,
            Category = request.Category ?? "Technical",
            CategoryAr = request.CategoryAr,
            Percentage = request.Percentage,
            SortOrder = request.SortOrder,
            Type = request.Type ?? "Design"
        };

        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = skill.Id }, skill);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] SkillUpdateRequest request)
    {
        var existing = await _context.Skills.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = request.Name ?? existing.Name;
        existing.NameAr = request.NameAr ?? existing.NameAr;
        existing.Category = request.Category ?? existing.Category;
        existing.CategoryAr = request.CategoryAr ?? existing.CategoryAr;
        existing.Percentage = request.Percentage;
        existing.SortOrder = request.SortOrder;
        existing.Type = request.Type ?? existing.Type;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Skills.FindAsync(id);
        if (item == null) return NotFound();
        _context.Skills.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class SkillCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string? NameAr { get; set; }
    public string? Category { get; set; }
    public string? CategoryAr { get; set; }
    public int Percentage { get; set; }
    public int SortOrder { get; set; }
    public string? Type { get; set; }
}

public class SkillUpdateRequest
{
    public string? Name { get; set; }
    public string? NameAr { get; set; }
    public string? Category { get; set; }
    public string? CategoryAr { get; set; }
    public int Percentage { get; set; }
    public int SortOrder { get; set; }
    public string? Type { get; set; }
}
