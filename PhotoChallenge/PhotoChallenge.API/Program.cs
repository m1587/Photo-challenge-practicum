using Microsoft.AspNetCore.Authentication.JwtBearer;
using PhotoChallenge.Core.IRepositories;
using PhotoChallenge.Core.IServices;
using PhotoChallenge.Data.Repositories;
using PhotoChallenge.Service;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Amazon.S3;
using PhotoChallenge.Data;
using PhotoChallenge.Core;
using System.Text.Json.Serialization;
using Amazon.Runtime;
using Amazon;
using SendGrid;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var credentials = new BasicAWSCredentials(
       Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID"),
       Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")
    );
    var clientConfig = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(Environment.GetEnvironmentVariable("AWS_REGION"))
    };
    return new AmazonS3Client(credentials, clientConfig);
});
// הוספת JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")))
    };
});

// הוספת הרשאות מבוססות-תפקידים
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
});
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});
builder.Services.AddOpenApi();
builder.Services.AddDbContext<DataContext>();
builder.Services.AddScoped<IManagerRepository, ManagerRepository>();
builder.Services.AddScoped<IVoteRepository, VoteRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IChallengeRepository, ChallengeRepository>();
builder.Services.AddScoped<IImageRepository, ImageRepository>();

// רישום השירותים
builder.Services.AddScoped<IVoteService, VoteService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IChallengeService, ChallengeService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IPasswordResetService, PasswordResetService>();
builder.Services.AddHttpClient<IHuggingFaceService, HuggingFaceService>();
builder.Services.AddHttpClient<IHuggingFaceService, HuggingFaceService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["HuggingFace:BaseUrl"]);
    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {Environment.GetEnvironmentVariable("HUGGING_FACE_APIKEY")}");
    client.Timeout = TimeSpan.FromMinutes(3);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
{
    policy.WithOrigins(
        "http://localhost:4200",
        "http://localhost:5173",
        "https://photo-challenge.onrender.com",
        "https://photo-challenge-admin.onrender.com"
         )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
}));
builder.Services.AddTransient<ISendGridClient>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
    return new SendGridClient(apiKey);
});
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 104857600; // 100MB
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseHttpsRedirection(); // רק בלוקאלי
app.UseCors("MyPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles(); // מאפשר פתיחה של index.html כברירת מחדל
app.UseStaticFiles();  // מאפשר הגשת קבצים סטטיים מ-wwwroot
app.MapFallbackToFile("index.html"); // כל נתיב לא-API יחזור ל-index.html

app.MapControllers();
app.Run();
