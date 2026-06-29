import { MetadataRoute } from "next";
import { courses } from "@/lib/courses";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://devops-formation.onrender.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/cours`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/cours/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const lessonPages: MetadataRoute.Sitemap = courses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      url: `${baseUrl}/cours/${course.slug}/${lesson.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...coursePages, ...lessonPages];
}
