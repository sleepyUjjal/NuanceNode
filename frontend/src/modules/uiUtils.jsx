export function verdictColor(verdict = "") {
  const normalizedVerdict = verdict.toLowerCase();
  if (normalizedVerdict.includes("fake") || normalizedVerdict.includes("false")) return "#c0392b";
  if (
    normalizedVerdict.includes("true") ||
    normalizedVerdict.includes("verified") ||
    normalizedVerdict.includes("likely true")
  ) {
    return "#27ae60";
  }
  return "#e67e22";
}

export function weightColor(weight = "") {
  const normalizedWeight = weight.toLowerCase();
  if (normalizedWeight === "strong") return "#27ae60";
  if (normalizedWeight === "moderate") return "#e67e22";
  return "#888899";
}

export function formatNodeTitle(key = "") {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function renderNodeValue(value, prefix = "") {
  if (value == null || value === "") return null;

  if (Array.isArray(value)) {
    if (!value.length) return <div style={{ color: "var(--text-faint)" }}>No items.</div>;
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {value.map((item, index) => (
          <div
            key={`${prefix}-${index}`}
            style={{
              paddingLeft: 12,
              borderLeft: "2px solid var(--border-hi)",
              color: "var(--text)",
            }}
          >
            {typeof item === "object" && item !== null
              ? renderNodeValue(item, `${prefix}-${index}`)
              : String(item)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value).filter(([, nestedValue]) => {
      if (nestedValue == null || nestedValue === "") return false;
      if (Array.isArray(nestedValue)) return nestedValue.length > 0;
      return true;
    });

    if (!entries.length) return <div style={{ color: "var(--text-faint)" }}>No details available.</div>;

    return (
      <div style={{ display: "grid", gap: 12 }}>
        {entries.map(([key, nestedValue]) => (
          <div key={`${prefix}-${key}`}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text-faint)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {formatNodeTitle(key)}
            </div>
            <div style={{ color: "var(--text-dim)", lineHeight: 1.7 }}>
              {renderNodeValue(nestedValue, `${prefix}-${key}`)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
}
