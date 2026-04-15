import { env } from "$env/dynamic/private";
import { Pool, type PoolClient } from "pg";

const WHOOP_PROVIDER = "whoop";
const ACCESS_TOKEN_BUFFER_MS = 60_000;

type StoredWhoopTokenRow = {
  refresh_token: string;
  access_token: string | null;
  access_token_expires_at: Date | null;
};

type RefreshedWhoopTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

let pool: Pool | null = null;
let inMemoryAccessToken:
  | {
      token: string;
      expiresAtMs: number;
    }
  | null = null;

function getDatabaseUrl(): string {
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL not configured");
  }

  return databaseUrl;
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 3,
    });
  }

  return pool;
}

function isAccessTokenStillValid(expiresAt: Date | null): boolean {
  if (!expiresAt) {
    return false;
  }

  return expiresAt.getTime() > Date.now() + ACCESS_TOKEN_BUFFER_MS;
}

function setInMemoryAccessToken(token: string, expiresAt: Date): void {
  inMemoryAccessToken = {
    token,
    expiresAtMs: expiresAt.getTime(),
  };
}

function clearInMemoryAccessToken(): void {
  inMemoryAccessToken = null;
}

async function getStoredWhoopTokens(client?: PoolClient): Promise<StoredWhoopTokenRow | null> {
  const db = client ?? getPool();
  const result = await db.query<StoredWhoopTokenRow>(
    `
      SELECT refresh_token, access_token, access_token_expires_at
      FROM whoop_oauth_tokens
      WHERE provider = $1
    `,
    [WHOOP_PROVIDER],
  );

  return result.rows[0] ?? null;
}

export async function getWhoopAccessToken(
  refreshTokens: (refreshToken: string) => Promise<RefreshedWhoopTokens>,
): Promise<string> {
  if (inMemoryAccessToken && inMemoryAccessToken.expiresAtMs > Date.now()) {
    return inMemoryAccessToken.token;
  }

  clearInMemoryAccessToken();

  const storedTokens = await getStoredWhoopTokens();
  if (
    storedTokens?.access_token &&
    isAccessTokenStillValid(storedTokens.access_token_expires_at)
  ) {
    setInMemoryAccessToken(storedTokens.access_token, storedTokens.access_token_expires_at!);
    return storedTokens.access_token;
  }

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const lockedTokens = await client.query<StoredWhoopTokenRow>(
      `
        SELECT refresh_token, access_token, access_token_expires_at
        FROM whoop_oauth_tokens
        WHERE provider = $1
        FOR UPDATE
      `,
      [WHOOP_PROVIDER],
    );

    const currentTokens = lockedTokens.rows[0];
    if (!currentTokens?.refresh_token) {
      throw new Error("Missing WHOOP refresh token in Postgres");
    }

    if (
      currentTokens.access_token &&
      isAccessTokenStillValid(currentTokens.access_token_expires_at)
    ) {
      await client.query("COMMIT");
      setInMemoryAccessToken(
        currentTokens.access_token,
        currentTokens.access_token_expires_at!,
      );
      return currentTokens.access_token;
    }

    const refreshedTokens = await refreshTokens(currentTokens.refresh_token);
    const expiresAt = new Date(
      Date.now() + Math.max(refreshedTokens.expiresIn - 60, 1) * 1000,
    );

    await client.query(
      `
        UPDATE whoop_oauth_tokens
        SET refresh_token = $2,
            access_token = $3,
            access_token_expires_at = $4,
            updated_at = NOW()
        WHERE provider = $1
      `,
      [
        WHOOP_PROVIDER,
        refreshedTokens.refreshToken,
        refreshedTokens.accessToken,
        expiresAt,
      ],
    );

    await client.query("COMMIT");
    setInMemoryAccessToken(refreshedTokens.accessToken, expiresAt);

    return refreshedTokens.accessToken;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function upsertWhoopTokens(params: {
  refreshToken: string;
  accessToken: string | null;
  accessTokenExpiresAt: Date | null;
}): Promise<void> {
  await getPool().query(
    `
      INSERT INTO whoop_oauth_tokens (
        provider,
        refresh_token,
        access_token,
        access_token_expires_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (provider) DO UPDATE
      SET refresh_token = EXCLUDED.refresh_token,
          access_token = EXCLUDED.access_token,
          access_token_expires_at = EXCLUDED.access_token_expires_at,
          updated_at = NOW()
    `,
    [
      WHOOP_PROVIDER,
      params.refreshToken,
      params.accessToken,
      params.accessTokenExpiresAt,
    ],
  );

  if (params.accessToken && params.accessTokenExpiresAt) {
    setInMemoryAccessToken(params.accessToken, params.accessTokenExpiresAt);
    return;
  }

  clearInMemoryAccessToken();
}
