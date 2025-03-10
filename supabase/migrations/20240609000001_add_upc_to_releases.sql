-- Add UPC code field to releases table
ALTER TABLE releases ADD COLUMN IF NOT EXISTS upc VARCHAR(13);

-- Create a function to generate UPC code when a release is published
CREATE OR REPLACE FUNCTION generate_upc_for_release()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate UPC for published releases that don't have one yet
  IF NEW.status = 'published' AND (NEW.upc IS NULL OR NEW.upc = '') THEN
    -- Generate a 12-digit number (UPC without check digit)
    NEW.upc = '0' || LPAD(FLOOR(RANDOM() * 100000000000)::TEXT, 11, '0');
    
    -- Calculate check digit (Luhn algorithm for UPC)
    DECLARE
      sum INTEGER := 0;
      i INTEGER;
      digit INTEGER;
      check_digit INTEGER;
    BEGIN
      -- Sum odd positions (1, 3, 5, ...) multiplied by 3
      FOR i IN 1..12 BY 2 LOOP
        digit := CAST(SUBSTRING(NEW.upc FROM i FOR 1) AS INTEGER);
        sum := sum + (digit * 3);
      END LOOP;
      
      -- Sum even positions (2, 4, 6, ...)
      FOR i IN 2..12 BY 2 LOOP
        digit := CAST(SUBSTRING(NEW.upc FROM i FOR 1) AS INTEGER);
        sum := sum + digit;
      END LOOP;
      
      -- Calculate check digit
      check_digit := (10 - (sum % 10)) % 10;
      
      -- Append check digit to UPC
      NEW.upc := NEW.upc || check_digit::TEXT;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for UPC generation
DROP TRIGGER IF EXISTS generate_upc_trigger ON releases;
CREATE TRIGGER generate_upc_trigger
BEFORE INSERT OR UPDATE OF status ON releases
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION generate_upc_for_release();

-- Add activity for UPC generation
CREATE OR REPLACE FUNCTION add_upc_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Only add activity when UPC is generated (was NULL before and now has value)
  IF (OLD.upc IS NULL OR OLD.upc = '') AND (NEW.upc IS NOT NULL AND NEW.upc != '') THEN
    INSERT INTO user_activity (
      user_id,
      activity_type,
      title,
      activity_time
    ) VALUES (
      NEW.artist_id,
      'upc-generated',
      'UPC код сгенерирован для релиза "' || NEW.title || '"',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for UPC activity
DROP TRIGGER IF EXISTS add_upc_activity_trigger ON releases;
CREATE TRIGGER add_upc_activity_trigger
AFTER UPDATE OF upc ON releases
FOR EACH ROW
EXECUTE FUNCTION add_upc_activity();
