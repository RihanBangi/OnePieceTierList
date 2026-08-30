using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnePieceTierList.API.Data;
using OnePieceTierList.API.Models;
using System.Security.Claims;

namespace OnePieceTierList.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TierListsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TierListsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/tierlists
    // Get all tier lists belonging to the logged-in user
    [HttpGet]
    public async Task<IActionResult> GetTierLists()
    {
        var userId = GetUserId();

        var tierLists = await _context.TierLists
            .Where(t => t.UserId == userId)
            .Include(t => t.Items)
            .ThenInclude(i => i.Character)
            .ToListAsync();

        return Ok(tierLists);
    }

    // GET: api/tierlists/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTierList(int id)
    {
        var userId = GetUserId();

        var tierList = await _context.TierLists
            .Include(t => t.Items)
            .ThenInclude(i => i.Character)
            .FirstOrDefaultAsync(t =>
                t.Id == id &&
                t.UserId == userId);

        if (tierList == null)
        {
            return NotFound();
        }

        return Ok(tierList);
    }

    // POST: api/tierlists
    [HttpPost]
    public async Task<IActionResult> CreateTierList(
        TierList tierList)
    {
        var userId = GetUserId();

        tierList.Id = 0;
        tierList.UserId = userId;
        tierList.CreatedAt = DateTime.UtcNow;

        _context.TierLists.Add(tierList);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTierList),
            new { id = tierList.Id },
            tierList);
    }

    // PUT: api/tierlists/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTierList(
        int id,
        TierList updatedTierList)
    {
        var userId = GetUserId();

        var tierList = await _context.TierLists
            .FirstOrDefaultAsync(t =>
                t.Id == id &&
                t.UserId == userId);

        if (tierList == null)
        {
            return NotFound();
        }

        tierList.Name = updatedTierList.Name;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/tierlists/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTierList(int id)
    {
        var userId = GetUserId();

        var tierList = await _context.TierLists
            .FirstOrDefaultAsync(t =>
                t.Id == id &&
                t.UserId == userId);

        if (tierList == null)
        {
            return NotFound();
        }

        _context.TierLists.Remove(tierList);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private int GetUserId()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        return int.Parse(userId!);
    }
}