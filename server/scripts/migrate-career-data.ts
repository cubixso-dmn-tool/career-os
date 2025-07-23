import { db } from "../db.js";
import { careerPaths, careerSkills, careerCourses, careerProjects, careerResources } from "../../shared/schema.js";

// Import the static career data
import { careerRoadmaps } from "../../client/src/components/career/CareerRoadmaps.js";

export async function migrateCareerData() {
  console.log("Starting career data migration...");
  
  try {
    // Category mappings for better organization
    const categoryMapping: Record<string, string> = {
      "full-stack-developer": "Software Development",
      "mobile-app-developer": "Software Development", 
      "devops-engineer": "Software Development",
      "blockchain-developer": "Software Development",
      "game-developer": "Software Development",
      "data-analyst": "Data & AI",
      "data-scientist": "Data & AI",
      "machine-learning-engineer": "Data & AI",
      "ai-researcher": "Data & AI",
      "business-intelligence-developer": "Data & AI",
      "cloud-architect": "Web & Cloud",
      "backend-engineer": "Web & Cloud", 
      "frontend-engineer": "Web & Cloud",
      "site-reliability-engineer": "Web & Cloud",
      "web3-smart-contract-auditor": "Web & Cloud",
      "cybersecurity-analyst": "Cybersecurity",
      "ethical-hacker": "Cybersecurity",
      "security-operations-center-analyst": "Cybersecurity",
      "cryptography-engineer": "Cybersecurity",
      "ui-ux-designer": "Design & Product",
      "product-manager": "Design & Product",
      "digital-marketing-analyst": "Marketing & Growth",
      "content-creator": "Marketing & Growth",
      "growth-hacker": "Marketing & Growth",
      "iot-developer": "Hardware & IoT",
      "embedded-systems-engineer": "Hardware & IoT",
      "robotics-engineer": "Hardware & IoT",
      "ar-vr-developer": "Hardware & IoT"
    };

    let migratedCount = 0;

    for (const [careerKey, careerData] of Object.entries(careerRoadmaps)) {
      try {
        // Create career path
        const [careerPath] = await db
          .insert(careerPaths)
          .values({
            title: careerData.title,
            category: categoryMapping[careerKey] || "Technology",
            description: careerData.description,
            overview: careerData.overview.intro,
            dayInLife: careerData.dayInLife.join("\n"),
            salaryExpectations: null, // Will be populated later
            growthOutlook: null, // Will be populated later
            isActive: true
          })
          .returning();

        console.log(`Created career path: ${careerData.title}`);

        // Migrate technical skills
        for (const skill of careerData.skills.technical) {
          await db.insert(careerSkills).values({
            careerPathId: careerPath.id,
            skillName: skill,
            skillType: "technical",
            importanceLevel: 4,
            description: `Technical skill required for ${careerData.title}`
          });
        }

        // Migrate soft skills
        for (const skill of careerData.skills.soft) {
          await db.insert(careerSkills).values({
            careerPathId: careerPath.id,
            skillName: skill,
            skillType: "soft",
            importanceLevel: 3,
            description: `Soft skill important for ${careerData.title}`
          });
        }

        // Migrate courses
        let courseOrder = 1;
        for (const course of careerData.courses) {
          await db.insert(careerCourses).values({
            careerPathId: careerPath.id,
            title: course.name,
            description: `${course.level} level course for ${careerData.title}`,
            provider: "Various Platforms",
            url: course.link,
            difficulty: course.level as "Beginner" | "Intermediate" | "Advanced",
            duration: "Self-paced",
            isFree: course.link.includes("youtube") || course.link.includes("freecodecamp"),
            price: null,
            category: "online-course",
            sortOrder: courseOrder++
          });
        }

        // Migrate projects
        let projectOrder = 1;
        for (const project of careerData.projects) {
          await db.insert(careerProjects).values({
            careerPathId: careerPath.id,
            title: project.name,
            description: `${project.level} level project to practice ${project.skills.join(", ")} skills`,
            difficulty: project.level as "Beginner" | "Intermediate" | "Advanced",
            technologies: project.skills,
            estimatedDuration: "2-4 weeks",
            projectUrl: null,
            githubRepo: null,
            sortOrder: projectOrder++
          });
        }

        // Migrate networking resources
        for (const community of careerData.networking.communities) {
          await db.insert(careerResources).values({
            careerPathId: careerPath.id,
            resourceType: "community",
            title: community,
            description: `Professional community for ${careerData.title}`,
            url: null,
            isFree: true,
            rating: null
          });
        }

        // Add some general resources
        const generalResources = [
          {
            type: "book" as const,
            title: `The Complete Guide to ${careerData.title}`,
            description: `Comprehensive guide covering all aspects of ${careerData.title}`,
            isFree: false
          },
          {
            type: "website" as const,
            title: `${careerData.title} Documentation`,
            description: `Official documentation and resources for ${careerData.title}`,
            isFree: true
          }
        ];

        for (const resource of generalResources) {
          await db.insert(careerResources).values({
            careerPathId: careerPath.id,
            resourceType: resource.type,
            title: resource.title,
            description: resource.description,
            url: null,
            isFree: resource.isFree,
            rating: null
          });
        }

        migratedCount++;
        console.log(`Successfully migrated ${careerData.title} (${migratedCount} total)`);

      } catch (error) {
        console.error(`Error migrating ${careerData.title}:`, error);
      }
    }

    console.log(`\n✅ Migration completed! Migrated ${migratedCount} career paths.`);
    console.log("📊 Migration Summary:");
    console.log(`- Career Paths: ${migratedCount}`);
    console.log(`- Skills: ${migratedCount * 15} (estimated)`);
    console.log(`- Courses: ${migratedCount * 8} (estimated)`);
    console.log(`- Projects: ${migratedCount * 5} (estimated)`);
    console.log(`- Resources: ${migratedCount * 10} (estimated)`);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCareerData()
    .then(() => {
      console.log("Migration script completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}