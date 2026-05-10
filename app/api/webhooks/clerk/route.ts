import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma
const prisma = new PrismaClient()

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // FIX: Added 'await' before headers()
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, someone is trying to access this route directly
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }

  // Get the raw body string
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 })
  }

  // Get the ID and type from the Clerk event
  const eventType = evt.type;

  // WHEN A NEW USER SIGNS UP:
  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;

    try {
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          // role and onboardingCompleted use Prisma defaults
        }
      });

      console.log(`Success! User ${user.id} was created in the database.`);
    } catch (error) {
      console.error('Error creating user in database:', error);
      return new Response('Error saving user to database', { status: 500 })
    }
  }

  // Inside your POST function in app/api/webhooks/clerk/route.ts

if (eventType === 'user.deleted') {
  const { id } = evt.data; // This is the Clerk ID of the deleted user

  try {
    await prisma.user.delete({
      where: {
        clerkId: id,
      },
    });
    console.log(`User ${id} deleted from Supabase successfully.`);
  } catch (err) {
    console.error('Error deleting user from database:', err);
    // We return a 200 even on error to prevent Clerk from retrying 
    // a deletion that might have already happened.
    return new Response('User already gone or error occurred', { status: 200 });
  }
}

  return new Response('Webhook processed successfully', { status: 200 })
}