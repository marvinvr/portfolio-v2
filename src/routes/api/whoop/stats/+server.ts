import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  WHOOP_CLIENT_ID,
  WHOOP_CLIENT_SECRET,
} from "$env/static/private";
import {
  getWhoopRefreshToken,
  setWhoopRefreshToken,
  getWhoopAccessToken,
  setWhoopAccessToken,
  getCachedWhoopStats,
  setCachedWhoopStats,
} from "$lib/redis";

const WHOOP_API_BASE = "https://api.prod.whoop.com/developer/v1";

interface WhoopCycle {
  id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  score_state: string;
  score: {
    strain: number;
    kilojoule: number;
    average_heart_rate: number;
    max_heart_rate: number;
  };
}

interface WhoopRecovery {
  cycle_id: number;
  sleep_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  score_state: string;
  score: {
    user_calibrating: boolean;
    recovery_score: number;
    resting_heart_rate: number;
    hrv_rmssd_milli: number;
    spo2_percentage: number;
    skin_temp_celsius: number;
  };
}

interface WhoopSleep {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: string;
  score: {
    stage_summary: {
      total_in_bed_time_milli: number;
      total_awake_time_milli: number;
      total_no_data_time_milli: number;
      total_light_sleep_time_milli: number;
      total_slow_wave_sleep_time_milli: number;
      total_rem_sleep_time_milli: number;
      sleep_cycle_count: number;
      disturbance_count: number;
    };
    sleep_needed_baseline_milli: number;
    sleep_performance_percentage: number;
    sleep_consistency_percentage: number;
    sleep_efficiency_percentage: number;
  };
}

const WHOOP_TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

async function getAccessToken(): Promise<string> {
  // First try to get access token from Redis
  const cachedAccessToken = await getWhoopAccessToken();
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  // Get refresh token from Redis first, fallback to env variable
  let refreshToken = await getWhoopRefreshToken();
  
  // If not in Redis, use env variable and store it
  if (!refreshToken) {
	error(500, "Missing refresh token");
  }

  if (!refreshToken || !WHOOP_CLIENT_ID || !WHOOP_CLIENT_SECRET) {
    throw new Error("Missing required Whoop credentials");
  }

  // Clean up any potential whitespace issues
  const cleanRefreshToken = refreshToken.trim();
  const cleanClientId = WHOOP_CLIENT_ID.trim();
  const cleanClientSecret = WHOOP_CLIENT_SECRET.trim();

  // Create the request body as per Whoop documentation
  const bodyParams = {
    grant_type: "refresh_token",
    refresh_token: cleanRefreshToken,
    client_id: cleanClientId,
    client_secret: cleanClientSecret,
    scope: "offline" // The offline scope allows you to get a new refresh token and an access token
  };

  const requestBody = new URLSearchParams(bodyParams).toString();

  const response = await fetch(WHOOP_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  const tokenData: TokenResponse = await response.json();
  
  // Store the new tokens in Redis
  await setWhoopAccessToken(tokenData.access_token, tokenData.expires_in);
  await setWhoopRefreshToken(tokenData.refresh_token); // Update refresh token as it changes

  return tokenData.access_token;
}

async function fetchWhoopData<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T[]> {
  const accessToken = await getAccessToken();

  const url = new URL(`${WHOOP_API_BASE}/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    // Return empty array for 404 (no data available)
    if (response.status === 404) {
      return [];
    }
    throw new Error(
      `Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.records || [];
}

function calculateAverages(data: number[]): {
  monthly: number;
  annual?: number;
} {
  if (data.length === 0) return { monthly: 0 };

  // For simplicity, we'll use the recent data available
  // In a real implementation, you'd filter by date
  const recent30 = data.slice(0, Math.min(30, data.length));
  const monthly = recent30.reduce((sum, val) => sum + val, 0) / recent30.length;

  const result: { monthly: number; annual?: number } = {
    monthly: Math.round(monthly * 10) / 10,
  };

  // Only calculate annual if we have more than 40 values
  if (data.length > 40) {
    const recent365 = data.slice(0, Math.min(365, data.length));
    const annual = recent365.reduce((sum, val) => sum + val, 0) / recent365.length;
    result.annual = Math.round(annual * 10) / 10;
  }

  return result;
}

export const GET: RequestHandler = async () => {
  try {
    // Check for cached stats first
    const cachedStats = await getCachedWhoopStats();
    if (cachedStats) {
      return json(cachedStats);
    }

    // Use a 30 day window for data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString();

    const endDate = new Date().toISOString();

    // Fetch data from Whoop API
    const [cycles, recoveries, sleeps] = await Promise.all([
      fetchWhoopData<WhoopCycle>("cycle", {
        start: startDate,
        end: endDate,
        limit: "25",
      }),
      fetchWhoopData<WhoopRecovery>("recovery", {
        start: startDate,
        end: endDate,
        limit: "25",
      }),
      fetchWhoopData<WhoopSleep>("activity/sleep", {
        start: startDate,
        end: endDate,
        limit: "25",
      }),
    ]);

    // Extract values for calculations
    const strainValues = cycles
      .map((c) => c.score?.strain || 0)
      .filter((v) => v > 0);
    const recoveryValues = recoveries
      .map((r) => r.score?.recovery_score || 0)
      .filter((v) => v > 0);
    const hrvValues = recoveries
      .map((r) => r.score?.hrv_rmssd_milli || 0)
      .filter((v) => v > 0);
    const rhrValues = recoveries
      .map((r) => r.score?.resting_heart_rate || 0)
      .filter((v) => v > 0);
    const sleepEfficiencyValues = sleeps
      .map((s) => s.score?.sleep_efficiency_percentage || 0)
      .filter((v) => v > 0);
    const sleepDurationValues = sleeps
      .map((s) => {
        const totalSleep =
          (s.score?.stage_summary?.total_light_sleep_time_milli || 0) +
          (s.score?.stage_summary?.total_slow_wave_sleep_time_milli || 0) +
          (s.score?.stage_summary?.total_rem_sleep_time_milli || 0);
        return totalSleep / (1000 * 60 * 60); // Convert to hours
      })
      .filter((v) => v > 0);

    // Calculate averages
    const stats = {
      recovery: {
        latest: recoveries[0]?.score?.recovery_score || 0,
        ...calculateAverages(recoveryValues),
      },
      strain: {
        latest: cycles[0]?.score?.strain || 0,
        ...calculateAverages(strainValues),
      },
      hrv: {
        latest: recoveries[0]?.score?.hrv_rmssd_milli || 0,
        ...calculateAverages(hrvValues),
      },
      rhr: {
        latest: recoveries[0]?.score?.resting_heart_rate || 0,
        ...calculateAverages(rhrValues),
      },
      sleepEfficiency: {
        latest: sleeps[0]?.score?.sleep_efficiency_percentage || 0,
        ...calculateAverages(sleepEfficiencyValues),
      },
      sleepDuration: {
        latest: sleepDurationValues[0] || 0,
        ...calculateAverages(sleepDurationValues),
      },
      lastUpdated: new Date().toISOString(),
    };

    // Cache the stats for 1 day
    await setCachedWhoopStats(stats, 3600 * 24);

    return json(stats);
  } catch (err) {
    console.error("Failed to fetch Whoop stats:", err);
    error(500, `Failed to fetch Whoop stats: ${err}`);
  }
};
