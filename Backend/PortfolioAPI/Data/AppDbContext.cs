using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Models;

namespace PortfolioAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Media> Media => Set<Media>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<Education> Educations => Set<Education>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Visitor> Visitors => Set<Visitor>();
    public DbSet<BlogComment> BlogComments => Set<BlogComment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.HasIndex(a => a.Username).IsUnique();
            entity.Property(a => a.Username).HasMaxLength(50).IsRequired();
            entity.Property(a => a.PasswordHash).HasMaxLength(255).IsRequired();
        });

        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.FullName).HasMaxLength(100);
            entity.Property(p => p.FullNameAr).HasMaxLength(100);
            entity.Property(p => p.JobTitle).HasMaxLength(200);
            entity.Property(p => p.JobTitleAr).HasMaxLength(200);
            entity.Property(p => p.PhotoUrl).HasMaxLength(500);
            entity.Property(p => p.ResumeUrl).HasMaxLength(500);
            entity.Property(p => p.Email).HasMaxLength(200);
            entity.Property(p => p.Phone).HasMaxLength(50);
            entity.Property(p => p.Location).HasMaxLength(200);
            entity.Property(p => p.LocationAr).HasMaxLength(200);
            entity.Property(p => p.HeroEffect).HasMaxLength(20);
            entity.Property(p => p.ThemeColor).HasMaxLength(20);
        });

        modelBuilder.Entity<SocialLink>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Platform).HasMaxLength(50).IsRequired();
            entity.Property(s => s.Url).HasMaxLength(500).IsRequired();
            entity.Property(s => s.Icon).HasMaxLength(50);
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Name).HasMaxLength(100).IsRequired();
            entity.Property(s => s.NameAr).HasMaxLength(100);
            entity.Property(s => s.Category).HasMaxLength(50);
            entity.Property(s => s.CategoryAr).HasMaxLength(50);
            entity.Property(s => s.Type).HasMaxLength(20).HasDefaultValue("Design");
        });

        modelBuilder.Entity<Experience>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
            entity.Property(e => e.TitleAr).HasMaxLength(200);
            entity.Property(e => e.Company).HasMaxLength(200);
            entity.Property(e => e.CompanyAr).HasMaxLength(200);
            entity.Property(e => e.Period).HasMaxLength(100);
        });

        modelBuilder.Entity<Education>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Degree).HasMaxLength(200).IsRequired();
            entity.Property(e => e.DegreeAr).HasMaxLength(200);
            entity.Property(e => e.Institution).HasMaxLength(200);
            entity.Property(e => e.InstitutionAr).HasMaxLength(200);
            entity.Property(e => e.Period).HasMaxLength(100);
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Title).HasMaxLength(200).IsRequired();
            entity.Property(p => p.TitleAr).HasMaxLength(200);
            entity.Property(p => p.Type).HasMaxLength(20).IsRequired();
            entity.Property(p => p.Category).HasMaxLength(100);
            entity.Property(p => p.TechStack).HasMaxLength(500);
            entity.Property(p => p.LiveUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.MediaType).HasMaxLength(20).IsRequired();
            entity.Property(m => m.Url).HasMaxLength(500).IsRequired();
            entity.Property(m => m.FileName).HasMaxLength(255);
            entity.HasOne(m => m.Project)
                  .WithMany(p => p.Media)
                  .HasForeignKey(m => m.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SiteSetting>(entity =>
        {
            entity.HasKey(s => s.SettingKey);
            entity.Property(s => s.SettingKey).HasMaxLength(100);
        });

        modelBuilder.Entity<Certification>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).HasMaxLength(200).IsRequired();
            entity.Property(c => c.NameAr).HasMaxLength(200);
            entity.Property(c => c.Issuer).HasMaxLength(200);
            entity.Property(c => c.IssuerAr).HasMaxLength(200);
            entity.Property(c => c.IssueDate).HasMaxLength(50);
            entity.Property(c => c.ExpiryDate).HasMaxLength(50);
            entity.Property(c => c.CredentialUrl).HasMaxLength(500);
            entity.Property(c => c.LogoUrl).HasMaxLength(500);
            entity.Property(c => c.ImageUrl1).HasMaxLength(500);
            entity.Property(c => c.ImageUrl2).HasMaxLength(500);
            entity.Property(c => c.ImageUrl3).HasMaxLength(500);
            entity.Property(c => c.Category).HasMaxLength(50);
            entity.Property(c => c.CategoryAr).HasMaxLength(50);
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.HasIndex(b => b.Slug).IsUnique();
            entity.Property(b => b.Title).HasMaxLength(300).IsRequired();
            entity.Property(b => b.TitleAr).HasMaxLength(300);
            entity.Property(b => b.Slug).HasMaxLength(300).IsRequired();
            entity.Property(b => b.Excerpt).HasMaxLength(500);
            entity.Property(b => b.ExcerptAr).HasMaxLength(500);
            entity.Property(b => b.CoverImageUrl).HasMaxLength(500);
            entity.Property(b => b.Author).HasMaxLength(200);
            entity.Property(b => b.Tags).HasMaxLength(500);
        });

        modelBuilder.Entity<Testimonial>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.ClientName).HasMaxLength(100).IsRequired();
            entity.Property(t => t.ClientNameAr).HasMaxLength(100);
            entity.Property(t => t.ClientTitle).HasMaxLength(200);
            entity.Property(t => t.ClientTitleAr).HasMaxLength(200);
            entity.Property(t => t.AvatarUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.Property(m => m.Name).HasMaxLength(100).IsRequired();
            entity.Property(m => m.Email).HasMaxLength(200).IsRequired();
            entity.Property(m => m.Subject).HasMaxLength(300);
            entity.Property(m => m.MessageText).HasColumnName("Message").IsRequired();
        });

        modelBuilder.Entity<Visitor>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.IpAddress).HasMaxLength(50);
            entity.Property(v => v.UserAgent).HasMaxLength(500);
            entity.Property(v => v.Page).HasMaxLength(200);
        });

        modelBuilder.Entity<Profile>().HasData(new Profile { Id = 1 });
    }
}
