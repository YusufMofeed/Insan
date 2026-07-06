using Insan.Application.DTOs;
using Insan.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Insan.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(request, cancellationToken);

        if (response is null)
            return Unauthorized();

        return Ok(response);
    }
}
