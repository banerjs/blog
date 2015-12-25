CREATE TABLE IF NOT EXISTS posts (
 id bigserial primary key not null,
 url text not null unique CHECK (length(url) < 256),
 section bigint not null,
 slide bigint not null,
 html text,
 title text CHECK (length(title) <= 20),
 css text CHECK (length(css) < 256),
 created_date timestamp with time zone not null default now(),
 updated_date timestamp with time zone not null default now(),

 CONSTRAINT unique_section_slide UNIQUE (section, slide)
);

CREATE TABLE IF NOT EXISTS sections (
	id bigserial primary key not null,
	name text not null unique CHECK (length(name) <= 20),
	url text not null unique CHECK (length(url) < 256),
	priority bigint not null
);

insert into posts (url, section, slide, html, css) values
	('/', 1, 1, '<div>
<section class="text-center container-fluid">
	<h1 class="row">Siddhartha Banerjee</h1>
	<h1 class="row"><small>Graduate Student</small></h1>
	<ul class="list-inline row">
		<li><a href="/about"><h5>About</h5></a></li>
	</ul>
</section>
</div>
', 'home/home.css');
insert into posts (url, title, section, slide, html, css) values
	('/about', 'About', 1, 2, '<article class="container">
<section>
<h1>About</h1>
<p>Hello! Welcome to my website. As a researcher in training at Georgia Tech, I plan to use the site as a place to share my thoughts and showcase my work. Although this site is my personal message board, I hope to be able to use it to conduct dialogues with others in the not too distant future.</p>
</section>

<section>
<h3>Research Interests</h3>
<p>I am a Ph.D. student in Robotics with the bulk of my research focus being in the area of Human Robot Interaction and how we can improve or augment it. This involves exploring human foibles and ensuring that robots are robust to them, and it also involves supplementing robot intelligence with notions similar to that of &quot;common sense&quot;. Keep an eye on this website, I''ll be sure to update it as my thoughts and research develop.</p>
</section>

<section>
<h3>Background</h3>
<p>Before beginning my graduate studies, I was a software developer at <a href="https://www.redfin.com" target="_blank">Redfin</a>. A member of the Data team (3..2..1..Data!), I helped Redfin ingest housing information from numerous real estate brokerage consortium (MLS) databases and display the data on the website. I also helped gather GIS data for the different geographical regions in the U.S. and calculate aggregate housing metrics in each of those regions. My time at Redfin was incredibly fulfilling and I honed many of my software development skills there.</p>

<p>Prior to Redfin, I was at Yale majoring in Electrical Engineering and Computer Science. A majority of my time was spent as part of the <a href="http://bulldogsracing.com/" target="_blank">Bulldogs Racing</a> team helping with the electrical systems, but I also had the opportunity to try my hand at an online <a href="http://cbey.yale.edu/our-impact/sobotka-stories-guide-finder" target="_blank">startup</a> with my roommates. With plenty of other projects on the side, I concluded my studies with an exploration of multi-agent complex dynamical systems with Professor Kumpati Narendra. Of course, my time at Yale was not all about the work: I had the chance to meet incredible people, forge lifelong friendships, and participate in an ecosystem that forever changed my outlook on life. Yale, particularly TD, will always be a part of me.</p>
</section>

<section>
<h3>Get in touch!</h3>
<p>In addition to my research interests, I love traveling, hiking, rock climbing, playing soccer, and exploring new places to eat. If you have ideas on any of these topics, are itching for a debate, or simply want to get in touch, I would love to hear from you. Feel free to email me, follow me on GitHub, or reach out via LinkedIn.</p>
</section>

<section id="contact_links">
<div class="col-sm-4 text-center">
	<a href="mailto:banerjs.sid@banerjs.com">
	<span class="glyphicon glyphicon-envelope"></span>
	</a>
</div>
<div class="col-sm-4">
	<a href="https://github.com/banerjs" target="_blank">
	<img src="/public/images/GitHub-Mark-64px.png" alt="GitHub" class="img-responsive center-block">
	</a>
</div>
<div class="col-sm-4">
	<a href="https://www.linkedin.com/in/banerjs" target="_blank">
	<img src="/public/images/In-Black-66px-R.png" alt="LinkedIn" class="img-responsive center-block">
	</a>
</div>
</section>
</article>
', 'home/about.css');

insert into sections (name, url, priority) values
	('Home', '/', 1),
	('Blog', '/blog', 2),
	('Travels', '/travels', 3);
