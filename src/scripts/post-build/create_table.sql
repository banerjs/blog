CREATE TABLE IF NOT EXISTS posts (
	id bigserial primary key not null,
	url text not null unique CHECK (length(url) < 256),
	section bigint not null,
	slide bigint not null,
	filename text not null unique CHECK (length(filename) < 256),
	title text CHECK (length(title) <= 20),
	css text CHECK (length(css) < 256),
	created_date timestamp with time zone not null default now(),
	updated_date timestamp with time zone not null default now(),

	CONSTRAINT unique_section_slide UNIQUE (section, slide)
);

CREATE TABLE IF NOT EXISTS sections (
	id bigserial primary key not null,
	name text not null CHECK (length(name) <= 20),
	foldername text not null unique CHECK (length(foldername) <= 20),
	url text not null unique CHECK (length(url) < 256),
	priority bigint not null,
	index_filename text CHECK(length(index_filename) < 256)
);
