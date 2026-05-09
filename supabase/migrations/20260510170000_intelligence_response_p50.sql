-- M1.5 · Chunk 16 helper: P50 response time for the bottleneck card.
--
-- For each inbound message, find the next outbound from the same agent
-- in the same conversation; the gap is the response time. P50 over the
-- window gives the bottleneck card a stable metric without bias from
-- one stalled thread.

CREATE OR REPLACE FUNCTION public.intelligence_response_p50(
  org uuid,
  window_days integer
)
RETURNS jsonb
LANGUAGE sql STABLE
AS $$
  WITH paired AS (
    SELECT
      m1.id,
      m1.conversation_id,
      m1.sent_at AS inbound_at,
      (
        SELECT m2.sent_at
        FROM messages m2
        WHERE m2.conversation_id = m1.conversation_id
          AND m2.direction = 'outbound'
          AND m2.sent_at > m1.sent_at
        ORDER BY m2.sent_at ASC
        LIMIT 1
      ) AS first_reply_at,
      c.channel
    FROM messages m1
    JOIN conversations c ON c.id = m1.conversation_id
    WHERE c.org_id = org
      AND m1.direction = 'inbound'
      AND m1.sent_at > now() - (window_days || ' days')::interval
  ),
  gaps AS (
    SELECT
      EXTRACT(EPOCH FROM (first_reply_at - inbound_at)) / 60 AS minutes,
      channel
    FROM paired
    WHERE first_reply_at IS NOT NULL
  )
  SELECT jsonb_build_object(
    'p50_minutes', percentile_cont(0.5) WITHIN GROUP (ORDER BY minutes),
    'channel', mode() WITHIN GROUP (ORDER BY channel)
  )
  FROM gaps;
$$;
