using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(option =>
{
    option.AddPolicy("corsPolicy", policyBuilder =>
    {
        policyBuilder
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("corsPolicy");

app.UseHttpsRedirection();

app.MapPost("/transferFile", async ([FromServices]ILogger<Program> logger, FileDto fileDto) =>
{
    logger.LogInformation("File: {FileName} Path: {FilePath}", fileDto.FileType, fileDto.FilePath);
    await Task.Delay(1000);
    return fileDto;
})
.WithName("GetWeatherForecast");

app.Run();

internal record FileDto(string FileType, string FilePath);