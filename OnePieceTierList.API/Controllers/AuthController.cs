using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnePieceTierList.API.Data;
using OnePieceTierList.API.DTOs;
using OnePieceTierList.API.Models;
using OnePieceTierList.API.Services;

namespace OnePieceTierList.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(
        AppDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new
            {
                message = "Email already registered."
            });
        }

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        // Create TierList for the new user
        var tierList = new TierList
        {
            UserId = user.Id,
            Name = $"{user.Name}'s One Piece Tier List"
        };

        _context.TierLists.Add(tierList);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Registration successful.",
            userId = user.Id,
            name = user.Name,
            email = user.Email,
            tierListId = tierList.Id
        });
    }

    // =========================
    // LOGIN
    // =========================
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            dto.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        // Find user's TierList
        var tierList = await _context.TierLists
            .FirstOrDefaultAsync(t => t.UserId == user.Id);

        // Create one if the user doesn't have one
        if (tierList == null)
        {
            tierList = new TierList
            {
                UserId = user.Id,
                Name = $"{user.Name}'s One Piece Tier List"
            };

            _context.TierLists.Add(tierList);

            await _context.SaveChangesAsync();
        }

        // Generate JWT
        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            message = "Login successful.",
            token,
            userId = user.Id,
            name = user.Name,
            email = user.Email,
            tierListId = tierList.Id
        });
    }
}