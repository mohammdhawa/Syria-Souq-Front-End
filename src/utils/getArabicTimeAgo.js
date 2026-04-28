export const getArabicTimeAgo = (createdAt) => {
  // Check if date is null, undefined, or empty
  if (!createdAt) {
    return "غير محدد";
  }

  const now = new Date();
  const createdDate = new Date(createdAt);
  
  // Check if the date is invalid
  if (isNaN(createdDate.getTime())) {
    return "غير محدد";
  }

  createdDate.setHours(createdDate.getHours() + 3);

  let diffInSeconds = Math.floor((now - createdDate) / 1000);

  if (diffInSeconds < 0) return "منذ لحظات";

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);
  const weeks = Math.floor(diffInSeconds / 604800);
  const months = Math.floor(diffInSeconds / 2592000);
  const years = Math.floor(diffInSeconds / 31536000);

  const pluralRules = new Intl.PluralRules("ar");

  const formatTime = (value, unit) => {
    const rules = {
      minute: {
        zero: "منذ لحظات",
        one: "منذ دقيقة",
        two: "منذ دقيقتين",
        few: `منذ ${value} دقائق`,
        many: `منذ ${value} دقيقة`,
        other: `منذ ${value} دقيقة`,
      },
      hour: {
        one: "منذ ساعة",
        two: "منذ ساعتين",
        few: `منذ ${value} ساعات`,
        many: `منذ ${value} ساعة`,
        other: `منذ ${value} ساعة`,
      },
      day: {
        one: "منذ يوم",
        two: "منذ يومين",
        few: `منذ ${value} أيام`,
        many: `منذ ${value} يومًا`,
        other: `منذ ${value} يوم`,
      },
      week: {
        one: "منذ أسبوع",
        two: "منذ أسبوعين",
        few: `منذ ${value} أسابيع`,
        many: `منذ ${value} أسبوعًا`,
        other: `منذ ${value} أسبوع`,
      },
      month: {
        one: "منذ شهر",
        two: "منذ شهرين",
        few: `منذ ${value} أشهر`,
        many: `منذ ${value} شهرًا`,
        other: `منذ ${value} شهر`,
      },
      year: {
        one: "منذ سنة",
        two: "منذ سنتين",
        few: `منذ ${value} سنوات`,
        many: `منذ ${value} سنة`,
        other: `منذ ${value} سنة`,
      },
    };

    const category = pluralRules.select(value);
    return rules[unit][category];
  };

  if (diffInSeconds < 60) return "منذ لحظات";
  if (minutes < 60) return formatTime(minutes, "minute");
  if (hours < 24) return formatTime(hours, "hour");
  if (days < 7) return formatTime(days, "day");
  if (weeks < 4) return formatTime(weeks, "week");
  if (months < 12) return formatTime(months, "month");
  return formatTime(years, "year");
};
