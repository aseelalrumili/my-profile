using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TestimonialsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Testimonials.OrderBy(t => t.SortOrder).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.Testimonials.FindAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Testimonial testimonial)
    {
        testimonial.CreatedAt = DateTime.UtcNow;
        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = testimonial.Id }, testimonial);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] Testimonial testimonial)
    {
        var existing = await _context.Testimonials.FindAsync(id);
        if (existing == null) return NotFound();

        existing.ClientName = testimonial.ClientName;
        existing.ClientNameAr = testimonial.ClientNameAr;
        existing.ClientTitle = testimonial.ClientTitle;
        existing.ClientTitleAr = testimonial.ClientTitleAr;
        existing.Content = testimonial.Content;
        existing.ContentAr = testimonial.ContentAr;
        existing.Rating = testimonial.Rating;
        existing.AvatarUrl = testimonial.AvatarUrl;
        existing.SortOrder = testimonial.SortOrder;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Testimonials.FindAsync(id);
        if (item == null) return NotFound();
        _context.Testimonials.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
