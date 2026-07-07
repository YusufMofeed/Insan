using Insan.API.DTOs;
using Insan.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insan.API.Controllers;

[ApiController]
[Route("api")]
public class LifeEventsController : ControllerBase
{
    private readonly LifeEventService _lifeEventService;

    public LifeEventsController(LifeEventService lifeEventService)
    {
        _lifeEventService = lifeEventService;
    }

    [HttpPost("journeys/{journeyId:guid}/lifeevents")]
    [Authorize(Roles = "User,Admin,Moderator")]
    public async Task<IActionResult> Create(
        Guid journeyId,
        [FromBody] CreateLifeEventRequest request,
        CancellationToken cancellationToken)
    {
        var lifeEvent = await _lifeEventService.CreateAsync(
            journeyId,
            request.Title,
            request.Description,
            request.EventDate,
            request.DisplayOrder,
            request.ImageUrl,
            cancellationToken);

        return Created($"/api/lifeevents/{lifeEvent.Id}", LifeEventResponse.FromEntity(lifeEvent));
    }

    [HttpGet("journeys/{journeyId:guid}/lifeevents")]
    public async Task<IActionResult> GetByJourney(Guid journeyId, CancellationToken cancellationToken)
    {
        var lifeEvents = await _lifeEventService.GetByJourneyAsync(journeyId, cancellationToken);

        return Ok(lifeEvents.Select(LifeEventResponse.FromEntity));
    }

    [HttpGet("lifeevents/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var lifeEvent = await _lifeEventService.GetByIdAsync(id, cancellationToken);

        return Ok(LifeEventResponse.FromEntity(lifeEvent));
    }

    [HttpPut("lifeevents/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateLifeEventRequest request,
        CancellationToken cancellationToken)
    {
        var lifeEvent = await _lifeEventService.UpdateAsync(
            id,
            request.Title,
            request.Description,
            request.EventDate,
            request.DisplayOrder,
            request.ImageUrl,
            cancellationToken);

        return Ok(LifeEventResponse.FromEntity(lifeEvent));
    }

    [HttpDelete("lifeevents/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _lifeEventService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
