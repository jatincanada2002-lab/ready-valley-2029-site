const DATA_URL = "./proposal-data.json";

const CATEGORY_FILTERS = [
  ["all", "All Sections"],
  ["charter-scope", "Charter & Scope"],
  ["schedule-cost", "Schedule & Cost"],
  ["people-governance", "People & Governance"],
  ["quality-risk-closure", "Quality, Risk & Closure"],
];

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const money = (amount) => `$${amount}M`;

function renderParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("");
}

function list(items = []) {
  return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}

function visualFrame(title, caption, body) {
  return `<div class="visual"><h3>${escapeHTML(title)}</h3><p class="visual-caption">${escapeHTML(caption)}</p>${body}</div>`;
}

function ganttVisual(data) {
  const header = `<div class="gantt-row head"><span>Workstream</span>${data.ganttPeriods.map((period) => `<span>${escapeHTML(period)}</span>`).join("")}</div>`;
  const tracks = data.ganttTracks.map((track) => {
    const left = (track.startIndex / data.ganttPeriods.length) * 100;
    const width = ((track.endIndex - track.startIndex + 1) / data.ganttPeriods.length) * 100;
    const marker = track.markerType === "diamond";
    return `<div class="gantt-row"><span class="gantt-label">${escapeHTML(track.label)}</span><div class="gantt-track"><span class="gantt-bar ${marker ? "milestone" : ""}" style="left:${left}%;width:${Math.max(width, 8)}%"></span></div></div>`;
  }).join("");
  const waterfall = `<div class="waterfall">${data.stages.map((stage) => `<div class="waterfall-step"><strong>${escapeHTML(stage.step)}</strong><span>${escapeHTML(stage.detail)}</span></div>`).join("")}</div>`;
  return `${visualFrame("READY VALLEY 2029 | DELIVERY GANTT", "Project period and Waterfall approval gates · active work · gate / milestone", `<div class="gantt">${header}${tracks}</div>`)}${visualFrame("WATERFALL LIFE CYCLE", "Approval evidence is reviewed at each gate before work advances.", waterfall)}`;
}

function budgetVisual(data) {
  const total = data.costs.reduce((sum, item) => sum + item.amountMillions, 0);
  let cursor = 0;
  const colors = ["#087b68", "#229681", "#45ad8d", "#d28a32", "#4f8293", "#83b9a6", "#a9cbbb", "#6c8d7e", "#efb459", "#b7762c"];
  const segments = data.costs.map((item, index) => {
    const from = (cursor / total) * 100;
    cursor += item.amountMillions;
    return `${colors[index]} ${from}% ${(cursor / total) * 100}%`;
  }).join(", ");
  const bars = data.costs.map((item) => `<div class="bar-row"><span>${escapeHTML(item.label)}</span><div class="bar-track"><div class="bar-fill ${item.isReserve ? "reserve" : ""}" style="width:${(item.amountMillions / 300) * 100}%"></div></div><strong>${money(item.amountMillions)}</strong></div>`).join("");
  const rows = data.workstreams.map((row) => `<tr${row.isTotal ? ' class="total-row"' : ""}><td>${escapeHTML(row.workstream)}</td><td>${escapeHTML(row.allocation)}</td><td>${escapeHTML(row.plannedUse)}</td></tr>`).join("");
  return visualFrame("INVESTMENT PORTFOLIO SPLIT", "How every dollar of the CAD $1,000,000,000 envelope is distributed across readiness pillars", `<div class="donut-layout"><div class="donut" style="background:conic-gradient(${segments})"></div><div class="bar-list">${bars}</div></div><div class="table-wrap"><table><thead><tr><th>Workstream</th><th>Allocation</th><th>Planned use</th></tr></thead><tbody>${rows}</tbody></table></div>`);
}

function stakeholderVisual(data) {
  const entries = [data.stakeholders.workClosely, data.stakeholders.keepAligned, data.stakeholders.monitor, data.stakeholders.listenInform];
  return visualFrame("STAKEHOLDER INFLUENCE × INTEREST", "Draft engagement map · confirm each group's authority, needs, and preferred engagement", `<div class="quadrants">${entries.map((entry) => `<div class="quadrant"><strong>${escapeHTML(entry.title)}</strong><small>${escapeHTML(entry.position)}</small>${list(entry.items)}</div>`).join("")}</div>`);
}

const SWOT = {
  strengths: ["Presence of services at the regional and national levels"],
  weaknesses: ["Decentralization", "Lack of baselines"],
  opportunities: ["Upgrading facilities", "Training"],
  threats: ["Pathogens", "Misinformation", "Cyber incidents", "Inflation", "Short-term funding"],
};

