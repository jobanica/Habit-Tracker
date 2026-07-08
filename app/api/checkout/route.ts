import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/xendit";
import { insertPending } from "@/lib/purchases";
import { isValidEmail, shortId } from "@/lib/format";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let email: string;
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const externalId = `order_${shortId()}`;

  try {
    const invoice = await createInvoice({ externalId, email });

    await insertPending({
      externalId,
      email,
      xenditInvoiceId: invoice.id,
    });

    return NextResponse.json({ url: invoice.invoice_url });
  } catch (err) {
    console.error("[checkout] failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
