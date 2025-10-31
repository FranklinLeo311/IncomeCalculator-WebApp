interface Place {
    'place name': string;
    'state': string;
    'state abbreviation': string;
}

interface RawZipData {
    'post code': string;
    'country': string;
    'country abbreviation': string;
    'places': Place[];
}
interface ZipData {
    'city': string;
    'state': string;
    'stateCode': string;
}

/**
 * Fetch city/state info from a ZIP code using Zippopotam.us API
 * @param zip U.S. ZIP code (e.g. "90210")
 * @returns Promise resolving to city/state data or throwing error
 */
export const fetchZipDetails = async (zip: any): Promise<ZipData> => {
    zip = String(zip) || ''
    if (!/^\d{5}$/.test(zip)) {
        throw new Error('Invalid ZIP code format. It should be 5 digits.');
    }

    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);

    if (!response.ok) {
        throw new Error('ZIP code not found or API error.');
    }

    const data: RawZipData = await response.json();
    const { places: [{ "place name": city, state, "state abbreviation": stateCode }] } = data
    return { city, state, stateCode };
};
