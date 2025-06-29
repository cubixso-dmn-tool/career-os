import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award, Lock } from "lucide-react";
import { Link } from "wouter";

interface Achievement {
  id: number;
  achievement: {
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
  };
  earnedAt: string;
}

interface UnlockedAchievement {
  title: string;
  description: string;
  icon: string;
  isUnlocked: true;
}

interface LockedAchievement {
  title: string;
  description: string;
  icon: string;
  isUnlocked: false;
}

type AchievementDisplay = UnlockedAchievement | LockedAchievement;

interface AchievementsCardProps {
  achievements: Achievement[];
}

export default function AchievementsCard({ achievements }: AchievementsCardProps) {
  // Transform achievements data to match the display format
  const earnedAchievements: AchievementDisplay[] = achievements.map(item => ({
    title: item.achievement.title,
    description: item.achievement.description,
    icon: item.achievement.icon,
    isUnlocked: true
  }));
  
  // Add a locked achievement if less than 3 achievements
  const displayAchievements: AchievementDisplay[] = [
    ...earnedAchievements,
    ...(earnedAchievements.length < 3 ? [{
      title: "Project Pioneer",
      description: "Complete your first project",
      icon: "lock",
      isUnlocked: false
    }] : [])
  ].slice(0, 3);

  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const className = isUnlocked 
      ? iconName === 'star' 
        ? 'text-amber-400' 
        : 'text-primary'
      : 'text-gray-400';
    
    switch (iconName) {
      case 'star':
        return <Star className={className} size={20} />;
      case 'award':
        return <Award className={className} size={20} />;
      case 'lock':
      default:
        return <Lock className={className} size={20} />;
    }
  };

  const getBgColor = (icon: string, isUnlocked: boolean) => {
    if (!isUnlocked) return 'bg-gray-100';
    return icon === 'star' ? 'bg-amber-100' : 'bg-indigo-100';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">Achievements</CardTitle>
          <Link href="/achievements">
            <span className="text-sm text-primary font-medium hover:underline cursor-pointer">View All</span>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayAchievements.map((achievement, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${getBgColor(achievement.icon, achievement.isUnlocked)} rounded-full flex items-center justify-center flex-shrink-0`}>
              {getIcon(achievement.icon, achievement.isUnlocked)}
            </div>
            <div>
              <h3 className={`font-medium ${achievement.isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                {achievement.title}
              </h3>
              <p className={`text-sm ${achievement.isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
