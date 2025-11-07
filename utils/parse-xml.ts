import axios from 'axios';
import * as xml2js from 'xml2js';

export async function parseXML(filePath: string) {
  try {
    const response = await axios.get(filePath);
    const parser = new xml2js.Parser({ 
      explicitArray: false,
      mergeAttrs: true
    });
    
    return new Promise((resolve, reject) => {
      parser.parseString(response.data, (error: any, result: any) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw error;
  }
}