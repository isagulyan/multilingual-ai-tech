
-- Create a security-definer function so anon users can safely increment
-- view counts without needing UPDATE permission on the articles table.
CREATE OR REPLACE FUNCTION increment_article_view(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE articles
  SET view_count = view_count + 1
  WHERE id = article_id AND status = 'published';
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION increment_article_view(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_article_view(uuid) TO authenticated;
