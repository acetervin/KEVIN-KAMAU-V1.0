var archiveProjects = [];
var archiveCopy = {
  intro: 'Selected builds with live links, repos, and full breakdowns.',
  ledger: 'Short reads for each project: what it is, what it does, and where to inspect it.',
  stats: {
    projects: 'Projects shipped',
    live: 'Live client and product work',
    stacks: 'Primary tools used across the set'
  },
  summaries: {
    0: {
      desc: 'Restaurant ordering system with customer, kitchen, and admin flows.',
      note: 'Built around PHP, MySQL, role-based access, and live order updates.'
    },
    1: {
      desc: 'TypeScript admin dashboard with tables, charts, and role management.',
      note: 'Focused on typed React patterns, reusable UI, and cleaner state handling.'
    },
    2: {
      desc: 'Python automation work covering scraping, AI helpers, and cloud experiments.',
      note: 'An active sandbox for tooling, data pipelines, and deployment trials.'
    },
    3: {
      desc: 'NGO website for programmes, events, and donor-facing communication.',
      note: 'Client work built for clarity, speed, and mobile-first access.'
    },
    4: {
      desc: 'Interior studio portfolio built around large imagery and editorial layout.',
      note: 'Designed to feel premium without sacrificing load time or usability.'
    },
    5: {
      desc: 'Real-estate site with listings, content updates, and ongoing maintenance.',
      note: 'The work spans feature delivery, CMS updates, and long-tail upkeep.'
    },
    6: {
      desc: 'Next.js commerce build with storefront, admin tools, and M-Pesa checkout.',
      note: 'Combines Supabase auth, product ops, and payment flow control.'
    }
  }
};

function archiveTitle(project) {
  return lang === 'ar' && project.titleAr ? project.titleAr : project.title;
}

function archiveSummaryCopy(project) {
  return archiveCopy.summaries[project.id] || null;
}

function archiveDesc(project) {
  var summary = archiveSummaryCopy(project);
  if (summary && summary.desc) return summary.desc;
  return lang === 'ar' && project.descAr ? project.descAr : project.desc;
}

function archiveEyebrow(project) {
  return lang === 'ar' && project.eyebrowAr ? project.eyebrowAr : project.eyebrow;
}

function archiveDisplayStatus(project) {
  if (project.statusLabel) return project.statusLabel;
  if (project.status === 'live') return 'Live';
  if (project.status === 'wip') return 'In Progress';
  return 'Complete';
}

function archivePrimaryActionHTML(project) {
  if (project.live) {
    return '<a href="' + project.live + '" target="_blank" data-browser="true" class="p-link p-link-pri">' +
      'Open Site' +
    '</a>';
  }

  if (project.github) {
    return '<a href="' + project.github + '" target="_blank" data-browser="true" class="p-link p-link-pri">' +
      'Open Repo' +
    '</a>';
  }

  return '';
}

function archiveSecondaryActionHTML(project) {
  if (project.live && project.github) {
    return '<a href="' + project.github + '" target="_blank" data-browser="true" class="p-link p-link-sec">' +
      'Open Repo' +
    '</a>';
  }

  return '';
}

function archiveOverview(project) {
  var summary = archiveSummaryCopy(project);
  if (summary && summary.note) return summary.note;
  var overview = lang === 'ar' && project.overviewAr ? project.overviewAr : project.overview;
  return overview && overview.length ? overview[0] : archiveDesc(project);
}

function archiveCover(project) {
  if (project.gallery && project.gallery.length && project.gallery[0].img) {
    return project.gallery[0];
  }

  return {
    img: '',
    caption: archiveTitle(project),
    label: archiveTitle(project)
  };
}

function archiveThumbs(project) {
  return project.gallery && project.gallery.length > 1 ? project.gallery.slice(1, 3) : [];
}

function archiveTagsHTML(tags) {
  return '<div class="p-tags">' + tags.slice(0, 5).map(function(tag) {
    return '<span class="p-tag">' + tag + '</span>';
  }).join('') + '</div>';
}

function archiveActionsHTML(project) {
  return '<div class="p-actions">' +
    archivePrimaryActionHTML(project) +
    archiveSecondaryActionHTML(project) +
    '<a href="project-details.html?p=' + project.id + '" class="p-link p-link-sec">Full Breakdown</a>' +
  '</div>';
}

function archiveStatCardHTML(label, value, note) {
  return '<div class="projects-archive-stat">' +
    '<span class="projects-archive-stat-label">' + label + '</span>' +
    '<strong class="projects-archive-stat-value">' + value + '</strong>' +
    '<span class="projects-archive-stat-note">' + note + '</span>' +
  '</div>';
}

function renderArchiveStats(projects) {
  var host = document.getElementById('projects-archive-stats');
  if (!host) return;

  var liveCount = projects.filter(function(project) { return project.status === 'live'; }).length;
  var uniqueTags = {};

  projects.forEach(function(project) {
    project.tags.forEach(function(tag) {
      uniqueTags[tag] = true;
    });
  });

  host.innerHTML = [
    archiveStatCardHTML('Projects', String(projects.length).padStart(2, '0'), archiveCopy.stats.projects),
    archiveStatCardHTML('Live Launches', String(liveCount).padStart(2, '0'), archiveCopy.stats.live),
    archiveStatCardHTML('Core Stacks', String(Object.keys(uniqueTags).length).padStart(2, '0'), archiveCopy.stats.stacks)
  ].join('');
}

