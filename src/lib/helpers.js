// A function to convert a city name like "New York" to a URL-friendly slug like "new-york"
export function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// A function to convert a slug back to a readable name
export function fromSlug(slug) {
  return slug.replace(/-/g, ' ');
}

// A function to convert a string to "Title Case"
export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}