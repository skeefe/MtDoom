import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import firebase_app from '../../firebase/config';

const db = getFirestore(firebase_app);

export async function POST(request: Request) {
  try {
    // Log to confirm body is received correctly
    const body = await request.json();
    console.log("Received body:", body);

    const xmlData = body.xmlData;
    if (!xmlData) {
      console.error('No XML data provided.');
      return NextResponse.json({ error: 'No XML data provided in the request body.' }, { status: 400 });
    }

    // Parse XML data
    const parser = new XMLParser();
    const parsedData = parser.parse(xmlData);
    console.log("Parsed data:", parsedData);

    // Process parsed data and update Firestore
    const armiesToUpdate = parsedData?.armies?.army || [];
    for (const army of armiesToUpdate) {
      const armyRef = doc(db, "Armies", army.id);

      await updateDoc(armyRef, {
        units: army.units,
        points: army.points,
      });
    }

    return NextResponse.json({ message: 'Codex data updated successfully!' });
  } catch (error) {
    console.error('Error updating codex data:', error);
    return NextResponse.json({ error: 'Failed to update codex data' }, { status: 500 });
  }
}
