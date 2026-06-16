import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SubscribeRequest {
  email: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ message: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { email }: SubscribeRequest = await req.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ message: "Invalid email address" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if email already subscribed
    const { data: existing, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      throw checkError;
    }

    if (existing) {
      return new Response(
        JSON.stringify({
          message: "Email already subscribed",
          subscribed: true,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Insert new subscriber
    const { data: inserted, error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: email.toLowerCase(),
          status: "active",
          source: "website",
          subscribed_at: new Date(),
        },
      ])
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        message: "Successfully subscribed to newsletter",
        subscriber: inserted?.[0],
      }),
      {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
