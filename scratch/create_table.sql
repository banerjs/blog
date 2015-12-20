CREATE TABLE IF NOT EXISTS posts (
 id bigserial primary key not null,
 url text not null unique CHECK (length(url) < 256),
 section integer not null,
 slide integer not null,
 html text,
 title text CHECK (length(title) <= 20),
 css text CHECK (length(css) < 256),
 created_date timestamp with time zone not null default now(),
 updated_date timestamp with time zone not null default now(),

 CONSTRAINT unique_section_slide UNIQUE (section, slide)
);

CREATE TABLE IF NOT EXISTS sections (
	id bigserial primary key not null,
	name text not null CHECK (length(name) <= 20),
	url text not null CHECK (length(url) < 256)
);
