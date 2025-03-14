import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { processMessage, getUserChatHistory } from "@/app/lib/chatService";

// Handler for POST requests to send a new message
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Process the message
    const response = await processMessage(message);

    // Return the response
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}

// Handler for GET requests to retrieve chat history
export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user chat history
    const history = await getUserChatHistory();

    // Return the chat history
    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    return NextResponse.json(
      { error: "An error occurred retrieving chat history" },
      { status: 500 }
    );
  }
}