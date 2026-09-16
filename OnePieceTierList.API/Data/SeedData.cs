using Microsoft.EntityFrameworkCore;
using OnePieceTierList.API.Models;

namespace OnePieceTierList.API.Data;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        // If characters already exist, don't insert them again
        if (await context.Characters.AnyAsync())
        {
            return;
        }

        var characters = new List<Character>
        {
            new Character
            {
                Name = "Monkey D. Luffy",
                ImageUrl = "/Characters/Luffy.jpg",
                Description = "Captain of the Straw Hat Pirates and future Pirate King",
                Crew = "Straw Hat Pirates",
                DevilFruit = "Hito Hito no Mi, Model: Nika"
            },

            new Character
            {
                Name = "Roronoa Zoro",
                ImageUrl = "/Characters/Zoro.jpg",
                Description = "Swordsman of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Nami",
                ImageUrl = "/Characters/Nami.jpg",
                Description = "Navigator of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Usopp",
                ImageUrl = "/Characters/Usopp.jpg",
                Description = "Sniper of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Sanji",
                ImageUrl = "/Characters/Sanji.jpg",
                Description = "Cook of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Tony Tony Chopper",
                ImageUrl = "/Characters/Chopper.jpg",
                Description = "Doctor of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "Hito Hito no Mi"
            },

            new Character
            {
                Name = "Nico Robin",
                ImageUrl = "/Characters/Robin.jpg",
                Description = "Archaeologist of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "Hana Hana no Mi"
            },

            new Character
            {
                Name = "Franky",
                ImageUrl = "/Characters/Franky.jpg",
                Description = "Shipwright of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Brook",
                ImageUrl = "/Characters/Brook.jpg",
                Description = "Musician of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "Yomi Yomi no Mi"
            },

            new Character
            {
                Name = "Jinbe",
                ImageUrl = "/Characters/Jinbe.jpg",
                Description = "Helmsman of the Straw Hat Pirates",
                Crew = "Straw Hat Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Shanks",
                ImageUrl = "/Characters/Shanks.jpg",
                Description = "Captain of the Red Hair Pirates",
                Crew = "Red Hair Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Marshall D. Teach",
                ImageUrl = "/Characters/Blackbeard.jpg",
                Description = "Captain of the Blackbeard Pirates",
                Crew = "Blackbeard Pirates",
                DevilFruit = "Yami Yami no Mi / Gura Gura no Mi"
            },

            new Character
            {
                Name = "Trafalgar D. Water Law",
                ImageUrl = "/Characters/Law.jpg",
                Description = "Captain of the Heart Pirates",
                Crew = "Heart Pirates",
                DevilFruit = "Ope Ope no Mi"
            },

            new Character
            {
                Name = "Eustass Kid",
                ImageUrl = "/Characters/Kid.jpg",
                Description = "Captain of the Kid Pirates",
                Crew = "Kid Pirates",
                DevilFruit = "Jiki Jiki no Mi"
            },

            new Character
            {
                Name = "Portgas D. Ace",
                ImageUrl = "/Characters/Ace.jpg",
                Description = "Former commander of the Whitebeard Pirates",
                Crew = "Whitebeard Pirates",
                DevilFruit = "Mera Mera no Mi"
            },

            new Character
            {
                Name = "Edward Newgate",
                ImageUrl = "/Characters/Whitebeard.jpg",
                Description = "Former captain of the Whitebeard Pirates",
                Crew = "Whitebeard Pirates",
                DevilFruit = "Gura Gura no Mi"
            },

            new Character
            {
                Name = "Dracule Mihawk",
                ImageUrl = "/Characters/Mihawk.jpg",
                Description = "World's Greatest Swordsman",
                Crew = "Cross Guild",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Monkey D. Dragon",
                ImageUrl = "/Characters/Dragon.jpg",
                Description = "Leader of the Revolutionary Army",
                Crew = "Revolutionary Army",
                DevilFruit = "Unknown"
            },

            new Character
            {
                Name = "Gol D. Roger",
                ImageUrl = "/Characters/Roger.jpg",
                Description = "Former Pirate King",
                Crew = "Roger Pirates",
                DevilFruit = "None"
            },

            new Character
            {
                Name = "Monkey D. Garp",
                ImageUrl = "/Characters/Garp.jpg",
                Description = "Legendary Marine Vice Admiral",
                Crew = "Marines",
                DevilFruit = "None"
            }
        };

        await context.Characters.AddRangeAsync(characters);
        await context.SaveChangesAsync();
    }
}