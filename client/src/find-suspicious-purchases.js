const findSuspiciousPurchases = (purchases) => {
  // Define threshold variables for each criterion
  const smallValueThreshold = 1.0;
  const standardDeviationMultiplier = 2; // Number of standard deviations above mean to flag
  const rarelyUsedCategoryThreshold = 2; // Minimum count to consider a category as regularly used

  const customerStats = {};

  // Calculate category averages and standard deviations for each customer
  purchases.forEach((purchase) => {
    const {
      customerId, category, amount,
    } = purchase;
    if (!customerStats[customerId]) customerStats[customerId] = {};
    if (!customerStats[customerId][category]) {
      customerStats[customerId][category] = {
        total: 0,
        count: 0,
        amounts: [],
      };
    }
    const categoryStats = customerStats[customerId][category];
    categoryStats.total += amount;
    categoryStats.count += 1;
    categoryStats.amounts.push(amount);
  });

  // Calculate averages and standard deviations
  Object.values(customerStats).forEach((categories) => {
    Object.values(categories).forEach((stats) => {
      const mean = stats.total / stats.count;
      const variance = stats.amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / stats.count;
      stats.mean = mean;
      stats.stdDev = Math.sqrt(variance);
    });
  });

  return purchases.map((purchase) => {
    const {
      customerId, category, amount,
    } = purchase;
    const reasons = [];

    // Check if the amount is significantly higher than the average for this category by this customer
    const categoryStats = customerStats[customerId]?.[category];
    if (categoryStats && amount > categoryStats.mean + categoryStats.stdDev * standardDeviationMultiplier) {
      reasons.push(`Amount exceeds ${standardDeviationMultiplier} standard deviations above the average for this category by this customer.`);
    }

    // Check for small values
    if (amount < smallValueThreshold) {
      reasons.push('Small or fractional value.');
    }

    // Check for inconsistent purchase category
    const totalCategories = Object.keys(customerStats[customerId] || {}).length;
    if (totalCategories > 1 && (!categoryStats || categoryStats.count < rarelyUsedCategoryThreshold)) {
      reasons.push('Inconsistent purchase category.');
    }

    // Attach reasons if any suspicious behavior is found
    if (reasons.length > 0) {
      return {
        ...purchase,
        suspiciousReasons: reasons,
      };
    }
    return purchase;
  }).filter((purchase) => purchase.suspiciousReasons);
};

export default findSuspiciousPurchases;