function renderSpotlight(project) {
  var host = document.getElementById('projects-spotlight');
  if (!host || !project) return;

  var cover = archiveCover(project);

  host.innerHTML = '<div class="projects-spotlight-media fi vis">' +
    (cover.img ? '<img src="' + cover.img + '" alt="' + cover.caption + '" loading="lazy" />' : '') +
    '<div class="projects-spotlight-overlay"></div>' +
    '<div class="projects-spotlight-caption">' +
      '<span class="projects-spotlight-label">Latest Build</span>' +
      '<strong>' + cover.label + '</strong>' +
    '</div>' +
  '</div>' +
  '<div class="projects-spotlight-copy fi vis">' +
    '<p class="projects-kicker">' + archiveEyebrow(project) + '</p>' +
    '<h2 class="projects-spotlight-title">' + archiveTitle(project) + '</h2>' +
    '<p class="projects-spotlight-desc">' + archiveDesc(project) + '</p>' +
    '<div class="projects-meta-strip">' +
      '<span class="projects-meta-chip">' + archiveDisplayStatus(project) + '</span>' +
      '<span class="projects-meta-chip">' + project.type + '</span>' +
      '<span class="projects-meta-chip">' + project.year + '</span>' +
    '</div>' +
    archiveTagsHTML(project.tags) +
    '<div class="projects-stack-list">' + project.stack.slice(0, 4).map(function(item) {
      return '<div class="projects-stack-entry">' +
        '<span>' + item.name + '</span>' +
        '<span>' + item.role + '</span>' +
      '</div>';
    }).join('') + '</div>' +
    archiveActionsHTML(project) +
  '</div>';
}

function archiveProjectRowHTML(project, rowIndex) {
  var cover = archiveCover(project);
  var thumbs = archiveThumbs(project);

  return '<article class="archive-project-row' + (rowIndex % 2 ? ' alt' : '') + ' fi vis">' +
    '<div class="archive-project-media">' +
      '<div class="archive-project-cover">' +
        (cover.img ? '<img src="' + cover.img + '" alt="' + cover.caption + '" loading="lazy" />' : '') +
        '<div class="archive-project-cover-caption">' +
          '<span>' + project.num + '</span>' +
          '<strong>' + cover.caption + '</strong>' +
        '</div>' +
      '</div>' +
      '<div class="archive-project-thumbs">' + thumbs.map(function(item) {
        return '<div class="archive-project-thumb">' +
          (item.img ? '<img src="' + item.img + '" alt="' + item.caption + '" loading="lazy" />' : '') +
          '<span>' + item.label + '</span>' +
        '</div>';
      }).join('') + '</div>' +
    '</div>' +
    '<div class="archive-project-copy">' +
      '<div class="archive-project-head">' +
        '<div>' +
          '<div class="archive-project-index">Project ' + project.num + '</div>' +
          '<h3 class="archive-project-title">' + archiveTitle(project) + '</h3>' +
        '</div>' +
        '<span class="archive-project-status">' + archiveDisplayStatus(project) + '</span>' +
      '</div>' +
      '<p class="archive-project-desc">' + archiveDesc(project) + '</p>' +
      '<div class="archive-project-details">' +
        '<span class="archive-project-detail">' + project.type + '</span>' +
        '<span class="archive-project-detail">' + project.year + '</span>' +
        '<span class="archive-project-detail">' + project.role + '</span>' +
      '</div>' +
      '<p class="archive-project-overview">' + archiveOverview(project) + '</p>' +
      archiveTagsHTML(project.tags) +
      archiveActionsHTML(project) +
    '</div>' +
  '</article>';
}

function renderLedger(projects) {
  var host = document.getElementById('projects-ledger');
  if (!host) return;

  host.innerHTML = projects.map(function(project, rowIndex) {
    return archiveProjectRowHTML(project, rowIndex);
  }).join('');
}

function renderArchiveCopy() {
  var intro = document.getElementById('projects-archive-intro');
  var ledger = document.getElementById('projects-ledger-copy');

  if (intro) {
    intro.textContent = archiveCopy.intro;
  }

  if (ledger) {
    ledger.textContent = archiveCopy.ledger;
  }
}

function renderProjectsArchive() {
  if (!archiveProjects.length) return;

  var orderedProjects = archiveProjects.slice().sort(function(a, b) {
    return b.id - a.id;
  });

  var featuredProject = orderedProjects[0];
  var remainingProjects = orderedProjects.slice(1);

  renderArchiveCopy();
  renderArchiveStats(archiveProjects);
  renderSpotlight(featuredProject);
  renderLedger(remainingProjects);
}

fetch('data/projects.json')
  .then(function(response) { return response.json(); })
  .then(function(projects) {
    archiveProjects = projects;
    renderProjectsArchive();
  })
  .catch(function(err) {
    console.error('Failed to load archive projects:', err);
    var spotlight = document.getElementById('projects-spotlight');
    if (spotlight) {
      spotlight.innerHTML = '<div class="pd-info-card"><span class="pd-info-label">// projects_error</span><p class="p-desc">Could not load projects right now. Run the site through the local server and try again.</p></div>';
    }

    var ledger = document.getElementById('projects-ledger');
    if (ledger) ledger.innerHTML = '';
  });
