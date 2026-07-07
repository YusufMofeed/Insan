using Insan.API.DTOs;
using Insan.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insan.API.Controllers;

[ApiController]
[Route("api")]
public class VoicesController : ControllerBase
{
    private readonly VoiceService _voiceService;

    public VoicesController(VoiceService voiceService)
    {
        _voiceService = voiceService;
    }

    [HttpPost("voices")]
    [Authorize(Roles = "User,Admin,Moderator")]
    public async Task<IActionResult> Create([FromBody] CreateVoiceRequest request, CancellationToken cancellationToken)
    {
        var voice = await _voiceService.CreateAsync(
            request.JourneyId,
            request.AuthorName,
            request.Relationship,
            request.Content,
            cancellationToken);

        return Created($"/api/voices/{voice.Id}", VoiceResponse.FromEntity(voice));
    }

    [HttpGet("journeys/{journeyId:guid}/voices")]
    public async Task<IActionResult> GetByJourney(
        Guid journeyId,
        [FromQuery] bool onlyApproved = true,
        CancellationToken cancellationToken = default)
    {
        var voices = await _voiceService.GetByJourneyAsync(journeyId, onlyApproved, cancellationToken);

        return Ok(voices.Select(VoiceResponse.FromEntity));
    }

    [HttpPost("voices/{id:guid}/approve")]
    [Authorize(Roles = "Moderator,Admin")]
    public async Task<IActionResult> Approve(Guid id, CancellationToken cancellationToken)
    {
        await _voiceService.ApproveAsync(id, cancellationToken);

        return NoContent();
    }

    [HttpPost("voices/{id:guid}/reject")]
    [Authorize(Roles = "Moderator,Admin")]
    public async Task<IActionResult> Reject(Guid id, CancellationToken cancellationToken)
    {
        await _voiceService.RejectAsync(id, cancellationToken);

        return NoContent();
    }
}
