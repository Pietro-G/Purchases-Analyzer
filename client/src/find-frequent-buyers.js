const findFrequentBuyers = (purchases, category, minimumPurchaseCount = 1) => {
  const purchaseCounts = new Map();

  // First pass: aggregate counts and total amounts by customer for the given category
  for (const purchase of purchases) {
    if (purchase.category === category) {
      const { customerId, amount } = purchase;

      if (!purchaseCounts.has(customerId)) {
        purchaseCounts.set(customerId, {
          count: 0,
          totalAmount: 0,
        });
      }

      const customerData = purchaseCounts.get(customerId);
      customerData.count += 1;
      customerData.totalAmount += amount;
    }
  }

  // Second pass: collect frequent buyers based on minimumPurchaseCount
  const frequentBuyers = [];
  for (const [ customerId, { count, totalAmount } ] of purchaseCounts.entries()) {
    if (count >= minimumPurchaseCount) {
      frequentBuyers.push({
        customerId,
        count,
        totalAmount,
      });
    }
  }

  return frequentBuyers;
};

export default findFrequentBuyers;
