using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnePieceTierList.API.Data;
using OnePieceTierList.API.Models;
using System.Security.Claims;

namespace OnePieceTierList.API.Controllers;

[ApiController]
[Route("api/tierlists/{tierListId}/items")]
[Authorize]
public class TierListItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TierListItemsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/tierlists/1/items
    [HttpGet]
    public async Task<IActionResult> GetItems(int tierListId)
    {
        var userId = GetUserId();

        var tierListExists = await _context.TierLists
            .AnyAsync(t =>
                t.Id == tierListId &&
                t.UserId == userId);

        if (!tierListExists)
        {
            return NotFound();
        }

        var items = await _context.TierListItems
            .Where(i => i.TierListId == tierListId)
            .Include(i => i.Character)
            .OrderBy(i => i.Tier)
            .ThenBy(i => i.Position)
            .ToListAsync();

        return Ok(items);
    }

    // POST: api/tierlists/1/items
    [HttpPost]
    public async Task<IActionResult> AddItem(
        int tierListId,
        TierListItem item)
    {
        var userId = GetUserId();

        // Make sure the tier list belongs to the logged-in user
        var tierListExists = await _context.TierLists
            .AnyAsync(t =>
                t.Id == tierListId &&
                t.UserId == userId);

        if (!tierListExists)
        {
            return NotFound(new
            {
                message = "Tier list not found."
            });
        }

        // Make sure the character exists
        var characterExists = await _context.Characters
            .AnyAsync(c => c.Id == item.CharacterId);

        if (!characterExists)
        {
            return BadRequest(new
            {
                message = "Character not found."
            });
        }

        // Prevent duplicate character in the same tier list
        var alreadyExists = await _context.TierListItems
            .AnyAsync(i =>
                i.TierListId == tierListId &&
                i.CharacterId == item.CharacterId);

        if (alreadyExists)
        {
            return BadRequest(new
            {
                message = "Character is already in this tier list."
            });
        }

        item.Id = 0;
        item.TierListId = tierListId;

        if (string.IsNullOrWhiteSpace(item.Tier))
        {
            item.Tier = "Unranked";
        }

        _context.TierListItems.Add(item);

        await _context.SaveChangesAsync();

        return Ok(item);
    }

    // PUT: api/tierlists/1/items/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(
        int tierListId,
        int id,
        TierListItem updatedItem)
    {
        var userId = GetUserId();

        var item = await _context.TierListItems
            .Include(i => i.TierList)
            .FirstOrDefaultAsync(i =>
                i.Id == id &&
                i.TierListId == tierListId &&
                i.TierList.UserId == userId);

        if (item == null)
        {
            return NotFound();
        }

        item.Tier = updatedItem.Tier;
        item.Position = updatedItem.Position;

        await _context.SaveChangesAsync();

        return Ok(item);
    }

    // DELETE: api/tierlists/1/items/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItem(
        int tierListId,
        int id)
    {
        var userId = GetUserId();

        var item = await _context.TierListItems
            .Include(i => i.TierList)
            .FirstOrDefaultAsync(i =>
                i.Id == id &&
                i.TierListId == tierListId &&
                i.TierList.UserId == userId);

        if (item == null)
        {
            return NotFound();
        }

        _context.TierListItems.Remove(item);

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