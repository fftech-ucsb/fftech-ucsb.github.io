const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: 'index.html' },
  { id: 'people', label: 'People', href: 'people.html' },
  { id: 'research', label: 'Research', href: 'research.html' },
  { id: 'projects', label: 'Projects', href: 'projects.html' },
  { id: 'events', label: 'Events', href: 'events.html' },
  { id: 'sponsors', label: 'Sponsors', href: 'sponsors.html' }
];

function renderNav(activePage) {
  const el = document.getElementById('nav-placeholder');
  if (!el) return;

  const links = NAV_ITEMS.map(item => {
    const active = item.id === activePage ? ' active' : '';
    const current = item.id === activePage ? ' aria-current="page"' : '';
    return `<li class="nav-item">
      <a class="nav-link${active}" href="${item.href}"${current}>${item.label}</a>
    </li>`;
  }).join('');

  el.innerHTML = `
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="index.html">
          Fftech Research Lab
          <span>UCSB Computer Science</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto">${links}</ul>
        </div>
      </div>
    </nav>`;
}

function renderFooter() {
  const el = document.getElementById('footer-placeholder');
  if (!el) return;

  el.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5>Contact</h5>
            <p>
              <i class="bi bi-envelope"></i>
              <a href="mailto:fftech@cs.ucsb.edu">fftech@cs.ucsb.edu</a>
            </p>
          </div>
          <div class="col-md-4 mb-3 text-center">
            <img src="thumbs/fftech-logo-thumb.png" alt="Fftech Lab Logo" class="footer-logo">
          </div>
          <div class="col-md-4 mb-3">
            <h5>Address</h5>
            <p>
              Fftech Research Laboratory<br>
              5120a Harold Frank Hall<br>
              UC Santa Barbara<br>
              Santa Barbara, CA
            </p>
          </div>
        </div>
        <div class="footer-bottom text-center">
          &copy; ${new Date().getFullYear()} Fftech Research Lab, UC Santa Barbara
        </div>
      </div>
    </footer>`;
}

function getInitials(name) {
  return name.split(' ')
    .filter(p => p.length > 0)
    .map(p => p[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

function personPhotoHTML(member) {
  if (member.photo) {
    return `<img src="${member.photo}" alt="${member.name}" class="person-avatar">`;
  }
  return `<div class="person-initials">${getInitials(member.name)}</div>`;
}

function personLinksHTML(member) {
  const parts = [];
  if (member.email) {
    parts.push(`<a href="mailto:${member.email}"><i class="bi bi-envelope"></i> ${member.email}</a>`);
  }
  if (member.website) {
    parts.push(`<a href="${member.website}" target="_blank"><i class="bi bi-globe"></i> Website</a>`);
  }
  for (const [label, url] of Object.entries(member.links || {})) {
    parts.push(`<a href="${url}" target="_blank"><i class="bi bi-link-45deg"></i> ${label}</a>`);
  }
  return parts.length ? `<div class="contact-links mt-2">${parts.join(' &nbsp; ')}</div>` : '';
}

function renderPersonRow(member) {
  return `
    <div class="card person-card mb-3">
      <div class="card-body d-flex gap-4 align-items-start flex-wrap flex-sm-nowrap">
        ${personPhotoHTML(member)}
        <div>
          <h5 class="card-title mb-1">${member.name}</h5>
          <div class="role">${member.role}</div>
          ${member.bio ? `<p class="bio mt-2 mb-1">${member.bio}</p>` : ''}
          ${personLinksHTML(member)}
        </div>
      </div>
    </div>`;
}

async function renderPeople(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  try {
    const res = await fetch('data/people.json');
    const data = await res.json();
    let html = '';

    const alumni = [];
    const current = [];

    for (const section of data.sections) {
      if (section.id === 'alumni') {
        alumni.push(...section.members);
      } else {
        current.push(...section.members);
      }
    }

    for (const m of current) {
      html += renderPersonRow(m);
    }

    if (alumni.length > 0) {
      html += '<h3 class="section-title" id="alumni">Alumni</h3>';
      for (const m of alumni) {
        html += renderPersonRow(m);
      }
    }

    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = '<p class="text-muted">Unable to load people data.</p>';
  }
}

async function renderEvents(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  try {
    const res = await fetch('data/events.json');
    const data = await res.json();
    let html = '';

    if (data.recurring) {
      html += `
        <div class="recurring-banner">
          <strong><i class="bi bi-calendar-week"></i> ${data.recurring.title}</strong>
          — ${data.recurring.schedule}<br>
          <small class="text-muted">${data.recurring.description}</small>
        </div>`;
    }

    data.events.forEach((event, idx) => {
      const links = Object.entries(event.links || {}).map(([label, url]) =>
        `<a href="${url}" target="_blank" class="btn btn-sm btn-outline-primary me-2"><i class="bi bi-box-arrow-up-right"></i> ${label}</a>`
      ).join('');

      let media = '';
      const photos = event.photos || [];
      if (photos.length > 1) {
        const carouselId = `carousel-${event.id}`;
        const indicators = photos.map((_, i) =>
          `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}"${i === 0 ? ' class="active"' : ''}></button>`
        ).join('');
        const slides = photos.map((p, i) =>
          `<div class="carousel-item${i === 0 ? ' active' : ''}"><img src="${p}" alt="Event photo" loading="lazy"></div>`
        ).join('');
        media = `
          <div id="${carouselId}" class="carousel slide event-carousel mb-3" data-bs-ride="carousel">
            <div class="carousel-indicators">${indicators}</div>
            <div class="carousel-inner rounded">${slides}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>`;
      } else if (photos.length === 1) {
        media = `<img src="${photos[0]}" alt="${event.title}" class="img-fluid rounded mb-3 event-hero-img" loading="lazy">`;
      } else if (event.image) {
        media = `<img src="${event.image}" alt="${event.title}" class="img-fluid rounded mb-3 event-hero-img" loading="lazy">`;
      }

      html += `
        <div class="card event-card mb-4">
          <div class="card-body">
            <div class="event-date mb-1">${event.displayDate}</div>
            <h4 class="event-title mb-3">${event.title}</h4>
            ${media}
            <p>${event.description}</p>
            ${links ? `<div class="mt-2">${links}</div>` : ''}
          </div>
        </div>`;
    });

    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = '<p class="text-muted">Unable to load events data.</p>';
  }
}

