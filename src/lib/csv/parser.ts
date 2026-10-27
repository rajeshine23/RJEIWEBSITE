import fs from "fs";
import { parse } from "csv-parse/sync";

export interface ParseOptions {
  trim?: boolean;
  skipEmptyLines?: boolean;
}

/**
 * Parses raw CSV string according to RFC 4180 standard.
 * Correctly handles quotes, commas, newlines in fields, and semicolons in sublists.
 */
export function parseCsvString<T = Record<string, string>>(
  content: string,
  options: ParseOptions = {}
): T[] {
  // Strip UTF-8 BOM if present
  const cleaned = content.replace(/^\uFEFF/, "");
  
  const records = parse(cleaned, {
    columns: true,
    skip_empty_lines: options.skipEmptyLines ?? true,
    trim: options.trim ?? true,
    relax_column_count: false,
    cast: false, // Keep raw strings to maintain strict domain validation
  });

  return records as T[];
}

/**
 * Reads and parses a CSV file from the filesystem.
 */
export function parseCsvFile<T = Record<string, string>>(
  filePath: string,
  options: ParseOptions = {}
): T[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found at path: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return parseCsvString<T>(content, options);
}

/**
 * Splits semicolon-separated list fields (e.g., "Gold;Green;Ruby Red").
 * Handles optional single items, trims individual items, and filters out empty values.
 */
export function parseSemicolonList(value: string | undefined | null): string[] {
  if (!value || typeof value !== "string") {
    return [];
  }
  return value
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Splits semicolon-separated integers (e.g. "5;2;0").
 */
export function parseSemicolonIntList(value: string | undefined | null): number[] {
  const parts = parseSemicolonList(value);
  return parts.map((part) => {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : num;
  });
}

/**
 * Converts a string into a clean, safe URL slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
