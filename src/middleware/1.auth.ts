import { eventHandler } from 'h3';
import { StatusCodes } from 'http-status-codes';

export interface AuthUser {
  id: number;
  email: string;
  positionId: number;
}

declare module 'h3' {
  interface H3EventContext {
    user?: AuthUser;
  }
}

// Routes that don't require authentication
const publicRoutes = ['/v1/login'];

export default eventHandler(async (event) => {
  const path = event.path;

  // Skip authentication for public routes
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return;
  }

  // Get authorization header
  const authHeader = getHeader(event, 'authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: 'Authentication required',
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Parse token to get user info (simplified version)
  // In production, verify JWT token properly
  const tokenParts = token.split('_');
  if (tokenParts.length < 3 || tokenParts[0] !== 'access') {
    throw createError({
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: 'Invalid token',
    });
  }

  const userId = parseInt(tokenParts[1], 10);
  if (isNaN(userId)) {
    throw createError({
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: 'Invalid token',
    });
  }

  // Get user from database to verify token and get current user info
  const [user] = await event.context.db
    .select({
      id: event.context.db._.fullSchema.customers.id,
      email: event.context.db._.fullSchema.customers.email,
      positionId: event.context.db._.fullSchema.customers.positionId,
    })
    .from(event.context.db._.fullSchema.customers)
    .where(
      event.context.db._
        .sql`${event.context.db._.fullSchema.customers.id} = ${userId} AND ${event.context.db._.fullSchema.customers.deletedAt} IS NULL`,
    )
    .limit(1);

  if (!user) {
    throw createError({
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: 'Invalid or expired token',
    });
  }

  // Set user in context
  event.context.user = {
    id: user.id,
    email: user.email,
    positionId: user.positionId,
  };
});
