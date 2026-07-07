using Insan.API.DTOs;
using Insan.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insan.API.Controllers;

[ApiController]
[Route("api")]
public class StoriesController : ControllerBase
{
    private readonly StoryService _storyService;

    public StoriesController(StoryService storyService)
    {
        _storyService = storyService;
    }

    [HttpPost("journeys/{journeyId:guid}/stories")]
    [Authorize(Roles = "User,Admin,Moderator")]
    public async Task<IActionResult> Create(
        Guid journeyId,
        [FromBody] CreateStoryRequest request,
        CancellationToken cancellationToken)
    {
        var story = await _storyService.CreateAsync(
            journeyId,
            request.Title,
            request.Content,
            request.AuthorName,
            cancellationToken);

        return Created($"/api/stories/{story.Id}", StoryResponse.FromEntity(story));
    }

    [HttpGet("journeys/{journeyId:guid}/stories")]
    public async Task<IActionResult> GetByJourney(Guid journeyId, CancellationToken cancellationToken)
    {
        var stories = await _storyService.GetByJourneyAsync(journeyId, cancellationToken);

        return Ok(stories.Select(StoryResponse.FromEntity));
    }

    [HttpGet("stories/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var story = await _storyService.GetByIdAsync(id, cancellationToken);

        return Ok(StoryResponse.FromEntity(story));
    }

    [HttpDelete("stories/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _storyService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
