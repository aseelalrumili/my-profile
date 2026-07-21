using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlogController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var posts = await _context.BlogPosts
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
        return Ok(posts);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] BlogPost post)
    {
        post.CreatedAt = DateTime.UtcNow;
        post.UpdatedAt = DateTime.UtcNow;
        _context.BlogPosts.Add(post);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] BlogPost post)
    {
        var existing = await _context.BlogPosts.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Title = post.Title;
        existing.TitleAr = post.TitleAr;
        existing.Slug = post.Slug;
        existing.Content = post.Content;
        existing.ContentAr = post.ContentAr;
        existing.Excerpt = post.Excerpt;
        existing.ExcerptAr = post.ExcerptAr;
        existing.CoverImageUrl = post.CoverImageUrl;
        existing.Author = post.Author;
        existing.Tags = post.Tags;
        existing.Published = post.Published;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) return NotFound();
        _context.BlogPosts.Remove(post);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
