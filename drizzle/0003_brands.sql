CREATE TABLE IF NOT EXISTS "brands" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "image" text NOT NULL,
  "width" integer NOT NULL DEFAULT 200,
  "height" integer NOT NULL DEFAULT 60,
  "order" integer NOT NULL DEFAULT 0
);

-- Seed with the original static brand logos so the marquee keeps rendering
-- the same six logos until the CRM is used to edit them.
INSERT INTO "brands" ("name", "image", "width", "height", "order") VALUES
  ('Logoipsum', 'https://framerusercontent.com/images/OPToRxvhQd2ScvavfIOXuI6o.svg', 194, 37, 1),
  ('Velo Studio', 'https://framerusercontent.com/images/Ntc48i8GxNtzZe6K8P7DeRLzQ.svg', 256, 42, 2),
  ('Urban Bites', 'https://framerusercontent.com/images/9XfpXOcQrpiKYnZNcFlnYhYZVI.svg', 256, 42, 3),
  ('Baseline Sports', 'https://framerusercontent.com/images/2rq9YMILXCGw0qOqXvxaPhzIuWo.svg', 279, 42, 4),
  ('Northcap Supply', 'https://framerusercontent.com/images/rHPu3YfQxZrz1Xw15tIQTPQIsU.svg', 222, 40, 5),
  ('Logoipsum 2', 'https://framerusercontent.com/images/OEklTYyEPGkk7846aK5rBd4nfcs.svg', 220, 37, 6);
