import db from "../../../db";
import { advocates } from "../../../db/schema";
//import { advocateData } from "../../../db/seed/advocates";
import { NextRequest } from "next/server";
import { sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const limit = parseInt(searchParams.get("limit") || "20");
      const offset = parseInt(searchParams.get("offset") || "0");

      const specialties = searchParams.getAll("specialty");
      let data;

      if (specialties.length > 0) {
        data = await db
          .select()
          .from(advocates)
          .where(
            sql`${advocates.specialties} && ARRAY[${sql.join(
              specialties.map((s) => sql`${s}`),
              sql`,`
            )}]::text[]`
          )
          .limit(limit)
          .offset(offset);
      } else {
        data = await db.select().from(advocates).limit(limit).offset(offset);
      }

      return Response.json({ data });
    } catch (error) {
      console.error("API error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  
  //const data = advocateData; // no longer needed. using live DB;