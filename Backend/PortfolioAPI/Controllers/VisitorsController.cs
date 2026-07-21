using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public VisitorsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("track")]
    [AllowAnonymous]
    public async Task<IActionResult> Track([FromBody] Visitor visitor)
    {
        visitor.VisitedAt = DateTime.UtcNow;
        _context.Visitors.Add(visitor);
        await _context.SaveChangesAsync();
        return Ok(visitor);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var visitors = await _context.Visitors
            .OrderByDescending(v => v.VisitedAt)
            .ToListAsync();
        return Ok(visitors);
    }

    [HttpGet("stats")]
    [Authorize]
    public async Task<IActionResult> GetStats()
    {
        var total = await _context.Visitors.CountAsync();
        var today = await _context.Visitors
            .CountAsync(v => v.VisitedAt.Date == DateTime.UtcNow.Date);
        return Ok(new { total, today });
    }

    [HttpGet("analytics")]
    [Authorize]
    public IActionResult GetAnalytics()
    {
        var visitors = _context.Visitors.ToList();
        var now = DateTime.UtcNow;

        var result = new
        {
            totalVisitors = visitors.Count,
            todayVisitors = visitors.Count(v => v.VisitedAt.Date == now.Date),
            thisWeek = visitors.Count(v => v.VisitedAt >= now.AddDays(-7)),
            thisMonth = visitors.Count(v => v.VisitedAt.Month == now.Month && v.VisitedAt.Year == now.Year),
            topPages = visitors.GroupBy(v => v.Page).Select(g => new { page = g.Key, count = g.Count() }).OrderByDescending(x => x.count).Take(10).ToList(),
            dailyVisits = visitors.Where(v => v.VisitedAt >= now.AddDays(-30)).GroupBy(v => v.VisitedAt.Date).Select(g => new { date = g.Key.ToString("yyyy-MM-dd"), count = g.Count() }).OrderBy(x => x.date).ToList(),
        };

        return Ok(result);
    }
}
