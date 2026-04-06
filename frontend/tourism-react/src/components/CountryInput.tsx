import React, { useState, useRef, useEffect } from "react";
import { searchCountries } from "../utils/countries";

interface CountryInputProps {
  value: string;
  onChange: (country: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
}

const CountryInput: React.FC<CountryInputProps> = ({
  value,
  onChange,
  disabled = false,
  hasError = false,
  placeholder = "Type to search countries…",
  id = "country",
  name = "country",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keep local input in sync when parent resets the value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    onChange(v); // propagate raw text so parent can validate
    const results = searchCountries(v);
    setSuggestions(results);
    setOpen(results.length > 0);
    setHighlighted(-1);
  };

  const select = (country: string) => {
    setInputValue(country);
    onChange(country);
    setSuggestions([]);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      select(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <input
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={`form-input${hasError ? " error" : ""}`}
      />
      {open && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "var(--card-bg, #fff)",
            border: "2px solid var(--border-light, #e9ecef)",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            listStyle: "none",
            margin: "4px 0 0",
            padding: "4px 0",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((country, i) => (
            <li
              key={country}
              onMouseDown={() => select(country)}
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                background:
                  i === highlighted
                    ? "var(--primary-blue, #3F84B1)"
                    : "transparent",
                color:
                  i === highlighted ? "#fff" : "var(--text-primary, #212529)",
                fontSize: "0.95rem",
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryInput;
