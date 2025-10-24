import { describe, it, expect } from 'vitest'
import { parseUDDF, formatDiveTime, getDiveDataAtTime } from '@/utils/uddfParser'

describe('UDDF Parser', () => {
  const sampleUDDF = `<?xml version="1.0" encoding="UTF-8"?>
<uddf version="3.2.3">
  <profiledata>
    <repetitiongroup>
      <dive>
        <informationbeforedive>
          <divenumber>1</divenumber>
          <datetime>2025-10-24T10:00:00+08:00</datetime>
          <airtemperature>25.0</airtemperature>
        </informationbeforedive>
        <informationafterdive>
          <diveduration>120</diveduration>
          <greatestdepth>20.5</greatestdepth>
          <averagedepth>15.2</averagedepth>
          <lowesttemperature>288.15</lowesttemperature>
        </informationafterdive>
        <samples>
          <waypoint>
            <divetime>0</divetime>
            <depth>0</depth>
            <temperature>293.15</temperature>
          </waypoint>
          <waypoint>
            <divetime>30</divetime>
            <depth>10.5</depth>
            <temperature>290.15</temperature>
          </waypoint>
          <waypoint>
            <divetime>60</divetime>
            <depth>20.5</depth>
            <temperature>288.15</temperature>
          </waypoint>
        </samples>
      </dive>
    </repetitiongroup>
  </profiledata>
</uddf>`

  it('should parse UDDF XML correctly', async () => {
    const result = await parseUDDF(sampleUDDF)
    
    expect(result).toBeDefined()
    expect(result.waypoints).toHaveLength(3)
    expect(result.metadata.diveDuration).toBe(120)
    expect(result.metadata.maxDepth).toBe(20.5)
  })

  it('should convert Kelvin to Celsius', async () => {
    const result = await parseUDDF(sampleUDDF)
    
    // 293.15K = 20°C
    expect(result.waypoints[0].temperature).toBeCloseTo(20, 1)
    // 288.15K = 15°C
    expect(result.waypoints[2].temperature).toBeCloseTo(15, 1)
  })

  it('should format dive time correctly', () => {
    expect(formatDiveTime(0)).toBe('00:00')
    expect(formatDiveTime(60)).toBe('01:00')
    expect(formatDiveTime(125)).toBe('02:05')
    expect(formatDiveTime(3661)).toBe('61:01')
  })

  it('should get dive data at specific time', async () => {
    const result = await parseUDDF(sampleUDDF)
    const data = getDiveDataAtTime(result.waypoints, 30)
    
    expect(data).toBeDefined()
    expect(data.divetime).toBe(30)
    expect(data.depth).toBe(10.5)
  })

  it('should throw error for invalid XML', async () => {
    await expect(parseUDDF('invalid xml')).rejects.toThrow()
  })
})
