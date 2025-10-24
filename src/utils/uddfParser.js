/**
 * UDDF Parser for Atmos App exported dive logs
 * Parses UDDF 3.2.3 format XML files
 */

/**
 * Convert Kelvin to Celsius
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} - Temperature in Celsius
 */
function kelvinToCelsius(kelvin) {
  return kelvin - 273.15
}

/**
 * Parse UDDF XML string and extract dive data
 * @param {string} xmlString - UDDF XML content
 * @returns {Promise<Object>} - Parsed dive data
 */
export async function parseUDDF(xmlString) {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('Invalid XML format')
    }

    // Extract dive information
    const dive = xmlDoc.querySelector('dive')
    if (!dive) {
      throw new Error('No dive data found in UDDF file')
    }

    // Extract waypoints
    const waypointElements = xmlDoc.querySelectorAll('waypoint')
    const waypoints = Array.from(waypointElements).map((waypoint) => {
      const divetime = parseFloat(waypoint.querySelector('divetime')?.textContent || 0)
      const depth = parseFloat(waypoint.querySelector('depth')?.textContent || 0)
      const temperature = parseFloat(waypoint.querySelector('temperature')?.textContent || 0)

      return {
        divetime, // seconds
        depth, // meters
        temperature: kelvinToCelsius(temperature), // Convert Kelvin to Celsius
        temperatureRaw: temperature, // Keep original Kelvin value
      }
    })

    // Extract dive metadata
    const informationAfterDive = xmlDoc.querySelector('informationafterdive')
    const informationBeforeDive = xmlDoc.querySelector('informationbeforedive')

    const metadata = {
      diveDuration: parseFloat(
        informationAfterDive?.querySelector('diveduration')?.textContent || 0
      ),
      maxDepth: parseFloat(informationAfterDive?.querySelector('greatestdepth')?.textContent || 0),
      averageDepth: parseFloat(
        informationAfterDive?.querySelector('averagedepth')?.textContent || 0
      ),
      minTemperature: kelvinToCelsius(
        parseFloat(informationAfterDive?.querySelector('lowesttemperature')?.textContent || 0)
      ),
      diveNumber: parseInt(informationBeforeDive?.querySelector('divenumber')?.textContent || 0),
      datetime: informationBeforeDive?.querySelector('datetime')?.textContent || '',
      airTemperature: parseFloat(
        informationBeforeDive?.querySelector('airtemperature')?.textContent || 0
      ),
      surfacePressure: parseFloat(
        informationBeforeDive?.querySelector('surfacepressure')?.textContent || 0
      ),
    }

    // Extract diver information
    const owner = xmlDoc.querySelector('owner')
    const diverInfo = {
      id: owner?.getAttribute('id') || '',
      firstName: owner?.querySelector('firstname')?.textContent || '',
      lastName: owner?.querySelector('lastanme')?.textContent || '', // Note: typo in UDDF spec
    }

    // Extract equipment information
    const divecomputer = xmlDoc.querySelector('divecomputer')
    const equipment = {
      id: divecomputer?.getAttribute('id') || '',
      name: divecomputer?.querySelector('name')?.textContent || '',
      manufacturer: divecomputer?.querySelector('manufacturer name')?.textContent || '',
      model: divecomputer?.querySelector('model')?.textContent || '',
      serialNumber: divecomputer?.querySelector('serialnumber')?.textContent || '',
    }

    return {
      waypoints,
      metadata,
      diverInfo,
      equipment,
      diveDuration: metadata.diveDuration,
      maxDepth: metadata.maxDepth,
      minTemperature: metadata.minTemperature,
    }
  } catch (error) {
    console.error('Error parsing UDDF:', error)
    throw new Error(`Failed to parse UDDF file: ${error.message}`)
  }
}

/**
 * Read and parse UDDF file
 * @param {File} file - UDDF file to parse
 * @returns {Promise<Object>} - Parsed dive data
 */
export async function parseUDDFFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const xmlString = e.target.result
        const parsedData = await parseUDDF(xmlString)
        resolve(parsedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Format dive time as MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export function formatDiveTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get dive data at specific time
 * @param {Array} waypoints - Array of waypoints
 * @param {number} time - Time in seconds
 * @returns {Object|null} - Dive data at specified time
 */
export function getDiveDataAtTime(waypoints, time) {
  if (!waypoints || waypoints.length === 0) {
    return null
  }

  // Find the closest waypoint
  const closest = waypoints.reduce((prev, curr) => {
    return Math.abs(curr.divetime - time) < Math.abs(prev.divetime - time) ? curr : prev
  })

  return closest
}
