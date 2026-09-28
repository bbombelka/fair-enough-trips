import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "context/theme/ThemeContext";

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders with dark mode switch label when current theme is light", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByTestId("theme-toggle-btn");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
    expect(button).toHaveAttribute("title", "Switch to dark mode");
  });

  it("toggles theme when clicked and updates label to light mode switch", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByTestId("theme-toggle-btn");
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-label", "Switch to light mode");
    expect(button).toHaveAttribute("title", "Switch to light mode");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("accepts custom className", () => {
    render(
      <ThemeProvider>
        <ThemeToggle className="custom-class" />
      </ThemeProvider>
    );

    const button = screen.getByTestId("theme-toggle-btn");
    expect(button.className).toContain("custom-class");
  });

  it("renders gracefully outside ThemeProvider using default fallback", () => {
    render(<ThemeToggle />);

    const button = screen.getByTestId("theme-toggle-btn");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });
});
