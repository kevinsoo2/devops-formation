export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  lessonsCompleted: number;
  quizzesPassed: number;
  perfectQuizzes: number;
  streakDays: number;
  totalXP: number;
  coursesCompleted: string[];
}

export const XP_VALUES = {
  LESSON_COMPLETE: 50,
  QUIZ_PASS: 30,
  QUIZ_PERFECT: 100,
  STREAK_BONUS: 20,
};

export const badges: Badge[] = [
  { id: "first-lesson", name: "Premier Pas", description: "Terminer votre première leçon", icon: "🎯", condition: (s) => s.lessonsCompleted >= 1 },
  { id: "five-lessons", name: "Apprenti", description: "Terminer 5 leçons", icon: "📚", condition: (s) => s.lessonsCompleted >= 5 },
  { id: "ten-lessons", name: "Étudiant Assidu", description: "Terminer 10 leçons", icon: "🎓", condition: (s) => s.lessonsCompleted >= 10 },
  { id: "twenty-lessons", name: "Expert en herbe", description: "Terminer 20 leçons", icon: "🏅", condition: (s) => s.lessonsCompleted >= 20 },
  { id: "all-lessons", name: "Maître DevOps", description: "Terminer toutes les leçons", icon: "👑", condition: (s) => s.lessonsCompleted >= 30 },
  { id: "first-quiz", name: "Quizmaster", description: "Réussir votre premier quiz", icon: "✅", condition: (s) => s.quizzesPassed >= 1 },
  { id: "perfect-quiz", name: "Sans Faute", description: "Obtenir 100% à un quiz", icon: "💯", condition: (s) => s.perfectQuizzes >= 1 },
  { id: "five-perfect", name: "Perfectionniste", description: "5 quiz parfaits", icon: "⭐", condition: (s) => s.perfectQuizzes >= 5 },
  { id: "streak-3", name: "Régulier", description: "3 jours consécutifs", icon: "🔥", condition: (s) => s.streakDays >= 3 },
  { id: "streak-7", name: "Endurant", description: "7 jours consécutifs", icon: "🔥🔥", condition: (s) => s.streakDays >= 7 },
  { id: "streak-30", name: "Inarrêtable", description: "30 jours consécutifs", icon: "🔥🔥🔥", condition: (s) => s.streakDays >= 30 },
  { id: "xp-500", name: "Niveau 5", description: "Atteindre 500 XP", icon: "⚡", condition: (s) => s.totalXP >= 500 },
  { id: "xp-1000", name: "Niveau 10", description: "Atteindre 1000 XP", icon: "⚡⚡", condition: (s) => s.totalXP >= 1000 },
  { id: "xp-2500", name: "Niveau 25", description: "Atteindre 2500 XP", icon: "💎", condition: (s) => s.totalXP >= 2500 },
  { id: "ansible-master", name: "Ansible Master", description: "Terminer le parcours Ansible", icon: "🔧", condition: (s) => s.coursesCompleted.includes("ansible") },
  { id: "k8s-master", name: "K8s Master", description: "Terminer le parcours Kubernetes", icon: "☸️", condition: (s) => s.coursesCompleted.includes("kubernetes") },
  { id: "docker-master", name: "Docker Master", description: "Terminer le parcours Docker", icon: "🐳", condition: (s) => s.coursesCompleted.includes("docker") },
  { id: "rhel-master", name: "RHEL Master", description: "Terminer le parcours Red Hat", icon: "🎩", condition: (s) => s.coursesCompleted.includes("redhat") },
  { id: "terraform-master", name: "Terraform Master", description: "Terminer le parcours Terraform", icon: "🏗️", condition: (s) => s.coursesCompleted.includes("terraform") },
];

export function getLevel(xp: number): { level: number; progress: number; nextLevelXP: number } {
  const level = Math.floor(xp / 200) + 1;
  const currentLevelXP = (level - 1) * 200;
  const nextLevelXP = level * 200;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, progress, nextLevelXP };
}

export function getUnlockedBadges(stats: UserStats): Badge[] {
  return badges.filter((b) => b.condition(stats));
}

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split("T")[0];
    const hasActivity = sorted.some((d) => d.toISOString().split("T")[0] === dateStr);
    if (hasActivity) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
