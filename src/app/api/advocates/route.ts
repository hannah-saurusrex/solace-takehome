import db from "../../../db";
import { advocates } from "../../../db/schema";
//import { advocateData } from "../../../db/seed/advocates";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = parseInt(searchParams.get("limit") || ("20"));
  const offset = parseInt(searchParams.get("offset") || "0");
  
  // Uncomment this line to use a database
  const data = await db
    .select()
    .from(advocates)
    .limit(limit)
    .offset(offset);

  //const data = advocateData; // no longer needed. using live DB;

  return Response.json({ data });
}