async function renderProjects(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  try {
    const res = await fetch('data/projects.json');
    const data = await res.json();
    let html = '';

    html += '<h3 class="section-title">Research Projects</h3>';
    html += '<div class="row">';
    for (const proj of data.research) {
      const partners = (proj.partners || []).map(p =>
        `<span class="badge bg-light text-dark border me-1">${p}</span>`
      ).join('');

      const venue = proj.venue
        ? `<span class="badge bg-primary me-2">${proj.venue}</span>`
        : '';

      const paperLink = proj.paper
        ? `<a href="${proj.paper}" target="_blank" class="btn btn-sm btn-outline-primary mt-2"><i class="bi bi-file-text"></i> Paper</a>`
        : '';

      const img = proj.image
        ? `<img src="${proj.image}" alt="${proj.title}" class="card-img-top" style="max-height: 200px; object-fit: cover;" loading="lazy">`
        : '';

      html += `
        <div class="col-md-6 mb-4">
          <div class="card project-card">
            ${img}
            <div class="card-body">
              <h5 class="card-title text-navy">${proj.title}</h5>
              <p class="card-text">${proj.description}</p>
              ${proj.details ? `<p class="card-text"><small class="text-muted">${proj.details}</small></p>` : ''}
              <div>${venue}${partners}</div>
              ${paperLink}
            </div>
          </div>
        </div>`;
    }
    html += '</div>';

    html += '<h3 class="section-title">Capstone Projects</h3>';
    html += '<div class="row">';
    for (const proj of data.capstone) {
      const members = (proj.members || []).join(', ');

      html += `
        <div class="col-md-6 mb-4">
          <div class="card project-card">
            <div class="card-body">
              <h5 class="card-title text-navy">${proj.title}</h5>
              <p class="card-text">${proj.description}</p>
              <div class="mt-2">
                <small class="text-muted">
                  <strong>Sponsor:</strong> ${proj.sponsor} &nbsp;
                  <strong>Team:</strong> ${proj.team}
                </small>
              </div>
              ${members ? `<div class="mt-1"><small class="text-muted">${members}</small></div>` : ''}
            </div>
          </div>
        </div>`;
    }
    html += '</div>';

    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = '<p class="text-muted">Unable to load projects data.</p>';
  }
}

async function renderSponsors(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  try {
    const res = await fetch('data/sponsors.json');
    const data = await res.json();
    let html = '<div class="row">';

    for (const sponsor of data.sponsors) {
      const logo = sponsor.logo
        ? `<img src="${sponsor.logo}" alt="${sponsor.name}" class="sponsor-logo">`
        : `<div class="sponsor-placeholder">${sponsor.name}</div>`;

      const link = sponsor.url ? ` href="${sponsor.url}" target="_blank"` : '';

      html += `
        <div class="col-md-4 mb-4">
          <div class="card sponsor-card">
            <div class="card-body">
              <a${link}>${logo}</a>
              <h5 class="card-title text-navy mt-2">${sponsor.name}</h5>
              ${sponsor.description ? `<p class="card-text"><small class="text-muted">${sponsor.description}</small></p>` : ''}
            </div>
          </div>
        </div>`;
    }

    html += '</div>';
    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = '<p class="text-muted">Unable to load sponsors data.</p>';
  }
}

async function renderSponsorStrip(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  try {
    const res = await fetch('data/sponsors.json');
    const data = await res.json();
    let html = '';

    for (const sponsor of data.sponsors) {
      if (!sponsor.logo) continue;
      const link = sponsor.url ? ` href="${sponsor.url}" target="_blank"` : '';
      html += `<a${link} title="${sponsor.name}"><img src="${sponsor.logo}" alt="${sponsor.name}"></a>`;
    }

    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = '';
  }
}
