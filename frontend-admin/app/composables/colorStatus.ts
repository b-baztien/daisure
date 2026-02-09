export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending_payment: "gray",
    payment_submitted: "yellow",
    payment_verified: "blue",
    in_escrow: "cyan",
    in_dispute: "red",
    completed: "green",
    cancelled: "gray",
    refunded: "orange",
    initiated: "warning",
  };
  return colors[status] || "gray";
};