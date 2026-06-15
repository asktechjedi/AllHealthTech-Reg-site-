/**
 * Ticket ID generation service.
 * Format: AHT-YYYY-NNNNN (e.g. AHT-2025-00042)
 */

/**
 * Generates the next ticket ID within an existing transaction.
 * Must be called with a Prisma transaction client (tx) so that the count
 * and the subsequent registration insert are atomic — preventing duplicate IDs
 * when two registrations happen concurrently.
 *
 * @param {import('@prisma/client').PrismaClient} tx - active Prisma transaction client
 * @returns {Promise<string>} e.g. "AHT-2025-00042"
 */
export async function generateTicketId(tx) {
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
}
