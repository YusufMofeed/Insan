using System.Text.Json;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Insan.API.HealthChecks;

public static class HealthCheckResponseWriter
{
    public static Task WriteResponse(HttpContext context, HealthReport report)
    {
        context.Response.ContentType = "application/json";

        var checks = report.Entries.ToDictionary(
            entry => entry.Key,
            entry => entry.Value.Status.ToString());

        var response = new
        {
            status = report.Status.ToString(),
            checks
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
