
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;
-- Tighten suggestions insert: require non-empty message (already enforced by CHECK but make policy explicit)
DROP POLICY "suggestions_public_insert" ON public.suggestions;
CREATE POLICY "suggestions_public_insert" ON public.suggestions
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(coalesce(message, '')) BETWEEN 1 AND 2000);