function diagramFor(section, data) {
  const id = section.id;
  if (id === "sec-1") return ganttVisual(data);
  if (id === "sec-2") return visualFrame("In-Scope Regional Network Elements", "In-scope and excluded project items", `<div class="scope-grid"><div class="visual-card"><h4>In Scope · 8 Core Pillars</h4>${list(["Coordination", "Quick signals", "Reporting capacity", "Debugging and sample transport", "Up to date facility", "Occupied paid working team", "Providing supplies", "Trusted communication"])}</div><div class="visual-card"><h4>Items Not Included · 5 Exclusions</h4>${list(["A Hospital", "Replace medical records DBMS", "New legislative powers", "Vaccine production", "Ensure tracking"])}</div></div>`);
  if (id === "sec-3") return budgetVisual(data);
  if (id === "sec-4") return stakeholderVisual(data);
  if (id === "sec-5") return visualFrame("Three Spheres Alignment at Each Waterfall Design Gate", "Business · Organization · Technology", `<div class="sphere-grid"><div class="visual-card"><h4>Business</h4>${list(["Value and operating cost", "Funding stakeholder alignment", "Measurable improvement in planned time"])}</div><div class="visual-card"><h4>Organization</h4>${list(["Governance & data authorization", "Staff workflows & trainers", "Operational owners & capacity"])}</div><div class="visual-card"><h4>Technology</h4>${list(["Data & privacy protections", "Facilities & integration", "Cybersecurity and support"])}</div></div>`);
  if (id === "sec-6") return visualFrame("Bolman & Deal Four-Frame Organizational Review (UFV)", "Reviewed at Initiation · Design · Deliver", `<div class="frame-grid"><div class="visual-card"><h4>Structural Frame</h4><p>Explanatory roles of approval, work planning, formal structures, and facility security & responsibility.</p></div><div class="visual-card"><h4>Human Resource Frame</h4><p>Safety and training, TFR student placement, staff workload determination, and college supervision.</p></div><div class="visual-card"><h4>Political Frame</h4><p>Structuring partners' interests, UFV leadership approval, and shared resource commitments.</p></div><div class="visual-card"><h4>Symbolic Frame</h4><p>Trusted and inclusive work reflecting the public mission of UFV across Fraser Valley communities.</p></div></div>`);
  if (id === "sec-7") return visualFrame("Governance Authority & Champion Structure", "Proposed champion · decision authority · execution accountability", `<div class="visual-grid"><div class="visual-card"><h4>Proposed Champion</h4><p>Mr. Stephen Smith</p><p>Fraser Health Executive Sponsor & Chief Medical Health Officer · removes senior obstacles & links evidence</p></div><div class="visual-card"><h4>Decision Authority</h4><p>Multi-Partner Steering Committee</p><p>Approves major scope, cost, and schedule decisions; no change to statutory authority</p></div><div class="visual-card"><h4>Execution Accountability</h4><p>Project Director</p><p>Responsible for delivering the project against charter baselines and controls</p></div></div>`);
  if (id === "sec-8") return visualFrame("Deliverables & Acceptance Verification Matrix", "Owner + Acceptance Test Required", `<div class="visual-grid">${["Charter and governance · Signed charter & steering terms", "Readiness office and playbook · Operational workflow sign-off", "Privacy protected reporting · Privacy, security & accessibility tests", "Exercises and corrective actions · Exercise attainment verification", "Evaluations · Independent baseline & outcomes review", "Rotating supplies · Inventory & expiry rotation audit", "Appointed paid surge roster · Role readiness verification for staff", "Accessible public information & community grants · Accessibility & multilingual validation", "Facility upgrades & UFV simulation hub (if approved) · Commissioning & facility sign-off", "Paid handover and closure report · Operating owner transfer acceptance"].map((item) => `<div class="visual-card"><p>${escapeHTML(item)}</p></div>`).join("")}</div>`);
  if (id === "sec-11") return visualFrame("Charter Contributions Feeding Pre-Initiation & Gate 1", "Gate 1 Readiness: Partner interest · Governance options · Credible 2029 path", `<div class="waterfall">${["Finance", "Procurement", "IT", "Real Property", "HR"].map((item) => `<div class="waterfall-step"><strong>${item}</strong></div>`).join("")}</div>`);
  if (id === "sec-12") return visualFrame("Progress Reports", "Monthly sponsor reports · quarterly public investment reports", `<div class="visual-grid"><div class="visual-card"><h4>Monthly Cadence · Sponsor Reports</h4><p>Milestones, completion forecast, budgeted/expended/committed/forecast costs, top risks, defects, procurement, resourcing & benefits.</p></div><div class="visual-card"><h4>Quarterly Cadence · Public Investment Reports</h4><p>Public overview of expenditure, progress, exercises, mitigations & feedback responses (no personal or security-sensitive data).</p></div><div class="visual-card"><h4>Green</h4><p>On track within baseline schedule, cost, and quality tolerances verified by finance & workstream owners.</p></div><div class="visual-card"><h4>Amber / Red</h4><p>Documented cause, named owner, recovery plan, escalation, and date of decision.</p></div></div>`);
  if (id === "sec-13") return visualFrame("Snapshot of Ready Valley 2029 — SWOT Proposal Stage", "Strengths · Weaknesses · Opportunities · Threats", `<div class="swot-grid">${Object.entries(SWOT).map(([title, items]) => `<div class="swot-card swot-${title}"><h4>${title.toUpperCase()}</h4>${list(items)}</div>`).join("")}</div>`);
  if (id === "sec-14") return visualFrame("Sensitivity & Scenario Evaluation Framework (Low · Central · High)", "Sensitivity variables: Severity · Timing · Uptake · Operating cost", `<div class="visual-grid"><div class="visual-card"><h4>Low Scenario</h4><p>Lower outbreak severity & limited disruption avoided</p></div><div class="visual-card"><h4>Central Scenario</h4><p>Expected baseline avoided disruption, emergency premiums & service interruptions</p></div><div class="visual-card"><h4>High Scenario</h4><p>High severity event where regional readiness offsets widespread shutdown costs</p></div><div class="visual-card"><h4>Return on Investment</h4><p>Net Benefits / Lifetime Cost</p></div></div>`);
  if (id === "sec-15") return visualFrame("QUALITY GATE | CRITICAL DEFECTS CLOSE BEFORE ACCEPTANCE", "A clear review trail from requirements to signed approval", `<div class="waterfall">${[["DEFINE", "Owner · evidence"], ["REVIEW", "Design · standards"], ["TEST", "Pass / fail"], ["FIX & RETEST", "Close defects"], ["ACCEPT", "Signed decision"]].map(([title, detail]) => `<div class="waterfall-step"><strong>${title}</strong><span>${detail}</span></div>`).join("")}</div>`);
  if (id === "sec-16") return visualFrame("Initial Project Charter Summary Sheet", "Planning purposes only · Not for construction or awards", `<div class="visual-grid">${[["PROJECT NAME", "Ready Valley 2029"], ["PROPOSED SPONSOR", "Fraser Health"], ["PROPOSED CHAMPION", "Chief Medical Health Officer"], ["PROJECT DIRECTOR", "Yet to be named"], ["END DATE", "December 31, 2029"], ["HYPOTHETICAL FUNDING", "CAD $1,000,000,000"], ["Authorized Charter Scope", "Data · Communications · Exercises · Evaluation · Transition · Facilities · Workforce & Data · Regional Coordination"], ["Explicit Charter Exceptions", "New hospital · New authorities · Mandated monitoring · Production of vaccines"]].map(([label, value]) => `<div class="visual-card"><h4>${label}</h4><p>${value}</p></div>`).join("")}</div>`);
  if (id === "sec-17") return visualFrame("Cost of Quality Formula", "Prevention + Appraisal + Internal Rework + External Failures", `<div class="visual-grid">${[["Prevention Costs", "Formal privacy reviews, requirements verification, staff competency training."], ["Appraisal Costs", "De-identified/synthetic testing, lab/cold-chain checks, emergency exercises."], ["Internal Rework", "Correcting failed accessibility, language, backup communication & distribution tests before live release."], ["External Failures (Avoided)", "Preventing live defects that cause unsafe information, service interruption, and delayed care."]].map(([title, body]) => `<div class="visual-card"><h4>${title}</h4><p>${body}</p></div>`).join("")}</div>`);
  if (id === "sec-18") return visualFrame("Forecast Staffing Architecture", "$190M Staff Budget Envelope", `<div class="visual-grid">${["Director", "Scheduler / Controller", "Financial & Procurement Leads", "Clinical / Public Health Specialists", "Data & Cyber Specialists", "Facilities & Infection Control Specialists", "Laboratory / Logistics Coordinators", "Workforce Specialists", "UFV & Indigenous Relations Liaison", "Communications / Accessibility Specialists", "Quality, Evaluation, Record & Training Specialists"].map((role) => `<div class="visual-card"><p>${escapeHTML(role)}</p></div>`).join("")}</div>`);
  if (id === "sec-19") return visualFrame("Workforce Motivation, Safety & Retention Framework", "Four connected pillars", `<div class="visual-grid">${[["Fair Workload & Pay", "Paid trainees with limited workload, less backfilling, no unpaid overtime, and compensated community expertise."], ["Psychological Safety", "Blameless problem finding without disclosing names, plus sharing senior ideas across staff members."], ["Monthly Strain Checks", "Monthly strain assessments, training, and feedback loops enabling timely workload adjustments."], ["Recognition & Alignment", "Structured manager meetings on project aims, risks, improvements, work & community achievements."]].map(([title, body]) => `<div class="visual-card"><h4>${title}</h4><p>${body}</p></div>`).join("")}</div>`);
  if (id === "sec-20") return visualFrame("Resource Control, Inventory Rotation & Financial Firewall", "Operating funds NOT topped up with Readiness Reserve", `<div class="visual-grid">${[["Work Package & Partner Stocking", "Assign ownership, labor estimates, dependencies, schedules & acceptance docs across clinicians, facilities, data owners, UFV & community partners."], ["Lifecycle & Expiry Rotation", "Track maintenance, replacement, warranties, disposition costs, minimum supply stocks, expiry rotation & backup suppliers."], ["Monthly Cash Flow Discipline", "Resource forecasts monitored monthly against cash flow; operating budgets stay strictly separated from the $80M Readiness Reserve."]].map(([title, body]) => `<div class="visual-card"><h4>${title}</h4><p>${body}</p></div>`).join("")}</div>`);
  if (id === "sec-21") return visualFrame("Stakeholder Communication Matrix", "Accessible, timely, and audience-specific updates", `<div class="table-wrap"><table><thead><tr><th>Stakeholder Group</th><th>Cadence</th><th>Deliverables & Channels</th></tr></thead><tbody>${[["Steering committee members", "Monthly", "Status, risks, decisions, and projections"], ["Operators", "Monthly", "Operator playbooks, data definitions, training materials, contacts, and exercise results"], ["Indigenous governments & communities", "Early draft review", "Early drafts for review and revision details based on Indigenous input"], ["UFV Liaison", "Ongoing", "Named academic & campus liaison coordination"], ["Residents", "Continuous & accessible", "Online, local trusted sources, own language, plain language by phone & print"], ["Public Reporting", "Quarterly", "Expenditures and corrective actions"]].map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
  if (id === "sec-22") return visualFrame("Top Ten Risk Controls", "High: 6 · Medium: 4 · Total Risks: 10", `<div class="table-wrap"><table><thead><tr><th>Risk</th><th>Level</th><th>Control</th></tr></thead><tbody>${[["Disagreement or withdrawal by partner", "High", "Signed legal documents, monthly escalation; champion manages relationships."], ["Agreement delays and wrong data", "Medium", "Minimum dataset; common definitions; privacy assessment; progressive integration"], ["Cyber attack or data breach", "High", "encryption; threat assessment; independent testing;"], ["Construction delay or increased cost", "High", "Early site assessments; independent cost estimates; progressive tendering;"], ["Labor shortage", "High", "Training pay; backfilling; safe rosters; surge capability; labor mobilization and wellbeing."], ["Integration failure", "Medium", "Easy and open interfaces; portability; documentation and exit provisions."], ["expired supplies or supplier failure", "Medium", "Rotation into normal operation; multi-sourcing; expiration monitoring and replenishment drills."], ["inaccessibility", "Medium", "Co-design; funded local partners; translation;"], ["requirements are different from those designed", "High", "Flexible procedures; scenario planning; periodic requirements reviews"], ["Funding is cancelled without operational funding", "High", "Five-year operations plan and owners required prior to acceptance."]].map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
  if (id === "sec-23") return visualFrame("Procurement & Tendering Workflow", "Purchases · tender specification · evaluation · award", `<div class="waterfall">${[["1. Purchase Programs", "Ventilation, filtration, secure hosting, diagnostics/labs, cold chain, PPE, training, translation, call centre, evaluations, UFV simulation."], ["2. Tender Specification", "Need definition, service level, testing, timeline, lifecycle cost, privacy, accessibility, warranty, data ownership, audit & exit clauses."], ["3. Supplier Evaluation", "Value, resilience, interoperability, supplier capacity, and risk factor reviewed by cross-functional leads."], ["4. Waterfall Award", "Award process executed pending budget and Waterfall gate approval."]].map(([title, detail]) => `<div class="waterfall-step"><strong>${title}</strong><span>${detail}</span></div>`).join("")}</div>`);
  if (id === "sec-24") return visualFrame("Stakeholder Register, Rights-Holder Engagement & Escalation Ladder", "Escalation follows project authority and respects partner jurisdictions.", `<div class="visual-grid">${[["Tier 1 · Workstream Lead", "Logs decisions, dates & commitments in Stakeholder Register"], ["Tier 2 · Project Director", "Resolves cross-workstream operational & schedule barriers"], ["Tier 3 · Executive Sponsor", "Links regional Fraser Health & ministry escalation pathways"], ["Tier 4 · Steering Committee", "Final multi-partner alignment on unresolved scope/cost issues"], ["Indigenous Governments (Rights Holders)", "Jurisdictions honored; engaged early through sovereign processes."], ["UFV Campus Governance Channel", "Clear feedback pathways for residents & workers with honest participation gap tracking."]].map(([title, body]) => `<div class="visual-card"><h4>${title}</h4><p>${body}</p></div>`).join("")}</div>`);
  if (id === "sec-25") return visualFrame("Formal Close-Out Verification & Ongoing Readiness Cycle", "Target Closure: Dec 31, 2029", `<div class="visual-grid">${["Acceptance testing complete", "Critical defects resolved", "Operators & sustaining resources assigned", "Staff trained & facilities commissioned", "Warranties & inventories accepted", "Privacy owners & residual risks accepted", "Costs reconciled & unspent funds returned", "Planned vs. actual closure report & lessons learned", "POST-2029 CONTINUOUS READINESS LOOP · Maintenance · Exercises · Training · Rotating of supplies · Capturing of benefits"].map((item) => `<div class="visual-card"><p>${escapeHTML(item)}</p></div>`).join("")}</div>`);
  return "";
}

function renderPage(data) {
  const header = data.header;
  const stats = [
    ["Hypothetical Investment", "CAD $1,000,000,000"],
    ["Regional Service Coverage", "1.9M+ · 20 Communities"],
    ["Pandemic Readiness Reserve Fund", "$80,000,000"],
    ["Target Completion & Closure", "December 31, 2029"],
  ];
  const sectionLinks = [["introduction", data.intro.title], ...data.sections.map((section) => [section.id, section.title]), ["references", "References"]];
  const root = document.querySelector("#site");

  root.innerHTML = `
    <header class="topbar" id="top">
      <a class="brand" href="#top">Ready Valley 2029</a>
      <nav class="topnav" aria-label="Primary sections">
        <a href="#introduction">Overview</a><a href="#sec-1">Schedule &amp; Cost</a><a href="#sec-4">Governance &amp; HR</a><a href="#sec-22">Risks &amp; Closure</a><a href="#references">References</a>
      </nav>
      <button class="print-button" type="button" id="print-button">Print Charter</button>
    </header>
    <section class="hero"><div class="hero-inner"><p class="eyebrow">${escapeHTML(header.eyebrow)}</p><h1>${escapeHTML(header.title)}</h1><p class="subtitle">${escapeHTML(header.subtitle)}</p><p class="hero-meta">${escapeHTML(header.meta)}</p></div></section>
    <div class="stats-wrap"><div class="stats">${stats.map(([label, value]) => `<div class="stat"><span class="stat-label">${label}</span><span class="stat-value">${value}</span></div>`).join("")}</div></div>
    <div class="toolbar-wrap"><div class="toolbar"><div class="filters" role="tablist" aria-label="Filter charter sections by theme">${CATEGORY_FILTERS.map(([key, label]) => `<button class="filter-button" type="button" role="tab" data-category="${key}" aria-pressed="${key === "all"}">${label}</button>`).join("")}</div><input class="search-box" id="search" type="search" placeholder="Search proposal sections..." aria-label="Search proposal sections" /><select class="search-box mobile-jump" id="mobile-jump" aria-label="Jump to section"><option value="">Jump to section</option>${sectionLinks.map(([id, title]) => `<option value="${id}">${escapeHTML(title)}</option>`).join("")}</select></div></div>
    <div class="page-layout"><aside class="contents"><p class="contents-title">Charter Contents</p><nav>${sectionLinks.map(([id, title]) => `<a href="#${id}" data-jump="${id}">${escapeHTML(title)}</a>`).join("")}</nav></aside><main class="content" id="content"></main></div>
    <footer class="site-footer"><span>Ready Valley 2029 · Fraser Valley Pandemic Preparedness Project Proposal · Chaacha &amp; UFV</span><a href="#top">↑ Back to top</a></footer>
  `;

  const content = root.querySelector("#content");
  const renderSections = () => {
    const query = root.querySelector("#search").value.trim().toLowerCase();
    const activeCategory = root.querySelector('[aria-pressed="true"]')?.dataset.category || "all";
    const introMatches = activeCategory === "all" && (!query || `${data.intro.title} ${data.intro.paragraphs.join(" ")}`.toLowerCase().includes(query));
    const sections = data.sections.filter((section) => {
      const categoryMatch = activeCategory === "all" || activeCategory === section.category;
      const queryMatch = !query || `${section.title} ${section.paragraphs.join(" ")}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
    let html = "";
    if (introMatches) {
      html += `<section class="proposal-section" id="introduction"><p class="section-kicker">Overview · &amp; UFV Readiness Network</p><h2>${escapeHTML(data.intro.title)}</h2><div class="prose">${renderParagraphs(data.intro.paragraphs)}</div>${visualFrame("Ready Valley 2029 Regional Network Architecture", "Connecting 6 readiness pillars across 20 Fraser Health communities (1.9M+ individuals)", `<div class="visual-grid">${[["Early Warning & Surveillance", "Aggregate indicators checked for privacy & connected regional surveillance (PHAC & WHO alignment)."], ["Testing & Lab Logistics", "Diagnostic capacity, cold-chain logistics, mobile collection & sample transport."], ["Selected-Site Enhancements", "Clean-air & ventilation upgrades across chosen hospital, community, and UFV facilities."], ["Rotating Strategic Supplies", "PPE kits, respirators, tests & consumables rotated into normal operations before expiry."], ["Paid Surge Workforce", "Trained, contactable paid reserve roster with safe workloads & wellness protections."], ["Accessible Communications", "Multilingual, plain-language public messaging through local trusted channels & call service."]].map(([title, body]) => `<div class="visual-card"><h4>${title}</h4><p>${body}</p></div>`).join("")}</div>`)}</section>`;
    }
    html += sections.map((section) => `<section class="proposal-section" id="${section.id}" data-category="${section.category}"><p class="section-kicker"><span>Section ${escapeHTML(section.numberLabel)}</span> · <span>${escapeHTML(section.categoryLabel)}</span></p><h2>${escapeHTML(section.title)}</h2><div class="prose">${renderParagraphs(section.paragraphs)}</div>${diagramFor(section, data)}</section>`).join("");
    if (activeCategory === "all" && (!query || `references ${data.references.map((ref) => ref.citation).join(" ")}`.toLowerCase().includes(query))) {
      html += `<section class="proposal-section references" id="references"><p class="section-kicker">Citations &amp; Supporting Documentation</p><h2>References</h2>${data.references.map((ref) => `<div class="reference"><div>${escapeHTML(ref.citation)}</div><a href="${escapeHTML(ref.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(ref.url)}</a></div>`).join("")}</section>`;
    }
    content.innerHTML = html || `<div class="empty-state"><p>No charter sections match “${escapeHTML(query)}”.</p><button class="primary-button" type="button" id="reset-filters">Reset Filters</button></div>`;
    root.querySelector("#reset-filters")?.addEventListener("click", () => {
      root.querySelector("#search").value = "";
      root.querySelector('[data-category="all"]').click();
    });
  };

  root.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
    root.querySelectorAll(".filter-button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    renderSections();
  }));
  root.querySelector("#search").addEventListener("input", renderSections);
  root.querySelector("#mobile-jump").addEventListener("change", (event) => {
    document.getElementById(event.target.value)?.scrollIntoView({ behavior: "smooth" });
  });
  root.querySelector("#print-button").addEventListener("click", () => window.print());
  root.querySelectorAll(".contents a").forEach((link) => link.addEventListener("click", () => {
    root.querySelectorAll(".contents a").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  }));
  renderSections();
}

fetch(DATA_URL)
  .then((response) => {
    if (!response.ok) throw new Error("Proposal data could not be loaded.");
    return response.json();
  })
  .then(renderPage)
  .catch(() => {
    document.querySelector("#site").innerHTML = '<main class="empty-state"><h1>Ready Valley 2029</h1><p>Open this folder with a local web server to view the proposal.</p></main>';
  });
