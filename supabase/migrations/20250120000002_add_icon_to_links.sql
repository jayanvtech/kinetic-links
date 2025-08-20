-- Add icon column to links table
ALTER TABLE links ADD COLUMN icon text;

-- Update existing links with default icons based on URL patterns
UPDATE links 
SET icon = CASE 
  WHEN url ILIKE '%instagram%' THEN 'instagram'
  WHEN url ILIKE '%twitter%' OR url ILIKE '%x.com%' THEN 'twitter'
  WHEN url ILIKE '%github%' THEN 'github'
  WHEN url ILIKE '%linkedin%' THEN 'linkedin'
  WHEN url ILIKE '%youtube%' THEN 'youtube'
  WHEN url ILIKE '%tiktok%' THEN 'video'
  WHEN url ILIKE '%facebook%' THEN 'facebook'
  WHEN url ILIKE '%discord%' THEN 'messageCircle'
  WHEN url ILIKE '%spotify%' THEN 'music'
  WHEN url ILIKE '%twitch%' THEN 'video'
  ELSE 'link'
END
WHERE icon IS NULL;
