using Insan.API;
using Insan.API.HealthChecks;
using Insan.API.Middlewares;
using Insan.Application.Interfaces;
using Insan.Application.Services;
using Insan.Infrastructure;
using Insan.Infrastructure.Persistence;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContext, UserContext>();

builder.Services.AddScoped<JourneyService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<VoiceService>();
builder.Services.AddScoped<MemoryService>();
builder.Services.AddScoped<StoryService>();
builder.Services.AddScoped<LifeEventService>();

builder.Services.AddHealthChecks()
    .AddCheck("api", () => HealthCheckResult.Healthy("API is running."), tags: new[] { "live" })
    .AddCheck<DatabaseHealthCheck>("database", tags: new[] { "ready" });

builder.Services.AddControllers();

// CORS: the allowed origin(s) come from configuration (Cors:AllowedOrigins),
// which in turn is populated from the CORS__ALLOWEDORIGINS__0 (etc.)
// environment variable in any real deployment — never hardcoded here. The
// one exception is Development: if nothing is configured, it falls back to
// the local frontend dev server's origin (http://localhost:5501) so a fresh
// clone works with zero extra setup, matching the previous hardcoded
// behavior exactly. Outside Development, an empty list is a configuration
// error and fails fast at startup rather than silently allowing no origins
// (or, worse, silently allowing every origin).
var corsAllowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? Array.Empty<string>();

if (corsAllowedOrigins.Length == 0)
{
    if (builder.Environment.IsDevelopment())
    {
        corsAllowedOrigins = new[] { "http://localhost:5501" };
    }
    else
    {
        throw new InvalidOperationException(
            "Cors:AllowedOrigins is not configured. Set at least one allowed origin " +
            "(e.g. via the CORS__ALLOWEDORIGINS__0 environment variable) outside Development.");
    }
}

const string CorsPolicyName = "InsanFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
        policy.WithOrigins(corsAllowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter a valid JWT token (without the 'Bearer ' prefix)."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

await app.Services.MigrateDatabaseAsync();

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(CorsPolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = HealthCheckResponseWriter.WriteResponse
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("live"),
    ResponseWriter = HealthCheckResponseWriter.WriteResponse
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = HealthCheckResponseWriter.WriteResponse
});

try
{
    Log.Information("Starting Insan API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Insan API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
