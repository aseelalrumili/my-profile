using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/blog")]
public class BlogCommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlogCommentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{postId}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> GetApprovedComments(int postId)
    {
        var comments = await _context.BlogComments
            .Where(c => c.BlogPostId == postId && c.IsApproved)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
        return Ok(comments);
    }

    [HttpPost("{postId}/comments")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateComment(int postId, [FromBody] BlogComment comment)
    {
        var post = await _context.BlogPosts.FindAsync(postId);
        if (post == null) return NotFound("Blog post not found.");

        comment.BlogPostId = postId;
        comment.IsApproved = false;
        comment.CreatedAt = DateTime.UtcNow;

        _context.BlogComments.Add(comment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetApprovedComments), new { postId }, comment);
    }

    [HttpGet("comments/all")]
    [Authorize]
    public async Task<IActionResult> GetAllComments()
    {
        var comments = await _context.BlogComments
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
        return Ok(comments);
    }

    [HttpPut("comments/{id}/approve")]
    [Authorize]
    public async Task<IActionResult> ApproveComment(int id)
    {
        var comment = await _context.BlogComments.FindAsync(id);
        if (comment == null) return NotFound();

        comment.IsApproved = true;
        await _context.SaveChangesAsync();
        return Ok(comment);
    }

    [HttpDelete("comments/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.BlogComments.FindAsync(id);
        if (comment == null) return NotFound();

        _context.BlogComments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
