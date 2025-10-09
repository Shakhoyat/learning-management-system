import { useMemo } from "react";

/**
 * Custom hook to process payment data into chart-ready format
 * @param {Array} payments - Array of payment objects
 * @param {string} userRole - User role ('tutor' or 'learner')
 * @returns {Object} Processed chart data or null
 */
export const useChartData = (payments, userRole) => {
  return useMemo(() => {
    if (!payments || payments.length === 0) return null;

    const isTutor = userRole === "tutor";
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    // Filter payments from last 4 weeks and only completed ones
    const recentPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate >= fourWeeksAgo && payment.status === "completed";
    });

    // Process weekly earnings data
    const weeklyData = processWeeklyData(recentPayments, now, isTutor);

    // Process daily earnings for last 14 days
    const dailyData = processDailyData(recentPayments, now, isTutor);

    // Process payment status distribution
    const statusData = processStatusData(payments);

    return {
      weeklyData,
      dailyData,
      statusData,
    };
  }, [payments, userRole]);
};

/**
 * Process weekly data for the last 4 weeks
 */
const processWeeklyData = (payments, now, isTutor) => {
  const weeklyData = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(
      now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000
    );
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

    const weekPayments = payments.filter((p) => {
      const date = new Date(p.createdAt);
      return date >= weekStart && date < weekEnd;
    });

    const weekEarnings = weekPayments.reduce((sum, p) => {
      const amount = isTutor ? p.fees?.netAmount || p.amount : p.amount;
      return sum + amount;
    }, 0);

    weeklyData.push({
      week: `Week ${4 - i}`,
      earnings: parseFloat(weekEarnings.toFixed(2)),
      sessions: weekPayments.length,
      fullWeek: `${weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
    });
  }

  return weeklyData;
};

/**
 * Process daily data for the last 14 days
 */
const processDailyData = (payments, now, isTutor) => {
  const dailyData = [];

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const dayPayments = payments.filter((p) => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate >= dayStart && paymentDate <= dayEnd;
    });

    const dayEarnings = dayPayments.reduce((sum, p) => {
      const amount = isTutor ? p.fees?.netAmount || p.amount : p.amount;
      return sum + amount;
    }, 0);

    dailyData.push({
      date: dayStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      earnings: parseFloat(dayEarnings.toFixed(2)),
      sessions: dayPayments.length,
    });
  }

  return dailyData;
};

/**
 * Process payment status distribution
 */
const processStatusData = (payments) => {
  const statusCounts = payments.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    percentage: ((count / payments.length) * 100).toFixed(1),
  }));
};
