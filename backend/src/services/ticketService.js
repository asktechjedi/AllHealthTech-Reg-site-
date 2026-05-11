/**
 * Ticket ID generation service.
 * Format: AHT-YYYY-NNNNN (e.g. AHT-2025-00042)
 */

/**
 * Generates a unique Ticket_ID using an atomic Prisma transaction.
 * Counts existing registrations for the current year and uses count + 1
 * as the sequence number, padded to 5 digits.
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 * @returns {Promise<string>} e.g. "AHT-2025-00042"
 */
export async function generateTicketId(prisma) {
  return prisma.$transaction(async (tx) => {
    const year = new Date().getFullYear();
    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
    const yearEnd = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const count = await tx.registration.count({
      where: {
        createdAt: {
          gte: yearStart,
          lt: yearEnd,
        },
      },
    });

    const sequence = String(count + 1).padStart(5, '0');
    return `AHT-${year}-${sequence}`;
  });
}
