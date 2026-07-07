using System.Net;
using System.Text.Json;
using Insan.Application.Exceptions;

namespace Insan.API.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, code) = exception switch
        {
            KeyNotFoundException => (HttpStatusCode.NotFound, "NOT_FOUND"),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "UNAUTHORIZED"),
            DuplicateEmailException => (HttpStatusCode.Conflict, "CONFLICT"),
            _ => (HttpStatusCode.InternalServerError, "INTERNAL_SERVER_ERROR")
        };

        var message = statusCode == HttpStatusCode.InternalServerError
            ? "An unexpected error occurred."
            : exception.Message;

        var response = new
        {
            success = false,
            message,
            code
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
