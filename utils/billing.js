export const noteStorageCost = (notesQty) => {
  const rate = notesQty <= 10
    ? 4
    : notesQty <= 100
      ? 2
      : 1;

  return rate * notesQty * 100;
};