using Insan.API.DTOs;
using Insan.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insan.API.Controllers;

[ApiController]
[Route("api/journeys")]
public class JourneysController : ControllerBase
{
    private readonly JourneyService _journeyService;

    public JourneysController(JourneyService journeyService)
    {
        _journeyService = journeyService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateJourneyRequest request, CancellationToken cancellationToken)
    {
        var journey = await _journeyService.CreateAsync(
            request.FullName,
            request.City,
            request.Occupation,
            request.Biography,
            request.CreatedBy,
            request.Nickname,
            request.BirthDate,
            request.MartyrdomDate,
            cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = journey.Id }, JourneyResponse.FromEntity(journey));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? city = null,
        [FromQuery] string? occupation = null,
        CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _journeyService.GetAllAsync(page, pageSize, search, city, occupation, cancellationToken);

        return Ok(new
        {
            data = items.Select(JourneyResponse.FromEntity),
            totalCount,
            page,
            pageSize
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var journey = await _journeyService.GetByIdAsync(id, cancellationToken);

        return Ok(JourneyResponse.FromEntity(journey));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateJourneyRequest request, CancellationToken cancellationToken)
    {
        var journey = await _journeyService.UpdateAsync(
            id,
            request.FullName,
            request.City,
            request.Occupation,
            request.Biography,
            request.Nickname,
            request.BirthDate,
            request.MartyrdomDate,
            cancellationToken);

        return Ok(JourneyResponse.FromEntity(journey));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _journeyService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
