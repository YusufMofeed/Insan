using Insan.API.DTOs;
using Insan.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insan.API.Controllers;

[ApiController]
[Route("api")]
public class MemoriesController : ControllerBase
{
    private readonly MemoryService _memoryService;

    public MemoriesController(MemoryService memoryService)
    {
        _memoryService = memoryService;
    }

    [HttpPost("journeys/{journeyId:guid}/memories")]
    [Authorize(Roles = "User,Admin,Moderator")]
    public async Task<IActionResult> Create(
        Guid journeyId,
        [FromBody] CreateMemoryRequest request,
        CancellationToken cancellationToken)
    {
        var memory = await _memoryService.CreateAsync(journeyId, request.Url, request.Caption, cancellationToken);

        return Created($"/api/memories/{memory.Id}", MemoryResponse.FromEntity(memory));
    }

    [HttpGet("journeys/{journeyId:guid}/memories")]
    public async Task<IActionResult> GetByJourney(Guid journeyId, CancellationToken cancellationToken)
    {
        var memories = await _memoryService.GetByJourneyAsync(journeyId, cancellationToken);

        return Ok(memories.Select(MemoryResponse.FromEntity));
    }

    [HttpGet("memories/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var memory = await _memoryService.GetByIdAsync(id, cancellationToken);

        return Ok(MemoryResponse.FromEntity(memory));
    }

    [HttpDelete("memories/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _memoryService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
