import React, { useState } from "react";
import { S } from "./AdminStyles";
import { Icon } from "./Icon";

export function Config() {
  const [activeSection, setActiveSection] = useState("general");
  const [eventName, setEventName] = useState("Test CTF");
  const [eventDesc, setEventDesc] = useState("");
  const [hov, setHov] = useState(null);
  const [timingTab, setTimingTab] = useState("start");
  const [accountTab, setAccountTab] = useState("user");
  const [fieldsTab, setFieldsTab] = useState("user");
  const [exportTab, setExportTab] = useState("export");

  const sidebarSections = [
    { id: "general", label: "General", icon: "settings", group: null },
    { id: "logo", label: "Logo", icon: "image", group: "Appearance" },
    { id: "theme", label: "Theme", icon: "globe", group: "Appearance" },
    { id: "localization", label: "Localization", icon: "code", group: "Appearance" },
    { id: "visibility", label: "Visibility", icon: "eye", group: "Access" },
    { id: "timing", label: "Start and End Time", icon: "clock", group: "Access" },
    { id: "pause", label: "Pause", icon: "pause", group: "Access" },
    { id: "accounts", label: "Accounts", icon: "users", group: "Users" },
    { id: "brackets", label: "Scoreboard Brackets", icon: "barChart", group: "Users" },
    { id: "fields", label: "Custom Fields", icon: "filter", group: "Users" },
    { id: "regcode", label: "Registration Code", icon: "shield", group: "Users" },
    { id: "challenges", label: "Challenges", icon: "flag", group: "Challenges" },
    { id: "importexport", label: "Import & Export", icon: "download", group: "Backup" },
    { id: "sanitize", label: "Sanitize", icon: "shield", group: "Security" },
    { id: "legal", label: "Legal", icon: "award", group: "Pages" },
    { id: "robots", label: "Robots.txt", icon: "terminal", group: "Pages" },
    { id: "email", label: "Email Notifications", icon: "mail", group: "Integrations" },
    { id: "social", label: "Social Sharing", icon: "share", group: "Integrations" },
    { id: "mlc", label: "MajorLeagueCyber", icon: "link", group: "Integrations" },
    { id: "usermode", label: "User Mode", icon: "user", group: "Danger zone" },
    { id: "reset", label: "Reset", icon: "alertTriangle", group: "Danger zone" },
  ];

  const groups = [];
  const seen = {};
  for (const s of sidebarSections) {
    if (s.group && !seen[s.group]) { groups.push({ group: s.group, items: [] }); seen[s.group] = groups[groups.length - 1]; }
    if (s.group) seen[s.group].items.push(s);
  }

  const helpStyle = { fontSize: 11, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 };

  const UpdateBtn = ({ text="UPDATE" }) => (
    <button style={{ ...S.btnPrimary }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.25)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
      {text === "UPDATE" && <Icon name="refresh" size={13} color="#00ff88" />} {text}
    </button>
  );

  const TabSelector = ({ tabs, active, onChange }) => (
    <div style={{ display: "flex", borderBottom: "1px solid rgba(30,30,56,0.9)", marginBottom: 20 }}>
      {tabs.map(t => (
        <div key={t.id} onClick={() => onChange(t.id)}
             style={{ 
               padding: "10px 20px", cursor: "pointer", 
               fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
               color: active === t.id ? "#00ff88" : "#8892a4",
               borderBottom: active === t.id ? "2px solid #00ff88" : "2px solid transparent",
               transition: "all 0.2s"
             }}>
          {t.label}
        </div>
      ))}
    </div>
  );

  const configPanels = {
    general: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Event Name</label>
          <div style={helpStyle}>When no logo is specified, the CTF's name is used instead.</div>
          <input style={{ ...S.input, width: "100%", maxWidth: "100%" }} value={eventName} onChange={e => setEventName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Event Description</label>
          <div style={helpStyle}>
            Description of your CTF. Available for use on your custom pages and emails as <span style={{ color: "#ff6b35" }}>{"{"}ctf_description{"}"}</span>.
          </div>
          <textarea style={{ ...S.textarea, width: "100%", maxWidth: "100%", minHeight: 140 }} value={eventDesc} onChange={e => setEventDesc(e.target.value)} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    logo: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Logo</label>
          <div style={helpStyle}>Logo to use for the website instead of a CTF name.</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "rgba(10,10,20,0.9)", border: "1px solid rgba(45,45,82,0.9)", borderRadius: 6, padding: "5px", flex: 1 }}>
              <input type="file" style={{ color: "#e2e8f4", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", width: "100%" }} />
            </div>
            <UpdateBtn text="Upload" />
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Tab Icon</label>
          <div style={helpStyle}>Used as the favicon. Only PNGs accepted. Must be 32x32px.</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "rgba(10,10,20,0.9)", border: "1px solid rgba(45,45,82,0.9)", borderRadius: 6, padding: "5px", flex: 1 }}>
              <input type="file" style={{ color: "#e2e8f4", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", width: "100%" }} />
            </div>
            <UpdateBtn text="Upload" />
          </div>
        </div>
      </div>
    ),
    theme: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Theme</label>
          <div style={{...helpStyle, marginBottom: 4}}>Switch themes to change CTFd's aesthetics</div>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%" }}>
            <option value="core">core</option>
          </select>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Primary Color</label>
          <div style={{...helpStyle, marginBottom: 4}}>Base color used for theme features. Requires theme support.</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
            <input type="color" defaultValue="#00ff88" style={{ width: 36, height: 36, border: "none", background: "none", cursor: "pointer", padding: 0 }} />
            <UpdateBtn text="Build CSS" />
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Theme Header</label>
          <div style={{...helpStyle, marginBottom: 4}}>Theme headers are inserted just before the &lt;/head&gt; tag on all public facing pages. Requires theme support.</div>
          <textarea style={{ ...S.textarea, width: "100%", maxWidth: "100%", minHeight: 140, fontFamily: "'JetBrains Mono', monospace" }} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Theme Footer</label>
          <div style={{...helpStyle, marginBottom: 4}}>Theme footers are inserted just before the &lt;/body&gt; tag on all public facing pages. Requires theme support.</div>
          <textarea style={{ ...S.textarea, width: "100%", maxWidth: "100%", minHeight: 140, fontFamily: "'JetBrains Mono', monospace" }} />
        </div>
      </div>
    ),
    localization: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Default Language</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option value="en">English</option>
          </select>
          <div style={helpStyle}>Language to use if a user does not specify a language in their account settings. By default, CTFd will auto-detect the user's preferred language.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    visibility: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Challenge Visibility</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <div style={helpStyle}>Control whether users must be logged in to see challenges</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Account Visibility</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="admins">Admins Only</option>
          </select>
          <div style={helpStyle}>Control whether accounts (users & teams) are shown to everyone, only to authenticated users, or only to admins</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Score Visibility</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="hidden">Hidden</option>
          </select>
          <div style={helpStyle}>
            Control whether solves/score are shown to the public, to logged in users, hidden to all non-admins, or only shown to admins<br/><br/>
            Score Visibility is a subset of Account Visibility. This means that if accounts are visible to a user then score visibility will control whether they can see the score of that user. If accounts are not visible then score visibility has no effect.
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Registration Visibility</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option value="public">Public</option>
            <option value="disabled">Disabled</option>
          </select>
          <div style={helpStyle}>Control whether registration is enabled for everyone or disabled</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    timing: (
      <div>
        <TabSelector tabs={[{id: "start", label: "Start Time"}, {id: "end", label: "End Time"}, {id: "freeze", label: "Freeze Time"}]} 
                     active={timingTab} onChange={setTimingTab} />
        
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Month</label>
              <input style={{ ...S.input }} placeholder="MM" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Day</label>
              <input style={{ ...S.input }} placeholder="DD" />
            </div>
            <div style={{ flex: 2 }}>
              <label style={S.label}>Year</label>
              <input style={{ ...S.input }} placeholder="YYYY" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Hour</label>
              <input style={{ ...S.input }} placeholder="HH" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Minute</label>
              <input style={{ ...S.input }} placeholder="MM" />
            </div>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <label style={S.label}>Timezone</label>
            <select style={{ ...S.select, width: "100%", maxWidth: 300 }}>
              <option>Asia/Calcutta</option>
              <option>UTC</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "rgba(0,0,0,0.2)", padding: 16, borderRadius: 8, border: "1px dashed rgba(30,30,56,0.9)" }}>
            <div>
              <label style={{ ...S.label, color: "#8892a4" }}>Local Time</label>
              <input style={{ ...S.input, background: "rgba(10,10,20,0.4)", color: "#8892a4", pointerEvents: "none" }} value="" readOnly />
            </div>
            <div>
              <label style={{ ...S.label, color: "#8892a4" }}>Timezone Time</label>
              <input style={{ ...S.input, background: "rgba(10,10,20,0.4)", color: "#8892a4", pointerEvents: "none" }} value="" readOnly />
            </div>
            <div>
              <label style={{ ...S.label, color: "#8892a4" }}>UTC Timestamp</label>
              <input style={{ ...S.input, background: "rgba(10,10,20,0.4)", color: "#8892a4", pointerEvents: "none" }} value="" readOnly />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    pause: (
      <div>
        <div style={{ marginBottom: 22, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <input type="checkbox" style={{ ...S.checkbox, marginTop: 4 }} />
          <div>
            <label style={{ ...S.label, marginBottom: 4 }}>Pause CTF</label>
            <div style={helpStyle}>Prevent users from submitting answers until unpaused. Challenges can still be viewed.</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    accounts: (
      <div>
        <TabSelector tabs={[{id: "user", label: "User Accounts"}, {id: "team", label: "Team Accounts"}]} 
                     active={accountTab} onChange={setAccountTab} />
        {accountTab === "user" ? (
          <div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Email Domain Allowlist</label>
              <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} />
              <div style={helpStyle}>Comma-separated list of allowable email domains which users can register under</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Email Domain Blocklist</label>
              <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} />
              <div style={helpStyle}>Comma-separated list of disallowed email domains which users cannot register under</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Minimum Password Length for Users</label>
              <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} type="number" />
              <div style={helpStyle}>Minimum Password Length for Users</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Verify Emails</label>
              <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
              <div style={helpStyle}>Control whether users must confirm their email addresses before playing</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Maximum Number of Users</label>
              <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} type="number" />
              <div style={helpStyle}>Maximum number of user accounts allowed to register with this CTF</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Incorrect Submissions per Minute</label>
              <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} type="number" defaultValue={10} />
              <div style={helpStyle}>Number of submissions allowed per minute for flag bruteforce protection (default: 10)</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Name Changes</label>
              <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
              <div style={helpStyle}>Control whether users and teams can change their names</div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Team Creation</label>
              <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
              <div style={helpStyle}>Control whether users can create their own teams (Teams mode only)</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Team Size</label>
              <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} type="number" />
              <div style={helpStyle}>Maximum number of users per team (Teams mode only)</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Maximum Number of Teams</label>
              <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} type="number" />
              <div style={helpStyle}>Maximum number of teams allowed to register with this CTF (Teams mode only)</div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>Team Disbanding</label>
              <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
                <option>Enabled for Inactive Teams</option>
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
              <div style={helpStyle}>Control whether team captains are allowed to disband their own teams</div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    brackets: (
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <button style={{ ...S.btnPrimary }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
            + Add New Bracket
          </button>
        </div>
      </div>
    ),
    fields: (
      <div>
        <div style={{...helpStyle, marginBottom: 16}}>Add custom fields to get additional data from your participants</div>
        <TabSelector tabs={[{id: "user", label: "Users"}, {id: "team", label: "Teams"}]} 
                     active={fieldsTab} onChange={setFieldsTab} />
        <div style={{...helpStyle, marginBottom: 40}}>
          {fieldsTab === "user" ? "Custom user fields are shown during registration. Users can optionally edit these fields in their profile." : "Custom team fields are shown during team creation. Teams can optionally edit these fields in their profile."}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button style={{ ...S.btnPrimary }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,136,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
            + Add New Field
          </button>
        </div>
      </div>
    ),
    regcode: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Registration Code</label>
          <div style={helpStyle}>Registration Code required for account registration (SSO excluded)</div>
          <input style={{ ...S.input, width: "100%", maxWidth: "100%" }} placeholder="Registration Code" />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    challenges: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>View Self Submissions</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option>Disabled</option>
            <option>Enabled</option>
          </select>
          <div style={helpStyle}>Allow users to view their previous submissions</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Max Attempts Behavior</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option>lockout</option>
            <option>timeout</option>
          </select>
          <div style={helpStyle}>Set Max Attempts behavior to be a lockout or a timeout</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Max Attempts Timeout Duration</label>
          <input style={{ ...S.input, width: "100%", maxWidth: "100%", marginBottom: 8 }} type="number" defaultValue={300} />
          <div style={helpStyle}>How long the timeout lasts in seconds for max attempts (if set to timeout). Default is 300 seconds</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Hints Free Public Access</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option>Disabled</option>
            <option>Enabled</option>
          </select>
          <div style={helpStyle}>Control whether users must be logged in to see free hints (hints without cost or requirements)</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>Challenge Ratings</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option>Public (users can submit ratings and see aggregated ratings)</option>
            <option>Private</option>
          </select>
          <div style={helpStyle}>Control who can see and submit challenge ratings</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    importexport: (
      <div>
        <TabSelector tabs={[
          {id: "export", label: "Export"},
          {id: "import", label: "Import"},
          {id: "download_csv", label: "Download CSV"},
          {id: "import_csv", label: "Import CSV"}
        ]} active={exportTab} onChange={setExportTab} />

        {exportTab === "export" && (
          <div>
            <div style={{...helpStyle, marginBottom: 24, fontSize: 13, color: "#e2e8f4", lineHeight: 1.6}}>
              Exports are an archive of your CTF in its current state. They can be re-imported into other CTFd instances or used by scripts and third parties to calculate statistics.<br/><br/>
              To download an export click the button below.
            </div>
            <button style={{ ...S.btnPrimary, borderColor: "#ffb86c", color: "#ffb86c" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,184,108,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(255,184,108,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              Export
            </button>
          </div>
        )}

        {exportTab === "import" && (
          <div>
            <div style={{...helpStyle, marginBottom: 16, fontSize: 13, color: "#e2e8f4", lineHeight: 1.6}}>
              You can import saved CTFd exports by uploading them below. This will completely wipe your existing CTFd instance and all your data will be replaced by the imported data. You should only import data that you trust!
            </div>
            <div style={{ background: "rgba(255,184,108,0.07)", border: "1px solid rgba(255,184,108,0.25)", borderRadius: 8, padding: "12px 16px", marginBottom: 24, color: "#ffb86c", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
              ! Importing a CTFd export will completely wipe your existing data
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={S.label}>Import File</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ background: "rgba(10,10,20,0.9)", border: "1px solid rgba(45,45,82,0.9)", borderRadius: 6, padding: "5px", flex: 1, maxWidth: 400 }}>
                  <input type="file" style={{ color: "#e2e8f4", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", width: "100%" }} />
                </div>
              </div>
            </div>
            <button style={{ ...S.btnPrimary, borderColor: "#ffb86c", color: "#ffb86c" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,184,108,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(255,184,108,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              Import
            </button>
          </div>
        )}

        {exportTab === "download_csv" && (
          <div>
            <div style={{ background: "rgba(255,184,108,0.07)", border: "1px solid rgba(255,184,108,0.25)", borderRadius: 8, padding: "12px 16px", marginBottom: 24, color: "#ffb86c", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
              ! CSVs exported from CTFd are not guaranteed to import back in via the Import CSV functionality. See <span style={{textDecoration: "underline", cursor:"pointer"}}>CSV Importing instructions</span> for details.
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={S.label}>Database Table</label>
              <select style={{ ...S.select, width: "100%", maxWidth: "100%" }}>
                <option value="scoreboard">scoreboard</option>
                <option value="users">users</option>
                <option value="teams">teams</option>
                <option value="challenges">challenges</option>
              </select>
            </div>
            <button style={{ ...S.btnPrimary, borderColor: "#ffb86c", color: "#ffb86c" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,184,108,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(255,184,108,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              Download CSV
            </button>
          </div>
        )}

        {exportTab === "import_csv" && (
          <div>
            <div style={{ background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 8, padding: "12px 16px", marginBottom: 24, color: "#00e5ff", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="helpCircle" size={14} color="#00e5ff" /> <span style={{textDecoration: "underline", cursor:"pointer"}}>Instructions and CSV templates</span>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={S.label}>CSV Type</label>
              <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
                <option value="users">Users</option>
                <option value="teams">Teams</option>
                <option value="challenges">Challenges</option>
              </select>
              <div style={helpStyle}>Type of CSV data</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={S.label}>CSV File</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <div style={{ background: "rgba(10,10,20,0.9)", border: "1px solid rgba(45,45,82,0.9)", borderRadius: 6, padding: "5px", flex: 1, maxWidth: 400 }}>
                  <input type="file" accept=".csv" style={{ color: "#e2e8f4", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", width: "100%" }} />
                </div>
              </div>
              <div style={helpStyle}>CSV file contents</div>
            </div>
            <button style={{ ...S.btnPrimary, borderColor: "#ffb86c", color: "#ffb86c" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,184,108,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(255,184,108,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              Import CSV
            </button>
          </div>
        )}
      </div>
    ),
    sanitize: (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label style={S.label}>HTML Sanitization</label>
          <select style={{ ...S.select, width: "100%", maxWidth: "100%", marginBottom: 8 }}>
            <option>Disabled</option>
            <option>Enabled</option>
          </select>
          <div style={helpStyle}>Whether CTFd will attempt to sanitize HTML content from content.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UpdateBtn />
        </div>
      </div>
    ),
    reset: (
      <div>
        <div style={{ background: "rgba(255,56,100,0.07)", border: "1px solid rgba(255,56,100,0.25)", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon name="alertTriangle" size={16} color="#ff3864" />
            <span style={{ color: "#ff3864", fontFamily: "'Orbitron', monospace", fontSize: 13, letterSpacing: 1 }}>DANGER ZONE</span>
          </div>
          <div style={{ fontSize: 12, color: "#8892a4", fontFamily: "'JetBrains Mono', monospace" }}>
            // This will permanently delete all submissions, challenges, and scores. This action cannot be undone.
          </div>
        </div>
        <button style={{ ...S.btnDanger }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,56,100,0.1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(255,56,100,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
          <Icon name="alertTriangle" size={13} color="#ff3864" /> RESET CTF DATA
        </button>
      </div>
    ),
  };

  const defaultPanel = (
    <div style={{ color: "#4a5568", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", padding: "40px 0" }}>
      // select a config section from the sidebar
    </div>
  );

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}><Icon name="settings" size={22} color="#00ff88" /> CONFIGURATION</div>
        <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "'JetBrains Mono', monospace", marginTop: 6 }}>// event settings and platform options</div>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Config Sidebar */}
        <div style={{ width: 210, background: "rgba(10,10,20,0.8)", border: "1px solid rgba(30,30,56,0.9)", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
          {/* General */}
          <div
            onClick={() => setActiveSection("general")}
            onMouseEnter={() => setHov("general")} onMouseLeave={() => setHov(null)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "11px 16px",
              cursor: "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
              borderBottom: "1px solid rgba(30,30,56,0.9)",
              background: activeSection === "general" ? "rgba(0,255,136,0.1)" : hov === "general" ? "rgba(0,255,136,0.04)" : "transparent",
              color: activeSection === "general" ? "#00ff88" : "#e2e8f4",
              borderLeft: activeSection === "general" ? "2px solid #00ff88" : "2px solid transparent",
              transition: "all 0.15s",
            }}>
            <Icon name="settings" size={13} color={activeSection === "general" ? "#00ff88" : "#4a5568"} /> General
          </div>
          {/* Grouped items */}
          {groups.map(({ group, items }) => (
            <div key={group}>
              <div style={{
                fontSize: 9, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace",
                color: group === "Danger zone" ? "#ff386466" : "#4a5568",
                textTransform: "uppercase", padding: "10px 16px 4px",
                borderTop: "1px solid rgba(30,30,56,0.9)", fontWeight: 600,
              }}>{group}</div>
              {items.map(item => (
                <div key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  onMouseEnter={() => setHov(item.id)} onMouseLeave={() => setHov(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "9px 16px",
                    cursor: "pointer", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    background: activeSection === item.id ? (group === "Danger zone" ? "rgba(255,56,100,0.08)" : "rgba(0,255,136,0.08)") : hov === item.id ? "rgba(255,255,255,0.02)" : "transparent",
                    color: activeSection === item.id ? (group === "Danger zone" ? "#ff3864" : "#00ff88") : hov === item.id ? "#e2e8f4" : "#8892a4",
                    borderLeft: activeSection === item.id ? `2px solid ${group === "Danger zone" ? "#ff3864" : "#00ff88"}` : "2px solid transparent",
                    transition: "all 0.15s",
                  }}>
                  <Icon name={item.icon} size={12} color={activeSection === item.id ? (group === "Danger zone" ? "#ff3864" : "#00ff88") : "#4a5568"} />
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Config Panel */}
        <div style={{ ...S.card, flex: 1 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, color: "#00ff88", letterSpacing: 1, marginBottom: 24, textShadow: "0 0 12px rgba(0,255,136,0.3)", textTransform: "uppercase" }}>
            {sidebarSections.find(s => s.id === activeSection)?.label || "General"}
          </div>
          {configPanels[activeSection] || defaultPanel}
        </div>
      </div>
    </div>
  );
}

export default Config;
