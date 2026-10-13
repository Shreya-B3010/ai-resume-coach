import "./AppHeader.css";

/*
  Shared product navbar used by every signed-in page.
  - Pure presentation: navigation is done with plain links, exactly like
    the rest of the app (full page loads, state lives in sessionStorage).
  - `active` highlights the current section.
  - `children` lets each page keep its own existing action button(s)
    (e.g. "New analysis", "Back to Roadmap") with their original handlers.
*/

const NAV_ITEMS = [
  { key: "analyzer", label: "Analyzer", href: "/resume-analyzer" },
  { key: "dashboard", label: "Dashboard", href: "/resume-dashboard" },
  { key: "roadmap", label: "Roadmap", href: "/career-roadmap" },
  { key: "projects", label: "Projects", href: "/project-recommendations" },
  { key: "coach", label: "Coach", href: "/career-coach" },
  { key: "interview", label: "Interview", href: "/mock-interview" },
];

function AppHeader({ active = "", width = 1180, children = null }) {
  return (
    <header className="ah" style={{ "--ah-w": `${width}px` }}>
      <div className="ah-inner">
        <a className="ah-brand" href="/" aria-label="AI Coach home">
          <span className="ah-brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="ah-brand-text">
            <strong>
              AI<em>Coach</em>
            </strong>
            <small>Career Intelligence</small>
          </span>
        </a>

        <nav className="ah-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={
                "ah-link" + (active === item.key ? " is-active" : "")
              }
              aria-current={active === item.key ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ah-actions">{children}</div>
      </div>
    </header>
  );
}

export default AppHeader;
