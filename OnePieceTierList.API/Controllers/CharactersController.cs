using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnePieceTierList.API.Data;
using OnePieceTierList.API.Models;

namespace OnePieceTierList.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CharactersController : ControllerBase
{
    private readonly AppDbContext _context;

    public CharactersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/characters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Character>>> GetCharacters()
    {
        return await _context.Characters.ToListAsync();
    }

    // GET: api/characters/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Character>> GetCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);

        if (character == null)
        {
            return NotFound();
        }

        return character;
    }

    // POST: api/characters
    [HttpPost]
    public async Task<ActionResult<Character>> CreateCharacter(Character character)
    {
        _context.Characters.Add(character);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCharacter),
            new { id = character.Id },
            character);
    }

    // PUT: api/characters/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCharacter(
        int id,
        Character character)
    {
        if (id != character.Id)
        {
            return BadRequest();
        }

        var existingCharacter = await _context.Characters.FindAsync(id);

        if (existingCharacter == null)
        {
            return NotFound();
        }

        existingCharacter.Name = character.Name;
        existingCharacter.ImageUrl = character.ImageUrl;
        existingCharacter.Description = character.Description;
        existingCharacter.Crew = character.Crew;
        existingCharacter.DevilFruit = character.DevilFruit;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/characters/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCharacter(int id)
    {
        var character = await _context.Characters.FindAsync(id);

        if (character == null)
        {
            return NotFound();
        }

        _context.Characters.Remove(character);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}